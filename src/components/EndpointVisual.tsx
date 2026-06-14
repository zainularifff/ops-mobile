import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient as SvgGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";

export type EndpointVisualKind = "managed" | "online" | "offline" | "stale";

export default function EndpointVisual({ kind, color }: { kind: EndpointVisualKind; color: string }) {
  return (
    <View style={styles.frame}>
      {kind === "online" ? (
        <OnlineImage color={color} />
      ) : kind === "offline" ? (
        <OfflineImage color={color} />
      ) : kind === "stale" ? (
        <StaleImage color={color} />
      ) : (
        <ManagedImage color={color} />
      )}
    </View>
  );
}

function ImageShell({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <Svg width="102" height="102" viewBox="0 0 102 102">
      <Defs>
        <SvgGradient id="shellBg" x1="12" y1="6" x2="92" y2="98" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor={color} stopOpacity="0.16" />
        </SvgGradient>
        <SvgGradient id="whiteCard" x1="22" y1="18" x2="75" y2="82" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#F4F7FF" />
        </SvgGradient>
      </Defs>
      <Rect x="4" y="4" width="94" height="94" rx="28" fill="url(#shellBg)" />
      <Circle cx="75" cy="22" r="25" fill={color} opacity="0.10" />
      <Circle cx="24" cy="78" r="18" fill={color} opacity="0.12" />
      <Ellipse cx="51" cy="88" rx="30" ry="7" fill="#111827" opacity="0.09" />
      {children}
    </Svg>
  );
}

function ManagedImage({ color }: { color: string }) {
  return (
    <ImageShell color={color}>
      <G>
        <Rect x="23" y="25" width="56" height="38" rx="13" fill="url(#whiteCard)" stroke={color} strokeWidth="2.4" />
        <Rect x="30" y="33" width="42" height="8" rx="4" fill={color} opacity="0.92" />
        <Rect x="30" y="47" width="27" height="6" rx="3" fill={color} opacity="0.44" />
        <Rect x="37" y="65" width="28" height="7" rx="3.5" fill={color} opacity="0.55" />
        <Rect x="26" y="73" width="50" height="8" rx="4" fill={color} opacity="0.22" />
        <Circle cx="75" cy="66" r="9" fill={color} />
        <Path d="M70 66 L74 70 L82 61" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </ImageShell>
  );
}

function OnlineImage({ color }: { color: string }) {
  return (
    <ImageShell color={color}>
      <G>
        <Circle cx="51" cy="50" r="29" fill="#FFFFFF" opacity="0.90" stroke={color} strokeWidth="2.4" />
        <Circle cx="51" cy="50" r="19" fill={color} opacity="0.14" />
        <Circle cx="51" cy="50" r="10" fill={color} />
        <Circle cx="51" cy="50" r="4" fill="#FFFFFF" />
        <Path d="M29 55 C32 68 43 76 56 75" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.42" />
        <Path d="M46 24 C60 23 72 32 77 45" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.56" />
        <Circle cx="78" cy="46" r="5" fill={color} />
        <Circle cx="29" cy="67" r="4" fill={color} opacity="0.55" />
      </G>
    </ImageShell>
  );
}

function OfflineImage({ color }: { color: string }) {
  return (
    <ImageShell color={color}>
      <G>
        <Rect x="28" y="24" width="47" height="54" rx="15" fill="url(#whiteCard)" stroke={color} strokeWidth="2.4" />
        <Rect x="37" y="36" width="29" height="7" rx="3.5" fill={color} opacity="0.72" />
        <Rect x="40" y="52" width="21" height="6" rx="3" fill={color} opacity="0.28" />
        <Path d="M24 27 L78 80" stroke={color} strokeWidth="6" strokeLinecap="round" />
        <Path d="M24 27 L78 80" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" opacity="0.88" />
        <Circle cx="27" cy="76" r="6" fill={color} />
        <Circle cx="78" cy="30" r="5" fill={color} opacity="0.74" />
        <Path d="M79 50 L86 57 M86 50 L79 57" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
      </G>
    </ImageShell>
  );
}

function StaleImage({ color }: { color: string }) {
  return (
    <ImageShell color={color}>
      <G>
        <Circle cx="51" cy="51" r="30" fill="#FFFFFF" opacity="0.92" stroke={color} strokeWidth="2.4" />
        <Circle cx="51" cy="51" r="4.5" fill={color} />
        <Path d="M51 33 V51 L64 59" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M30 32 C40 20 60 19 72 31" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.58" />
        <Path d="M72 31 L71 43 L82 37" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.62" />
        <Circle cx="31" cy="32" r="5" fill={color} />
        <Circle cx="71" cy="75" r="4.5" fill={color} opacity="0.52" />
      </G>
    </ImageShell>
  );
}

const styles = StyleSheet.create({
  frame: {
    width: 102,
    height: 102,
    alignItems: "center",
    justifyContent: "center",
  },
});
