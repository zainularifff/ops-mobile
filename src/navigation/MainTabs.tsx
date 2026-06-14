import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BarChart3, FileText, Settings, ShieldCheck } from "lucide-react-native";

import OverviewStack from "./OverviewStack";
import OperationsStack from "./OperationsStack";
import ReportsStack from "./ReportsStack";
import SettingsScreen from "../screens/settings/SettingsScreen";
import { colors } from "../theme/colors";

export type MainTabParamList = {
  Overview: undefined;
  Operator: undefined;
  Reports: undefined;
  Settings: undefined;
};

type MainTabsProps = { onLogout: () => void };

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabs({ onLogout }: MainTabsProps) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "800",
          paddingBottom: 2,
        },
        tabBarStyle: {
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 12,
          shadowColor: colors.navy,
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.08,
          shadowRadius: 18,
        },
        tabBarIcon: ({ color, size }) => {
          const iconSize = Math.max(size || 20, 20);
          if (route.name === "Operator") {
            return <ShieldCheck size={iconSize} color={color} strokeWidth={2.6} />;
          }
          if (route.name === "Reports") {
            return <FileText size={iconSize} color={color} strokeWidth={2.6} />;
          }
          if (route.name === "Settings") {
            return <Settings size={iconSize} color={color} strokeWidth={2.6} />;
          }
          return <BarChart3 size={iconSize} color={color} strokeWidth={2.6} />;
        },
      })}
    >
      <Tab.Screen name="Overview" component={OverviewStack} />
      <Tab.Screen name="Operator" component={OperationsStack} />
      <Tab.Screen name="Reports" component={ReportsStack} />
      <Tab.Screen name="Settings">
        {() => <SettingsScreen onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
