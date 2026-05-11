import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OverviewScreen from "../screens/overview/OverviewScreen";

import EndpointSummaryScreen from "../screens/endpoint/EndpointSummaryScreen";
import ActiveDeviceCoverageScreen from "../screens/endpoint/ActiveDeviceCoverageScreen";
import ActiveDeviceListScreen from "../screens/endpoint/ActiveDeviceListScreen";
import EndpointIssueListScreen from "../screens/endpoint/EndpointIssueListScreen";
import SiteEndpointSummaryScreen from "../screens/endpoint/SiteEndpointSummaryScreen";
import DeviceQuickViewScreen from "../screens/endpoint/DeviceQuickViewScreen";

import TicketSummaryScreen from "../screens/ticket/TicketSummaryScreen";
import TicketWorkloadListScreen from "../screens/ticket/TicketWorkloadListScreen";
import TicketQuickViewScreen from "../screens/ticket/TicketQuickViewScreen";

import RiskSummaryScreen from "../screens/risk/RiskSummaryScreen";
import ExceptionDetailScreen from "../screens/exception/ExceptionDetailScreen";
const Stack = createNativeStackNavigator();

export default function OverviewStack() {
  return (
    <Stack.Navigator
      initialRouteName="OverviewHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OverviewHome" component={OverviewScreen} />

      <Stack.Screen name="EndpointSummary" component={EndpointSummaryScreen} />

      <Stack.Screen
        name="ActiveDeviceCoverage"
        component={ActiveDeviceCoverageScreen}
      />

      <Stack.Screen
        name="ActiveDeviceList"
        component={ActiveDeviceListScreen}
      />

      <Stack.Screen name="TicketSummary" component={TicketSummaryScreen} />

      <Stack.Screen
        name="TicketWorkloadList"
        component={TicketWorkloadListScreen}
      />

      <Stack.Screen name="TicketQuickView" component={TicketQuickViewScreen} />

      <Stack.Screen name="RiskSummary" component={RiskSummaryScreen} />

      <Stack.Screen name="ExceptionDetail" component={ExceptionDetailScreen} />

      <Stack.Screen
        name="EndpointIssueList"
        component={EndpointIssueListScreen}
      />

      <Stack.Screen
        name="SiteEndpointSummary"
        component={SiteEndpointSummaryScreen}
      />

      <Stack.Screen name="DeviceQuickView" component={DeviceQuickViewScreen} />
    </Stack.Navigator>
  );
}