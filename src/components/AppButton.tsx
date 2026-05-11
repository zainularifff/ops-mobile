import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../theme/colors";

type Props = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export default function AppButton({
  title,
  onPress,
  variant = "primary",
  loading = false,
}: Props) {
  return (
    <TouchableOpacity
      style={[styles.button, styles[variant]]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? colors.white : colors.blue} />
      ) : (
        <Text style={[styles.text, variant !== "primary" && styles.textAlt]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
  },
  primary: {
    backgroundColor: colors.blue,
  },
  secondary: {
    backgroundColor: "#F4F7FB",
  },
  danger: {
    backgroundColor: "#FFF0F0",
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  textAlt: {
    color: colors.blue,
  },
});