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
import { getHexathon, getEvents, getBlocks, getScavengerHunt, getSwagItems } from '@/api/api';
import { FirebaseUser } from './auth-context';

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
  toggleStar: (event: any) => void;
  toggleIsStarSchedule: () => void;
  setEvents: (events: any[]) => void;
}

const HackathonContext = createContext<HackathonContextValue>({
  state: { hackathon: null, starredIds: [], isStarSchedule: false },
  isLoading: true,
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
  // Use a ref-like mutable object so the interval callback always sees fresh hackathon data
  const hackathonRef = useRef<any>(null);

  const toggleStar = (event: any) => dispatch({ type: TOGGLE_STAR, value: event });
  const toggleIsStarSchedule = () => dispatch({ type: TOGGLE_STAR_SCHEDULE, value: null });
  const setEvents = (events: any[]) => dispatch({ type: SET_EVENTS, value: events });

  const loadHackathon = async (fUser: FirebaseUser) => {
    try {
      const token = await fUser.getIdToken();
      const raw = await getHexathon(token);
      const hexathon = raw.json;

      if (raw.status === 200 && hexathon) {
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
        console.warn('getHexathon failed, will retry:', raw.status, hexathon?.message);
      }
    } catch (err) {
      console.warn('loadHackathon error:', err);
    }
  };

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
    () => ({ state, isLoading, toggleStar, toggleIsStarSchedule, setEvents }),
    [state, isLoading]
  );

  return <HackathonContext.Provider value={value}>{children}</HackathonContext.Provider>;
}

export { HackathonContext };
