import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";
import { ScavHuntCrossword } from "./ScavHuntCrossword";
import { ScavengerHuntTab } from "./ScavengerHuntTab";
import { ScavengerHuntStack } from "../../navigation";
import { dynamicStyles } from "../../theme";
import { ScavHuntProvider } from "../../state/scavHunt";
import { ScavHuntItem } from "./ScavHuntItem";
import HexlabsIcon from "../../../assets/images/HexlabsIcon";

export default function ScavengerHuntStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <ScavHuntProvider>
      <ScavengerHuntStack.Navigator>
        <ScavengerHuntStack.Screen
          options={{
            headerTitleAlign: "left",
            headerTitle: (props) => <HexlabsIcon {...props} />,
            headerStyle: dStyles.tabBarBackgroundColor,
          }}
          name="HackGT"
        >
          {(props) => <ScavengerHuntTab {...props} />}
        </ScavengerHuntStack.Screen>
        <ScavengerHuntStack.Screen
          options={{
            headerTitleAlign: "left",
            headerTitle: (props) => <HexlabsIcon {...props} />,
            headerStyle: dStyles.tabBarBackgroundColor,
            headerLeft: null,
          }}
          name="ScavHuntItem"
          component={ScavHuntItem}
        />
        <ScavengerHuntStack.Screen
          options={{
            headerTitleAlign: "left",
            headerTitle: (props) => <HexlabsIcon {...props} />,
            headerStyle: dStyles.tabBarBackgroundColor,
            headerLeft: null,
          }}
          name="ScavHuntCrossword"
          component={ScavHuntCrossword}
        />
      </ScavengerHuntStack.Navigator>
    </ScavHuntProvider>
  );
}
