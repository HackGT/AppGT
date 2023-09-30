import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { ProfileTab } from "./ProfileTab";
import { ProfileStack } from "../../navigation";
import { dynamicStyles } from "../../theme";

import HexlabsIcon from "../../../assets/images/HexlabsIcon";

export default function InformationStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        options={{
          headerTitleAlign: "left",
          headerTitle: (props) => <HexlabsIcon {...props} />,
          headerStyle: dStyles.tabBarBackgroundColor,
        }}
        name="HackGT"
      >
        {(props) => <ProfileTab {...props} />}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
}