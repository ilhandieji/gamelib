import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 32;
const MIN_PASSWORD_LENGTH = 10;
const MAX_PASSWORD_LENGTH = 100;

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        signup: { label: "Sign up", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing username or password.");
        }

        const username = String(credentials.username).trim();
        const password = String(credentials.password);
        const isSignup = credentials.signup === "true";

        if (username.length < MIN_USERNAME_LENGTH || username.length > MAX_USERNAME_LENGTH) {
          throw new Error(
            `Username must be between ${MIN_USERNAME_LENGTH} and ${MAX_USERNAME_LENGTH} characters.`
          );
        }

        if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
          throw new Error(
            `Password must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters.`
          );
        }

        if (isSignup) {
          try {
            const newUser = await prisma.user.create({
              data: { username, password },
            });

            return { id: String(newUser.id), username: newUser.username };
          } catch (error: any) {
            // Handle unique constraint violation on username
            if (error.code === "P2002" && error.meta?.target?.includes("username")) {
              throw new Error("Username already exists.");
            }
            // Re-throw other errors
            throw error;
          }
        }

        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user || user.password !== password) {
          throw new Error("Invalid username or password.");
        }

        return { id: String(user.id), username: user.username };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string } }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        const user = session.user as Session["user"] & { id?: string };
        user.id = token.id as string;
        session.user = user;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
