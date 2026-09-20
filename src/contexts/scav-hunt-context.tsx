import { type ReactNode, createContext, useContext, useReducer, useEffect } from 'react';

// Module-level memory storage
const storage: Record<string, string> = {};
const memoryStorage = {
  getItem: (key: string): Promise<string | null> => Promise.resolve(storage[key] ?? null),
  setItem: (key: string, value: string): Promise<void> => {
    storage[key] = value;
    return Promise.resolve();
  },
};

const COMPLETE_QUESTION = 'COMPLETE_QUESTION';
const COMPLETE_HINT = 'COMPLETE_HINT';
const SET_FROM_STORAGE = 'SET_FROM_STORAGE';

type ScavHuntState = {
  completedQuestions: string[];
  completedHints: string[];
};

type ScavHuntAction =
  | { type: typeof COMPLETE_QUESTION; value: string }
  | { type: typeof COMPLETE_HINT; value: any }
  | { type: typeof SET_FROM_STORAGE; value: Partial<ScavHuntState> };

const initialValue: ScavHuntState = {
  completedQuestions: [],
  completedHints: [],
};

function completeHint(state: ScavHuntState, item: any): ScavHuntState {
  const newState = {
    ...state,
    completedHints: [...state.completedHints, `${item.id}-${item.code}`],
  };
  memoryStorage.setItem('completedHints', JSON.stringify(newState.completedHints));
  return newState;
}

function scavHuntReducer(state: ScavHuntState, action: ScavHuntAction): ScavHuntState {
  switch (action.type) {
    case COMPLETE_QUESTION:
      return { ...state, completedQuestions: [...state.completedQuestions, action.value] };
    case COMPLETE_HINT:
      return completeHint(state, action.value);
    case SET_FROM_STORAGE:
      return { ...state, ...action.value };
    default:
      return state;
  }
}

export interface ScavHuntContextValue {
  state: ScavHuntState;
  completeQuestion: (id: string) => void;
  completeHint: (item: any) => void;
  setFromStorage: (value: Partial<ScavHuntState>) => void;
}

const ScavHuntContext = createContext<ScavHuntContextValue>({
  state: initialValue,
  completeQuestion: () => {},
  completeHint: () => {},
  setFromStorage: () => {},
});

export function useScavHunt() {
  return useContext(ScavHuntContext);
}

export function ScavHuntProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(scavHuntReducer, initialValue);

  const completeQuestion = (id: string) => dispatch({ type: COMPLETE_QUESTION, value: id });
  const completeHintFn = (item: any) => dispatch({ type: COMPLETE_HINT, value: item });
  const setFromStorage = (value: Partial<ScavHuntState>) =>
    dispatch({ type: SET_FROM_STORAGE, value });

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const completedQuestions = await memoryStorage.getItem('completedQuestions');
        const completedHints = await memoryStorage.getItem('completedHints');
        setFromStorage({
          completedHints: completedHints ? JSON.parse(completedHints) : [],
          completedQuestions: completedQuestions ? JSON.parse(completedQuestions) : [],
        });
      } catch (e) {
        // ignore
      }
    };
    getInitialData();
  }, []);

  const value: ScavHuntContextValue = {
    state,
    completeQuestion,
    completeHint: completeHintFn,
    setFromStorage,
  };

  return <ScavHuntContext.Provider value={value}>{children}</ScavHuntContext.Provider>;
}

export { ScavHuntContext };
