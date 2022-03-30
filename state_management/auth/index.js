import React from 'react'
import { initialValue, authReducer } from './AuthReducer'
import { } from "./AuthActionTypes";
import { AuthContext } from '../../context'

export default function AuthProvider({ children }) {

    const [state, dispatch] = React.useReducer(authReducer, initialValue)

    const value = {
        state: state
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}