import {
  COMPLETE_QUESTION,
  COMPLETE_HINT,
  SET_FROM_STORAGE,
} from "./ScavHuntActionTypes";
import AsyncStorage from "@react-native-community/async-storage";

export const initialValue = {
  completedQuestions: [],
  completedHints: [],
};

export function scavHuntReducer(state, action) {
  switch (action.type) {
    case COMPLETE_QUESTION:
      return {
        ...state,
        completedQuestions: state.completedQuestions.concat([action.value]),
      };
    case COMPLETE_HINT:
      return completeHint(state, action.value);
    case SET_FROM_STORAGE:
      return { ...state, ...action.value };
  }
}

function completeHint(state, item) {
  const newState = {
    ...state,
    completedHints: state.completedHints.concat([item.id + "-" + item.code]),
  };
  console.log(
    "in reducer: ",
    state,
    item,
    newState,
    JSON.stringify(newState.completedHints)
  );
  AsyncStorage.setItem(
    "completedHints",
    JSON.stringify(newState.completedHints)
  );
  return newState;
}
