import React from "react";
import { initialValue, scavHuntReducer } from "./ScavHuntReducer";
import { COMPLETE_HINT, COMPLETE_QUESTION } from "./ScavHuntActionTypes";
import ScavHuntContext from "./ScavHuntContext";

export default function ScavHuntProvider({ children }) {
  const [state, dispatch] = React.useReducer(scavHuntReducer, initialValue);

  const value = {
    state: state,
    completeQuestion: (id) =>
      dispatch({
        type: COMPLETE_QUESTION,
        value: id,
      }),
    completeHint: (item) => {
      dispatch({
        type: COMPLETE_HINT,
        value: item
      })
    }
  };

  return (
    <ScavHuntContext.Provider value={value}>
      {children}
    </ScavHuntContext.Provider>
  );
}
