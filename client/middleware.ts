// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ['/', '/api/webhooks/clerk', '/api/webhooks/stripe'],
});

export const config = {
  matcher: [
    /*
      Ensure middleware applies to:
      - All routes except static files (like .js, .css, .png)
      - Everything under `/api` and `/trpc`
    */
    "/((?!.*\\.[\\w]+$|_next).*)", 
    "/", 
    "/(api|trpc)(.*)"
  ],
};
