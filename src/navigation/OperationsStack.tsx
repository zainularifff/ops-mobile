import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OperatorScreen from "../screens/operations/OperatorScreen";
import OperationModuleScreen from "../screens/operations/OperationModuleScreen";
import OperationListScreen from "../screens/operations/OperationListScreen";
import OperationDetailScreen from "../screens/operations/OperationDetailScreen";

const Stack = createNativeStackNavigator();

export default function OperationsStack() {
  return (
    <Stack.Navigator
      initialRouteName="OperatorHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="OperatorHome" component={OperatorScreen} />
      <Stack.Screen name="OperationModule" component={OperationModuleScreen} />
      <Stack.Screen name="OperationList" component={OperationListScreen} />
      <Stack.Screen name="OperationDetail" component={OperationDetailScreen} />
    </Stack.Navigator>
  );
}
