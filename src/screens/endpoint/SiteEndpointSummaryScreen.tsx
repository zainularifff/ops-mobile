import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../../theme/colors";

export default function SiteEndpointSummaryScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    navigation.replace("ActiveDeviceList", { status: "all" });
  }, [navigation]);

  return (
    <View style={[styles.page, { paddingTop: insets.top + 24 }]}> 
      <ActivityIndicator size="small" color={colors.blue} />
      <Text style={styles.text}>Loading device records...</Text>
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
