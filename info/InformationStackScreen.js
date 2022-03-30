import React from "react";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { InformationTab } from "./InformationTab";
import { InformationStack } from "../stacks"
import { dynamicStyles } from "../themes";

import HackGTIcon from "../assets/HackGTIcon";

export default function InformationStackScreen({ navigation }) {
    const dStyles = useDynamicStyleSheet(dynamicStyles);
    return (
        <InformationStack.Navigator>
            <InformationStack.Screen
                options={{
                    headerTitleAlign: "left",
                    headerTitle: (props) => <HackGTIcon {...props} />,
                    headerStyle: dStyles.tabBarBackgroundColor,
                }}
                name="HackGT"
            >
                {(props) => <InformationTab {...props} />}
            </InformationStack.Screen>
        </InformationStack.Navigator>
    );
}