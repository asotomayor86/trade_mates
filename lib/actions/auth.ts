"use server";

import { AuthError } from "next-auth";

import { signIn, signOut } from "@/auth";

/** Login con username + contraseña. Devuelve mensaje de error o redirige. */
export async function authenticate(
  _prev: string | null,
  formData: FormData
): Promise<string | null> {
  try {
    await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirectTo: "/",
    });
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      return "Usuario o contraseña incorrectos";
    }
    // Re-lanza el redirect interno de Next.js (NEXT_REDIRECT).
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
