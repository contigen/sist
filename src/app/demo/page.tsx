import { connection } from "next/server";
import { Suspense } from "react";
import { generateImage } from "@/tools";
import { DemoComponent } from "./demo-component";

export default async function DemoPage() {
  await connection();
  const { success, imageURL } = await generateImage(
    "A beautiful sunset over a calm ocean",
  );
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DemoComponent success={success} imageURL={imageURL || ""} />
    </Suspense>
  );
}
