import { colors } from "../theme/colors";

export type OperationModuleKey =
  | "endpoint"
  | "ticket"
  | "remote"
  | "software"
  | "asset"
  | "geo";

export type OperationTone =
  | "green"
  | "red"
  | "amber"
  | "blue"
  | "purple";

export type OperationCategory = {
  key: string;
  title: string;
  description: string;
  tone: OperationTone;
  iconKey: string;
};

export type OperationModuleConfig = {
  key: OperationModuleKey;
  title: string;
  label: string;
  description: string;
  color: string;
  iconKey: string;
  metricLabel: string;
  purpose: string;
  categories: OperationCategory[];
};

export const operationModules: Record<OperationModuleKey, OperationModuleConfig> = {
  endpoint: {
    key: "endpoint",
    title: "Endpoint Health",
    label: "ENDPOINT OPERATIONS",
    description:
      "Monitor endpoint reporting condition, offline devices, stale agents and site-level endpoint visibility.",
    color: colors.blue,
    iconKey: "monitor",
    metricLabel: "Managed Endpoints",
    purpose:
      "Used by operations team to quickly identify endpoint reporting problems and device follow-up areas.",
    categories: [
      {
        key: "active",
        title: "Active Coverage",
        description: "Devices currently reporting normally",
        tone: "green",
        iconKey: "check",
      },
      {
        key: "offline",
        title: "Offline / Not Reporting",
        description: "Devices that require endpoint follow-up",
        tone: "red",
        iconKey: "wifiOff",
      },
      {
        key: "stale",
        title: "Stale Devices",
        description: "No update beyond expected reporting window",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "review",
        title: "Endpoint Review",
        description: "Records requiring operational validation",
        tone: "purple",
        iconKey: "shield",
      },
    ],
  },

  ticket: {
    key: "ticket",
    title: "Support Tickets",
    label: "SUPPORT OPERATIONS",
    description:
      "Monitor support queue, SLA pressure, ownership and ticket progress from an operations view.",
    color: colors.purple,
    iconKey: "ticket",
    metricLabel: "Open Tickets",
    purpose:
      "Used to understand support workload, SLA risk and tickets requiring follow-up.",
    categories: [
      {
        key: "sla",
        title: "SLA Risk",
        description: "Tickets near escalation threshold",
        tone: "red",
        iconKey: "alert",
      },
      {
        key: "pending",
        title: "Pending Assignment",
        description: "Tickets waiting for owner or approval",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "progress",
        title: "In Progress",
        description: "Tickets currently handled by support team",
        tone: "blue",
        iconKey: "activity",
      },
      {
        key: "resolved",
        title: "Resolved Today",
        description: "Tickets completed today",
        tone: "green",
        iconKey: "check",
      },
    ],
  },

  remote: {
    key: "remote",
    title: "Remote Control",
    label: "REMOTE ACTIVITY",
    description:
      "Monitor remote support sessions, failed attempts, after-hours activity and audit visibility.",
    color: colors.cyan,
    iconKey: "remote",
    metricLabel: "Remote Records",
    purpose:
      "Used to track remote support usage, session success and activities that may require audit review.",
    categories: [
      {
        key: "sessions",
        title: "Remote Sessions Today",
        description: "Total remote support sessions recorded",
        tone: "blue",
        iconKey: "remote",
      },
      {
        key: "success",
        title: "Successful Sessions",
        description: "Remote sessions completed successfully",
        tone: "green",
        iconKey: "check",
      },
      {
        key: "failed",
        title: "Failed Sessions",
        description: "Failed or interrupted remote sessions",
        tone: "red",
        iconKey: "alert",
      },
      {
        key: "afterhours",
        title: "After-Hours Activity",
        description: "Remote sessions outside normal working hours",
        tone: "amber",
        iconKey: "clock",
      },
    ],
  },

  software: {
    key: "software",
    title: "Software & Security",
    label: "SOFTWARE VISIBILITY",
    description:
      "Monitor software compliance, unauthorized applications, outdated software and vulnerability exposure.",
    color: colors.amber,
    iconKey: "software",
    metricLabel: "Software Records",
    purpose:
      "Used to review software posture and identify software items that require action or approval.",
    categories: [
      {
        key: "compliant",
        title: "Compliant Software",
        description: "Approved software currently in good posture",
        tone: "green",
        iconKey: "check",
      },
      {
        key: "outdated",
        title: "Outdated Software",
        description: "Software versions requiring update review",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "vulnerable",
        title: "Vulnerable Software",
        description: "Software with potential security exposure",
        tone: "red",
        iconKey: "shield",
      },
      {
        key: "unauthorized",
        title: "Unauthorized Software",
        description: "Software requiring approval or removal",
        tone: "purple",
        iconKey: "alert",
      },
    ],
  },

  asset: {
    key: "asset",
    title: "Asset Lifecycle",
    label: "ASSET LIFECYCLE",
    description:
      "Monitor asset age, lifecycle stage, replacement priority and planning visibility.",
    color: colors.green,
    iconKey: "asset",
    metricLabel: "Asset Records",
    purpose:
      "Used to support replacement planning and lifecycle risk visibility across managed devices.",
    categories: [
      {
        key: "new",
        title: "New Assets",
        description: "Recently onboarded or refreshed assets",
        tone: "green",
        iconKey: "asset",
      },
      {
        key: "standard",
        title: "Standard Lifecycle",
        description: "Assets within standard lifecycle window",
        tone: "blue",
        iconKey: "check",
      },
      {
        key: "aging",
        title: "Aging Assets",
        description: "Assets approaching replacement planning stage",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "critical",
        title: "Critical Aging",
        description: "Assets requiring replacement or risk review",
        tone: "red",
        iconKey: "alert",
      },
    ],
  },

  geo: {
    key: "geo",
    title: "Geolocation",
    label: "LOCATION MONITORING",
    description:
      "Monitor location coverage, unknown locations, mismatches and tracking accuracy.",
    color: colors.red,
    iconKey: "geo",
    metricLabel: "Location Coverage",
    purpose:
      "Used to validate endpoint location visibility and identify location data issues.",
    categories: [
      {
        key: "tracked",
        title: "Tracked Devices",
        description: "Devices with valid latest location information",
        tone: "green",
        iconKey: "geo",
      },
      {
        key: "unknown",
        title: "Unknown Location",
        description: "Devices without reliable location data",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "mismatch",
        title: "Location Mismatch",
        description: "Devices reporting unexpected site or location",
        tone: "red",
        iconKey: "alert",
      },
      {
        key: "accuracy",
        title: "Accuracy Review",
        description: "Location data quality and coverage review",
        tone: "blue",
        iconKey: "check",
      },
    ],
  },
};
