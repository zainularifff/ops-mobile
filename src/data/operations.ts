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
  value: string;
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
  metric: string;
  metricLabel: string;
  purpose: string;
  categories: OperationCategory[];
};

export type OperationRecord = {
  id: string;
  title: string;
  source: string;
  sourceLabel: string;
  site: string;
  owner: string;
  time: string;
  priority: "High" | "Medium" | "Low";
  status: string;
  summary: string;
  action: string;
  details: {
    label: string;
    value: string;
  }[];
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
    metric: "4,892",
    metricLabel: "Managed Endpoints",
    purpose:
      "Used by operations team to quickly identify endpoint reporting problems and device follow-up areas.",
    categories: [
      {
        key: "active",
        title: "Active Coverage",
        value: "4,217",
        description: "Devices currently reporting normally",
        tone: "green",
        iconKey: "check",
      },
      {
        key: "offline",
        title: "Offline / Not Reporting",
        value: "358",
        description: "Devices that require endpoint follow-up",
        tone: "red",
        iconKey: "wifiOff",
      },
      {
        key: "stale",
        title: "Stale Devices",
        value: "317",
        description: "No update beyond expected reporting window",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "review",
        title: "Endpoint Review",
        value: "42",
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
    metric: "126",
    metricLabel: "Open Tickets",
    purpose:
      "Used to understand support workload, SLA risk and tickets requiring follow-up.",
    categories: [
      {
        key: "sla",
        title: "SLA Risk",
        value: "18",
        description: "Tickets near escalation threshold",
        tone: "red",
        iconKey: "alert",
      },
      {
        key: "pending",
        title: "Pending Assignment",
        value: "44",
        description: "Tickets waiting for owner or approval",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "progress",
        title: "In Progress",
        value: "39",
        description: "Tickets currently handled by support team",
        tone: "blue",
        iconKey: "activity",
      },
      {
        key: "resolved",
        title: "Resolved Today",
        value: "25",
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
    metric: "982",
    metricLabel: "Remote Sessions",
    purpose:
      "Used to track remote support usage, session success and activities that may require audit review.",
    categories: [
      {
        key: "sessions",
        title: "Remote Sessions Today",
        value: "982",
        description: "Total remote support sessions recorded",
        tone: "blue",
        iconKey: "remote",
      },
      {
        key: "success",
        title: "Successful Sessions",
        value: "914",
        description: "Remote sessions completed successfully",
        tone: "green",
        iconKey: "check",
      },
      {
        key: "failed",
        title: "Failed Sessions",
        value: "68",
        description: "Failed or interrupted remote sessions",
        tone: "red",
        iconKey: "alert",
      },
      {
        key: "afterhours",
        title: "After-Hours Activity",
        value: "12",
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
    metric: "423",
    metricLabel: "Software Items",
    purpose:
      "Used to review software posture and identify software items that require action or approval.",
    categories: [
      {
        key: "compliant",
        title: "Compliant Software",
        value: "252",
        description: "Approved software currently in good posture",
        tone: "green",
        iconKey: "check",
      },
      {
        key: "outdated",
        title: "Outdated Software",
        value: "96",
        description: "Software versions requiring update review",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "vulnerable",
        title: "Vulnerable Software",
        value: "45",
        description: "Software with potential security exposure",
        tone: "red",
        iconKey: "shield",
      },
      {
        key: "unauthorized",
        title: "Unauthorized Software",
        value: "20",
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
    metric: "1,151",
    metricLabel: "Aging Assets",
    purpose:
      "Used to support replacement planning and lifecycle risk visibility across managed devices.",
    categories: [
      {
        key: "new",
        title: "New Assets",
        value: "1,032",
        description: "Recently onboarded or refreshed assets",
        tone: "green",
        iconKey: "asset",
      },
      {
        key: "standard",
        title: "Standard Lifecycle",
        value: "2,198",
        description: "Assets within standard lifecycle window",
        tone: "blue",
        iconKey: "check",
      },
      {
        key: "aging",
        title: "Aging Assets",
        value: "1,151",
        description: "Assets approaching replacement planning stage",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "critical",
        title: "Critical Aging",
        value: "511",
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
    metric: "87%",
    metricLabel: "Location Coverage",
    purpose:
      "Used to validate endpoint location visibility and identify location data issues.",
    categories: [
      {
        key: "tracked",
        title: "Tracked Devices",
        value: "4,120",
        description: "Devices with valid latest location information",
        tone: "green",
        iconKey: "geo",
      },
      {
        key: "unknown",
        title: "Unknown Location",
        value: "208",
        description: "Devices without reliable location data",
        tone: "amber",
        iconKey: "clock",
      },
      {
        key: "mismatch",
        title: "Location Mismatch",
        value: "31",
        description: "Devices reporting unexpected site or location",
        tone: "red",
        iconKey: "alert",
      },
      {
        key: "accuracy",
        title: "Accuracy Review",
        value: "87%",
        description: "Location data quality and coverage review",
        tone: "blue",
        iconKey: "check",
      },
    ],
  },
};

export const operationRecords: Record<string, OperationRecord[]> = {
  "endpoint:active": [
    {
      id: "END-ACT-001",
      title: "Endpoint reporting normally",
      source: "KL-HQ-LAP-014",
      sourceLabel: "Device",
      site: "Kuala Lumpur HQ",
      owner: "IT Operations",
      time: "5 min ago",
      priority: "Low",
      status: "Active",
      summary:
        "Device is currently reporting normally within the expected monitoring window.",
      action:
        "No immediate action required. Continue monitoring through the main EMA system if deeper inventory detail is needed.",
      details: [
        { label: "Connection Window", value: "Today" },
        { label: "Reporting Status", value: "Normal" },
        { label: "Agent Condition", value: "Healthy" },
      ],
    },
  ],

  "endpoint:offline": [
    {
      id: "END-OFF-001",
      title: "Endpoint not reporting",
      source: "JPJ-PUTRAJAYA-WS-014",
      sourceLabel: "Device",
      site: "Putrajaya",
      owner: "Endpoint Support",
      time: "2 days ago",
      priority: "High",
      status: "Offline",
      summary:
        "Device has not reported within the expected monitoring period and may require endpoint follow-up.",
      action:
        "Verify device availability, network connection and endpoint agent service. Escalate to site support if the device is still active.",
      details: [
        { label: "Last Seen", value: "2 days ago" },
        { label: "Issue Type", value: "Not Reporting" },
        { label: "Expected Action", value: "Endpoint follow-up" },
      ],
    },
    {
      id: "END-OFF-002",
      title: "Branch device disconnected",
      source: "SHAH-ALAM-PC-088",
      sourceLabel: "Device",
      site: "Shah Alam",
      owner: "Site Support",
      time: "3 days ago",
      priority: "High",
      status: "Offline",
      summary:
        "Branch endpoint is currently offline and has no recent update activity.",
      action:
        "Check whether the device is powered on, connected to network and still under active usage.",
      details: [
        { label: "Last Seen", value: "3 days ago" },
        { label: "Device Group", value: "Branch endpoint" },
        { label: "Follow-up Owner", value: "Site Support" },
      ],
    },
  ],

  "endpoint:stale": [
    {
      id: "END-STL-001",
      title: "Stale endpoint update",
      source: "JB-LAP-119",
      sourceLabel: "Device",
      site: "Johor Bahru",
      owner: "Endpoint Support",
      time: "9 days ago",
      priority: "Medium",
      status: "Stale",
      summary:
        "Endpoint has not updated for more than 7 days and should be validated.",
      action:
        "Confirm whether the device is still active, retired or temporarily disconnected.",
      details: [
        { label: "Stale Window", value: "> 7 days" },
        { label: "Last Update", value: "9 days ago" },
        { label: "Review Type", value: "Agent reporting" },
      ],
    },
  ],

  "endpoint:review": [
    {
      id: "END-REV-001",
      title: "Endpoint requires validation",
      source: "KL-HQ-PC-411",
      sourceLabel: "Device",
      site: "Kuala Lumpur HQ",
      owner: "IT Operations",
      time: "4 hours ago",
      priority: "Medium",
      status: "Review",
      summary:
        "Endpoint record requires validation due to incomplete or inconsistent operational status.",
      action:
        "Verify ownership, latest status and whether device should remain in active monitoring scope.",
      details: [
        { label: "Review Reason", value: "Incomplete endpoint status" },
        { label: "Data Condition", value: "Requires validation" },
        { label: "Action Type", value: "Operational review" },
      ],
    },
  ],

  "ticket:sla": [
    {
      id: "INC-24051",
      title: "Unable to access EMA agent dashboard",
      source: "INC-24051",
      sourceLabel: "Ticket",
      site: "Kuala Lumpur HQ",
      owner: "Support Team A",
      time: "18 min ago",
      priority: "High",
      status: "SLA Risk",
      summary:
        "Ticket is approaching SLA escalation threshold and requires immediate follow-up.",
      action:
        "Review owner, update progress and escalate to support lead if resolution is blocked.",
      details: [
        { label: "SLA Status", value: "45 min left" },
        { label: "Requester", value: "Operations User" },
        { label: "Queue", value: "Support Team A" },
      ],
    },
  ],

  "ticket:pending": [
    {
      id: "INC-24102",
      title: "User reported slow device performance",
      source: "INC-24102",
      sourceLabel: "Ticket",
      site: "Shah Alam",
      owner: "Unassigned",
      time: "34 min ago",
      priority: "Medium",
      status: "Pending",
      summary:
        "Ticket is waiting for assignment or first response from the support team.",
      action:
        "Assign ticket owner and confirm whether the issue is device, network or application related.",
      details: [
        { label: "Queue Status", value: "Pending assignment" },
        { label: "Requester", value: "Branch User" },
        { label: "Ticket Type", value: "Performance issue" },
      ],
    },
  ],

  "ticket:progress": [
    {
      id: "INC-24130",
      title: "Remote support session in progress",
      source: "INC-24130",
      sourceLabel: "Ticket",
      site: "Johor Bahru",
      owner: "Remote Support",
      time: "10 min ago",
      priority: "Medium",
      status: "In Progress",
      summary:
        "Support team is actively handling the ticket through a remote support session.",
      action:
        "Monitor progress and ensure resolution notes are updated after the support session.",
      details: [
        { label: "Current Status", value: "In progress" },
        { label: "Support Channel", value: "Remote support" },
        { label: "Assigned To", value: "Remote Support" },
      ],
    },
  ],

  "ticket:resolved": [
    {
      id: "INC-24144",
      title: "Printer mapping issue resolved",
      source: "INC-24144",
      sourceLabel: "Ticket",
      site: "Putrajaya",
      owner: "Support Team A",
      time: "1 hour ago",
      priority: "Low",
      status: "Resolved",
      summary:
        "Ticket was resolved today and is available for closure validation.",
      action:
        "Validate user confirmation and close ticket if no further issue is reported.",
      details: [
        { label: "Resolution Status", value: "Resolved today" },
        { label: "Closure Check", value: "Pending confirmation" },
        { label: "Support Team", value: "Support Team A" },
      ],
    },
  ],

  "remote:sessions": [
    {
      id: "RMT-9821",
      title: "Remote support session recorded",
      source: "KL-HQ-LAP-014",
      sourceLabel: "Target Device",
      site: "Kuala Lumpur HQ",
      owner: "Remote Support",
      time: "7 min ago",
      priority: "Low",
      status: "Completed",
      summary:
        "Remote session was initiated for support activity and recorded for audit visibility.",
      action:
        "Review session only if user raises dispute or if activity was outside approved support window.",
      details: [
        { label: "Session Type", value: "Remote support" },
        { label: "Session Status", value: "Completed" },
        { label: "Audit Visibility", value: "Recorded" },
      ],
    },
  ],

  "remote:success": [
    {
      id: "RMT-SUC-014",
      title: "Successful remote session",
      source: "JPJ-PUTRAJAYA-WS-021",
      sourceLabel: "Target Device",
      site: "Putrajaya",
      owner: "Support Team A",
      time: "15 min ago",
      priority: "Low",
      status: "Success",
      summary:
        "Remote session completed successfully and support activity was recorded.",
      action:
        "No action required unless follow-up support activity is needed.",
      details: [
        { label: "Result", value: "Successful" },
        { label: "Session Owner", value: "Support Team A" },
        { label: "Completion", value: "Normal" },
      ],
    },
  ],

  "remote:failed": [
    {
      id: "RMT-FLD-008",
      title: "Failed remote session attempt",
      source: "SHAH-ALAM-LAP-077",
      sourceLabel: "Target Device",
      site: "Shah Alam",
      owner: "Remote Support",
      time: "21 min ago",
      priority: "High",
      status: "Failed",
      summary:
        "Remote session failed and may indicate endpoint connectivity or permission issue.",
      action:
        "Check target device availability, remote control permission and endpoint agent condition.",
      details: [
        { label: "Failure Reason", value: "Connection timeout" },
        { label: "Attempt Count", value: "2 attempts" },
        { label: "Next Step", value: "Verify agent/network" },
      ],
    },
  ],

  "remote:afterhours": [
    {
      id: "RMT-AH-002",
      title: "After-hours remote activity",
      source: "KL-HQ-WS-204",
      sourceLabel: "Target Device",
      site: "Kuala Lumpur HQ",
      owner: "Admin Support",
      time: "11:42 PM",
      priority: "Medium",
      status: "After-hours",
      summary:
        "Remote activity was recorded outside normal support hours and may require audit review.",
      action:
        "Validate whether the activity was approved and linked to a support ticket.",
      details: [
        { label: "Activity Window", value: "After-hours" },
        { label: "Approval Check", value: "Required" },
        { label: "Linked Ticket", value: "Not confirmed" },
      ],
    },
  ],

  "software:compliant": [
    {
      id: "SW-CMP-001",
      title: "Approved software installed",
      source: "Microsoft Office",
      sourceLabel: "Software",
      site: "Kuala Lumpur HQ",
      owner: "Software Compliance",
      time: "Today",
      priority: "Low",
      status: "Compliant",
      summary:
        "Software is approved and currently within compliance visibility.",
      action:
        "No immediate action required. Continue monitoring software posture.",
      details: [
        { label: "Software Category", value: "Microsoft Product" },
        { label: "Compliance Status", value: "Approved" },
        { label: "Review Requirement", value: "No action" },
      ],
    },
  ],

  "software:outdated": [
    {
      id: "SW-OUT-011",
      title: "Outdated browser detected",
      source: "Google Chrome",
      sourceLabel: "Software",
      site: "Putrajaya",
      owner: "Software Compliance",
      time: "2 hours ago",
      priority: "Medium",
      status: "Outdated",
      summary:
        "Installed software version is outdated and requires update review.",
      action:
        "Verify latest approved version and schedule update through normal software maintenance process.",
      details: [
        { label: "Software Type", value: "Browser" },
        { label: "Issue", value: "Outdated version" },
        { label: "Required Action", value: "Update review" },
      ],
    },
  ],

  "software:vulnerable": [
    {
      id: "SW-VUL-009",
      title: "Potential vulnerable software",
      source: "Legacy PDF Tool",
      sourceLabel: "Software",
      site: "Shah Alam",
      owner: "Security Review",
      time: "4 hours ago",
      priority: "High",
      status: "Vulnerable",
      summary:
        "Software item may introduce security exposure and should be reviewed.",
      action:
        "Validate software version, business need and remediation option.",
      details: [
        { label: "Risk Type", value: "Vulnerability exposure" },
        { label: "Software Category", value: "Tools" },
        { label: "Review Owner", value: "Security Review" },
      ],
    },
  ],

  "software:unauthorized": [
    {
      id: "SW-UNA-020",
      title: "Unauthorized software detected",
      source: "Unapproved Remote Tool",
      sourceLabel: "Software",
      site: "Johor Bahru",
      owner: "Security Review",
      time: "25 min ago",
      priority: "High",
      status: "Unauthorized",
      summary:
        "Detected software is not part of approved software list and requires review.",
      action:
        "Confirm business justification. Remove or approve according to software governance process.",
      details: [
        { label: "Software Category", value: "Remote Tool" },
        { label: "Approval Status", value: "Not approved" },
        { label: "Action Required", value: "Review / remove" },
      ],
    },
  ],

  "asset:new": [
    {
      id: "AST-NEW-014",
      title: "New asset onboarded",
      source: "KL-HQ-LAP-500",
      sourceLabel: "Asset",
      site: "Kuala Lumpur HQ",
      owner: "Asset Management",
      time: "Today",
      priority: "Low",
      status: "New",
      summary:
        "New endpoint asset has been onboarded into monitoring scope.",
      action:
        "Confirm asset owner, site assignment and lifecycle record completeness.",
      details: [
        { label: "Lifecycle Stage", value: "New" },
        { label: "Asset Type", value: "Laptop" },
        { label: "Registration Status", value: "Newly onboarded" },
      ],
    },
  ],

  "asset:standard": [
    {
      id: "AST-STD-221",
      title: "Asset within standard lifecycle",
      source: "JPJ-PUTRAJAYA-WS-021",
      sourceLabel: "Asset",
      site: "Putrajaya",
      owner: "Asset Management",
      time: "Today",
      priority: "Low",
      status: "Standard",
      summary:
        "Asset is within standard lifecycle and does not require replacement planning.",
      action:
        "No replacement action required. Continue standard monitoring.",
      details: [
        { label: "Lifecycle Stage", value: "Standard" },
        { label: "Replacement Need", value: "Not required" },
        { label: "Monitoring Status", value: "Normal" },
      ],
    },
  ],

  "asset:aging": [
    {
      id: "AST-AG-119",
      title: "Aging asset requires planning",
      source: "JB-OPS-PC-119",
      sourceLabel: "Asset",
      site: "Johor Bahru",
      owner: "Asset Management",
      time: "This month",
      priority: "Medium",
      status: "Aging",
      summary:
        "Asset is approaching aging threshold and should be considered in replacement planning.",
      action:
        "Review asset age, business criticality and replacement schedule.",
      details: [
        { label: "Lifecycle Stage", value: "Aging" },
        { label: "Age Band", value: "> 5 years" },
        { label: "Planning Need", value: "Replacement planning" },
      ],
    },
  ],

  "asset:critical": [
    {
      id: "AST-CRT-088",
      title: "Critical aging asset",
      source: "SHAH-ALAM-PC-088",
      sourceLabel: "Asset",
      site: "Shah Alam",
      owner: "Asset Management",
      time: "This month",
      priority: "High",
      status: "Critical Aging",
      summary:
        "Asset is in critical aging condition and may require replacement prioritisation.",
      action:
        "Prioritise replacement review and validate risk impact with operations owner.",
      details: [
        { label: "Lifecycle Stage", value: "Critical Aging" },
        { label: "Risk Area", value: "Support / reliability" },
        { label: "Required Action", value: "Replacement review" },
      ],
    },
  ],

  "geo:tracked": [
    {
      id: "GEO-TRK-001",
      title: "Device location tracked",
      source: "KL-HQ-LAP-014",
      sourceLabel: "Device",
      site: "Kuala Lumpur HQ",
      owner: "Location Monitoring",
      time: "8 min ago",
      priority: "Low",
      status: "Tracked",
      summary:
        "Device has valid latest location information and is included in coverage count.",
      action:
        "No immediate action required. Continue monitoring location coverage.",
      details: [
        { label: "Location Status", value: "Tracked" },
        { label: "Last Known Site", value: "Kuala Lumpur HQ" },
        { label: "Coverage Status", value: "Valid" },
      ],
    },
  ],

  "geo:unknown": [
    {
      id: "GEO-UNK-008",
      title: "Unknown device location",
      source: "PUTRAJAYA-LAP-045",
      sourceLabel: "Device",
      site: "Putrajaya",
      owner: "Location Monitoring",
      time: "2 hours ago",
      priority: "Medium",
      status: "Unknown",
      summary:
        "Device does not have reliable latest location information.",
      action:
        "Verify location data availability and confirm whether endpoint tracking is enabled.",
      details: [
        { label: "Location Status", value: "Unknown" },
        { label: "Possible Cause", value: "Missing location update" },
        { label: "Review Type", value: "Coverage review" },
      ],
    },
  ],

  "geo:mismatch": [
    {
      id: "GEO-MIS-031",
      title: "Location mismatch detected",
      source: "JB-OPS-PC-119",
      sourceLabel: "Device",
      site: "Johor Bahru",
      owner: "Location Monitoring",
      time: "1 hour ago",
      priority: "High",
      status: "Mismatch",
      summary:
        "Device location does not match expected site mapping and requires validation.",
      action:
        "Validate user/site assignment and confirm whether location mapping is accurate.",
      details: [
        { label: "Expected Site", value: "Johor Bahru" },
        { label: "Reported Site", value: "Unknown / mismatch" },
        { label: "Required Action", value: "Location validation" },
      ],
    },
  ],

  "geo:accuracy": [
    {
      id: "GEO-ACC-087",
      title: "Location accuracy review",
      source: "Location Coverage Summary",
      sourceLabel: "Coverage",
      site: "Malaysia Sites",
      owner: "Location Monitoring",
      time: "Today",
      priority: "Low",
      status: "Review",
      summary:
        "Location coverage and accuracy are within mobile monitoring scope.",
      action:
        "Review unknown and mismatch records if coverage drops below expected threshold.",
      details: [
        { label: "Coverage", value: "87%" },
        { label: "Review Area", value: "Accuracy / completeness" },
        { label: "Scope", value: "Malaysia sites" },
      ],
    },
  ],
};

export function getOperationRecords(
  moduleKey: OperationModuleKey,
  categoryKey: string
) {
  return operationRecords[`${moduleKey}:${categoryKey}`] || [];
}