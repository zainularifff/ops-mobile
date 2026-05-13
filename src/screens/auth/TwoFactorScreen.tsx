import React, { useRef, useState } from "react";
import {
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react-native";

import AppButton from "../../components/AppButton";
import { colors } from "../../theme/colors";
import { styles } from "./TwoFactorScreen.styles";

type Props = {
  onVerified: () => void;
  onBack?: () => void;
};

const DEMO_CODE = "123456";

export default function TwoFactorScreen({ onVerified, onBack }: Props) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<TextInput>(null);

  function handleChange(value: string) {
    const cleaned = value.replace(/[^0-9]/g, "").slice(0, 6);
    setCode(cleaned);
    setError("");
  }

  function handleVerify() {
    Keyboard.dismiss();

    if (code.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (code !== DEMO_CODE) {
      setError("Invalid verification code. Use 123456 for prototype.");
      return;
    }

    onVerified();
  }

  return (
    <SafeAreaView edges={["top"]} style={styles.safeArea}>
      <View style={styles.page}>
        <View style={styles.glowTop} />
        <View style={styles.glowBottom} />

        <View style={styles.container}>
          {onBack ? (
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.backButton}
              onPress={onBack}
            >
              <ArrowLeft size={18} color={colors.white} strokeWidth={2.7} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.brandSection}>
            <View style={styles.logoBox}>
              <ShieldCheck size={34} color={colors.white} strokeWidth={2.6} />
            </View>

            <Text style={styles.title}>Two-Factor Verification</Text>

            <Text style={styles.subtitle}>
              Enter the 6-digit verification code to continue.
            </Text>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeaderIcon}>
              <LockKeyhole size={22} color={colors.blue} strokeWidth={2.6} />
            </View>

            <Text style={styles.cardTitle}>Secure login</Text>

            <Text style={styles.cardDescription}>
              This step confirms your identity before accessing OPS Mobile.
            </Text>

            <TouchableOpacity
              activeOpacity={0.95}
              style={styles.codeBox}
              onPress={() => inputRef.current?.focus()}
            >
              <Text style={styles.codeText}>
                {formatCodeDisplay(code)}
              </Text>
            </TouchableOpacity>

            <TextInput
              ref={inputRef}
              value={code}
              onChangeText={handleChange}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.hiddenInput}
              autoFocus
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <AppButton title="Verify Code" onPress={handleVerify} />

            <Text style={styles.noteText}>
              Prototype code: 123456
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function formatCodeDisplay(code: string) {
  const padded = code.padEnd(6, "•");
  return padded.split("").join("  ");
}