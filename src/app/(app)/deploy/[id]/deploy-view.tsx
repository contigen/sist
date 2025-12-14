"use client";

import { Activity, Copy, Globe } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deployAgent, undeployAgent } from "@/actions";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGold } from "@/components/ui/button-gold";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import type { Agent } from "@/lib/types";

type DeployViewProps = {
  agent: Agent;
};

export function DeployView({ agent }: DeployViewProps) {
  const [isDeploying, startDeployTransition] = useTransition();
  const [isUndeploying, startUndeployTransition] = useTransition();
  const [agentState, setAgentState] = useState(agent);

  const handleDeploy = () => {
    startDeployTransition(async () => {
      const result = await deployAgent(agentState.id);
      if (result.success) {
        toast.success(result.message || "Agent deployed successfully!");
        setAgentState((prev) => ({
          ...prev,
          isDeployed: true,
          deployedAt: new Date(),
        }));
      } else {
        toast.error(result.error || "Failed to deploy agent");
      }
    });
  };

  const handleUndeploy = () => {
    startUndeployTransition(async () => {
      const result = await undeployAgent(agentState.id);
      if (result.success) {
        toast.success(result.message || "Agent undeployed successfully!");
        setAgentState((prev) => ({
          ...prev,
          isDeployed: false,
          deployedAt: null,
        }));
      } else {
        toast.error(result.error || "Failed to undeploy agent");
      }
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const isPending = isDeploying || isUndeploying;

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader
        breadcrumb={
          <span className="flex items-center gap-2 font-medium">
            Deployment Dashboard
            <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded font-semibold">
              -{agentState.id.substring(0, 8)}-
            </span>
          </span>
        }
      >
        <Link href="/playground">
          <Button variant="ghost" size="sm">
            Edit Agent
          </Button>
        </Link>
        <Link href={`/preview?agentId=${agentState.id}`}>
          <ButtonGold size="sm">Preview</ButtonGold>
        </Link>
      </PageHeader>
      <main className="flex-1 py-8">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                {agentState.name}
              </h1>
              <StatusBadge status={agentState.isDeployed ? "live" : "idle"} />
            </div>
            <p className="text-muted-foreground">{agentState.purpose}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 border-border">
              <div className="text-xs text-muted-foreground mb-1">
                Request Count
              </div>
              <div className="text-2xl font-semibold">
                {agentState.requestCount.toLocaleString()}
              </div>
            </Card>
            <Card className="p-6 border-border">
              <div className="text-xs text-muted-foreground mb-1">Status</div>
              <div className="text-2xl font-semibold">
                {agentState.isDeployed ? "Live" : "Idle"}
              </div>
            </Card>
            <Card className="p-6 border-border">
              <div className="text-xs text-muted-foreground mb-1">
                Deployed At
              </div>
              <div className="text-lg font-semibold">
                {agentState.deployedAt
                  ? new Date(agentState.deployedAt).toLocaleDateString()
                  : "—"}
              </div>
            </Card>
          </div>

          <Card className="p-6 border-border mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Globe className="size-6 text-gold" />
                <div>
                  <h3 className="font-semibold">Edge Function Deployment</h3>
                  <p className="text-xs text-muted-foreground">
                    Ultra-low latency with global edge network
                  </p>
                </div>
              </div>
            </div>

            {agentState.isDeployed && (
              <div className="mb-4 p-3 bg-secondary rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  API Endpoint
                </div>
                <div className="flex items-center gap-2">
                  <code className="text-sm flex-1 break-all">
                    {typeof window !== "undefined"
                      ? `${window.location.origin}/api/agents/${agentState.id}/chat`
                      : `/api/agents/${agentState.id}/chat`}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      copyToClipboard(
                        typeof window !== "undefined"
                          ? `${window.location.origin}/api/agents/${agentState.id}/chat`
                          : `/api/agents/${agentState.id}/chat`,
                      )
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-secondary rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  Capabilities
                </div>
                <div className="text-lg font-bold">
                  {agentState.capabilities.length}
                </div>
              </div>
              <div className="p-3 bg-secondary rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">
                  Constraints
                </div>
                <div className="text-lg font-bold">
                  {agentState.constraints.length}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {agentState.isDeployed ? (
                <>
                  <Link
                    href={`/preview?agentId=${agentState.id}`}
                    className="flex-1"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                    >
                      <Activity className="w-4 h-4 mr-2" />
                      Test Agent
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={handleUndeploy}
                    disabled={isPending}
                  >
                    {isUndeploying ? <Spinner /> : "Undeploy"}
                  </Button>
                </>
              ) : (
                <ButtonGold
                  size="sm"
                  className="flex-1"
                  onClick={handleDeploy}
                  disabled={isPending}
                >
                  {isDeploying ? (
                    <Spinner strokeColor="#fff" />
                  ) : (
                    "Deploy Agent"
                  )}
                </ButtonGold>
              )}
            </div>
          </Card>

          <Card className="p-6 border-border mb-4">
            <h2 className="text-xl font-medium mb-4">Model Configuration</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Model</div>
                <div className="text-sm font-mono">
                  {agentState.model || "gemini-2.0-flash-exp"}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Temperature
                  </div>
                  <div className="text-sm font-mono">
                    {agentState.temperature ?? 0.7}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Max Tokens
                  </div>
                  <div className="text-sm font-mono">
                    {agentState.maxTokens ?? 2048}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Top P
                  </div>
                  <div className="text-sm font-mono">
                    {agentState.topP ?? 0.9}
                  </div>
                </div>
              </div>
              {agentState.tools && agentState.tools.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-2">
                    Enabled Tools
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {agentState.tools.map((tool) => (
                      <Badge
                        key={tool}
                        variant="secondary"
                        className="text-xs font-mono"
                      >
                        {tool}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6 border-border">
            <h2 className="text-xl font-medium mb-4">Agent Configuration</h2>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Capabilities
                </div>
                <div className="flex flex-wrap gap-2">
                  {agentState.capabilities.map((cap) => (
                    <Badge key={cap} variant="outline" className="bg-secondary">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Constraints
                </div>
                <div className="flex flex-wrap gap-2">
                  {agentState.constraints.map((constraint) => (
                    <Badge
                      key={constraint}
                      variant="outline"
                      className="bg-secondary"
                    >
                      {constraint}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  System Instructions
                </div>
                <div className="p-3 bg-secondary rounded-lg text-sm font-mono whitespace-pre-wrap">
                  {agentState.instruction}
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
