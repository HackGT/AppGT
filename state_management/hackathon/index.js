import React from 'react'
import { hackathonReducer } from './HackathonReducer'
import { TOGGLE_STAR, TOGGLE_STAR_SCHEDULE } from "./HackathonActionTypes";
import { HackathonContext } from '../../context'

export default function HackathonProvider({ initialValue, children }) {

    const [state, dispatch] = React.useReducer(hackathonReducer, initialValue)

    const value = {
        state: state,
        toggleStar: (event) => dispatch({
            type: TOGGLE_STAR,
            value: event
        }),
        toggleIsStarSchedule: () => dispatch({
            type: TOGGLE_STAR_SCHEDULE,
            value: null
        })
    }

    console.log('value', value)

    return (
        <HackathonContext.Provider value={value}>
            {children}
        </HackathonContext.Provider>
    )
}
