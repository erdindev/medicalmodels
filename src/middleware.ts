export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/saved/:path*", "/comparisons/:path*", "/settings/:path*"],
};
