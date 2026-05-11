export type DashboardSummary = {
  totalEndpoints: number;
  activeDevices: number;
  offlineDevices: number;
  openTickets: number;
  highRiskExceptions: number;
};

export type WorklistItem = {
  id: string;
  title: string;
  site: string;
  status: string;
  risk: "Low" | "Medium" | "High";
};