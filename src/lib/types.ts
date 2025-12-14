export type DeploymentStatus = "idle" | "deploying" | "live" | "error";

export type LogEntry = {
  timestamp: string;
  message: string;
  type: "green" | "blue" | "red" | "yellow" | "muted";
};

export type ModelOption = {
  value: string;
  label: string;
  description: string;
  enabled: boolean;
  supportsAllTools: boolean;
  unsupportedTools?: string[];
};

export type ToolOption = {
  id: string;
  label: string;
  description: string;
  isNative?: boolean;
};

export type AgentConfiguration = {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  tools: string[];
  capabilities: string[];
  constraints: string[];
};

export type { Agent } from "@/generated/prisma/client";
