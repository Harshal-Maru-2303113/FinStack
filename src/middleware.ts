import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const name = "next-auth.session-token";//"__Secure-next-auth.session-token";
  const token = request.cookies.get(name);
  const { pathname } = request.nextUrl;

  console.log("Token:", token); // Log the token
  console.log("Pathname:", pathname); // Log the requested path

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
      console.log("Redirecting logged-in user away from auth page.");
      return NextResponse.redirect(new URL("/", request.url));
    }
    console.log("Allowing access to protected page.");
    return NextResponse.next();
  }

  if (!token) {
    if (isAuthPage) {
      console.log("Allowing access to auth page.");
      return NextResponse.next();
    }
    if (isProtectedPage) {
      console.log("Redirecting unauthenticated user to login.");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  console.log("Allowing access to public page.");
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
