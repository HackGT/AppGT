import { StyleSheet } from "react-native";
import { colors } from "../themes";

function elevationShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: 0.6 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation
  };
}

function popoutShadowStyle(elevation) {
  return {
    elevation,
    shadowColor: "grey",
    shadowOffset: { width: 0, height: -0.3 * elevation },
    shadowOpacity: 0.3,
    shadowRadius: 0.8 * elevation
  };
}

export const styleguide = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 20,
    paddingLeft: 8
  },
  text: {
    fontSize: 15,
    marginBottom: 12
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 24,
    marginLeft: 24,
    marginRight: 24,
    marginBottom: 20,
    flexGrow: 1,
    ...elevationShadowStyle(5)
  },
  noShadow: {
    backgroundColor: colors.lightGrayBackgroundBehindTagText,
    ...elevationShadowStyle(1)
  },
  titleView: {
    marginLeft: 24,
    marginTop: 24,
    marginBottom: 12,
    marginRight: 24
  },
  wrapperView: {
    paddingTop: 36,
    paddingLeft: 16,
    paddingRight: 16
  },
  popoutBar: {
    ...popoutShadowStyle(5),
    height: 80
  },
  elevate: {
    ...elevationShadowStyle(10)
  },
  score: {
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: "center",
    fontWeight: "bold"
  },
  notfound: {
    margin: 40,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center"
  },
  button: {
    backgroundColor: colors.primaryBlue,
    padding: 5,
    borderRadius: 20,
    margin: 8,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  cancelButton: {
    padding: 5,
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  qr: {
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonDisabled: {
    backgroundColor: colors.lightGrayImages,
    padding: 5,
    borderRadius: 20,
    margin: 8,
    flexDirection: "row",
    height: 40,
    alignItems: "center",
    justifyContent: "center"
  },
  LobButton: {
    backgroundColor: "#FDE8C1",
    borderRadius: 10,
    textAlign: "center",
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  LobText: {
    color: "#F9A57C",
    fontWeight: "bold",
    fontSize: 15
  },
  RoseButton: {
    backgroundColor: "#F9BDC6",
    borderRadius: 10,
    textAlign: "center",
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  RoseText: {
    color: "#F05F9B",
    fontWeight: "bold",
    fontSize: 15
  },
  ShroomButton: {
    backgroundColor: "#A4D496",
    borderRadius: 10,
    textAlign: "center",
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  ShroomText: {
    color: "#457483",
    fontWeight: "bold",
    fontSize: 15
  },
  TeaButton: {
    backgroundColor: "#CDECFB",
    borderRadius: 10,
    textAlign: "center",
    width: 200,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10
  },
  TeaText: {
    color: "#6DAEDF",
    fontWeight: "bold",
    fontSize: 15
  },
  locationImage: {
    position: "absolute",
    width: 375,
    height: 260,
    left: 0,
    top: 0,
  }
});
