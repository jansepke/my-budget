/* eslint-disable @typescript-eslint/no-non-null-assertion */
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/spreadsheets.readonly",
        },
      },
    }),
  ],
};

export default NextAuth(authOptions);
