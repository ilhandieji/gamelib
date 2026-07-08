import NextAuth, { type NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

import
{
  createTrackedSession,
  getRequestMetadata,
  invalidateSessionByToken,
  recordLoginHistory,
  verifyPassword,
} from "@/lib/auth";

export const authOptions: NextAuthOptions = {
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: 
  [
    CredentialsProvider
    (
      {
        name: "Credentials",
        credentials:
        {
          username: { label: "Username", type: "text" },
          password: { label: "Password", type: "password" },
        },

        async authorize(credentials, request)
        {
          if (!credentials?.username || !credentials?.password)
            { throw new Error("Invalid username or password."); }
          
          const username = String(credentials.username).trim();
          const password = String(credentials.password);

          if (!username || !password)
            { throw new Error("Invalid username or password."); }
          
          const user = await prisma.user.findUnique({where: { username },});

          if (!user) { throw new Error("Invalid username or password."); }

          const isValidPassword = await verifyPassword(password, user.password);
          if (!isValidPassword)
            { throw new Error("Invalid username or password."); }

          const metadata = getRequestMetadata(request.headers);
          await recordLoginHistory(user.id, metadata);
          const { token } = await createTrackedSession(user.id, metadata);

          return {
            id: String(user.id),
            name: user.username,
            username: user.username,
            sessionToken: token,
          };
        },
      }
    ),
  ],
  session: { strategy: "jwt", },
  callbacks:
  {
    async jwt({ token, user })
    {
      if (user) 
      {
        const authUser = user as typeof user & { id: string; sessionToken?: string; name?: string };
        token.sub = authUser.id;
        token.name = authUser.name;
        const jwtToken = token as JWT & { sessionToken?: string };
        jwtToken.sessionToken = authUser.sessionToken;
      }

      return token;
    },

    async session({ session, token })
    {
      if (session.user)
        {
          const sessionUser = session.user as typeof session.user & { id?: string };
          sessionUser.id = typeof token.sub === "string" ? token.sub : "";
        }

      return session;
    },
  },
  
  events:
  {
    async signOut(message)
    {
      const token = message.token as JWT | undefined;
      const sessionToken = token?.sessionToken;

      if (typeof sessionToken === "string" && sessionToken.length > 0)
        { await invalidateSessionByToken(sessionToken); }
    },
  },
  pages: { signIn: "/login", },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
