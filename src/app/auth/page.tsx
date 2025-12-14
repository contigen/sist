import { Github } from "lucide-react";
import Link from "next/link";
import { signIn } from "@/auth";
import { ButtonGold } from "@/components/ui/button-gold";
import { Card } from "@/components/ui/card";

export default async function AuthPage({ searchParams }: PageProps<"/auth">) {
  const errorParam = (await searchParams).error as string;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gold to-gold/70 bg-clip-text text-transparent">
              Sist.
            </h1>
          </Link>
          <p className='text-muted-foreground text-lg [font-feature-settings:"ss01","ss03"] tracking-tight'>
            Agent Deployment Playground
          </p>
        </div>
        <Card className="p-8 space-y-6 relative overflow-hidden border-border/50 rounded-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(234,179,8,0.15),transparent_50%)]"></div>
          <div className="space-y-2 text-center relative">
            <h2 className="text-2xl font-[650] text-foreground tracking-tighter">
              Welcome back
            </h2>
            <p
              className={`text-sm text-mutedforeground [font-feature-settings:"ss01","ss03"] ${
                errorParam ? "text-red-300" : "text-muted-foreground"
              }`}
            >
              {errorParam
                ? "Authentication failed. Please try again."
                : "Sign in to continue to your agent workspace"}
            </p>
          </div>
          <form
            className="space-y-4 relative"
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <ButtonGold className="w-full">
              <Github className="mr-2 h-5 w-5" />
              Continue with GitHub
            </ButtonGold>
          </form>
        </Card>
      </div>
    </div>
  );
}
