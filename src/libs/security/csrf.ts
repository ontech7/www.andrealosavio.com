import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomUUID();
const TOKEN_EXPIRY_MS = 30 * 60 * 1000;

function sign(timestamp: string, nonce: string): string {
  return createHmac("sha256", CSRF_SECRET)
    .update(`${timestamp}.${nonce}`)
    .digest("hex");
}

export function generateCsrfToken(): string {
  const timestamp = Date.now().toString();
  const nonce = randomBytes(16).toString("hex");
  const signature = sign(timestamp, nonce);
  return `${timestamp}.${nonce}.${signature}`;
}

export function validateCsrfToken(token: string): boolean {
  const parts = token.split(".");

  if (parts.length !== 3) return false;

  const [timestamp, nonce, signature] = parts;

  const tokenAge = Date.now() - Number(timestamp);

  if (isNaN(tokenAge) || tokenAge > TOKEN_EXPIRY_MS || tokenAge < 0) {
    return false;
  }

  const expectedSignature = sign(timestamp, nonce);
  if (signature.length !== expectedSignature.length) return false;

  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expectedSignature, "hex");
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
