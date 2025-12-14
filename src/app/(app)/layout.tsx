import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Nav } from "./nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <Nav />
      {children}
    </SessionProvider>
  );
}
