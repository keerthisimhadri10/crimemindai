export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low';
export type CrimeStatus = 'Under Investigation' | 'Solved' | 'Charge Sheet Filed' | 'Cold Case' | 'Pending Evidence';

export type UserRole = 'Administrator' | 'Investigator' | 'Police Officer' | 'Viewer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  badgeNumber: string;
  role: UserRole;
  district: string;
  department: string;
  avatarUrl?: string;
  lastLogin?: string;
}

export interface RolePermissions {
  canRunAI: boolean;
  canEditOfficerNotes: boolean;
  canRunPredictions: boolean;
  canExportPDF: boolean;
  canManageUsers: boolean;
  canViewGraphNetwork: boolean;
  canViewAnalytics: boolean;
  canSearchFIRs: boolean;
}

export interface CrimeRecord {
  id: string; // e.g., FIR-2026-101
  crimeType: string;
  district: string;
  area: string;
  latitude: number;
  longitude: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  suspect: string;
  victim: string;
  officer: string;
  status: CrimeStatus;
  vehicle: string;
  weapon: string;
  phoneNumber: string;
  knownAssociates: string[];
  previousFIRCount: number;
  evidence: string[];
  severity: SeverityLevel;
  description: string;
  moduiOperandi?: string;
}

export interface Hypothesis {
  hypothesis: string;
  confidence: number;
  supportingPoints: string[];
}

export interface InvestigationResult {
  query: string;
  summary: {
    title: string;
    overview: string;
    patternsDetected: string[];
  };
  keyFindings: string[];
  hypotheses: Hypothesis[];
  evidenceUsed: {
    firId: string;
    description: string;
    relevance: string;
  }[];
  reasoning: string;
  confidenceScore: number; // 0 - 100
  recommendations: string[];
  nextSteps: string[];
  matchedCases: CrimeRecord[];
  timestamp: string;
}

export interface NetworkNodeData extends Record<string, unknown> {
  label: string;
  type: 'Person' | 'Vehicle' | 'Phone' | 'Weapon' | 'Case' | 'Location' | 'Associate';
  subtitle?: string;
  details?: string;
  severity?: SeverityLevel;
  firCount?: number;
  status?: string;
}

export interface CustomNetworkNode {
  id: string;
  type: string;
  data: NetworkNodeData;
  position: { x: number; y: number };
}

export interface CustomNetworkEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: Record<string, string>;
}

export interface NetworkGraphResult {
  summary: string;
  nodes: CustomNetworkNode[];
  edges: CustomNetworkEdge[];
  insights: {
    title: string;
    description: string;
    confidence: number;
  }[];
}

export interface PredictionScenarioInput {
  patrolChange: number; // e.g. +30% or -10%
  isFestival: boolean;
  festivalName?: string;
  cctvMultiplier: number; // e.g. 2x
  gangActive: boolean;
  gangName?: string;
  customQuery?: string;
}

export interface PredictionRiskItem {
  crimeType: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  score: number; // 0-100
  trend: 'UP' | 'DOWN' | 'STABLE';
  details: string;
}

export interface PredictionScenarioResult {
  scenarioTitle: string;
  risks: PredictionRiskItem[];
  recommendedDeployment: {
    officersCount: number;
    mobilePatrols: number;
    temporaryCCTV: number;
    drones: number;
    specialUnits: string[];
  };
  reasoning: string;
  confidenceScore: number;
  mitigationSteps: string[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  officer: string;
  action: string;
  details: string;
}
