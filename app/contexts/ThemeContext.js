import React, { useMemo } from "react";
import { useColorScheme } from "react-native";
import { lightStyles, useTheme } from "../theme";

const ThemeContext = React.createContext({
  theme: "light",
  dynamicStyles: lightStyles,
});

const ThemeProvider = ({ children }) => {
  const mode = useColorScheme() === "dark" ? "dark" : "light";
  const styles = useTheme();

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
