import { promises as fs } from 'node:fs';
import path from 'node:path';
const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const token = process.env.GITHUB_TOKEN;
const branch = process.env.GITHUB_BRANCH || 'main';
const useGithub = Boolean(owner && repo && token);
function validate(p: string) { if (!/^(content\/posts|data\/messages)\/[a-z0-9-]+\.(md|json)$/.test(p)) throw Error('Invalid content path'); return p; }
async function githubRequest(p: string, init?: RequestInit) {
 const u = `https://api.github.com/repos/${owner}/${repo}/contents/${p}`;
 return fetch(u, { ...init, headers: { Accept:'application/vnd.github+json', Authorization:`Bearer ${token}`, 'X-GitHub-Api-Version':'2022-11-28', ...(init?.headers||{}) }, next:{revalidate:init?.method?0:120} });
}
export async function listFiles(dir: 'content/posts'|'data/messages') {
 if (useGithub) { const res=await githubRequest(`${dir}?ref=${encodeURIComponent(branch)}`); if(res.status===404) return []; if(!res.ok) throw Error('Cannot read repository'); const items=await res.json(); return (Array.isArray(items)?items:[]).filter((v:{type:string,name:string})=>v.type==='file' && /\.(md|json)$/.test(v.name)).map((v:{name:string})=>v.name); }
 try { return (await fs.readdir(path.join(process.cwd(),dir))).filter(n=>/\.(md|json)$/.test(n)); } catch(e:any) { if(e?.code==='ENOENT') return []; throw e; }
}
export async function readFile(p:string) {
 validate(p);
 if (useGithub) { const res=await githubRequest(`${p}?ref=${encodeURIComponent(branch)}`); if(res.status===404) return null; if(!res.ok) throw Error('Cannot read GitHub file'); const val=await res.json(); return { text:Buffer.from(val.content.replace(/\s/g,''),'base64').toString('utf8'),sha:val.sha as string }; }
 try { return {text:await fs.readFile(path.join(process.cwd(),p),'utf8'),sha:''}; } catch(e:any) { if(e?.code==='ENOENT')return null; throw e; }
}
export async function writeFile(p:string,text:string) {
 validate(p);
 if (useGithub) { const existing=await readFile(p); const res=await githubRequest(p,{method:'PUT',body:JSON.stringify({message:`Update ${p}`,content:Buffer.from(text).toString('base64'),branch,...(existing?{sha:existing.sha}:{})})}); if(!res.ok) throw Error(`GitHub write failed ${res.status}`); return; }
 const target=path.join(process.cwd(),p); await fs.mkdir(path.dirname(target),{recursive:true}); await fs.writeFile(target,text);
}
export async function deleteFile(p:string){
 validate(p);
 if(useGithub){const old=await readFile(p);if(!old)return;const res=await githubRequest(p,{method:'DELETE',body:JSON.stringify({message:`Delete ${p}`,sha:old.sha,branch})});if(!res.ok)throw Error('GitHub delete failed');return;}
 await fs.unlink(path.join(process.cwd(),p));
}
