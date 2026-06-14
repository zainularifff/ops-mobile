import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OverviewStack from "./OverviewStack";
import SettingsScreen from "../screens/settings/SettingsScreen";

export type MainTabParamList = {
  Overview: undefined;
  Settings: undefined;
};

type MainTabsProps = { onLogout: () => void };

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs({ onLogout }: MainTabsProps) {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Overview" component={OverviewStack} />
      <Tab.Screen name="Settings">
        {() => <SettingsScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
