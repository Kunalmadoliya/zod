import CredentialsProvider from "next-auth/providers/credentials";
import {NextAuthOptions} from "next-auth";
import dbConnect from "./dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: {label: "Email or Username", type: "text"},
        password: {label: "Password", type: "password"},
      },

      async authorize(credentials) {
        await dbConnect();
        try {
          if (!credentials?.identifier)
            throw new Error("Please enter email/username.");
          if (!credentials?.password)
            throw new Error("Please enter your password.");

          const user = await User.findOne({
            $or: [
              {email: credentials.identifier},
              {username: credentials.identifier},
            ],
          });

          if (!user) throw new Error("No account found.");

          if (!user.isVerified) throw new Error("Account not verified.");

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) throw new Error("Incorrect password.");

          return {
            id: user?.id.toString(),
            email: user.email,
            username: user.username,
          };
        } catch (err) {
          console.error(err);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token._id = user.id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
      }
      return token;
    },

    async session({session, token}) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
