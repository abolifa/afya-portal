// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/auth/login", "/auth/register"];

// Anything under public/ or Next internals we should never guard
const ASSET_ALLOWLIST: RegExp[] = [
  /^\/_next\//, // Next internals: static, image, etc.
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
  /^\/logo\.(png|jpg|jpeg|svg|webp)$/i,
  /^\/images\//, // if you keep other assets under public/images
  /^\/icons\//, // if you keep icons under public/icons
  /^\/static\//, // if you use /public/static
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("patient_token")?.value;

  // Let assets through
  if (ASSET_ALLOWLIST.some((re) => re.test(pathname))) {
    return NextResponse.next();
  }

  // Let explicit public routes through
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Protect the rest
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Exclude assets and auth from the matcher so middleware doesn't even run there
export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|logo\\.(?:png|jpg|jpeg|svg|webp)|images|icons|static|auth).*)",
  ],
};
