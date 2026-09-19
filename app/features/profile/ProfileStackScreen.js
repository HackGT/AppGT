import React from "react";

import { ProfileTab } from "./ProfileTab";
import { ProfileStack } from "../../navigation";
import { useTheme } from "../../theme";

import HexlabsIcon from "../../../assets/images/HexlabsIcon";

export default function InformationStackScreen({ navigation }) {
  const dStyles = useTheme();
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