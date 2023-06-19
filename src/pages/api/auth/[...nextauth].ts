/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { customFetch, customFetchJson } from "@/utils";
import { get } from "@vercel/edge-config";
import { GetServerSidePropsContext } from "next";
import NextAuth, { Account, AuthOptions, Session, getServerSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import assert from "node:assert/strict";

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
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
      if (account) {
        token.accessToken = account.access_token!;
        token.expiresAt = account.expires_at!;

        if (account.refresh_token) {
          await saveRefreshToken(account);
        }
      } else if (!token.expiresAt || Date.now() >= token.expiresAt * 1000) {
        await refreshToken(token);
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

async function refreshToken(token: JWT) {
  const refreshToken: string | undefined = await get("refresh_token_jansepke");

  const tokens = await customFetchJson("https://oauth2.googleapis.com/token", {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_ID!,
      client_secret: process.env.GOOGLE_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken!,
    }),
    method: "POST",
  });

  token.accessToken = tokens.access_token;
  token.expiresAt = Math.floor(Date.now() / 1000 + tokens.expires_in);
}

async function saveRefreshToken(account: Account) {
  await customFetch(process.env.EDGE_CONFIG_API!, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          operation: "update",
          key: "refresh_token_jansepke",
          value: account.refresh_token,
        },
      ],
    }),
  });
}
