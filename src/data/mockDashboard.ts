import { DashboardSummary } from "../types/dashboard";

export const dashboardSummary: DashboardSummary = {
  totalEndpoints: 4892,
  activeDevices: 4217,
  offlineDevices: 358,
  openTickets: 126,
  highRiskExceptions: 27,
};

export const operationModules = [
  {
    id: "endpoint",
    title: "Endpoint Health",
    description: "Active, offline and stale endpoint visibility",
    icon: "▣",
    color: "#2F62D8",
  },
  {
    id: "ticket",
    title: "Support Tickets",
    description: "Open tickets, SLA risk and workload status",
    icon: "▤",
    color: "#7857D9",
  },
  {
    id: "remote",
    title: "Remote Control",
    description: "Remote activity, success, failure and audit logs",
    icon: "⧉",
    color: "#1588A8",
  },
  {
    id: "software",
    title: "Software & Security",
    description: "Unauthorized software and security visibility",
    icon: "▦",
    color: "#D48A1C",
  },
  {
    id: "asset",
    title: "Asset Lifecycle",
    description: "Aging assets and replacement planning",
    icon: "▥",
    color: "#1F9D65",
  },
  {
    id: "geo",
    title: "Geolocation",
    description: "Location coverage and accuracy review",
    icon: "⌖",
    color: "#D84D4D",
  },
];