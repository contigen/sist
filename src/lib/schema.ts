import { z } from "zod";

export const agentSchema = z.object({
  name: z.string().min(1),
  purpose: z.string().min(1),
  instructions: z.string().min(1),
  capabilities: z.array(z.string()).min(1),
  constraints: z.array(z.string()).min(1),
  tools: z.array(z.string()).default([]),
  model: z.string().default("gemini-2.0-flash-exp"),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().min(256).max(8192).default(2048),
  topP: z.number().min(0).max(1).default(0.9),
});
