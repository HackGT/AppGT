import {
  type ReactNode,
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import { getHexathon, getEvents, getBlocks, getScavengerHunt, getSwagItems, CURRENT_HEXATHON } from '@/api/api';
import { FirebaseUser } from './auth-context';
import { HackathonErrorScreen, HackathonLoadingScreen } from '@/components/hackathon-error-screen';

// Module-level memory storage (replaces AsyncStorage)
const storage: Record<string, string> = {};
const memoryStorage = {
  getItem: (key: string): Promise<string | null> => Promise.resolve(storage[key] ?? null),
  setItem: (key: string, value: string): Promise<void> => {
    storage[key] = value;
    return Promise.resolve();
  },
};

// Action types
const TOGGLE_STAR = 'TOGGLE_STAR';
const TOGGLE_STAR_SCHEDULE = 'TOGGLE_STAR_SCHEDULE';
const SET_EVENTS = 'SET_EVENTS';

type HackathonState = {
  hackathon: any;
  starredIds: string[];
  isStarSchedule: boolean;
};

type HackathonAction =
  | { type: typeof TOGGLE_STAR; value: any }
  | { type: typeof TOGGLE_STAR_SCHEDULE; value: null }
  | { type: typeof SET_EVENTS; value: any[] };

function toggleStarred(starredIds: string[], event: any): string[] {
  const toggleEventId: string = event.id;
  const isNowStarred = !starredIds.includes(toggleEventId);
  if (isNowStarred) {
    const newStarred = [...starredIds, toggleEventId];
    memoryStorage.setItem('starredIds', JSON.stringify(newStarred));
    return newStarred;
  } else {
    const newStarred = starredIds.filter((id) => id !== toggleEventId);
    memoryStorage.setItem('starredIds', JSON.stringify(newStarred));
    return newStarred;
  }
}

function hackathonReducer(state: HackathonState, action: HackathonAction): HackathonState {
  switch (action.type) {
    case TOGGLE_STAR:
      return { ...state, starredIds: toggleStarred(state.starredIds, action.value) };
    case TOGGLE_STAR_SCHEDULE:
      return { ...state, isStarSchedule: !state.isStarSchedule };
    case SET_EVENTS:
      return { ...state };
    default:
      return state;
  }
}

export interface HackathonContextValue {
  state: HackathonState;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
  toggleStar: (event: any) => void;
  toggleIsStarSchedule: () => void;
  setEvents: (events: any[]) => void;
}

const HackathonContext = createContext<HackathonContextValue>({
  state: { hackathon: null, starredIds: [], isStarSchedule: false },
  isLoading: true,
  error: null,
  retry: () => {},
  toggleStar: () => {},
  toggleIsStarSchedule: () => {},
  setEvents: () => {},
});

export function useHackathon() {
  return useContext(HackathonContext);
}

const STATE_REFRESH_TIME = 5 * 60 * 1000;

interface HackathonProviderProps {
  children: ReactNode;
  firebaseUser: FirebaseUser;
  initialValue?: Partial<HackathonState>;
}

export function HackathonProvider({ children, firebaseUser, initialValue }: HackathonProviderProps) {
  const init: HackathonState = {
    hackathon: initialValue?.hackathon ?? null,
    starredIds: initialValue?.starredIds ?? [],
    isStarSchedule: initialValue?.isStarSchedule ?? false,
  };

  const [state, dispatch] = useReducer(hackathonReducer, init);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Use a ref-like mutable object so the interval callback always sees fresh hackathon data
  const hackathonRef = useRef<any>(null);

  const toggleStar = (event: any) => dispatch({ type: TOGGLE_STAR, value: event });
  const toggleIsStarSchedule = () => dispatch({ type: TOGGLE_STAR_SCHEDULE, value: null });
  const setEvents = (events: any[]) => dispatch({ type: SET_EVENTS, value: events });

  const loadHackathon = async (fUser: FirebaseUser) => {
    setError(null);
    setIsLoading(true);
    try {
      const token = await fUser.getIdToken();
      const raw = await getHexathon(token);
      const hexathon = raw.json.currentHexathon;

      if (raw.status === 200 && hexathon) {
        CURRENT_HEXATHON.id = hexathon.id;
        const { eventJson } = await getEvents(token);
        const { blockJson } = await getBlocks(token);
        const { scavengerHuntJson } = await getScavengerHunt(token);
        const { swagJson } = await getSwagItems(token);

        hexathon.events = eventJson ?? [];
        hexathon.blocks = blockJson ?? [];
        hexathon.scavengerHunt = scavengerHuntJson ?? [];
        hexathon.swag = swagJson ?? [];

        hackathonRef.current = hexathon;
        // We update state directly via a forced re-render trick:
        // Since reducer doesn't handle setting hackathon, we mutate the state object.
        // This is the same pattern as original HackathonProvider: value.state.hackathon = hexathon
        state.hackathon = hexathon;
        setIsLoading(false);
      } else {
        setError(raw.json?.message ?? `Request failed with status ${raw.status}`);
        setIsLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
    }
  };

  const retry = () => loadHackathon(firebaseUser);

  useEffect(() => {
    // Load starred IDs from storage
    memoryStorage.getItem('starredIds').then((val) => {
      if (val) {
        const ids = JSON.parse(val);
        // Patch them in
        state.starredIds = ids;
      }
    });

    loadHackathon(firebaseUser);

    const interval = setInterval(() => {
      loadHackathon(firebaseUser);
    }, STATE_REFRESH_TIME);

    return () => clearInterval(interval);
  }, []);

  const value = useMemo(
    () => ({ state, isLoading, error, retry, toggleStar, toggleIsStarSchedule, setEvents }),
    [state, isLoading, error]
  );

  if (isLoading) return <HackathonLoadingScreen />;
  if (error) return <HackathonErrorScreen onRetry={retry} errorMessage={error} />;

  return <HackathonContext.Provider value={value}>{children}</HackathonContext.Provider>;
}

export { HackathonContext };
