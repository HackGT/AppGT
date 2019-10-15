import { StyleSheet } from "react-native";
import { colors } from "../themes";

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: 0.6 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation
  };
}

function popoutShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: 'grey',
    shadowOffset: { width: 0, height: -0.3 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation
  };
}

export const styleguide = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 24,
    paddingLeft: 8,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 20,
    flexGrow: 1,
    ...elevationShadowStyle(5),
  },
  noShadow: {
    backgroundColor: colors.lightGrayBackgroundBehindTagText,
    ...elevationShadowStyle(1)
  },
  titleView: {
    marginLeft: 24,
    marginTop: 24,
    marginBottom: 12
  },
  wrapperView: {
    paddingTop: 36,
    paddingLeft: 16,
    paddingRight: 16,
  },
  popoutBar: {
    ...popoutShadowStyle(5),
    height: 80,
  },
  elevate: {
    ...elevationShadowStyle(10),
  }
});
