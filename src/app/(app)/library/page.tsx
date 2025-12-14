"use client";

import { Play, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCachedAgentsByUserId, getUserId } from "@/actions";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { ButtonGold } from "@/components/ui/button-gold";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { Agent } from "@/lib/types";

export default function LibraryPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadAgents = async () => {
      try {
        const userId = await getUserId();
        if (userId) {
          const fetchedAgents = await getCachedAgentsByUserId(userId);
          setAgents(fetchedAgents || []);
        }
      } catch (error) {
        console.error("Failed to load agents:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAgents();
  }, []);

  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.purpose.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <PageHeader breadcrumb="Agent Library">
          <Link href="/playground">
            <ButtonGold>Create New Agent</ButtonGold>
          </Link>
        </PageHeader>
        <main className="flex-1 flex items-center justify-center">
          <Spinner />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader breadcrumb="Agent Library">
        <Link href="/playground">
          <ButtonGold>Create New Agent</ButtonGold>
        </Link>
      </PageHeader>

      <main className="flex-1 py-8">
        <div className="container max-w-6xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Agent Library</h1>
            <p className="text-muted-foreground">
              All your created agents in one place
            </p>
          </div>

          <div className="mb-6">
            <Input
              placeholder="Search agents by name or purpose..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredAgents.length === 0 ? (
            <Card className="p-12 border-border text-center">
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {searchQuery ? "No agents found" : "No agents yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first AI agent to get started"}
              </p>
              {!searchQuery && (
                <Link href="/playground">
                  <ButtonGold>Create Agent</ButtonGold>
                </Link>
              )}
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAgents.map((agent) => (
                <Card key={agent.id} className="p-6 border-border card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-[hsl(var(--gold))/0.1] flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-[hsl(var(--gold))]" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold">{agent.name}</h3>
                          <StatusBadge
                            status={agent.isDeployed ? "live" : "idle"}
                          />
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {agent.purpose}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Capabilities:</span>{" "}
                            {agent.capabilities.length}
                          </div>
                          <div>
                            <span className="font-medium">Constraints:</span>{" "}
                            {agent.constraints.length}
                          </div>
                          <div>
                            <span className="font-medium">Requests:</span>{" "}
                            {agent.requestCount.toLocaleString()}
                          </div>
                          <div>
                            <span className="font-medium">Created:</span>{" "}
                            {new Date(agent.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <Link href={`/deploy/${agent.id}`}>
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      </Link>
                      {agent.isDeployed && (
                        <Link href={`/preview?agentId=${agent.id}`}>
                          <ButtonGold size="sm">Test</ButtonGold>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
