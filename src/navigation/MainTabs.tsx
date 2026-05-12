import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  LayoutDashboard,
  Activity,
  ClipboardList,
  FileText,
  Settings,
} from "lucide-react-native";

import OverviewStack from "./OverviewStack";
import OperationsStack from "./OperationsStack";
import WorklistStack from "./WorklistStack";
import ReportsStack from "./ReportsStack";
import SettingsScreen from "../screens/settings/SettingsScreen";

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
  const insets = useSafeAreaInsets();

  const bottomSpace = Math.max(insets.bottom, 12);

  return (
    <Tab.Navigator
      initialRouteName="Overview"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#64748B",
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 62 + bottomSpace,
          paddingTop: 8,
          paddingBottom: bottomSpace,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          elevation: 12,
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Overview"
        component={OverviewStack}
        options={{
          tabBarLabel: "Overview",
          tabBarIcon: ({ color, size }) => (
            <LayoutDashboard size={size} color={color} strokeWidth={2.4} />
          ),
        }}
      />

      <Tab.Screen
        name="Operations"
        component={OperationsStack}
        options={{
          tabBarLabel: "Operations",
          tabBarIcon: ({ color, size }) => (
            <Activity size={size} color={color} strokeWidth={2.4} />
          ),
        }}
      />

      <Tab.Screen
        name="Worklist"
        component={WorklistStack}
        options={{
          tabBarLabel: "Worklist",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} strokeWidth={2.4} />
          ),
        }}
      />

      <Tab.Screen
        name="Reports"
        component={ReportsStack}
        options={{
          tabBarLabel: "Reports",
          tabBarIcon: ({ color, size }) => (
            <FileText size={size} color={color} strokeWidth={2.4} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} strokeWidth={2.4} />
          ),
        }}
      >
        {() => <SettingsScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}