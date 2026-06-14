import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BarChart3, FileText, Settings, ShieldCheck } from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: "#8A95A5",
        tabBarLabelStyle: {
          fontSize: 10.5,
          fontWeight: "900",
          paddingBottom: bottomInset > 10 ? 0 : 2,
        },
        tabBarItemStyle: {
          paddingTop: 6,
        },
        tabBarStyle: {
          height: 62 + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
          backgroundColor: "rgba(255,255,255,0.98)",
          borderTopWidth: 1,
          borderTopColor: colors.border,
          elevation: 18,
          shadowColor: colors.navy,
          shadowOffset: { width: 0, height: -10 },
          shadowOpacity: 0.1,
          shadowRadius: 22,
        },
        tabBarIcon: ({ color, size }) => {
          const iconSize = Math.max(size || 20, 20);
          if (route.name === "Operator") {
            return <ShieldCheck size={iconSize} color={color} strokeWidth={2.65} />;
          }
          if (route.name === "Reports") {
            return <FileText size={iconSize} color={color} strokeWidth={2.65} />;
          }
          if (route.name === "Settings") {
            return <Settings size={iconSize} color={color} strokeWidth={2.65} />;
          }
          return <BarChart3 size={iconSize} color={color} strokeWidth={2.65} />;
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
