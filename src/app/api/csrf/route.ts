import { generateCsrfToken } from "@/libs/security/csrf";
import { NextResponse } from "next/server";

export async function GET() {
  const token = generateCsrfToken();

  return NextResponse.json(
    { token },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    }
  );
}
