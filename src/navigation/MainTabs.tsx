import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  ClipboardList,
  FileText,
  LayoutDashboard,
  MonitorCog,
  Settings,
} from "lucide-react-native";

import OverviewStack from "./OverviewStack";
import OperationsStack from "./OperationsStack";
import WorklistStack from "./WorklistStack";
import ReportsStack from "./ReportsStack";
import SettingsScreen from "../screens/settings/SettingsScreen";
import { colors } from "../theme/colors";

export type MainTabParamList = {
  Overview: undefined;
  Operations: undefined;
  Worklist: undefined;
  Reports: undefined;
  Settings: undefined;
};

type MainTabsProps = {
  onLogout: () => void;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs({ onLogout }: MainTabsProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 72,
          paddingTop: 8,
          paddingBottom: 10,
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
        },
      }}
    >
      <Tab.Screen
        name="Overview"
        component={OverviewStack}
        options={{
          tabBarIcon: ({ color }) => (
            <LayoutDashboard size={22} color={color} strokeWidth={2.6} />
          ),
        }}
      />

      <Tab.Screen
        name="Operations"
        component={OperationsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <MonitorCog size={22} color={color} strokeWidth={2.6} />
          ),
        }}
      />

      <Tab.Screen
        name="Worklist"
        component={WorklistStack}
        options={{
          tabBarIcon: ({ color }) => (
            <ClipboardList size={22} color={color} strokeWidth={2.6} />
          ),
        }}
      />

      <Tab.Screen
        name="Reports"
        component={ReportsStack}
        options={{
          tabBarIcon: ({ color }) => (
            <FileText size={22} color={color} strokeWidth={2.6} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        options={{
          tabBarIcon: ({ color }) => (
            <Settings size={22} color={color} strokeWidth={2.6} />
          ),
        }}
      >
        {() => <SettingsScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}