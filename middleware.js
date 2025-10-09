import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("session");
  const role = req.cookies.get("userRole")?.value;
  const status= req.cookies.get("userStatus")?.value

  const { pathname } = req.nextUrl;
  console.log(token,role,status);

//login check
  if (!token && (pathname.startsWith("/admin") || pathname.startsWith("/teacher") || pathname.startsWith("/student"))) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  //status check

  if(token&&status!=="approved")
    return NextResponse.redirect(new URL("/?waitlist=true",req?.url));



  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL(`/${role?.toLowerCase()}`, req.url));
  }
  if (pathname.startsWith("/teacher") && role !== "teacher") {
    return NextResponse.redirect(new URL(`/${role?.toLowerCase()}`, req.url));
  }
  if (pathname.startsWith("/student") && role !== "student") {
    return NextResponse.redirect(new URL(`/${role?.toLowerCase()}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};
