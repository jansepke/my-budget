/* eslint-disable @typescript-eslint/no-non-null-assertion */
import assert from "node:assert/strict";
import { GetServerSidePropsContext } from "next";
import NextAuth, { AuthOptions, Session, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};

export const getSession = async (context: GetServerSidePropsContext): Promise<Session> => {
  const session = await getServerSession(context.req, context.res, authOptions);

  assert(session, "session should always be set");

  return session;
};

export default NextAuth(authOptions);
