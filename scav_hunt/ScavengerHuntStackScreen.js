import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { ScavengerHuntTab } from "./ScavengerHuntTab";
import { AuthContext } from "../context";
import { ScavengerHuntStack } from "../stacks"
import { dynamicStyles } from "../themes";
import ScavHuntProvider from "../state_management/scavHunt";
import { ScavHuntItem } from "./ScavHuntItem";
import HackGTIcon from "../assets/HackGTIcon";

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
                                    headerLeft: null
                                }}
                                name="ScavHuntItem"
                                component={ScavHuntItem}
                            />
                        </ScavengerHuntStack.Navigator>
                    )
                }}
            </AuthContext.Consumer>
        </ScavHuntProvider>
    );
}