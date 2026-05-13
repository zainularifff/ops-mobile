import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  MapPin,
  Tag,
  UserRound,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import { colors } from "../../theme/colors";

import {
  softBackgroundStyle,
  solidBackgroundStyle,
  styles,
} from "./WorklistDetailScreen.styles";

export default function WorklistDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const item = route.params?.item || {};
  const typeColor = getTypeColor(item.type);

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
          <View style={styles.profileTop}>
            <View style={[styles.profileIcon, solidBackgroundStyle(typeColor)]}>
              <Text style={styles.profileIconText}>
                {(item.id || "WL-001").replace("WL-", "")}
              </Text>
            </View>

            <View style={styles.badgeWrap}>
              <StatusPill
                label={item.priority || "Medium"}
                tone={item.priority === "High" ? "red" : "amber"}
              />
              <StatusPill label={item.status || "Open"} tone="blue" />
            </View>
          </View>

          <Text style={styles.profileLabel}>WORKLIST DETAIL</Text>
          <Text style={styles.profileTitle}>{item.title || "Worklist Item"}</Text>
          <Text style={styles.profileDesc}>
            {item.reason || "Action item requires operational review."}
          </Text>
        </View>

        <View style={styles.infoPanel}>
          <Text style={styles.panelTitle}>Action Item Information</Text>

          <InfoRow
            icon={Tag}
            label="Source"
            value={item.source || "-"}
            color={typeColor}
          />

          <InfoRow
            icon={MapPin}
            label="Site"
            value={item.site || "-"}
            color={typeColor}
          />

          <InfoRow
            icon={UserRound}
            label="Owner"
            value={item.owner || "-"}
            color={typeColor}
          />

          <InfoRow
            icon={Clock3}
            label="Due"
            value={item.due || "-"}
            color={typeColor}
          />
        </View>

        <View style={styles.actionPanel}>
          <View style={styles.actionIcon}>
            <CheckCircle2 size={20} color={colors.green} strokeWidth={2.7} />
          </View>

          <View style={styles.actionTextWrap}>
            <Text style={styles.actionTitle}>Recommended Action</Text>
            <Text style={styles.actionText}>
              {item.action ||
                "Review this item and update the required action status."}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function getTypeColor(type: string) {
  if (type === "endpoint") return colors.blue;
  if (type === "ticket") return colors.purple;
  if (type === "remote") return colors.cyan;
  if (type === "software") return colors.amber;
  if (type === "asset") return colors.green;

  return colors.blue;
}

function InfoRow({ icon: Icon, label, value, color }: any) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, softBackgroundStyle(color)]}>
        <Icon size={18} color={color} strokeWidth={2.7} />
      </View>

      <View style={styles.infoTextWrap}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}