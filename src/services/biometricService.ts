import * as LocalAuthentication from "expo-local-authentication";

export async function isBiometricAvailable() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  return hasHardware && isEnrolled;
}

export async function authenticateWithBiometric(message: string) {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: message,
    fallbackLabel: "Use device passcode",
    cancelLabel: "Cancel",
  });

  return result.success;
}