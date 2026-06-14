import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export type EndpointVisualKind = "managed" | "online" | "offline" | "stale";

export default function EndpointVisual({ kind, color }: { kind: EndpointVisualKind; color: string }) {
  if (kind === "online") {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator style={styles.motion} size="small" color={color} />
        <View style={[styles.ringLarge, { borderColor: color }]} />
        <View style={[styles.ringSmall, { borderColor: color }]} />
        <View style={[styles.core, { backgroundColor: color }]}> 
          <View style={styles.coreInner} />
        </View>
        <View style={[styles.dotOne, { backgroundColor: color }]} />
        <View style={[styles.dotTwo, { backgroundColor: color }]} />
      </View>
    );
  }

  if (kind === "offline") {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator style={styles.motion} size="small" color={color} />
        <View style={styles.rowGraphic}>
          <View style={[styles.node, { backgroundColor: color }]} />
          <View style={[styles.line, { backgroundColor: color }]} />
          <View style={[styles.hollow, { borderColor: color }]} />
          <View style={[styles.shortLine, { backgroundColor: color }]} />
          <View style={[styles.smallNode, { backgroundColor: color }]} />
        </View>
        <View style={[styles.diagonal, { backgroundColor: color }]} />
      </View>
    );
  }

  if (kind === "stale") {
    return (
      <View style={styles.wrap}>
        <ActivityIndicator style={styles.motion} size="small" color={color} />
        <View style={[styles.dial, { borderColor: color }]}> 
          <View style={[styles.handMain, { backgroundColor: color }]} />
          <View style={[styles.handSide, { backgroundColor: color }]} />
          <View style={[styles.center, { backgroundColor: color }]} />
        </View>
        <View style={[styles.orbitDot, { backgroundColor: color }]} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <ActivityIndicator style={styles.motion} size="small" color={color} />
      <View style={styles.stack}>
        <View style={[styles.layer, { borderColor: color }]}> 
          <View style={[styles.light, { backgroundColor: color }]} />
          <View style={[styles.bar, { backgroundColor: color }]} />
        </View>
        <View style={[styles.layer, styles.layerOffset, { borderColor: color }]}> 
          <View style={[styles.light, { backgroundColor: color }]} />
          <View style={[styles.barShort, { backgroundColor: color }]} />
        </View>
        <View style={[styles.layer, { borderColor: color }]}> 
          <View style={[styles.light, { backgroundColor: color }]} />
          <View style={[styles.bar, { backgroundColor: color }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 78, height: 78, alignItems: "center", justifyContent: "center" },
  motion: { position: "absolute", opacity: 0.18, transform: [{ scale: 1.95 }] },
  ringLarge: { position: "absolute", width: 70, height: 70, borderRadius: 70, borderWidth: 1.5, opacity: 0.18 },
  ringSmall: { position: "absolute", width: 46, height: 46, borderRadius: 46, borderWidth: 1.5, opacity: 0.28 },
  core: { width: 30, height: 30, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  coreInner: { width: 10, height: 10, borderRadius: 10, backgroundColor: "rgba(255,255,255,0.92)" },
  dotOne: { position: "absolute", width: 7, height: 7, borderRadius: 7, right: 13, top: 23, opacity: 0.55 },
  dotTwo: { position: "absolute", width: 5, height: 5, borderRadius: 5, left: 17, bottom: 19, opacity: 0.42 },
  rowGraphic: { width: 64, height: 40, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  node: { width: 15, height: 15, borderRadius: 15 },
  line: { width: 18, height: 5, borderRadius: 5, marginLeft: 4, opacity: 0.5 },
  hollow: { width: 15, height: 15, borderRadius: 15, borderWidth: 2, marginHorizontal: -1, backgroundColor: "rgba(255,255,255,0.6)" },
  shortLine: { width: 12, height: 5, borderRadius: 5, marginRight: 4, opacity: 0.5 },
  smallNode: { width: 11, height: 11, borderRadius: 11 },
  diagonal: { position: "absolute", width: 5, height: 66, borderRadius: 5, transform: [{ rotate: "-35deg" }], opacity: 0.86 },
  dial: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, backgroundColor: "rgba(255,255,255,0.7)", alignItems: "center", justifyContent: "center" },
  center: { width: 7, height: 7, borderRadius: 7, position: "absolute" },
  handMain: { width: 4, height: 17, borderRadius: 4, position: "absolute", top: 12 },
  handSide: { width: 15, height: 4, borderRadius: 4, position: "absolute", right: 13, top: 24 },
  orbitDot: { position: "absolute", width: 9, height: 9, borderRadius: 9, top: 5 },
  stack: { width: 54, gap: 5 },
  layer: { height: 16, borderRadius: 8, borderWidth: 1.2, backgroundColor: "rgba(255,255,255,0.78)", flexDirection: "row", alignItems: "center", paddingHorizontal: 7 },
  layerOffset: { marginLeft: 7, marginRight: -7 },
  light: { width: 6, height: 6, borderRadius: 6, marginRight: 7 },
  bar: { flex: 1, height: 4, borderRadius: 6, opacity: 0.75 },
  barShort: { width: 24, height: 4, borderRadius: 6, opacity: 0.65 },
});
