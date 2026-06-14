import { NextResponse } from "next/server";

const VERIFICATION_CONTENT =
  "google-site-verification: google419d4e9f97389708.html";

export function GET() {
  return new NextResponse(VERIFICATION_CONTENT, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
