import {NextResponse} from 'next/server';
export const revalidate=3600;
export async function GET(_req:Request,{params}:{params:Promise<{name:string}>}){
 const {name}=await params;
 if(!/^[0-9a-f-]{36}\.(jpg|png|webp|gif)$/.test(name))return new Response('Not found',{status:404});
 const owner=process.env.GITHUB_OWNER,repo=process.env.GITHUB_REPO,token=process.env.GITHUB_TOKEN;
 if(!owner||!repo||!token)return new Response('Unavailable',{status:503});
 const branch=process.env.GITHUB_BRANCH||'main';
 const result=await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/media/${name}?ref=${encodeURIComponent(branch)}`,{headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json'},next:{revalidate:3600}});
 if(!result.ok)return new Response('Image not found',{status:404});
 const item=await result.json();if(!item.content)return new Response('Image unavailable',{status:502});const bytes=Buffer.from(item.content.replace(/\s/g,''),'base64');return new NextResponse(bytes,{headers:{'Content-Type':name.endsWith('.png')?'image/png':name.endsWith('.webp')?'image/webp':name.endsWith('.gif')?'image/gif':'image/jpeg','Cache-Control':'public, max-age=3600, s-maxage=86400','X-Content-Type-Options':'nosniff'}});
}
