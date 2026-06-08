# logbook-web

The marketing site, verify page, and agent profile pages for [logbook](https://github.com/logbookbase/logbook).

Built with Next.js 15, Tailwind, TypeScript.

## Run locally

```bash
# install
npm install

# point at your local logbook api
cp .env.example .env.local
# edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:3000

# dev server
npm run dev
```

Open <http://localhost:3001> (or whatever port Next picks — the api runs on 3000).

## Pages

- `/` — landing
- `/verify` — paste an event id, see green or red
- `/verify/[eventId]` — direct deep link (auto-verifies on load, shareable)
- `/agents/[did]` — public agent profile + event timeline
- `/docs` — quickstart, sdk, pricing, bankr integration

## Deploy

```bash
vercel
```

Set `NEXT_PUBLIC_API_URL` to the deployed api url (e.g. `https://api.signedlogbook.com`) in Vercel project settings.

## Project structure

```
src/
├── app/
│   ├── layout.tsx           root layout, metadata, font preconnect
│   ├── page.tsx             landing
│   ├── globals.css          tailwind + dot-grid + animations
│   ├── not-found.tsx        404
│   ├── verify/
│   │   ├── page.tsx         /verify (empty input)
│   │   └── [eventId]/
│   │       └── page.tsx     /verify/<id> (auto-verifies)
│   ├── agents/[did]/
│   │   └── page.tsx         /agents/<did> (server-fetched)
│   └── docs/
│       └── page.tsx         /docs (anchored sections)
├── components/
│   ├── Logo.tsx             open-book-and-seal svg, dark/light variants
│   ├── Nav.tsx              sticky top nav
│   ├── Footer.tsx           4-column footer
│   └── VerifyView.tsx       client component used by /verify and /verify/[id]
└── lib/
    └── api.ts               typed fetch wrappers for the logbook api
```

## License

MIT
