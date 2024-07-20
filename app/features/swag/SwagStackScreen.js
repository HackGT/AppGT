import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { SwagTab } from "./SwagTab";
import { SwagScreen } from "./SwagScreen";
import { SwagStack } from "../../navigation";
import { dynamicStyles } from "../../theme";
import HexlabsIcon from "../../../assets/images/HexlabsIcon";
import { AuthContext } from "../../contexts/AuthContext";

export default function SwagStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <AuthContext.Consumer>
      {({ user }) => {
        return (
          <SwagStack.Navigator>
            <SwagStack.Screen
              options={{
                headerTitleAlign: "left",
                headerTitle: (props) => <HexlabsIcon {...props} />,
                headerStyle: dStyles.tabBarBackgroundColor,
              }}
              name="HackGT"
            >
              {(props) => <SwagTab {...props} />}
            </SwagStack.Screen>
            <SwagStack.Screen
              options={{
                headerTitleAlign: "left",
                headerTitle: (props) => <HexlabsIcon {...props} />,
                headerStyle: dStyles.tabBarBackgroundColor,
                headerLeft: null,
              }}
              name="SwagScreen"
              component={SwagScreen}
            />
          </SwagStack.Navigator>
        );
      }}
    </AuthContext.Consumer>
  );
}
