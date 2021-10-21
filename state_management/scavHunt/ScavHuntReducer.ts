import { COMPLETE_HINT } from './ScavHuntActionTypes'

export const initialValue = {
    completedHints: []
}

export function scavHuntReducer(state, action) {
    switch (action.type) {
        case COMPLETE_HINT:
            return { ...state, completedHints: state.completedHints.concat([action.value])}
    }
}
