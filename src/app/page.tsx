"use client";

import { useSession } from "next-auth/react";
import Dashboard from "@/components/Dashboard";
import { HelloWebsites } from "./Websites";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main>
      <HelloWebsites />
      <Dashboard />
    </main>
  );
}
