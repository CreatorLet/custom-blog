# Creator Blog Starter

A premium, reusable Next.js blog with Markdown files in a **private GitHub repository**, a config-driven identity, contact inbox and authenticated publishing dashboard.

## Quick start

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and set `ADMIN_PASSWORD` and a randomly generated `SESSION_SECRET` (32+ chars).
3. Run `npm run dev` and open `http://localhost:3000`.
4. Edit `blog.config.json` to customize each client's site.
5. Sign in at `/admin/login` with your password.

**Local mode:** With the GitHub environment variables blank, articles and contact messages are saved to the local filesystem. On ephemeral cloud hosts, writes are **not persistent**; set GitHub variables for deployment.

**GitHub mode:** Create a **private** repository for each client, copy this project there, and use a fine-grained GitHub credential with Contents read/write access. Add `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_TOKEN`, and optionally `GITHUB_BRANCH` in your deployment's private environment. Keep the config public-safe and keep ALL secrets out of Git. Contact messages go to `data/messages/` (not publicly rendered). Disable public access to the repo.

**Important:** A private GitHub repo alone does not prevent someone with the host token from seeing messages; use strict minimum access. For substantial message volume, move inbox storage to a proper database. GitHub also has API rate limits, and writing many inbox messages to Git is not ideal.

## Features

- Homepage, responsive story grid, editorial article pages, categories, tag archives, related articles, sponsored disclosures
- Per-article titles/descriptions, canonical URLs, Open Graph, Twitter card, BlogPosting structured data, sitemap, robots, RSS
- Contact form saved to GitHub and viewable only in `/admin/inbox`; mailto reply links
- Authenticated admin, article create/edit/delete, draft vs published, Markdown toolbar, featured imagery, date, author, tags
- Branding fields in `blog.config.json`; sample images are linked from Unsplash

## SEO / AEO / GEO

No platform can guarantee rankings or citations in Google or AI assistants. Pages are HTML-rendered server-side and include semantic headings, canonical metadata, machine-readable structured data, feed and sitemap. Publish substantive original writing with clear authorship, verified facts, citations to sources and meaningful image descriptions. Check deployed metadata with Search Console and other webmaster tools.

## Production checklist (not yet included)

- Payment/hosting lock: **intentionally deferred** as requested.
- Add per-IP and per-account rate limiting/CAPTCHA to login and contact routes. Current honeypot is not robust abuse protection.
- Replace password-only login with multi-factor auth and password hashing/user accounts if supporting more than one admin.
- Move message storage to a database if traffic increases; add inbox delete/archive and privacy/retention policy.
- Consider media upload service instead of image URL fields, and image optimization with Next Image.
- Add scheduled publishing, version previews, Markdown live preview, stronger input validation, an audit trail, real analytics and backups before commercial launch.
- Configure a real production domain in `blog.config.json` before launch so canonical URLs, sitemap and schema are correct.
- Redeploy/restart after config changes: the current config is imported at build time.
- Set website logo/favicon/social links to real client assets.
- Ensure content written to the GitHub repo is private, and do not expose your GitHub token in `NEXT_PUBLIC_` variables.

## Repo structure

- `blog.config.json` — brand and public display configuration
- `content/posts/*.md` — Markdown with frontmatter
- `lib/github.ts` — GitHub Contents API adapter and local filesystem fallback
- `app/` — App Router pages and APIs
- `components/` — editorial UI and admin components

## Creator provisioning plan

Create one **private repository** per creator from this source, modify only `blog.config.json`, then provision a dedicated deployment with separate server-only environment secrets and a custom domain. Creators use `/admin` but never need access to GitHub. Keep the owner-controlled GitHub credentials outside the repository.

## Premium editor, image uploads and search optimisation
- The visual Tiptap editor stores Markdown in GitHub while editing directly as formatted text. It supports inline image uploads (PNG/JPEG/WebP/GIF, 4MB limit). Uploaded files are stored in `media/` and served through `/api/media/[name]`. Configure the GitHub token for production; Render's ephemeral filesystem is not used for media.
- Set `siteUrl` in `blog.config.json` or `NEXT_PUBLIC_SITE_URL` to your actual canonical HTTPS domain. Set up both root and www domains in Render; Render provides an automatic redirect to the preferred hostname.
- `socialSharing` in the config controls article sharing links. `seo.defaultTitle` and `seo.homepageIntro` customize searchable editorial content; write genuinely useful original content, not keyword stuffing.
- Public article and homepage rendering is revalidated every 120 seconds to reduce GitHub API round trips. First visits after cache expiry can still be slower. Render Free services may spin down and cause cold starts. An always-on paid instance is advisable for consistent response times.
- Before launch, change the GitHub repository visibility to private because contact messages are stored there.
