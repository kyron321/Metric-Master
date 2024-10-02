"use client";

import { useSession } from "next-auth/react";
import SignOut from "@/components/SignOut";
import { Websites } from "./Websites";
import PageSpeed from "@/components/Pagespeed";
import SignIn from "@/components/SignIn";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <main>
      {!session ? (
        <SignIn />
      ) : (
        <>
          <SignOut />
          <Websites />
          <PageSpeed />
        </>
      )}
    </main>
  );
}