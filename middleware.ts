import {NextResponse,type NextRequest} from 'next/server';
// Set basic security headers on every route. Paid-hosting middleware will be added in a later phase.
export function middleware(req:NextRequest){const r=NextResponse.next();r.headers.set('X-Content-Type-Options','nosniff');r.headers.set('Referrer-Policy','strict-origin-when-cross-origin');r.headers.set('X-Frame-Options','DENY');r.headers.set('Permissions-Policy','camera=(), microphone=(), geolocation=()');if(req.nextUrl.pathname.startsWith('/admin')||req.nextUrl.pathname.startsWith('/api/'))r.headers.set('Cache-Control','private, no-store');return r;}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico).*)']};
