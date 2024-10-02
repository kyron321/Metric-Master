"use client";

import { signIn, useSession } from "next-auth/react";
import React from "react";

const User = () => {
  const { data: session } = useSession();
  return (
    <>
      {!session ? (
        <>
          <h1 className="text-3xl text-red-500 font-bold">
            You're not logged in
          </h1>
          <div className="flex space-x-5">
            <button
              onClick={() => signIn("google")}
              className="border border-black rounded-lg px-5 py-1"
            >
              Sign in with Google
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="text-3xl text-green-500 font-bold">
            Welcome, {session.user?.name}
          </h1>
        </>
      )}
    </>
  );
};

export default User;