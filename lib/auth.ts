import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
const name='blog_admin';
function secret(){if(!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length<32)throw Error('SESSION_SECRET must be at least 32 characters');return new TextEncoder().encode(process.env.SESSION_SECRET);}
export async function isAdmin(){try{const v=(await cookies()).get(name)?.value;if(!v)return false;const {payload}=await jwtVerify(v,secret(),{issuer:'creator-blog',audience:'admin'});return payload.role==='admin';}catch{return false;}}
export async function createSession(){const jwt=await new SignJWT({role:'admin'}).setProtectedHeader({alg:'HS256'}).setIssuer('creator-blog').setAudience('admin').setIssuedAt().setExpirationTime('7d').sign(secret());(await cookies()).set(name,jwt,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:60*60*24*7});}
export async function endSession(){(await cookies()).delete(name);}
export function sameOrigin(request:Request){const origin=request.headers.get('origin');if(!origin)return false;return new URL(origin).host===request.headers.get('host');}
