import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import OperatorScreen from "../screens/operations/OperatorScreen";

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
    </Stack.Navigator>
  );
}
