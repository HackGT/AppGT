import { createStackNavigator } from "@react-navigation/stack";

export { default as ScheduleStackScreen } from "../schedule/ScheduleStackScreen";
export { default as InformationStackScreen } from "../info/InformationStackScreen";
export { default as ScavengerHuntStackScreen } from "../scav_hunt/ScavengerHuntStackScreen";
export { default as CheckInStackScreen } from "../participantCheckin/CheckInStackScreen";

export const ScheduleStack = createStackNavigator();
export const InformationStack = createStackNavigator();
export const ScavengerHuntStack = createStackNavigator();
export const CheckInStack = createStackNavigator();
