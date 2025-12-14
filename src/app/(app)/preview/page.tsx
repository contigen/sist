import { notFound, redirect } from "next/navigation";
import { getUserId } from "@/actions";
import { findAgentById } from "@/lib/db-queries";
import { PreviewView } from "./preview-view";

export default async function PreviewPage({
  searchParams,
}: PageProps<"/preview">) {
  const { agentId } = await searchParams;
  if (!agentId || Array.isArray(agentId)) redirect("/library");
  const userId = await getUserId();
  const agent = await findAgentById(agentId, userId!);
  if (!agent) notFound();
  return <PreviewView agent={agent} />;
}
