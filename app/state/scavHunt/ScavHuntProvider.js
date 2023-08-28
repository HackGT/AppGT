import React, { useEffect } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import { initialValue, scavHuntReducer } from "./ScavHuntReducer";
import {
  COMPLETE_HINT,
  COMPLETE_QUESTION,
  SET_FROM_STORAGE,
} from "./ScavHuntActionTypes";
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
        value: item,
      });
    },
    setFromStorage: (value) => {
      dispatch({
        type: SET_FROM_STORAGE,
        value: value,
      });
    },
  };

  useEffect(() => {
    const getInitialData = async () => {
      try {
        const completedQuestions = await AsyncStorage.getItem(
          "completedQuestions"
        );
        const completedHints = await AsyncStorage.getItem("completedHints");
        value.setFromStorage({
          completedHints: JSON.parse(completedHints) ?? [],
          completedQuestions: JSON.parse(completedQuestions) ?? [],
        });
      } catch (e) {}
    };

    getInitialData();
  }, []);

  return (
    <ScavHuntContext.Provider value={value}>
      {children}
    </ScavHuntContext.Provider>
  );
}
