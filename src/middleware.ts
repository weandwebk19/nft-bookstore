import axios from "axios";
import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export { default } from "next-auth/middleware";

// export function middleware(request: NextRequest) {
//   return NextResponse.redirect(new URL("/", request.url));
// }

// export async function middleware(request: NextRequest, _next: NextFetchEvent) {
//   const token = await getToken({ req: request });
//   try {
//     const user = await fetch(
//       `http://localhost:3000/api/users/wallet/${token?.sub}`,
//       {
//         method: "GET"
//       }
//     );
//     console.log("-----user: ", user);
//   } catch (e) {
//     console.error(e);
//   }
// }

export const config = {
  matcher: ["/account/bookshelf/:path*", "/books/create"]
};
