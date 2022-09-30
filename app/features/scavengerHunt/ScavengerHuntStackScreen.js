import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";
import { ScavHuntCrossword } from "./ScavHuntCrossword";
import { ScavengerHuntTab } from "./ScavengerHuntTab";
import { AuthContext } from "../../state/context";
import { ScavengerHuntStack } from "../../navigation";
import { dynamicStyles } from "../../theme";
import ScavHuntProvider from "../../state/scavHunt";
import { ScavHuntItem } from "./ScavHuntItem";
import HackGTIcon from "../../../assets/images/HackGTIcon";

export default function ScavengerHuntStackScreen({ navigation }) {
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <ScavHuntProvider>
      <AuthContext.Consumer>
        {({ user }) => {
          return (
            <ScavengerHuntStack.Navigator>
              <ScavengerHuntStack.Screen
                options={{
                  headerTitleAlign: "left",
                  headerTitle: (props) => <HackGTIcon {...props} />,
                  headerStyle: dStyles.tabBarBackgroundColor,
                }}
                name="HackGT"
              >
                {(props) => <ScavengerHuntTab {...props} user={user} />}
              </ScavengerHuntStack.Screen>
              <ScavengerHuntStack.Screen
                options={{
                  headerTitleAlign: "left",
                  headerTitle: (props) => <HackGTIcon {...props} />,
                  headerStyle: dStyles.tabBarBackgroundColor,
                  headerLeft: null,
                }}
                name="ScavHuntItem"
                component={ScavHuntItem}
              />
              <ScavengerHuntStack.Screen
                options={{
                  headerTitleAlign: "left",
                  headerTitle: (props) => <HackGTIcon {...props} />,
                  headerStyle: dStyles.tabBarBackgroundColor,
                  headerLeft: null,
                }}
                name="ScavHuntCrossword"
                component={ScavHuntCrossword}
              />
            </ScavengerHuntStack.Navigator>
          );
        }}
      </AuthContext.Consumer>
    </ScavHuntProvider>
  );
}
