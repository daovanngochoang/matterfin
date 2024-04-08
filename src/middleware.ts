import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import {
  CREATE_ORGANIZATION_PATH,
  DASHBOARD_PATH,
  GENERAL_CHECKOUT_PATH,
  HOME_PATH,
  SELECT_ORGANIZATION_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH
} from "@/constants/routingPath";

export default authMiddleware({
  publicRoutes: [
    SIGN_IN_PATH,
    SIGN_UP_PATH,
    `${GENERAL_CHECKOUT_PATH}/(.*)`
  ],
  afterAuth(auth, req, evt) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute && req.nextUrl.pathname != SIGN_IN_PATH) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (auth.userId && !auth.isPublicRoute) {

      if (auth.sessionClaims != null) {
        const memberships = auth.sessionClaims.memberships;

        if (Object.keys(memberships).length == 0 && req.nextUrl.pathname !== CREATE_ORGANIZATION_PATH) {
          return NextResponse.redirect(new URL(CREATE_ORGANIZATION_PATH, req.url))
        }

        // else if (
        //     auth.userId &&
        //     !auth.orgId &&
        //     req.nextUrl.pathname !== SELECT_ORGANIZATION_PATH
        //     && Object.keys(memberships).length >= 1
        // ) {
        //     console.log(" req.nextUrl.pathname !== SELECT_ORGANIZATION_PATH")
        //     const orgSelection = new URL(SELECT_ORGANIZATION_PATH, req.url);
        //     return NextResponse.redirect(orgSelection);
        // }
      }
    }

    // If the user is signed in and trying to access a protected route, allow them to access route
    if (auth.userId && !auth.isPublicRoute) {
      if (req.nextUrl.pathname == HOME_PATH) {
        return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url))
      }
    }

    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});


export const config = {
  matcher: [
    // Exclude files with a "." followed by an extension, which are typically static files.
    // Exclude files in the _next directory, which are Next.js internals.
    "/((?!.+\\.[\\w]+$|_next).*)",
    // Re-include any files in the api or trpc folders that might have an extension
    "/(api|trpc)(.*)"
  ]
};
