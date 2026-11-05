import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

declare module "next-auth" {
  interface Session {
    user: {
      discordId?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

// Discord sends `iss` on the OAuth callback; without this Auth.js compares it to its authjs.dev placeholder
const DISCORD_ISSUER = "https://discord.com";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      issuer: DISCORD_ISSUER,
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET,
      authorization: { params: { scope: "identify" } },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, profile }) {
      if (profile?.id) token.discordId = profile.id;
      return token;
    },
    session({ session, token }) {
      if (typeof token.discordId === "string") {
        session.user.discordId = token.discordId;
      }
      return session;
    },
  },
});
