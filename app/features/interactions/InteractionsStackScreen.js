import React from "react";

import { InteractionsTab } from "./InteractionsTab";
import { InteractionScreen } from "./InteractionScreen";
import { InteractionsStack } from "../../navigation";
import { useTheme } from "../../theme";
import HexlabsIcon from "../../../assets/images/HexlabsIcon";
import { AuthContext } from "../../contexts/AuthContext";

export default function InteractionsStackScreen({ navigation }) {
  const dStyles = useTheme();
  return (
    <AuthContext.Consumer>
      {({ user }) => {
        return (
          <InteractionsStack.Navigator>
            <InteractionsStack.Screen
              options={{
                headerTitleAlign: "left",
                headerTitle: (props) => <HexlabsIcon {...props} />,
                headerStyle: dStyles.tabBarBackgroundColor,
              }}
              name="HackGT"
            >
              {(props) => <InteractionsTab {...props} />}
            </InteractionsStack.Screen>
            <InteractionsStack.Screen
              options={{
                headerTitleAlign: "left",
                headerTitle: (props) => <HexlabsIcon {...props} />,
                headerStyle: dStyles.tabBarBackgroundColor,
                headerLeft: null,
              }}
              name="InteractionScreen"
              component={InteractionScreen}
            />
          </InteractionsStack.Navigator>
        );
      }}
    </AuthContext.Consumer>
  );
}
