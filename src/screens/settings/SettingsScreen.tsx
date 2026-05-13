import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { getAppBuildNumber, getAppVersion } from "../../utils/appInfo";
import { colors } from "../../theme/colors";

import {
  dialogIconStyle,
  primaryButtonStyle,
  settingIconDynamicStyle,
  styles,
} from "./SettingsScreen.styles";

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
  const navigation = useNavigation<any>();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);

  const appVersion = getAppVersion();
  const buildNumber = getAppBuildNumber();

  const appVersionLabel = buildNumber
    ? `v${appVersion} (${buildNumber})`
    : `v${appVersion}`;

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

        if (onLogout) {
          onLogout();
          return;
        }

        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      },
    });
  }

  return (
    <>
      <SafeAreaView edges={["top"]} style={styles.safeArea}>
        <ScrollView
          style={styles.page}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          bounces={false}
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
              <Text style={styles.profileName}>Zainul Ariffin</Text>
              <Text style={styles.profileEmail}>EMA Mobile User</Text>
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
              tintColor={colors.blue}
              activeTrackColor="#BFD7FF"
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
              tintColor={colors.green}
              activeTrackColor="#BBF7D0"
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
              tintColor={colors.blue}
            />

            <StaticSettingRow
              icon={Server}
              title="App Version"
              description="EMA OPS Mobile application build"
              status={appVersionLabel}
              tone="blue"
              tintColor={colors.green}
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
      </SafeAreaView>

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
  tintColor = colors.blue,
}: any) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, settingIconDynamicStyle(tintColor)]}>
        <Icon size={18} color={tintColor} strokeWidth={2.7} />
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
  tintColor = colors.blue,
  activeTrackColor = "#BFD7FF",
}: any) {
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, settingIconDynamicStyle(tintColor)]}>
        <Icon size={18} color={tintColor} strokeWidth={2.7} />
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
          true: activeTrackColor,
        }}
        thumbColor={value ? tintColor : "#F8FAFC"}
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
    type === "success"
      ? colors.green
      : type === "danger"
        ? colors.red
        : colors.blue;

  const iconBg =
    type === "success"
      ? "#EBF8F1"
      : type === "danger"
        ? "#FFF0F0"
        : "#EAF1FF";

  const primaryBg =
    type === "danger"
      ? colors.red
      : type === "success"
        ? colors.green
        : colors.blue;

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

          <View style={[styles.dialogIcon, dialogIconStyle(iconBg)]}>
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
              style={[styles.primaryButton, primaryButtonStyle(primaryBg)]}
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