"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const SignOut = () => {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      {session ? (
        <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <img
            src={session.user?.image as string}
            className="rounded-full h-20 w-20"
            alt="User Avatar"
          />
          <h1 className="text-3xl text-green-500 dark:text-green-400 font-bold">
            Welcome back, {session.user?.name}
          </h1>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-300">
            {session.user?.email}
          </p>
          <button
            onClick={() => signOut()}
            className="border border-black dark:border-gray-600 rounded-lg bg-red-400 dark:bg-red-600 px-5 py-2 text-white hover:bg-red-500 dark:hover:bg-red-700 transition"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-3xl text-red-500 dark:text-red-400 font-bold">
            You're not logged in
          </h1>
          <div className="flex space-x-5">
            <button
              onClick={() => signIn("google")}
              className="border border-black dark:border-gray-600 rounded-lg px-5 py-2 bg-blue-500 dark:bg-blue-700 text-white hover:bg-blue-600 dark:hover:bg-blue-800 transition"
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