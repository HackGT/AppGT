import { DynamicStyleSheet, DynamicValue } from "react-native-dark-mode";

export const dynamicStyles = new DynamicStyleSheet({
  backgroundColor: {
    backgroundColor: new DynamicValue("white", "#0F0F0F"),
  },
  secondaryBackgroundColor: {
    backgroundColor: new DynamicValue("#F2F2F2", "#35383D"),
  },

  text: {
    color: new DynamicValue("#3F3F3F", "white"),
  },

  borderColor: {
    borderColor: new DynamicValue("#3F3F3F", "white"),
  },

  secondaryText: {
    color: new DynamicValue("#4F4F4F", "#C2C2C2"),
  },

  tintColor: {
    color: new DynamicValue("#41D1FF", "#2C8DDB"),
  },
  tintBackgroundColor: {
    backgroundColor: new DynamicValue("#41D1FF", "#2C8DDB"),
  },

  secondaryTintColor: {
    color: new DynamicValue("#2C8DDB", "#2C8DDB"),
  },
  secondaryTintBackgroundColor: {
    backgroundColor: new DynamicValue("#41D1FF", "#2C8DDB"),
  },

  primaryButtonBackground: {
    backgroundColor: new DynamicValue("#666666", "#35383D"),
  },

  tritaryBackgroundColor: {
    backgroundColor: new DynamicValue("white", "#1A1919"),
  },

  tabBarBackgroundColor: {
    backgroundColor: new DynamicValue("white", "#171717"),
    shadowColor: new DynamicValue("white", "#666666"),
    borderTopColor: new DynamicValue("white", "#666666"),
  },

  searchBorderTopColor: {
    borderTopColor: new DynamicValue("white", "#0F0F0F"),
  },

  searchBorderBottomColor: {
    borderBottomColor: new DynamicValue("white", "#0F0F0F"),
  },

  searchBackgroundColor: {
    backgroundColor: new DynamicValue("#F2F2F2", "#1A1919"),
  },

  searchDividerColor: {
    borderBottomColor: new DynamicValue("#C3C3C3", "#35383D"),
  },
});
