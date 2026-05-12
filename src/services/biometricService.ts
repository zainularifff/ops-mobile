import * as LocalAuthentication from "expo-local-authentication";

export async function isBiometricAvailable() {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    return hasHardware && isEnrolled;
  } catch (error) {
    return false;
  }
}

export async function authenticateWithBiometric(message: string) {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: message,
      fallbackLabel: "Use device passcode",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    return false;
  }
}