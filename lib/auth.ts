import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SALT_ROUNDS = 12;
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export type AuthMetadata = {
  ip: string;
  userAgent: string;
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  storedPassword: string,
): Promise<boolean> {
  if (!storedPassword) {
    return false;
  }

  if (storedPassword.startsWith("$2")) {
    return bcrypt.compare(password, storedPassword);
  }

  return false;
}

export function getRequestMetadata(
  input: Headers | Record<string, unknown> | undefined,
): AuthMetadata {
  const headers =
    input instanceof Headers
      ? input
      : new Headers(input as HeadersInit | undefined);

  const forwardedFor = headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";
  const userAgent = headers.get("user-agent") ?? "unknown";

  return { ip, userAgent };
}

export async function cleanupExpiredSessions(userId?: number): Promise<void> {
  const now = new Date();

  await prisma.session.deleteMany({
    where: {
      expiresAt: { lt: now },
      ...(userId !== undefined ? { userId } : {}),
    },
  });
}

export async function createTrackedSession(
  userId: number,
  metadata: AuthMetadata,
): Promise<{ token: string; expiresAt: Date }> {
  await cleanupExpiredSessions(userId);

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
      lastSeenAt: new Date(),
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    },
  });

  return { token, expiresAt };
}

export async function recordLoginHistory(
  userId: number,
  metadata: AuthMetadata,
): Promise<void> {
  await prisma.loginHistory.create({
    data: {
      userId,
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    },
  });
}

export async function invalidateSessionByToken(token: string): Promise<void> {
  await prisma.session.deleteMany({ where: { token } });
}
