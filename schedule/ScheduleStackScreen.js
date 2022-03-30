import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { ScheduleSearch } from "./ScheduleSearch";
import { ScheduleTab } from "./ScheduleTab";
import { HackathonContext } from "../context";
import { ScheduleStack } from "../stacks"
import { dynamicStyles } from "../themes";

import SearchIcon from "../assets/Search";
import StarOnIcon from "../assets/StarLargeOn";
import StarOffIcon from "../assets/StarLargeOff";
import HackGTIcon from "../assets/HackGTIcon";

export default function ScheduleStackScreen({ navigation }) {
    const dStyles = useDynamicStyleSheet(dynamicStyles);
    return (
        <HackathonContext.Consumer>
            {({ isStarSchedule, toggleIsStarSchedule }) => (
                <ScheduleStack.Navigator>
                    <ScheduleStack.Screen
                        options={{
                            headerTitleAlign: "left",
                            headerTitle: () => <HackGTIcon/>,
                            headerRight: () => (
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={toggleIsStarSchedule}>
                                        {isStarSchedule ? (
                                            <StarOnIcon
                                                fill={dStyles.secondaryBackgroundColor.backgroundColor}
                                            />
                                        ) : (
                                            <StarOffIcon
                                                fill={dStyles.secondaryBackgroundColor.backgroundColor}
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={{ paddingLeft: 10, paddingRight: 10 }}
                                        onPress={() => {
                                            navigation.navigate("ScheduleSearch");
                                        }}
                                    >
                                        <SearchIcon
                                            fill={dStyles.secondaryBackgroundColor.backgroundColor}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ),
                            headerStyle: dStyles.tabBarBackgroundColor,
                        }}
                        name="HackGT"
                    >
                        {(props) => <ScheduleTab {...props} />}
                    </ScheduleStack.Screen>

                    <ScheduleStack.Screen
                        options={{
                            headerTransparent: true,
                            headerTitle: "",
                            headerLeft: null,
                        }}
                        name="ScheduleSearch"
                        component={ScheduleSearch}
                    />
                </ScheduleStack.Navigator>
            )}
        </HackathonContext.Consumer>
    );
}