import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { CheckInTab } from "./CheckInTab";
import { InteractionScreen } from './InteractionScreen';
import { CheckInStack } from "../../navigation";
import { dynamicStyles } from "../../theme";
import HackGTIcon from "../../../assets/images/HackGTIcon";
import { AuthContext } from "../../contexts/AuthContext";

export default function CheckInStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <AuthContext.Consumer>
      {({ user }) => {
        return (
          <CheckInStack.Navigator>
            <CheckInStack.Screen
              options={{
                headerTitleAlign: "left",
                headerTitle: (props) => <HackGTIcon {...props} />,
                headerStyle: dStyles.tabBarBackgroundColor,
              }}
              name="HackGT"
            >
              {(props) => <CheckInTab {...props} />}
            </CheckInStack.Screen>
            <CheckInStack.Screen
              options={{
                headerTitleAlign: "left",
                headerTitle: (props) => <HackGTIcon {...props} />,
                headerStyle: dStyles.tabBarBackgroundColor,
                headerLeft: null,
              }}
              name="InteractionScreen"
              component={InteractionScreen}
            />
          </CheckInStack.Navigator>
        );
      }}
    </AuthContext.Consumer>
  );
}
