# AGENT_CONTEXT.md — Hush Waitlist

## Repo
`shegens/hush-waitlist` (public)
Pages: https://shegens.github.io/hush-waitlist/

## What
Standalone waitlist signup for Hush. Para wallet auth → auto-registers address → optional name/notes form boosts waitlist ranking.

## Stack
- Next.js 14 (static export via `output: "export"`)
- Para SDK `@getpara/react-sdk@3.1.0` (BETA env)
- Supabase (Postgres via REST) — private waitlist table
- GitHub Actions deploy → GitHub Pages

## Auth
Para BETA. API key in repo secret `PARA_API_KEY`.
Para env: `BETA`. Modal: email + Google/Apple OAuth, no phone.

## Database
Supabase project: `hxzqdiaukdwsmgnojaef.supabase.co`
Anon key in repo secret `SUPABASE_ANON_KEY`.

### Schema
```sql
waitlist (
  address     text primary key,
  name        text,
  notes       text,
  score       int default 1,   -- 1 base + 1 name + 1 notes
  status      text default 'pending',  -- pending | approved
  created_at  timestamptz,
  updated_at  timestamptz
)
```
Admin view: `waitlist_ranked` — ordered by status desc, score desc, created_at asc.
RLS: insert + update allowed (anon), no public reads. Service key for admin.

## Flow
1. User connects wallet via Para → address auto-inserted as `pending` (score 1)
2. Offered optional form: name + notes (up to 999 chars)
3. Filling name → score 2, filling both → score 3
4. Confirmation shown. No read-back of waitlist position (private).

## Design
Same palette as main Hush site. See `shegens/hush` AGENT_CONTEXT.md for full design tokens.

## Known Issues / Build Notes
- Para SDK has many optional peer deps (ethers, Farcaster, AA providers) — all stubbed to `false` in `next.config.js` webpack aliases
- `openModal()` must be called as `() => openModal()`, not passed directly as `onClick`
- `useAccount()` returns `embedded.wallets[0].address`, not a top-level `address`

## TODO
- [ ] Custom domain (hush.wtf or similar)
- [ ] Admin dashboard to approve addresses
- [ ] Email notification when approved
