import React from 'react'
import { initialValue, checkInReducer } from './CheckInReducer'
import { } from "./CheckInActionTypes";
import { CheckInContext } from '../../context'

export default function CheckInProvider({ children }) {

    const [state, dispatch] = React.useReducer(checkInReducer, initialValue)

    const value = {
        state: state
    }

    return (
        <CheckInContext.Provider value={value}>
            {children}
        </CheckInContext.Provider>
    )
}