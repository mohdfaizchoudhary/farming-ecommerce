import {
  apiErrorResponse,
  ApiError,
  assertSameOrigin,
  clearAdminSessionCookie,
  createAdminSessionCookie,
  getAdminSession,
  verifyAdminCredentials,
} from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = getAdminSession(request);
    if (!user) throw new ApiError("Admin sign-in is required.", 401);
    return Response.json({ authorized: true, email: user.email }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new ApiError("Invalid sign-in request.", 400);
    }

    if (
      typeof body !== "object"
      || body === null
      || !("email" in body)
      || !("password" in body)
      || typeof body.email !== "string"
      || typeof body.password !== "string"
      || !body.email.trim()
      || !body.password
    ) {
      throw new ApiError("Enter a valid email and password.", 400);
    }

    const user = verifyAdminCredentials(body.email, body.password);
    if (!user) throw new ApiError("Incorrect admin email or password.", 401);

    return Response.json(
      { authorized: true, email: user.email },
      {
        headers: {
          "Cache-Control": "no-store",
          "Set-Cookie": createAdminSessionCookie(),
        },
      },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    assertSameOrigin(request);
    return Response.json(
      { signedOut: true },
      {
        headers: {
          "Cache-Control": "no-store",
          "Set-Cookie": clearAdminSessionCookie(),
        },
      },
    );
  } catch (error) {
    return apiErrorResponse(error);
  }
}
  