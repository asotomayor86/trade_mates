import type { NextAuthConfig } from "next-auth";

// Configuración compartida y "edge-safe": NO importa Prisma ni bcrypt, por lo
// que puede ejecutarse también en el proxy (runtime edge). El proveedor
// Credentials (que sí usa Prisma/bcrypt) se añade en auth.ts.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id as string;
        token.username = user.username;
        token.displayName = user.displayName;
        token.role = user.role;
      }
      // Disparado por unstable_update() (ver lib/actions/profile.ts): el
      // dato ya se validó y guardó en la base de datos antes de llamarlo,
      // aquí solo se refleja en el propio token — si no, el nombre nuevo no
      // se vería en la cabecera hasta el próximo login (la sesión es JWT,
      // horneada en el login).
      if (trigger === "update" && session?.user?.displayName) {
        token.displayName = session.user.displayName;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.displayName = token.displayName;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
