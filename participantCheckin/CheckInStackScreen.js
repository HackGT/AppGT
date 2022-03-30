import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { CheckInTab } from "./CheckInTab";
import { AuthContext } from "../context";
import { CheckInStack } from "../stacks"
import { dynamicStyles } from "../themes";
import CheckInProvider from "../state_management/checkIn";
import HackGTIcon from "../assets/HackGTIcon";

export default function CheckInStackScreen({ navigation }) {
    const dStyles = useDynamicStyleSheet(dynamicStyles);
    return (
        <CheckInProvider>
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
                        </CheckInStack.Navigator>
                    )
                }}
            </AuthContext.Consumer>
        </CheckInProvider>
    );
}