import { COMPLETE_QUESTION, COMPLETE_HINT } from './ScavHuntActionTypes'
import AsyncStorage from "@react-native-community/async-storage"

export const initialValue = {
    completedQuestions: [],
    completedHints: []
}

export function scavHuntReducer(state, action) {
    switch (action.type) {
        case COMPLETE_QUESTION:
            return { ...state, completedQuestions: state.completedQuestions.concat([action.value])}
        case COMPLETE_HINT:
            return completeHint(state, action.value)
    }
}

function completeHint(state, item) {
    const newState =  { ...state, completedHints: state.completedHints.concat([item.id + '-' + item.hint])}
    AsyncStorage.setItem(
        "completedHints",
      JSON.stringify(newState)
    );
    return newState
}