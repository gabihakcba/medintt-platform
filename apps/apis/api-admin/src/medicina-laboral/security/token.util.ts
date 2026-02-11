import { createHmac, timingSafeEqual, randomBytes, createHash } from 'crypto';

export class TokenExpiredError extends Error {
  constructor(message = 'Token expired') {
    super(message);
    this.name = 'TokenExpiredError';
  }
}

/**
 * Creates a URL-safe signed token using HMAC-SHA256.
 * Format: payloadBase64Url.signatureBase64Url
 */
export function createSignedToken(payload: object, secret: string): string {
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadStr).toString('base64url');

  const hmac = createHmac('sha256', secret);
  hmac.update(payloadB64);
  const signature = hmac.digest('base64url');

  return `${payloadB64}.${signature}`;
}

/**
 * Verifies a signed token. Returns the payload if valid, null otherwise.
 * Checks signature and strictly enforces 'exp' claim if present.
 */
export function verifySignedToken<T = any>(
  token: string,
  secret: string,
  options?: { throwOnExpired?: boolean },
): T | null {
  if (!token || typeof token !== 'string') return null;

  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [payloadB64, signature] = parts;

  // 1. Re-compute signature
  const hmac = createHmac('sha256', secret);
  hmac.update(payloadB64);
  const expectedSignature = hmac.digest('base64url');

  // 2. Constant-time comparison
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(sigBuf, expectedBuf)) return null;

  // 3. Decode payload
  try {
    const payloadStr = Buffer.from(payloadB64, 'base64url').toString('utf-8');
    const payload = JSON.parse(payloadStr);

    // 4. Check expiration if present
    if (payload.exp && typeof payload.exp === 'number') {
      const now = Math.floor(Date.now() / 1000);
      if (now > payload.exp) {
        if (options?.throwOnExpired) {
          throw new TokenExpiredError();
        }
        return null; // Expired
      }
    }

    return payload as T;
  } catch {
    return null;
  }
}

/**
 * Returns current timestamp in seconds (Unix time).
 */
export function nowUnix(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Generates a random nonce (base64url).
 */
export function nonceB64url(bytes = 16): string {
  return randomBytes(bytes).toString('base64url');
}

/**
 * Computes SHA256 hash of a string, returns base64url.
 * Used for storing hashed DNI in proof.
 */
export function hashString(input: string): string {
  return createHash('sha256').update(input).digest('base64url');
}
