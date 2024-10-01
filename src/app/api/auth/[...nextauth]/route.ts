import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

// Extend the Session type to include uid
declare module "next-auth" {
  interface Session {
    uid?: string;
  }
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        })
    ],
    callbacks: {
        async session({ session, token, user }) {
          session.uid = token.sub; // Add UID to session
          return session;
        },
    },
});

// Make sure to export the handler for both GET and POST requests
export { handler as GET, handler as POST };
