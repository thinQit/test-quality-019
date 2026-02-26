import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface AuthTokenPayload {
  sub: string;
  role: 'admin' | 'customer';
  jti: string;
  exp?: number;
  iat?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || '';

export function signJwt(payload: AuthTokenPayload, options?: SignOptions) {
  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d', ...options });
}

export function verifyJwt(token: string): AuthTokenPayload | null {
  if (!JWT_SECRET) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function getBearerToken(authorization: string | null) {
  if (!authorization) return null;
  const [scheme, token] = authorization.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  return token;
}

export function isApiKeyValid(apiKey: string | null): boolean {
  const expected = process.env.API_KEY;
  if (!expected || !apiKey) return false;
  return apiKey === expected;
}

export function getAuthPayload(authorization: string | null, apiKey: string | null): AuthTokenPayload | 'apiKey' | null {
  if (isApiKeyValid(apiKey)) return 'apiKey';
  const token = getBearerToken(authorization);
  if (!token) return null;
  return verifyJwt(token);
}

export function requireAdmin(authorization: string | null, apiKey: string | null): boolean {
  const payload = getAuthPayload(authorization, apiKey);
  if (!payload) return false;
  if (payload === 'apiKey') return true;
  return payload.role === 'admin';
}
