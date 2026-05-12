import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import AuthNavigator from "./AuthNavigator";
import MainTabs from "./MainTabs";
import { isLoggedIn } from "../services/authService";

export default function AppNavigator() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const hasToken = await isLoggedIn();
      setAuthenticated(hasToken);
      setCheckingSession(false);
    }

    checkSession();
  }, []);

  if (checkingSession) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#061225",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  if (!authenticated) {
    return (
      <AuthNavigator
        onAuthComplete={() => {
          setAuthenticated(true);
        }}
      />
    );
  }

  return (
    <MainTabs
      onLogout={() => {
        setAuthenticated(false);
      }}
    />
  );
}