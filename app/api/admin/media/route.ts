import {NextResponse} from 'next/server';
import {isAdmin,sameOrigin} from '@/lib/auth';
export const runtime='nodejs';
export async function POST(req:Request){
 if(!await isAdmin()) return NextResponse.json({error:'Unauthorized'},{status:401});
 if(!sameOrigin(req)) return NextResponse.json({error:'Invalid origin'},{status:403});
 const form=await req.formData();const file=form.get('file');
 if(!(file instanceof File))return NextResponse.json({error:'Choose an image'},{status:400});
 const types=['image/jpeg','image/png','image/webp','image/gif'];
 if(!types.includes(file.type)||file.size>4*1024*1024||file.size===0)return NextResponse.json({error:'Use a JPEG, PNG, WebP or GIF under 4 MB'},{status:400});
 const owner=process.env.GITHUB_OWNER,repo=process.env.GITHUB_REPO,token=process.env.GITHUB_TOKEN;
 if(!owner||!repo||!token)return NextResponse.json({error:'GitHub image storage is not configured'},{status:503});
 const ext:{[k:string]:string}={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'};
 const name=`media/${crypto.randomUUID()}.${ext[file.type]}`;
 const bytes=Buffer.from(await file.arrayBuffer());
 const response=await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/${name}`,{method:'PUT',headers:{Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','Content-Type':'application/json'},body:JSON.stringify({message:`Add editorial image ${name}`,branch:process.env.GITHUB_BRANCH||'main',content:bytes.toString('base64')}),cache:'no-store'});
 if(!response.ok)return NextResponse.json({error:'Image upload failed'},{status:502});
 // Serve from GitHub via a same-origin route; do not expose the token or repo to visitors.
 return NextResponse.json({url:`/api/media/${name.split('/')[1]}`});
}
