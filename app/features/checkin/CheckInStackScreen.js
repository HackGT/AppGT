import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { CheckInQR } from "./CheckInQR";
import { CheckInNFC } from './CheckInNFC';
import { CheckInStack } from "../../navigation";
import { dynamicStyles } from "../../theme";
import HexlabsIcon from "../../../assets/images/HexlabsIcon";
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
                                headerTitle: (props) => <HexlabsIcon {...props} />,
                                headerStyle: dStyles.tabBarBackgroundColor,
                            }}
                            name="CheckInQR"
                        >
                            {(props) => <CheckInQR {...props} />}
                        </CheckInStack.Screen>
                        <CheckInStack.Screen
                            options={{
                                headerTitleAlign: "left",
                                headerTitle: (props) => <HexlabsIcon {...props} />,
                                headerStyle: dStyles.tabBarBackgroundColor,
                                headerLeft: null,
                            }}
                            name="CheckInNFC"
                            component={CheckInNFC}
                        />
                    </CheckInStack.Navigator>
                );
            }}
        </AuthContext.Consumer>
    );
}
