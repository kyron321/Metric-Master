import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { Session } from "next-auth";

// Extend the Session type to include uid
declare module "next-auth" {
  interface Session {
    uid?: string;
  }
}

const handler = NextAuth({
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        async session({ session, token, user }) {
          // Add the UID to the session object
          session.uid = token.sub; // The token's 'sub' is typically the Google UID
          return session;
        },
      },
});

export {handler as GET, handler as POST};