import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { colors } from "../theme/colors";
import { formatNumber } from "../utils/formatters";

type Props = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
};

export default function StatCard({ label, value, icon: Icon, color }: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${color}18` }]}>
        <Icon size={20} color={color} strokeWidth={2.7} />
      </View>

      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{formatNumber(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  label: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "800",
    lineHeight: 15,
  },
  value: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: -0.7,
    marginTop: 8,
  },
});