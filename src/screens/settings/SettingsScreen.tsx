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
import {
  getTwoFactorStatus,
  updateTwoFactorStatus,
} from "../../services/authService";
import {
  authenticateWithBiometric,
  isBiometricAvailable,
} from "../../services/biometricService";
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

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message || fallback;
  return String(error || fallback);
}

export default function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const navigation = useNavigation<any>();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(true);
  const [twoFactorAvailable, setTwoFactorAvailable] = useState(true);
  const [biometricEnabled, setBiometricEnabledState] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);

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

    try {
      setTwoFactorLoading(true);
      const status = await getTwoFactorStatus();
      setTwoFactorEnabled(Boolean(status.enabled));
      setTwoFactorAvailable(true);
    } catch (error) {
      setTwoFactorEnabled(false);
      setTwoFactorAvailable(false);
    } finally {
      setTwoFactorLoading(false);
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

  async function handleTwoFactorToggle(value: boolean) {
    if (twoFactorLoading) return;

    const previousValue = twoFactorEnabled;
    setTwoFactorEnabled(value);
    setTwoFactorLoading(true);

    try {
      const status = await updateTwoFactorStatus(value);
      setTwoFactorEnabled(Boolean(status.enabled));
      setTwoFactorAvailable(true);

      showDialog({
        type: value ? "success" : "info",
        title: "2FA Verification",
        message: value
          ? "2FA verification has been enabled for your account. Future login will require the second verification step."
          : "2FA verification has been disabled for your account.",
        primaryText: "Done",
      });
    } catch (error) {
      setTwoFactorEnabled(previousValue);
      setTwoFactorAvailable(false);

      showDialog({
        type: "danger",
        title: "2FA Update Failed",
        message: getErrorMessage(
          error,
          "Unable to update 2FA setting. Please confirm the backend supports 2FA settings endpoints."
        ),
        primaryText: "OK",
      });
    } finally {
      setTwoFactorLoading(false);
    }
  }

  async function handleBiometricToggle(value: boolean) {
    if (biometricLoading) return;

    const previousValue = biometricEnabled;
    setBiometricLoading(true);

    try {
      if (!value) {
        await setBiometricEnabled(false);
        setBiometricEnabledState(false);

        showDialog({
          type: "info",
          title: "Biometric Login",
          message: "Biometric login has been disabled for this device.",
          primaryText: "Done",
        });
        return;
      }

      const available = await isBiometricAvailable();

      if (!available) {
        setBiometricEnabledState(false);
        showDialog({
          type: "danger",
          title: "Biometric Not Available",
          message: "Fingerprint or face unlock is not available or not enrolled on this device. Set it up in Android/iOS settings first.",
          primaryText: "OK",
        });
        return;
      }

      const verified = await authenticateWithBiometric("Enable biometric login for OPS Mobile");

      if (!verified) {
        setBiometricEnabledState(previousValue);
        showDialog({
          type: "info",
          title: "Biometric Not Enabled",
          message: "Biometric verification was cancelled. The setting was not changed.",
          primaryText: "OK",
        });
        return;
      }

      await setBiometricEnabled(true);
      setBiometricEnabledState(true);

      showDialog({
        type: "success",
        title: "Biometric Login",
        message: "Biometric login has been verified and enabled for this device.",
        primaryText: "Done",
      });
    } catch (error) {
      setBiometricEnabledState(previousValue);

      showDialog({
        type: "danger",
        title: "Update Failed",
        message: "Unable to update biometric setting. Please try again.",
        primaryText: "OK",
      });
    } finally {
      setBiometricLoading(false);
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
                twoFactorLoading
                  ? "Checking 2FA status..."
                  : !twoFactorAvailable
                    ? "2FA setting endpoint is unavailable"
                    : twoFactorEnabled
                      ? "Second verification is enabled during login"
                      : "Second verification is currently disabled"
              }
              value={twoFactorEnabled}
              onValueChange={handleTwoFactorToggle}
              tintColor={colors.blue}
              activeTrackColor="#BFD7FF"
              disabled={twoFactorLoading || !twoFactorAvailable}
            />

            <ToggleSettingRow
              icon={Fingerprint}
              title="Biometric Login"
              description={
                biometricLoading
                  ? "Verifying biometric setting..."
                  : biometricEnabled
                    ? "Fingerprint or face unlock is enabled"
                    : "Fingerprint or face unlock is disabled"
              }
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              tintColor={colors.green}
              activeTrackColor="#BBF7D0"
              disabled={biometricLoading}
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
  disabled = false,
}: any) {
  return (
    <View style={[styles.settingRow, disabled && { opacity: 0.62 }]}> 
      <View style={[styles.settingIcon, settingIconDynamicStyle(tintColor)]}>
        <Icon size={18} color={tintColor} strokeWidth={2.7} />
      </View>

      <View style={styles.settingTextWrap}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDesc}>{description}</Text>
      </View>

      <Switch
        value={value}
        disabled={disabled}
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
