import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "partum_session";

// Korumalı rotalar için oturum çerezi varlığını kontrol eder.
// (Çerezin imza doğrulaması sunucu bileşenlerinde yapılır.)
export function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/jarvis/:path*"],
};
