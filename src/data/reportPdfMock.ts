export type ReportSection = {
  title: string;
  statement: string;
};

export type PdfMetric = {
  label: string;
  value: string;
  note: string;
};

export type PdfFinding = {
  area: string;
  statement: string;
};

export type PdfColumn = {
  key: string;
  label: string;
};

export type PdfDetailTable = {
  title: string;
  description: string;
  columns: PdfColumn[];
  rows: Record<string, string>[];
};

export type ReportPdfPayload = {
  id: string;
  title: string;
  description: string;
  category: string;
  frequency: string;
  lastGenerated: string;
  pages: number;
  status: string;
  sections: ReportSection[];
  metrics: PdfMetric[];
  findings: PdfFinding[];
  detailTable: PdfDetailTable;
};

function getDefaultReportSections(category: string): ReportSection[] {
  if (category === "endpoint") {
    return [
      {
        title: "Endpoint Coverage",
        statement:
          "Shows managed endpoints, active devices, offline devices and stale reporting status.",
      },
      {
        title: "Site Breakdown",
        statement:
          "Identifies selected sites with higher endpoint review or reporting issues.",
      },
      {
        title: "Endpoint Follow-up",
        statement:
          "Lists devices requiring operation review or support follow-up.",
      },
    ];
  }

  if (category === "ticket") {
    return [
      {
        title: "Ticket Workload",
        statement:
          "Summarises open tickets, SLA risk, pending assignment and in-progress support work.",
      },
      {
        title: "SLA Risk",
        statement: "Identifies tickets approaching escalation threshold.",
      },
      {
        title: "Resolution Summary",
        statement:
          "Shows tickets resolved today and items pending closure validation.",
      },
    ];
  }

  if (category === "remote") {
    return [
      {
        title: "Remote Session Activity",
        statement:
          "Summarises remote control activity for monitoring and audit visibility.",
      },
      {
        title: "Failed Attempts",
        statement:
          "Highlights failed remote sessions that may require endpoint or permission review.",
      },
      {
        title: "After-hours Review",
        statement:
          "Shows remote activity outside normal support hours for audit review.",
      },
    ];
  }

  if (category === "software") {
    return [
      {
        title: "Software Compliance",
        statement:
          "Summarises approved, outdated, vulnerable and unauthorized software visibility.",
      },
      {
        title: "Unauthorized Software",
        statement: "Highlights software requiring approval or removal action.",
      },
      {
        title: "Security Exposure",
        statement:
          "Identifies software items that may introduce vulnerability exposure.",
      },
    ];
  }

  if (category === "asset") {
    return [
      {
        title: "Asset Lifecycle",
        statement:
          "Summarises asset age, lifecycle condition and replacement planning visibility.",
      },
      {
        title: "Aging Assets",
        statement: "Highlights devices approaching replacement planning stage.",
      },
      {
        title: "Critical Aging",
        statement:
          "Identifies assets requiring replacement review or risk prioritisation.",
      },
    ];
  }

  if (category === "geo") {
    return [
      {
        title: "Location Coverage",
        statement:
          "Summarises devices with tracked, unknown and mismatched location status.",
      },
      {
        title: "Unknown Location",
        statement: "Highlights endpoints without reliable location data.",
      },
      {
        title: "Location Accuracy",
        statement: "Provides review indicators for location coverage quality.",
      },
    ];
  }

  return [
    {
      title: "Overall Operations Health",
      statement:
        "Summarises endpoint health, ticket workload, risk exposure and items requiring attention.",
    },
    {
      title: "Today’s Attention",
      statement:
        "Highlights urgent operational issues such as offline endpoints, SLA risk and high-risk items.",
    },
    {
      title: "Management Summary",
      statement:
        "Provides executive-friendly status without requiring full technical investigation.",
    },
  ];
}

