import { NextResponse } from "next/server";

// Define protected routes
const protectedRoutes = ["/dashboard", "/budgets", "/income"];

export function middleware(request) {
    // Retrieve user authentication status from cookies
    const isAuthenticated = request.cookies.get("isAuthenticated") === "true";

    // Check if the requested route is protected
    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        // Redirect to login if the user is not authenticated
        if (!isAuthenticated) {
            const loginUrl = new URL("/signin", request.url); // Replace `/signin` with your login page route
            return NextResponse.redirect(loginUrl);
        }
    }

    // Allow requests to proceed if they pass the checks
    return NextResponse.next();
}

// Configure the middleware to run on specific routes
export const config = {
    matcher: ["/dashboard/:path*", "/budgets/:path*", "/income/:path*"], // Adjust paths as needed
};
