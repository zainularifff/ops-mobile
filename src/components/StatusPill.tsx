import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  label: string;
  tone?: "green" | "red" | "amber" | "blue" | "purple";
};

const toneMap = {
  green: { bg: "#EBF8F1", text: colors.green },
  red: { bg: "#FFF0F0", text: colors.red },
  amber: { bg: "#FFF7E8", text: colors.amber },
  blue: { bg: "#EAF1FF", text: colors.blue },
  purple: { bg: "#F1ECFF", text: colors.purple },
};

export default function StatusPill({ label, tone = "blue" }: Props) {
  const selected = toneMap[tone];

  return (
    <View style={[styles.pill, { backgroundColor: selected.bg }]}>
      <Text style={[styles.text, { color: selected.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  text: {
    fontSize: 10,
    fontWeight: "900",
  },
});