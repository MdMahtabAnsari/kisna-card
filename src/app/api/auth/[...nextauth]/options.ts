import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { verify } from "argon2";
import { UserStatus, Role } from "@/lib/schema/auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "identifier-password",
      name: "Identifier Password",
      credentials: {
        identifier: { label: "identifier", type: "text", placeholder: "Email/UserId/Phone" },
        password: { label: "Password", type: "password", placeholder: "Password" }
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Identifier and password are required");
        }
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { userId: credentials.identifier },
              { phone: credentials.identifier }
            ]
          }
        });
        if (!user) {
          throw new Error("User not found");
        }
        if (user.status !== "ACTIVE") {
          throw new Error("User is not active");
        }
        // const isValid = await verify(user.password, credentials.password);
        // if (!isValid) {
        //   throw new Error("Invalid credentials");
        // }
        if(user.password !== credentials.password) {
          throw new Error("Invalid credentials");
        }
        // Only return fields you want in the JWT/session
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          userId: user.userId,
          role: user.role,
          status: user.status,
        };
      }
    })
  ],
  pages: {
    signIn: "/signin",
    signOut: "/signout",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.phone = user.phone;
        token.userId = user.userId;
        token.role = user.role;
        token.status = user.status;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.phone = token.phone as string;
        session.user.userId = token.userId as string;
        session.user.role = token.role as Role;
        session.user.status = token.status as UserStatus;
      }
      return session;
    }
  }
}