import { createStackNavigator } from "@react-navigation/stack";

export { default as ScheduleStackScreen } from "../features/schedule/ScheduleStackScreen";
export { default as InformationStackScreen } from "../features/information/InformationStackScreen";
export { default as ScavengerHuntStackScreen } from "../features/scavengerHunt/ScavengerHuntStackScreen";
export { default as InteractionsStackScreen } from "../features/interactions/InteractionsStackScreen";

export const ScheduleStack = createStackNavigator();
export const InformationStack = createStackNavigator();
export const ScavengerHuntStack = createStackNavigator();
export const CheckInStack = createStackNavigator();
