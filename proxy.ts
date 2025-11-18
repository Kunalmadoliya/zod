import withAuth from "next-auth/middleware";
import {NextResponse} from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({req, token}) => {
        const {pathname} = req.nextUrl;

        if (
          token &&
          (pathname.startsWith("/login") || pathname.startsWith("/register"))
        ) {
          return false;
        }

        if (!token && pathname.startsWith("/dashboard")) {
          return false;
        }

        // ✅ Allow everything else
        return true;
      },
    },
  }
);
