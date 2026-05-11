import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CheckCircle2,
  Fingerprint,
  LogOut,
  Server,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react-native";

import StatusPill from "../../components/StatusPill";
import {
  clearAuthStorage,
  getBiometricEnabled,
  setBiometricEnabled,
} from "../../services/secureStorage";
import { colors } from "../../theme/colors";

type SettingsScreenProps = {
  onLogout?: () => void;
};

type DialogType = "success" | "danger" | "info";

type DialogState = {
  visible: boolean;
  type: DialogType;
  title: string;
  message: string;
  primaryText: string;
  secondaryText?: string;
  onPrimary?: () => void | Promise<void>;
};

export default function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const insets = useSafeAreaInsets();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);

  const [dialog, setDialog] = useState<DialogState>({
    visible: false,
    type: "info",
    title: "",
    message: "",
    primaryText: "OK",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const biometric = await getBiometricEnabled();
      setBiometricEnabledState(Boolean(biometric));
    } catch (error) {
      setBiometricEnabledState(false);
    }
  }

  function closeDialog() {
    setDialog((current) => ({
      ...current,
      visible: false,
    }));
  }

  function showDialog(payload: Omit<DialogState, "visible">) {
    setDialog({
      visible: true,
      ...payload,
    });
  }

  function handleTwoFactorToggle(value: boolean) {
    setTwoFactorEnabled(value);

    showDialog({
      type: value ? "success" : "info",
      title: "2FA Verification",
      message: value
        ? "2FA verification has been enabled during login."
        : "2FA verification has been disabled for this prototype.",
      primaryText: "Done",
    });
  }

  async function handleBiometricToggle(value: boolean) {
    try {
      await setBiometricEnabled(value);
      setBiometricEnabledState(value);

      showDialog({
        type: value ? "success" : "info",
        title: "Biometric Login",
        message: value
          ? "Biometric login has been enabled for this device."
          : "Biometric login has been disabled for this device.",
        primaryText: "Done",
      });
    } catch (error) {
      showDialog({
        type: "danger",
        title: "Update Failed",
        message: "Unable to update biometric setting. Please try again.",
        primaryText: "OK",
      });
    }
  }

  function confirmLogout() {
    showDialog({
      type: "danger",
      title: "Logout",
      message: "Are you sure you want to logout from EMA OPS Mobile?",
      primaryText: "Logout",
      secondaryText: "Cancel",
      onPrimary: async () => {
        await clearAuthStorage();
        setBiometricEnabledState(false);
        closeDialog();
        onLogout?.();
      },
    });
  }

  return (
    <>
      <ScrollView
        style={styles.page}
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>EMA OPS MOBILE</Text>
          <Text style={styles.title}>Settings</Text>
          <Text style={styles.subtitle}>
            Manage account access and mobile app preferences.
          </Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <UserRound size={24} color={colors.white} strokeWidth={2.7} />
          </View>

          <View style={styles.profileTextWrap}>
            <Text style={styles.profileName}>IT Manager</Text>
            <Text style={styles.profileEmail}>itmanager@ema.io</Text>
          </View>

          <StatusPill label="Signed In" tone="green" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <ToggleSettingRow
            icon={ShieldCheck}
            title="2FA Verification"
            description={
              twoFactorEnabled
                ? "Second verification is enabled during login"
                : "Second verification is currently disabled"
            }
            value={twoFactorEnabled}
            onValueChange={handleTwoFactorToggle}
          />

          <ToggleSettingRow
            icon={Fingerprint}
            title="Biometric Login"
            description={
              biometricEnabled
                ? "Fingerprint or face unlock is enabled"
                : "Fingerprint or face unlock is disabled"
            }
            value={biometricEnabled}
            onValueChange={handleBiometricToggle}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Info</Text>

          <StaticSettingRow
            icon={Server}
            title="Environment"
            description="Current mobile app environment"
            status="UAT"
            tone="blue"
          />

          <StaticSettingRow
            icon={Server}
            title="App Version"
            description="EMA OPS Mobile prototype version"
            status="1.0.0"
            tone="blue"
          />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={confirmLogout}
        >
          <LogOut size={19} color={colors.white} strokeWidth={2.7} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Logging out will clear the current session and return to the login
          page.
        </Text>
      </ScrollView>

      <ModernDialog
        visible={dialog.visible}
        type={dialog.type}
        title={dialog.title}
        message={dialog.message}
        primaryText={dialog.primaryText}
        secondaryText={dialog.secondaryText}
        onClose={closeDialog}
        onPrimary={dialog.onPrimary}
      />
    </>
  );
}

