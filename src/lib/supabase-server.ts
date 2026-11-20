import { createHmac, timingSafeEqual } from "node:crypto";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

let serviceClient: SupabaseClient | null = null;
let publicServerClient: SupabaseClient | null = null;
const defaultAdminRoles = ["owner", "catalogue_manager", "inventory_manager", "fulfilment", "support", "finance", "marketing"];
const adminCookieName = "farming_admin_session";
const adminSessionLifetimeSeconds = 8 * 60 * 60;

export type AdminIdentity = { id: string; email: string };

function getAdminConfig() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!email || !password || !sessionSecret || Buffer.byteLength(sessionSecret) < 32) {
    throw new ApiError("Admin authentication is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD, and a 32-byte ADMIN_SESSION_SECRET.", 503);
  }
  return { email, password, sessionSecret };
}

function constantTimeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function signAdminPayload(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyAdminCredentials(email: string, password: string): AdminIdentity | null {
  const config = getAdminConfig();
  const emailMatches = constantTimeEqual(email.trim().toLowerCase(), config.email.toLowerCase());
  const passwordMatches = constantTimeEqual(password, config.password);
  return emailMatches && passwordMatches ? { id: "env-admin", email: config.email } : null;
}

export function createAdminSessionCookie() {
  const { email, sessionSecret } = getAdminConfig();
  const expiresAt = Math.floor(Date.now() / 1000) + adminSessionLifetimeSeconds;
  const payload = Buffer.from(JSON.stringify({ email, expiresAt }), "utf8").toString("base64url");
  const signature = signAdminPayload(payload, sessionSecret);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${adminCookieName}=${payload}.${signature}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${adminSessionLifetimeSeconds}${secure}`;
}

export function clearAdminSessionCookie() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${adminCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`;
}

export function getAdminSession(request: Request): AdminIdentity | null {
  const { email, sessionSecret } = getAdminConfig();
  const cookie = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${adminCookieName}=`))
    ?.slice(adminCookieName.length + 1);
  if (!cookie) return null;

  const [payload, signature, extra] = cookie.split(".");
  if (!payload || !signature || extra !== undefined || !/^[a-f0-9]{64}$/i.test(signature)) return null;
  const expectedSignature = Buffer.from(signAdminPayload(payload, sessionSecret), "hex");
  const receivedSignature = Buffer.from(signature, "hex");
  if (!timingSafeEqual(expectedSignature, receivedSignature)) return null;

  try {
    const parsed: unknown = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (typeof parsed !== "object" || parsed === null || !("email" in parsed) || !("expiresAt" in parsed)) return null;
    if (parsed.email !== email || typeof parsed.expiresAt !== "number" || parsed.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return { id: "env-admin", email };
  } catch {
    return null;
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  try {
    if (!origin || new URL(origin).origin !== new URL(request.url).origin) {
      throw new ApiError("Cross-origin admin requests are not allowed.", 403);
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Invalid request origin.", 403);
  }
}

export function getSupabasePublicServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new ApiError("Supabase public credentials are not configured.", 503);
  }
  publicServerClient ??= createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return publicServerClient;
}

export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new ApiError("NEXT_PUBLIC_SUPABASE_URL is not configured.", 503);
  if (!serviceKey) {
    throw new ApiError("SUPABASE_SERVICE_ROLE_KEY is missing from the server environment.", 503);
  }
  serviceClient ??= createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return serviceClient;
}

async function authenticateRequest(request: Request): Promise<{ user: User; client: SupabaseClient }> {
  const authorization = request.headers.get("authorization");
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new ApiError("Sign in is required.", 401);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new ApiError("Supabase authentication is not configured.", 503);

  const authClient = createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const { data, error } = await authClient.auth.getUser(token);
  if (error || !data.user) throw new ApiError("Your session is invalid or expired.", 401);

  return { user: data.user, client: authClient };
}

export async function requireUser(request: Request): Promise<{ user: User; service: SupabaseClient }> {
  const { user } = await authenticateRequest(request);
  return { user, service: getSupabaseServiceClient() };
}

export async function requireAdminSession(
  request: Request,
  allowedRoles: string[] = defaultAdminRoles,
) {
  const user = getAdminSession(request);
  if (!user) throw new ApiError("Admin sign-in is required.", 401);
  if (!allowedRoles.includes("owner")) throw new ApiError("Admin access is not authorized.", 403);
  return user;
}

export async function requireAdmin(
  request: Request,
  allowedRoles: string[] = defaultAdminRoles,
) {
  const user = await requireAdminSession(request, allowedRoles);
  if (request.method !== "GET" && request.method !== "HEAD") assertSameOrigin(request);
  return { user, service: getSupabaseServiceClient() };
}

export function apiErrorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json({ error: error.message }, { status: error.status });
  }
  console.error("Supabase API request failed.", error);
  return Response.json({ error: "The server could not complete this request." }, { status: 500 });
}
