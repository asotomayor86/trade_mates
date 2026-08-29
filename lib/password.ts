import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

// Token de invitación: url-safe, sin caracteres ambiguos en la práctica
// (hex puro), suficientemente largo para no ser adivinable.
export function generateInvitationToken() {
  return randomBytes(24).toString("base64url");
}
