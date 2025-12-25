TankSitter is a tiny PWA for aquarium nerds who care way too much about their fish not dying while they're on vacation.

What it does
Create tanks and add tasks (daily / weekly / once).

Generate a public sitter link with a super simple UI (incl. "granny mode" with big text).

Add photos to tasks so your sitter knows exactly what "a tiny pinch" means.

Let the sitter tick off tasks on their phone or on a printed checklist.

Works in German & English, runs great on mobile, and can be installed as a PWA.
​

Tech
Next.js (App Router, TypeScript)
​

Supabase (Postgres, Auth, Storage)
​

Tailwind + shadcn/ui for the UI.
​

next-intl for i18n, next-pwa for PWA bits.
​

Run it locally
bash
git clone https://github.com/YOUR-USER/tanksitter.git
cd tanksitter

pnpm install        # or npm / yarn

# .env.local
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

pnpm dev
Open http://localhost:3000 and start over‑engineering your tank care routine.

Status
Public beta.
Bugs, ideas, PRs – all welcome.
