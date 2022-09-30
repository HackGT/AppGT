import React from "react";
import { initialValue, scavHuntReducer } from "./ScavHuntReducer";
import { COMPLETE_HINT } from "./ScavHuntActionTypes";
import ScavHuntContext from "./ScavHuntContext";

export default function ScavHuntProvider({ children }) {
  const [state, dispatch] = React.useReducer(scavHuntReducer, initialValue);

  const value = {
    state: state,
    completeHint: (id) =>
      dispatch({
        type: COMPLETE_HINT,
        value: id,
      }),
  };

  return (
    <ScavHuntContext.Provider value={value}>
      {children}
    </ScavHuntContext.Provider>
  );
}
