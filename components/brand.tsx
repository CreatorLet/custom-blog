import Link from 'next/link';import {blog} from '@/lib/config';
export function Brand(){return <Link href="/" className="brand" aria-label={`${blog.name} homepage`}>{blog.logoImage?<img src={blog.logoImage} alt={blog.name} className="brand-img"/>:blog.logoText}</Link>}
