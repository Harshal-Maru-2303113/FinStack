import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const name = "__Secure-next-auth.session-token";
  const token = request.cookies.get(name);
  const { pathname } = request.nextUrl;
  const authPages = ["/login", "/signup", "/verification"];
  const protectedPages = [
    "/profile",
    "/dashboard",
    "/budget",
    "/transactions",
    "/settings",
    "/investments",
    "/addtransactions",
    "/analytics",
  ];
  const isAuthPage = authPages.includes(pathname);
  const isProtectedPage = protectedPages.includes(pathname);

  if (token) {
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
