import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WorklistScreen from "../screens/worklist/WorklistScreen";
import WorklistDetailScreen from "../screens/worklist/WorklistDetailScreen";

const Stack = createNativeStackNavigator();

export default function WorklistStack() {
  return (
    <Stack.Navigator
      initialRouteName="WorklistHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="WorklistHome" component={WorklistScreen} />
      <Stack.Screen name="WorklistDetail" component={WorklistDetailScreen} />
    </Stack.Navigator>
  );
}