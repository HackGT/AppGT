import React from "react";

import { InformationTab } from "./InformationTab";
import { InformationStack } from "../../navigation";
import { useTheme } from "../../theme";

import HexlabsIcon from "../../../assets/images/HexlabsIcon";

export default function InformationStackScreen({ navigation }) {
  const dStyles = useTheme();
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
