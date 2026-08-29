import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

// Instancia "edge-safe" de Auth.js solo para leer la sesión en el proxy
// (antes "middleware"; Next 16 renombró la convención a proxy.ts).
const { auth } = NextAuth(authConfig);

const PUBLIC_PATHS = ["/login"];
// Prefijo público: cada invitación vive en /invite/[token] (Fase 2).
const PUBLIC_PREFIXES = ["/invite/"];

function isPublicPath(path: string) {
  return (
    PUBLIC_PATHS.includes(path) ||
    PUBLIC_PREFIXES.some((prefix) => path.startsWith(prefix))
  );
}

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session?.user;
  const path = nextUrl.pathname;

  if (!isLoggedIn) {
    if (isPublicPath(path)) return NextResponse.next();
    const loginUrl = new URL("/login", nextUrl);
    return NextResponse.redirect(loginUrl);
  }

  // Autenticado en login: mandar al dashboard. Las páginas de invitación
  // siguen accesibles con sesión (p. ej. un admin comprobando el enlace).
  if (path === "/login") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Ejecuta el proxy en todo salvo recursos estáticos y la API de auth.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
