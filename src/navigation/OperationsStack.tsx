import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OperationsScreen from "../screens/operations/OperationsScreen";
import OperationModuleScreen from "../screens/operations/OperationModuleScreen";
import OperationListScreen from "../screens/operations/OperationListScreen";
import OperationDetailScreen from "../screens/operations/OperationDetailScreen";

const Stack = createNativeStackNavigator();

export default function OperationsStack() {
  return (
    <Stack.Navigator
      initialRouteName="OperationsHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OperationsHome" component={OperationsScreen} />
      <Stack.Screen name="OperationModule" component={OperationModuleScreen} />
      <Stack.Screen name="OperationList" component={OperationListScreen} />
      <Stack.Screen name="OperationDetail" component={OperationDetailScreen} />
    </Stack.Navigator>
  );
}