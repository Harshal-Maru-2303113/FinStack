import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Define the cookie name for the authentication token
  const name = "__Secure-next-auth.session-token";
  // Retrieve the authentication token from cookies
  const token = request.cookies.get(name);
  // Get the current request URL path
  const { pathname } = request.nextUrl;

  // Define the paths for authentication pages that do not require a token
  const authPages = ["/login", "/signup", "/verification"];
  // Define the paths for protected pages that require the user to be authenticated
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

  // Check if the current path is one of the authentication pages
  const isAuthPage = authPages.includes(pathname);
  // Check if the current path is one of the protected pages
  const isProtectedPage = protectedPages.includes(pathname);

  // If the user is authenticated (token exists)
  if (token) {
    // If the user is on an authentication page, redirect them to the home page
    if (isAuthPage) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Otherwise, proceed with the request (user is authenticated)
    return NextResponse.next();
  }

  // If the user is not authenticated (no token)
  if (!token) {
    // If the user is on an authentication page, allow access
    if (isAuthPage) {
      return NextResponse.next();
    }
    // If the user tries to access a protected page, redirect to the login page
    if (isProtectedPage) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Proceed with the request if none of the conditions matched
  return NextResponse.next();
}

// Configuration to apply the middleware to all paths except API routes and static files
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
