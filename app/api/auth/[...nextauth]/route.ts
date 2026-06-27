import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        title: {
          label: "Username",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const username = credentials?.title;
        const password = credentials?.password;

        if (!username || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (!user) {
          return null;
        }

        // فعلاً بدون bcrypt
        if (user.password !== password) {
          return null;
        }

        return {
          id: user.id.toString(),
          name: user.username,
          username: user.username,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).username = token.username;
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
