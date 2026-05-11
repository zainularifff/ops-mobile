import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { colors } from "../theme/colors";

type Props = {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

export default function ModuleCard({
  title,
  description,
  icon: Icon,
  color,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: `${color}18` }]}>
        <Icon size={22} color={color} strokeWidth={2.7} />
      </View>

      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <Text style={styles.chevron}>›</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
  },
  description: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 16,
    marginTop: 3,
  },
  chevron: {
    color: colors.muted,
    fontSize: 24,
    fontWeight: "800",
  },
});