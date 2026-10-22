import {listFiles,readFile,writeFile} from '@/lib/github';
export type Message={id:string;name:string;email:string;subject:string;message:string;createdAt:string};
export async function getMessages(){const names=await listFiles('data/messages');const records=await Promise.all(names.filter(n=>n.endsWith('.json')).map(n=>readFile(`data/messages/${n}`)));return records.filter(Boolean).map(f=>JSON.parse(f!.text) as Message).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));}
export async function saveMessage(m:Message){await writeFile(`data/messages/${m.id}.json`,JSON.stringify(m,null,2));}
