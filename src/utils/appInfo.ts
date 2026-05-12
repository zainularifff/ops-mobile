import Constants from "expo-constants";
import * as Application from "expo-application";

export function getAppVersion() {
  return (
    Constants.expoConfig?.version ||
    Application.nativeApplicationVersion ||
    "1.0.0"
  );
}

export function getAppBuildNumber() {
  return (
    Application.nativeBuildVersion ||
    String(Constants.expoConfig?.android?.versionCode || "")
  );
}