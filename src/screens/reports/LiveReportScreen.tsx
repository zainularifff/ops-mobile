import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";

import { colors } from "../../theme/colors";
import { styles } from "./ReportDetailScreen.styles";

export default function LiveReportScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const report = route.params?.report || {};

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.85}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={20} color={colors.text} strokeWidth={2.7} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.profileCard}>
          <Text style={styles.profileLabel}>{report.id || "-"}</Text>
          <Text style={styles.profileTitle}>{report.title || "Report"}</Text>
          <Text style={styles.profileDesc}>{report.description || "-"}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
