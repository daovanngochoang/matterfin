import { NextResponse } from "next/server";
import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { DASHBOARD_PATH, HOME_PATH } from "@/constants/routingPath";

export default authMiddleware({
  publicRoutes: [
    HOME_PATH,
  ],
  afterAuth(auth, req, evt) {


    if (req.nextUrl.pathname == HOME_PATH) {
      console.log(new URL(DASHBOARD_PATH, req.url))
      return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url))
    }

    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    // // Redirect signed in users to organization selection page if they are not active in an organization
    // if (
    //   auth.userId &&
    //   !auth.orgId &&
    //   req.nextUrl.pathname !== "/org-selection"
    // ) {
    //   const orgSelection = new URL("/org-selection", req.url);
    //   return NextResponse.redirect(orgSelection);
    // }
    // // If the user is signed in and trying to access a protected route, allow them to access route
    // if (auth.userId && !auth.isPublicRoute) {
    //   return NextResponse.next();
    // }
    // Allow users visiting public routes to access them
    return NextResponse.next();
  },
});


// import {authMiddleware} from "@clerk/nextjs";
// import {HOME_PATH} from "@/constants/routingPath";
//
// // See https://clerk.com/docs/references/nextjs/auth-middleware
// // for more information about configuring your Middleware
// export default authMiddleware({
//     // Allow signed out users to access the specified routes:
//     publicRoutes: [HOME_PATH],
//
// });
//
//
export const config = {
    matcher: [
        // Exclude files with a "." followed by an extension, which are typically static files.
        // Exclude files in the _next directory, which are Next.js internals.
        "/((?!.+\\.[\\w]+$|_next).*)",
        // Re-include any files in the api or trpc folders that might have an extension
        "/(api|trpc)(.*)"
    ]
};
