import { StyleSheet } from "react-native";

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
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 20,
    ...elevationShadowStyle(5),
  },
  titleView: {
    marginLeft: 24,
    marginTop: 24,
    marginBottom: 16
  },
  wrapperView: {
    paddingTop: 48,
    paddingLeft: 8,
    paddingRight: 8,
  },
  popoutBar: {
    ...popoutShadowStyle(2000),
  }
});