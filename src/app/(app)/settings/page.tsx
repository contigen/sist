"use client";

import { Cpu, Eye, EyeOff, Key } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ButtonGold } from "@/components/ui/button-gold";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <PageHeader breadcrumb="Settings">
        <Link href="/library">
          <Button variant="ghost" size="sm">
            Back to Library
          </Button>
        </Link>
      </PageHeader>

      <main className="flex-1 py-8">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              Settings
            </h1>
            <p className="text-muted-foreground">
              Configure your agent deployment preferences and integrations
            </p>
          </div>

          <Tabs defaultValue="api-keys" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="api-keys">API Keys</TabsTrigger>
              <TabsTrigger value="options">Advanced</TabsTrigger>
            </TabsList>
            <TabsContent value="api-keys" className="space-y-4">
              <Card className="p-6 border-border">
                <div className="flex items-center gap-2 mb-6">
                  <Key className="size-5 text-gold" />
                  <h2 className="font-bold">API Keys & Credentials</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="openai-key">OpenAI API Key</Label>
                    <div className="flex gap-2 mt-1.5">
                      <div className="relative flex-1">
                        <Input
                          id="openai-key"
                          type={showApiKey ? "text" : "password"}
                          placeholder="sk-..."
                          defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxx"
                        />
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showApiKey ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <Button variant="outline" className="bg-transparent">
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Used for GPT-4 and other OpenAI models
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="anthropic-key">Anthropic API Key</Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="anthropic-key"
                        type="password"
                        placeholder="sk-ant-..."
                      />
                      <Button variant="outline" className="bg-transparent">
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Used for Claude models
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="cloudflare-key">
                      Cloudflare Workers API Token
                    </Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        id="cloudflare-key"
                        type="password"
                        placeholder="••••••••••••••••"
                      />
                      <Button variant="outline" className="bg-transparent">
                        Test
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Required for cloud worker deployments
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border flex justify-end">
                  <ButtonGold>Save API Keys</ButtonGold>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="options" className="space-y-4">
              <Card className="p-6 border-border">
                <div className="flex items-center gap-2 mb-6">
                  <Cpu className="size-5 text-gold" />
                  <h2 className="font-bold">Model Preferences</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="default-model">Default Model</Label>
                    <select
                      id="default-model"
                      className="w-full mt-1.5 bg-secondary border border-border rounded-md px-3 py-2 text-sm"
                    >
                      <option>gemini-3-pro</option>
                      <option>gemini-2.5-pro</option>
                      <option>gemini-2.5-flash</option>
                      <option>gemini-2.5-flash-lite</option>
                      <option>gpt-4</option>
                      <option>gpt-4-turbo</option>
                      <option>gpt-3.5-turbo</option>
                      <option>claude-4-opus</option>
                      <option>claude-4-sonnet</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="temperature">Default Temperature</Label>
                    <div className="flex items-center gap-4 mt-1.5">
                      <input
                        id="temperature"
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        defaultValue="0.7"
                        className="flex-1"
                      />
                      <span className="text-sm font-mono w-12 text-right">
                        0.7
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lower values make output more focused, higher values more
                      creative
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <Input
                      id="max-tokens"
                      type="number"
                      defaultValue="2048"
                      className="mt-1.5"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum response length
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
