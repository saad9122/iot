import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

// export { default } from "next-auth/middleware"

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;

  // Paths that are always accessible
  const publicPaths = ['/login', '/signup'];

  // Check if the current path is public
  if (publicPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Role-based access control

  // @ts-ignore
  const userRole = token?.user?.role

  // Define role-based access rules
  const roleRules = {
    '/admin': ['admin'],
    '/dashboard': ['admin', 'user'],
    // Add more routes and allowed roles as needed
  };

  // Check if the user has permission to access the current path
  // @ts-ignore
  const path = req.nextUrl.pathname;
  // @ts-ignore
  if (roleRules[path] && !roleRules[path].includes(userRole)) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|icons|images).*)'],
};
