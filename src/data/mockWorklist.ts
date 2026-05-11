import { WorklistItem } from "../types/dashboard";

export const mockWorklist: WorklistItem[] = [
  {
    id: "DEV-001",
    title: "BSN-WS-0456",
    site: "BSN",
    status: "Offline",
    risk: "High",
  },
  {
    id: "DEV-002",
    title: "PERAK-LAP-0221",
    site: "Perak",
    status: "Stale > 7 Days",
    risk: "High",
  },
  {
    id: "INC-24051",
    title: "Endpoint support ticket",
    site: "HQ",
    status: "Open",
    risk: "Medium",
  },
  {
    id: "EX-3001",
    title: "Unauthorized software detected",
    site: "HQ",
    status: "Under Review",
    risk: "High",
  },
];