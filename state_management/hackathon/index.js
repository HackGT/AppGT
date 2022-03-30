import React from 'react'
import { initialValue, hackathonReducer } from './HackathonReducer'
import { } from "./HackathonActionTypes";
import { HackathonContext } from '../../context'

export default function HackathonProvider({ children }) {

    const [state, dispatch] = React.useReducer(hackathonReducer, initialValue)

    const value = {
        state: state
    }

    return (
        <HackathonContext.Provider value={value}>
            {children}
        </HackathonContext.Provider>
    )
}
