import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OverviewHomeScreen from "../screens/overview/OverviewHomeScreen";
import ActiveDeviceListScreen from "../screens/endpoint/ActiveDeviceListScreen";
import DeviceQuickViewScreen from "../screens/endpoint/DeviceQuickViewScreen";
import GeolocationSummaryScreen from "../screens/geolocation/GeolocationSummaryScreen";
import GeolocationHistoryScreen from "../screens/geolocation/GeolocationHistoryScreen";
import TicketSummaryScreen from "../screens/ticket/TicketSummaryScreen";
import TicketWorkloadListScreen from "../screens/ticket/TicketWorkloadListScreen";
import TicketQuickViewScreen from "../screens/ticket/TicketQuickViewScreen";

const Stack = createNativeStackNavigator();

export default function OverviewStack() {
  return (
    <Stack.Navigator
      initialRouteName="OverviewHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OverviewHome" component={OverviewHomeScreen} />
      <Stack.Screen name="ActiveDeviceList" component={ActiveDeviceListScreen} />
      <Stack.Screen name="DeviceQuickView" component={DeviceQuickViewScreen} />
      <Stack.Screen name="GeolocationSummary" component={GeolocationSummaryScreen} />
      <Stack.Screen name="GeolocationHistory" component={GeolocationHistoryScreen} />
      <Stack.Screen name="TicketSummary" component={TicketSummaryScreen} />
      <Stack.Screen name="TicketWorkloadList" component={TicketWorkloadListScreen} />
      <Stack.Screen name="TicketQuickView" component={TicketQuickViewScreen} />
    </Stack.Navigator>
  );
}
