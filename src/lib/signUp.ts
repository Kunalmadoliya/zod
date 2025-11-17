import CredentialsProvider from "next-auth/providers/credentials";
import {NextAuthOptions} from "next-auth";
import dbConnect from "./dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOption: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {
          label: "Email or Username",
          type: "text",
          placeholder: "you@example.com or user123",
        },
        password: {label: "Password", type: "password"},
      },

      async authorize(credentials) {
        try {
          // 1️⃣ Missing fields
          if (!credentials?.identifier) {
            throw new Error("Please enter your email or username.");
          }
          if (!credentials?.password) {
            throw new Error("Please enter your password.");
          }

          await dbConnect();

          // 2️⃣ Look up by email OR username
          const user = await User.findOne({
            $or: [
              {email: credentials.identifier},
              {username: credentials.identifier},
            ],
          });

          if (!user) {
            throw new Error("No account found with this email/username.");
          }

          // 3️⃣ Password check
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password as string
          );

          if (!isValid) {
            throw new Error("Incorrect password. Please try again.");
          }

          // 4️⃣ Success → return user object
          return {
            id: user.id.toString(),
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id; // store user id in token
    }
    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string; // put id into session.user.id
    }
    return session;
  },
},

  pages: {},
  session: {},
  secret: process.env.NEXTAUTH_SECRET,
};
