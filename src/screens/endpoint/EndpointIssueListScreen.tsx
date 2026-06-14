import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../theme/colors";

function resolveStatus(value: unknown) {
  const text = String(value || "offline").toLowerCase();
  if (text === "stale") return "stale";
  if (text === "online") return "online";
  if (text === "all") return "all";
  return "offline";
}

export default function EndpointIssueListScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.replace("ActiveDeviceList", {
      status: resolveStatus(route.params?.type || route.params?.status),
    });
  }, [navigation, route.params?.status, route.params?.type]);

  return (
    <View style={[styles.page, { paddingTop: insets.top + 24 }]}> 
      <ActivityIndicator size="small" color={colors.blue} />
      <Text style={styles.text}>Opening live endpoint records...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  text: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 10,
  },
});
