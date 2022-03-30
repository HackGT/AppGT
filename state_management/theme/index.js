import React from 'react'
import { initialValue, themeReducer } from './ThemeReducer'
import { } from "./ThemeActionTypes";
import { ThemeContext } from '../../context'

export default function ThemeProvider({ children }) {

    const [state, dispatch] = React.useReducer(themeReducer, initialValue)

    const value = {
        state: state
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}
