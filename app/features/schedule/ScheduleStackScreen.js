import React, { useContext } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { View } from "react-native";
import { useDynamicStyleSheet } from "react-native-dark-mode";

import { ScheduleSearch } from "./ScheduleSearch";
import { ScheduleTab } from "./ScheduleTab";
import { HackathonContext } from "../../state/hackathon";
import { ScheduleStack } from "../../navigation";
import { dynamicStyles } from "../../theme";

import SearchIcon from "../../../assets/images/Search";
import StarOnIcon from "../../../assets/images/StarLargeOn";
import StarOffIcon from "../../../assets/images/StarLargeOff";
import HexlabsIcon from "../../../assets/images/HexlabsIcon";

export default function ScheduleStackScreen({ navigation }) {
  const { state, toggleIsStarSchedule } = useContext(HackathonContext);
  const dStyles = useDynamicStyleSheet(dynamicStyles);
  return (
    <ScheduleStack.Navigator>
      <ScheduleStack.Screen
        options={{
          headerTitleAlign: "left",
          headerTitle: () => <HexlabsIcon />,
          headerRight: () => (
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={toggleIsStarSchedule}>
                {state.isStarSchedule ? (
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
  );
}
