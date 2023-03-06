import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { InformationTab } from "./InformationTab";
import { InformationStack } from "../../navigation";
import { dynamicStyles } from "../../theme";

import HexlabsIcon from "../../../assets/images/HexlabsIcon";

export default function InformationStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <InformationStack.Navigator>
      <InformationStack.Screen
        options={{
          headerTitleAlign: "left",
          headerTitle: (props) => <HexlabsIcon {...props} />,
          headerStyle: dStyles.tabBarBackgroundColor,
        }}
        name="HackGT"
      >
        {(props) => <InformationTab {...props} />}
      </InformationStack.Screen>
    </InformationStack.Navigator>
  );
}
