import { COMPLETE_QUESTION } from './ScavHuntActionTypes'

export const initialValue = {
    completedQuestions: []
}

export function scavHuntReducer(state, action) {
    switch (action.type) {
        case COMPLETE_QUESTION:
            return { ...state, completedQuestions: state.completedQuestions.concat([action.value])}
    }
}
