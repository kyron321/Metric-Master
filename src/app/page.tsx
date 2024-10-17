"use client";

import { useSession } from "next-auth/react";
import { Websites } from "./Websites";
import SignIn from "@/components/SignIn";
import Loader from "@/components/Loader";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <><Loader/></>;
  }

  return (
    <main>
      {!session ? (
        <SignIn />
      ) : (
        <>
          <Websites session={session} />
        </>
      )}
    </main>
  );
}