# Skill: Netlify Deploy + SEO + Media Readiness (Kitchen Forge Pattern)

Use this skill when the user wants one-shot deployment readiness for a Vite/React site on Netlify, including SEO, media assets, canonical tags, and production-safe form handling.

## Mandatory Question Intake (Ask First)
Ask these questions before changing files. Do not skip.

1. What is the final production domain (for canonical, OG URL, sitemap, robots)?
2. Who is the SEO author value?
3. What service areas/cities should be listed publicly?
4. Should all direct contact info (email/phone/address) be removed from visible content?
5. What is the only allowed contact channel (Netlify form, etc.)?
6. Should social links be real URLs, hidden, or placeholders?
7. Do we need GDPR/CCPA language updates in legal pages?
8. Are any secrets/API keys required for submissions or integrations?
9. If secrets are needed, which integration should run via Netlify Functions?
10. Confirm final go-live checklist owner (agent vs user) for DNS/Search Console submission.

## Execution Order (Strict)
Follow in this order so the job lands in one pass.

1. Content policy pass:
   - Remove/replace forbidden contact details from all pages (including footer/legal pages if requested).
   - Update service-area language with exact city list from user.

2. Head/meta pass:
   - Ensure homepage `index.html` has:
     - `description`
     - `author`
     - canonical
     - OG/Twitter title/description/image/url
     - favicon and apple-touch icon
   - Ensure each route/page has:
     - page title
     - description
     - author
     - canonical

3. Media assets pass:
   - Ensure `public/og-image.png` exists and is referenced.
   - Ensure favicon exists (`public/favicon.svg` or user-supplied asset) and is referenced.

4. Netlify contact form pass:
   - Add hidden static form in `index.html` so Netlify detects it.
   - Ensure React form has:
     - `name="<form-name>"`
     - `data-netlify="true"`
     - `netlify-honeypot="bot-field"`
     - hidden `form-name` and honeypot input
   - Submit as `application/x-www-form-urlencoded` to `/`.
   - Add graceful success UI state and meaningful failure state.

5. Netlify platform config pass:
   - Add/update `netlify.toml`:
     - build command
     - publish dir
     - functions dir
     - SPA redirect rule
   - Add `public/_redirects` fallback: `/* /index.html 200` (safe redundancy).

6. Crawl/indexing pass:
   - Add/update `public/robots.txt`.
   - Add/update `public/sitemap.xml` with all canonical URLs.

7. Sensitive env/security pass:
   - Search for `import.meta.env` and `process.env`.
   - If secrets are needed in browser code, move secret operations to `netlify/functions/*`.
   - Keep only safe public values in frontend env vars.

8. Build verification pass:
   - Run a production build.
   - If monorepo output path fails in local sandbox, run an alternate local output build to verify compile.

9. Final audit output:
   - Report changed files.
   - Report any unresolved risk.
   - Provide exact post-deploy steps:
     - verify form appears in Netlify Forms
     - verify sitemap URL
     - submit sitemap in Google Search Console + Bing Webmaster Tools

## File Targets (Expected in this repo)
- `index.html`
- `src/pages/*.jsx`
- `src/components/ContactForm.jsx`
- `src/components/Footer.jsx`
- `public/favicon.svg`
- `public/og-image.png`
- `public/_redirects`
- `public/robots.txt`
- `public/sitemap.xml`
- `netlify.toml`
- optional: `netlify/functions/*.mjs`

## Acceptance Criteria
- No forbidden contact data appears publicly if user requested removal.
- Canonical/author/description exist and match production domain.
- OG/Twitter image and metadata resolve to production URLs.
- Netlify form is detectable and submission UX is graceful.
- SPA routes resolve on hard refresh.
- Sitemap and robots are deployed and valid.
- Build succeeds for deployment target.


