import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
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
  const spin = useRef(new Animated.Value(0)).current;
  const breathe = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const orbit = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 3600,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, {
          toValue: 1,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(breathe, {
          toValue: 0,
          duration: 1400,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    orbit.start();
    pulse.start();

    return () => {
      orbit.stop();
      pulse.stop();
    };
  }, [breathe, spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });
  const pulseScale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.92, 1.06] });
  const pulseOpacity = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.48, 0.9] });

  return (
    <View style={styles.wrap}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.motionAura,
          {
            borderColor: color,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
          },
        ]}
      />
      <Animated.View pointerEvents="none" style={[styles.orbitLayer, { transform: [{ rotate }] }]}>
        <View style={[styles.orbitDot, { backgroundColor: color }]} />
      </Animated.View>

      {kind === "online" ? (
        <OnlineIllustration color={color} />
      ) : kind === "offline" ? (
        <OfflineIllustration color={color} />
      ) : kind === "stale" ? (
        <StaleIllustration color={color} />
      ) : (
        <ManagedIllustration color={color} />
      )}
    </View>
  );
}

function ManagedIllustration({ color }: { color: string }) {
  return (
    <Svg width="92" height="92" viewBox="0 0 92 92">
      <Defs>
        <SvgGradient id="managedBg" x1="8" y1="6" x2="86" y2="88" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.98" />
          <Stop offset="1" stopColor={color} stopOpacity="0.18" />
        </SvgGradient>
        <SvgGradient id="managedFace" x1="18" y1="20" x2="72" y2="72" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#EEF3FF" />
        </SvgGradient>
      </Defs>
      <Circle cx="58" cy="28" r="25" fill={color} opacity="0.10" />
      <Circle cx="28" cy="65" r="20" fill={color} opacity="0.12" />
      <Ellipse cx="46" cy="80" rx="28" ry="7" fill="#101828" opacity="0.08" />
      <G>
        <Rect x="22" y="22" width="48" height="14" rx="7" fill="url(#managedFace)" stroke={color} strokeWidth="2" />
        <Rect x="18" y="40" width="56" height="14" rx="7" fill="url(#managedBg)" stroke={color} strokeWidth="2" opacity="0.94" />
        <Rect x="22" y="58" width="48" height="14" rx="7" fill="url(#managedFace)" stroke={color} strokeWidth="2" />
        <Circle cx="31" cy="29" r="3" fill={color} />
        <Circle cx="31" cy="47" r="3" fill={color} />
        <Circle cx="31" cy="65" r="3" fill={color} />
        <Rect x="40" y="27" width="21" height="4" rx="2" fill={color} opacity="0.86" />
        <Rect x="40" y="45" width="27" height="4" rx="2" fill={color} opacity="0.78" />
        <Rect x="40" y="63" width="18" height="4" rx="2" fill={color} opacity="0.82" />
      </G>
      <Path d="M70 39 L79 45 L70 51" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
    </Svg>
  );
}

function OnlineIllustration({ color }: { color: string }) {
  return (
    <Svg width="92" height="92" viewBox="0 0 92 92">
      <Defs>
        <SvgGradient id="onlineCore" x1="24" y1="20" x2="66" y2="72" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor={color} stopOpacity="0.24" />
        </SvgGradient>
      </Defs>
      <Circle cx="46" cy="46" r="37" fill={color} opacity="0.09" />
      <Circle cx="46" cy="46" r="28" fill="none" stroke={color} strokeWidth="2" opacity="0.20" />
      <Circle cx="46" cy="46" r="19" fill="none" stroke={color} strokeWidth="2" opacity="0.38" />
      <Circle cx="46" cy="46" r="15" fill="url(#onlineCore)" stroke={color} strokeWidth="2.5" />
      <Circle cx="46" cy="46" r="6" fill={color} />
      <Path d="M46 18 C62 20 74 31 77 47" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <Path d="M19 49 C21 65 34 76 50 77" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.28" />
      <Circle cx="75" cy="47" r="4" fill={color} />
      <Circle cx="22" cy="66" r="3" fill={color} opacity="0.55" />
    </Svg>
  );
}

function OfflineIllustration({ color }: { color: string }) {
  return (
    <Svg width="92" height="92" viewBox="0 0 92 92">
      <Defs>
        <SvgGradient id="offlineDevice" x1="20" y1="18" x2="74" y2="74" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor={color} stopOpacity="0.18" />
        </SvgGradient>
      </Defs>
      <Circle cx="61" cy="29" r="25" fill={color} opacity="0.10" />
      <Circle cx="29" cy="68" r="16" fill={color} opacity="0.14" />
      <Rect x="25" y="24" width="42" height="44" rx="13" fill="url(#offlineDevice)" stroke={color} strokeWidth="2" opacity="0.95" />
      <Rect x="32" y="34" width="28" height="5" rx="2.5" fill={color} opacity="0.74" />
      <Rect x="35" y="48" width="22" height="5" rx="2.5" fill={color} opacity="0.38" />
      <Path d="M23 70 H69" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.38" />
      <Path d="M27 25 L68 70" stroke={color} strokeWidth="5" strokeLinecap="round" />
      <Circle cx="22" cy="69" r="5" fill={color} />
      <Circle cx="70" cy="70" r="5" fill={color} opacity="0.78" />
      <Path d="M72 27 L78 34 M78 27 L72 34" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </Svg>
  );
}

function StaleIllustration({ color }: { color: string }) {
  return (
    <Svg width="92" height="92" viewBox="0 0 92 92">
      <Defs>
        <SvgGradient id="staleClock" x1="18" y1="18" x2="74" y2="74" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="1" stopColor={color} stopOpacity="0.19" />
        </SvgGradient>
      </Defs>
      <Circle cx="62" cy="31" r="25" fill={color} opacity="0.10" />
      <Circle cx="26" cy="66" r="18" fill={color} opacity="0.14" />
      <Circle cx="46" cy="48" r="27" fill="url(#staleClock)" stroke={color} strokeWidth="2.5" />
      <Circle cx="46" cy="48" r="4.5" fill={color} />
      <Path d="M46 31 V48 L59 56" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M30 28 C38 20 52 18 62 25" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <Path d="M62 25 L62 36 L72 31" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      <Circle cx="29" cy="28" r="4" fill={color} />
      <Circle cx="67" cy="70" r="4" fill={color} opacity="0.58" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 92,
    height: 92,
    alignItems: "center",
    justifyContent: "center",
  },
  motionAura: {
    position: "absolute",
    width: 78,
    height: 78,
    borderRadius: 30,
    borderWidth: 1.5,
    opacity: 0.5,
  },
  orbitLayer: {
    position: "absolute",
    width: 84,
    height: 84,
    borderRadius: 42,
  },
  orbitDot: {
    position: "absolute",
    top: 3,
    alignSelf: "center",
    width: 7,
    height: 7,
    borderRadius: 7,
    opacity: 0.65,
  },
});