export function getReportPdfPayload(
  report: any,
  sections: ReportSection[] = []
): ReportPdfPayload {
  const category = report.category || "executive";
  const finalSections =
    sections.length > 0 ? sections : getDefaultReportSections(category);

  const base = {
    id: report.id || "RPT-000",
    title: report.title || "EMA OPS Report",
    description:
      report.description || "Generated operational report summary.",
    category,
    frequency: report.frequency || "-",
    lastGenerated: report.lastGenerated || "-",
    pages: report.pages || 0,
    status: report.status || "Ready",
    sections: finalSections,
  };

  if (category === "endpoint") {
    return {
      ...base,
      metrics: [
        {
          label: "Managed Endpoints",
          value: "4,892",
          note: "Total devices under monitoring",
        },
        {
          label: "Active Devices",
          value: "4,217",
          note: "Reporting within expected window",
        },
        {
          label: "Offline Devices",
          value: "358",
          note: "Require endpoint follow-up",
        },
        {
          label: "Stale Devices",
          value: "317",
          note: "No update beyond expected window",
        },
      ],
      findings: [
        {
          area: "Endpoint Reporting",
          statement:
            "Most endpoints are reporting normally, but offline and stale devices require operational follow-up.",
        },
        {
          area: "Site Attention",
          statement:
            "Selected branch devices show delayed reporting and should be verified by site support.",
        },
      ],
      detailTable: {
        title: "Endpoint Detail Preview",
        description:
          "Selected endpoint records requiring monitoring or support validation.",
        columns: [
          { key: "device", label: "Device" },
          { key: "site", label: "Site" },
          { key: "status", label: "Status" },
          { key: "lastSeen", label: "Last Seen" },
          { key: "owner", label: "Owner" },
          { key: "action", label: "Action" },
        ],
        rows: [
          {
            device: "JPJ-PUTRAJAYA-WS-014",
            site: "Putrajaya",
            status: "Offline",
            lastSeen: "2 days ago",
            owner: "Endpoint Support",
            action: "Check network and agent service",
          },
          {
            device: "SHAH-ALAM-PC-088",
            site: "Shah Alam",
            status: "Offline",
            lastSeen: "3 days ago",
            owner: "Site Support",
            action: "Confirm device availability",
          },
          {
            device: "JB-LAP-119",
            site: "Johor Bahru",
            status: "Stale",
            lastSeen: "9 days ago",
            owner: "Endpoint Support",
            action: "Validate active usage",
          },
        ],
      },
    };
  }

  if (category === "ticket") {
    return {
      ...base,
      metrics: [
        {
          label: "Open Tickets",
          value: "126",
          note: "Current support workload",
        },
        {
          label: "SLA Risk",
          value: "18",
          note: "Near escalation threshold",
        },
        {
          label: "Pending",
          value: "44",
          note: "Awaiting assignment or approval",
        },
        {
          label: "Resolved Today",
          value: "25",
          note: "Completed support items",
        },
      ],
      findings: [
        {
          area: "SLA Monitoring",
          statement:
            "SLA risk tickets require immediate follow-up to avoid escalation.",
        },
        {
          area: "Workload Control",
          statement:
            "Pending tickets should be assigned to owners to reduce backlog exposure.",
        },
      ],
      detailTable: {
        title: "Ticket Detail Preview",
        description:
          "Selected tickets representing workload, SLA risk and resolution status.",
        columns: [
          { key: "ticket", label: "Ticket" },
          { key: "title", label: "Title" },
          { key: "site", label: "Site" },
          { key: "owner", label: "Owner" },
          { key: "sla", label: "SLA / Due" },
          { key: "priority", label: "Priority" },
        ],
        rows: [
          {
            ticket: "INC-24051",
            title: "Unable to access EMA agent dashboard",
            site: "Kuala Lumpur HQ",
            owner: "Support Team A",
            sla: "45 min left",
            priority: "High",
          },
          {
            ticket: "INC-24102",
            title: "User reported slow device performance",
            site: "Shah Alam",
            owner: "Unassigned",
            sla: "Pending assignment",
            priority: "Medium",
          },
          {
            ticket: "INC-24144",
            title: "Printer mapping issue resolved",
            site: "Putrajaya",
            owner: "Support Team A",
            sla: "Resolved today",
            priority: "Low",
          },
        ],
      },
    };
  }

  if (category === "remote") {
    return {
      ...base,
      metrics: [
        {
          label: "Remote Activities",
          value: "982",
          note: "Recorded support sessions",
        },
        {
          label: "Successful",
          value: "914",
          note: "Completed sessions",
        },
        {
          label: "Failed Attempts",
          value: "68",
          note: "Require review",
        },
        {
          label: "After-Hours",
          value: "12",
          note: "Audit attention",
        },
      ],
      findings: [
        {
          area: "Remote Activity Monitoring",
          statement:
            "Remote activity is used for monitoring and audit visibility only. It does not initiate remote sessions from mobile.",
        },
        {
          area: "Failed Attempts",
          statement:
            "Failed remote sessions may indicate connectivity, permission or endpoint agent issues.",
        },
      ],
      detailTable: {
        title: "Remote Activity Detail Preview",
        description:
          "Selected remote control activity records for monitoring and audit review.",
        columns: [
          { key: "session", label: "Session" },
          { key: "target", label: "Target Device" },
          { key: "supportUser", label: "Support User" },
          { key: "time", label: "Time" },
          { key: "status", label: "Status" },
          { key: "reason", label: "Reason" },
        ],
        rows: [
          {
            session: "RMT-9821",
            target: "KL-HQ-LAP-014",
            supportUser: "Remote Support",
            time: "7 min ago",
            status: "Completed",
            reason: "Support activity recorded",
          },
          {
            session: "RMT-FLD-008",
            target: "SHAH-ALAM-LAP-077",
            supportUser: "Remote Support",
            time: "21 min ago",
            status: "Failed",
            reason: "Connection timeout",
          },
          {
            session: "RMT-AH-002",
            target: "KL-HQ-WS-204",
            supportUser: "Admin Support",
            time: "11:42 PM",
            status: "After-hours",
            reason: "Audit review required",
          },
        ],
      },
    };
  }

  if (category === "software") {
    return {
      ...base,
      metrics: [
        {
          label: "Software Items",
          value: "423",
          note: "Visible in mobile summary",
        },
        {
          label: "Compliant",
          value: "252",
          note: "Approved software",
        },
        {
          label: "Outdated",
          value: "96",
          note: "Requires update review",
        },
        {
          label: "Unauthorized",
          value: "20",
          note: "Requires action",
        },
      ],
      findings: [
        {
          area: "Software Compliance",
          statement:
            "Unauthorized and vulnerable software should be reviewed to reduce security and compliance exposure.",
        },
        {
          area: "Update Review",
          statement:
            "Outdated software requires validation against approved software versions.",
        },
      ],
      detailTable: {
        title: "Software Detail Preview",
        description:
          "Selected software records requiring compliance or security review.",
        columns: [
          { key: "software", label: "Software" },
          { key: "device", label: "Device" },
          { key: "site", label: "Site" },
          { key: "category", label: "Category" },
          { key: "status", label: "Status" },
          { key: "action", label: "Action" },
        ],
        rows: [
          {
            software: "Unapproved Remote Tool",
            device: "JB-OPS-PC-119",
            site: "Johor Bahru",
            category: "Remote Tool",
            status: "Unauthorized",
            action: "Review / remove",
          },
          {
            software: "Legacy PDF Tool",
            device: "SHAH-ALAM-PC-088",
            site: "Shah Alam",
            category: "Tools",
            status: "Vulnerable",
            action: "Validate version",
          },
          {
            software: "Google Chrome",
            device: "PUTRAJAYA-LAP-045",
            site: "Putrajaya",
            category: "Browser",
            status: "Outdated",
            action: "Update review",
          },
        ],
      },
    };
  }

  if (category === "asset") {
    return {
      ...base,
      metrics: [
        {
          label: "New Assets",
          value: "1,032",
          note: "Recently onboarded",
        },
        {
          label: "Standard",
          value: "2,198",
          note: "Within lifecycle",
        },
        {
          label: "Aging",
          value: "1,151",
          note: "Planning required",
        },
        {
          label: "Critical Aging",
          value: "511",
          note: "Replacement attention",
        },
      ],
      findings: [
        {
          area: "Lifecycle Planning",
          statement:
            "Aging and critical aging assets should be reviewed for replacement planning.",
        },
        {
          area: "Operational Risk",
          statement:
            "Critical aging devices may increase support, reliability and operational continuity risks.",
        },
      ],
      detailTable: {
        title: "Asset Lifecycle Detail Preview",
        description:
          "Selected assets requiring lifecycle review or replacement planning.",
        columns: [
          { key: "asset", label: "Asset" },
          { key: "model", label: "Model" },
          { key: "site", label: "Site" },
          { key: "age", label: "Age" },
          { key: "lifecycle", label: "Lifecycle" },
          { key: "action", label: "Action" },
        ],
        rows: [
          {
            asset: "SHAH-ALAM-PC-088",
            model: "Dell OptiPlex",
            site: "Shah Alam",
            age: "> 5 years",
            lifecycle: "Critical Aging",
            action: "Replacement review",
          },
          {
            asset: "JB-OPS-PC-119",
            model: "HP ProDesk",
            site: "Johor Bahru",
            age: "> 5 years",
            lifecycle: "Aging",
            action: "Plan refresh",
          },
          {
            asset: "KL-HQ-LAP-500",
            model: "Lenovo ThinkPad",
            site: "Kuala Lumpur HQ",
            age: "< 1 year",
            lifecycle: "New",
            action: "Confirm ownership",
          },
        ],
      },
    };
  }

  if (category === "geo") {
    return {
      ...base,
      metrics: [
        {
          label: "Coverage",
          value: "87%",
          note: "Location visibility",
        },
        {
          label: "Tracked",
          value: "4,120",
          note: "Valid latest location",
        },
        {
          label: "Unknown",
          value: "208",
          note: "Missing location data",
        },
        {
          label: "Mismatch",
          value: "31",
          note: "Requires validation",
        },
      ],
      findings: [
        {
          area: "Location Coverage",
          statement:
            "Most endpoints have valid location visibility, but unknown and mismatch records require review.",
        },
        {
          area: "Location Accuracy",
          statement:
            "Mismatch records should be validated against expected site and user assignment.",
        },
      ],
      detailTable: {
        title: "Geolocation Detail Preview",
        description:
          "Selected location records requiring coverage or accuracy review.",
        columns: [
          { key: "device", label: "Device" },
          { key: "expected", label: "Expected Site" },
          { key: "reported", label: "Reported Site" },
          { key: "status", label: "Status" },
          { key: "time", label: "Last Update" },
          { key: "action", label: "Action" },
        ],
        rows: [
          {
            device: "JB-OPS-PC-119",
            expected: "Johor Bahru",
            reported: "Unknown",
            status: "Mismatch",
            time: "1 hour ago",
            action: "Validate mapping",
          },
          {
            device: "PUTRAJAYA-LAP-045",
            expected: "Putrajaya",
            reported: "-",
            status: "Unknown",
            time: "2 hours ago",
            action: "Check tracking",
          },
          {
            device: "KL-HQ-LAP-014",
            expected: "Kuala Lumpur HQ",
            reported: "Kuala Lumpur HQ",
            status: "Tracked",
            time: "8 min ago",
            action: "No action",
          },
        ],
      },
    };
  }

  return {
    ...base,
    metrics: [
      {
        label: "Managed Endpoints",
        value: "4,892",
        note: "Total monitored endpoint base",
      },
      {
        label: "Active Devices",
        value: "4,217",
        note: "Currently reporting normally",
      },
      {
        label: "Open Tickets",
        value: "126",
        note: "Current support workload",
      },
      {
        label: "High Risk Items",
        value: "42",
        note: "Require attention",
      },
    ],
    findings: [
      {
        area: "Operations Health",
        statement:
          "Overall operations are visible through endpoint health, support workload and attention items.",
      },
      {
        area: "Attention Summary",
        statement:
          "Offline endpoints, SLA risk tickets and software review items should be prioritised.",
      },
    ],
    detailTable: {
      title: "Executive Attention Detail Preview",
      description:
        "Selected cross-domain items for executive and operational awareness.",
      columns: [
        { key: "area", label: "Area" },
        { key: "item", label: "Item" },
        { key: "status", label: "Status" },
        { key: "owner", label: "Owner" },
        { key: "priority", label: "Priority" },
        { key: "action", label: "Action" },
      ],
      rows: [
        {
          area: "Endpoint",
          item: "JPJ-PUTRAJAYA-WS-014",
          status: "Offline",
          owner: "Endpoint Support",
          priority: "High",
          action: "Verify endpoint",
        },
        {
          area: "Ticket",
          item: "INC-24051",
          status: "SLA Risk",
          owner: "Support Team A",
          priority: "High",
          action: "Escalate if blocked",
        },
        {
          area: "Software",
          item: "Unapproved Remote Tool",
          status: "Unauthorized",
          owner: "Security Review",
          priority: "High",
          action: "Review / remove",
        },
      ],
    },
  };
}