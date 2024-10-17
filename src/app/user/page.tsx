"use client";

import { useSession } from "next-auth/react";
import SignOut from "@/components/SignOut";
import SignIn from "@/components/SignIn";
import Loader from "@/components/Loader";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <><Loader/></>;
  }

  return (
    <main>
      <SignOut/>
    </main>
  );
}