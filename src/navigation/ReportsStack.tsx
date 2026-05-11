import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ReportsScreen from "../screens/reports/ReportsScreen";
import ReportDetailScreen from "../screens/reports/ReportDetailScreen";

const Stack = createNativeStackNavigator();

export default function ReportsStack() {
  return (
    <Stack.Navigator
      initialRouteName="ReportsHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ReportsHome" component={ReportsScreen} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
    </Stack.Navigator>
  );
}