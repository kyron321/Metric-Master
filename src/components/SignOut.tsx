"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const SignOut = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {session ? (
        <div className="flex flex-col items-center space-y-4 p-6 bg-mm-white dark:bg-gray-800 rounded-lg shadow-md">
          <img
            src={session.user?.image as string}
            className="rounded-full h-20 w-20"
            alt="User Avatar"
          />
          <h1 className="text-3xl text-secondary font-bold">
            Welcome back, {session.user?.name}
          </h1>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-300">
            {session.user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="rounded-lg transition-colors bg-secondary hover:bg-secondary-dark px-5 py-2 text-mm-white hover:text-mm-white-dark"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 p-6 bg-mm-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-3xl text-mm-white font-bold">
            You're not logged in
          </h1>
          <div className="flex space-x-5">
            <button
              onClick={() => signIn("google")}
              className="rounded-lg transition-colors bg-secondary hover:bg-secondary-dark px-5 py-2 text-mm-white hover:text-mm-white-dark"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignOut;