import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";

export function signAdminToken() {
  return jwt.sign({ role: "admin" }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export function verifyAdminToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
}

export async function isAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return !!verifyAdminToken(token);
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