function StaticSettingRow({
  icon: Icon,
  title,
  description,
  status,
  tone,
}: any) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Icon size={18} color={colors.blue} strokeWidth={2.7} />
      </View>

      <View style={styles.settingTextWrap}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>

      <StatusPill label={status} tone={tone} />
    </View>
  );
}

function ToggleSettingRow({
  icon: Icon,
  title,
  description,
  value,
  onValueChange,
}: any) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>
        <Icon size={18} color={colors.blue} strokeWidth={2.7} />
      </View>

      <View style={styles.settingTextWrap}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: "#D7E0EA",
          true: "#BFD7FF",
        }}
        thumbColor={value ? colors.blue : "#F8FAFC"}
      />
    </View>
  );
}

function ModernDialog({
  visible,
  type,
  title,
  message,
  primaryText,
  secondaryText,
  onClose,
  onPrimary,
}: {
  visible: boolean;
  type: DialogType;
  title: string;
  message: string;
  primaryText: string;
  secondaryText?: string;
  onClose: () => void;
  onPrimary?: () => void | Promise<void>;
}) {
  const iconColor =
    type === "success" ? colors.green : type === "danger" ? colors.red : colors.blue;

  const iconBg =
    type === "success" ? "#EBF8F1" : type === "danger" ? "#FFF0F0" : "#EAF1FF";

  const primaryBg =
    type === "danger" ? colors.red : type === "success" ? colors.green : colors.blue;

  async function handlePrimary() {
    if (onPrimary) {
      await onPrimary();
      return;
    }

    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.dialogCard}>
          <TouchableOpacity
            style={styles.dialogCloseButton}
            activeOpacity={0.85}
            onPress={onClose}
          >
            <X size={18} color={colors.textSoft} strokeWidth={2.7} />
          </TouchableOpacity>

          <View style={[styles.dialogIcon, { backgroundColor: iconBg }]}>
            <CheckCircle2 size={28} color={iconColor} strokeWidth={2.8} />
          </View>

          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogMessage}>{message}</Text>

          <View style={styles.dialogButtonRow}>
            {secondaryText ? (
              <TouchableOpacity
                style={styles.secondaryButton}
                activeOpacity={0.85}
                onPress={onClose}
              >
                <Text style={styles.secondaryButtonText}>{secondaryText}</Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: primaryBg }]}
              activeOpacity={0.85}
              onPress={handlePrimary}
            >
              <Text style={styles.primaryButtonText}>{primaryText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 18,
    paddingBottom: 110,
  },
  header: {
    marginBottom: 16,
  },
  eyebrow: {
    color: colors.blue,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    color: colors.text,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  subtitle: {
    color: colors.textSoft,
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    lineHeight: 18,
  },
  profileCard: {
    backgroundColor: colors.navy,
    borderRadius: 26,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: colors.blue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileTextWrap: {
    flex: 1,
  },
  profileName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "900",
  },
  profileEmail: {
    color: "#AFC0D6",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 16,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900",
    paddingTop: 14,
    paddingBottom: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: "#EAF1FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  settingTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  settingTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  settingDesc: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    marginTop: 3,
    lineHeight: 15,
  },
  logoutButton: {
    backgroundColor: colors.red,
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 4,
  },
  logoutText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "900",
    marginLeft: 8,
  },
  footerText: {
    color: colors.textSoft,
    fontSize: 11,
    fontWeight: "700",
    lineHeight: 16,
    textAlign: "center",
    marginTop: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(7, 17, 32, 0.62)",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  dialogCard: {
    backgroundColor: colors.white,
    borderRadius: 30,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  dialogCloseButton: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 34,
    height: 34,
    borderRadius: 13,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  dialogIcon: {
    width: 58,
    height: 58,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  dialogTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  dialogMessage: {
    color: colors.textSoft,
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 20,
  },
  dialogButtonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 17,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "900",
  },
  primaryButton: {
    flex: 1,
    borderRadius: 17,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "900",
  },
});