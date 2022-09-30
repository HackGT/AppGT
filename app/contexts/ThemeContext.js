import React, { useMemo } from "react";
import {
  useDarkModeContext,
  useDynamicStyleSheet,
} from "react-native-dark-mode";
import { dynamicStyles } from "../theme";

const ThemeContext = React.createContext({
  theme: "light",
  dynamicStyles: dynamicStyles,
});

const ThemeProvider = ({ children }) => {
  const mode = useDarkModeContext();
  const styles = useDynamicStyleSheet(dynamicStyles);

  const value = useMemo(
    () => ({
      theme: mode,
      dynamicStyles: styles,
    }),
    [mode, styles]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
