import {NextResponse} from "next/server";
import {authMiddleware, redirectToSignIn} from "@clerk/nextjs";
import {
    CREATE_ORGANIZATION_PATH,
    DASHBOARD_PATH,
    HOME_PATH,
    SELECT_ORGANIZATION_PATH,
    SIGN_IN_PATH, SIGN_UP_PATH
} from "@/constants/routingPath";

export default authMiddleware({
    publicRoutes: [
        SIGN_IN_PATH,
        SIGN_UP_PATH
    ],
    afterAuth(auth, req, evt) {
        // Handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({returnBackUrl: req.url});
        }

        // Redirect signed in users to organization selection page if they are not active in an organization
        else if (auth.sessionClaims != null && req.nextUrl.pathname != CREATE_ORGANIZATION_PATH) {
            console.log("auth.sessionClaims != null && req.nextUrl.pathname != CREATE_ORGANIZATION_PATH")
            const memberships = auth.sessionClaims.memberships;
            if (Object.keys(memberships).length == 0) {
                console.log("Object.keys(memberships).length == 0")
                return NextResponse.redirect(new URL(CREATE_ORGANIZATION_PATH, req.url))
            } else {
                if (
                    auth.userId &&
                    !auth.orgId &&
                    req.nextUrl.pathname !== SELECT_ORGANIZATION_PATH
                ) {
                     console.log(" auth.userId &&\n" +
                         "                    !auth.orgId &&\n" +
                         "                    req.nextUrl.pathname !== SELECT_ORGANIZATION_PATH")
                    const orgSelection = new URL(SELECT_ORGANIZATION_PATH, req.url);
                    return NextResponse.redirect(orgSelection);
                }
                // If the user is signed in and trying to access a protected route, allow them to access route
                else if (auth.userId && !auth.isPublicRoute) {
                    if (req.nextUrl.pathname == HOME_PATH) {
                        return NextResponse.redirect(new URL(DASHBOARD_PATH, req.url))
                    }
                }

            }
        }



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
