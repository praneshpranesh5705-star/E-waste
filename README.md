# EcoCycle — E-Waste Recycling

A modern e-waste recycling platform built with **Next.js, React and JavaScript**.

## Features

- Premium responsive recycling website
- Mobile navigation and animated hero
- E-waste categories and recycling workflow
- AI image scanner for electronic items
- Server-side Gemini vision API
- Pickup request API
- Supabase-ready pickup database
- Password-protected admin dashboard
- Vercel-ready environment configuration

## Local setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## AI setup

Copy `.env.example` to `.env.local` and add a Gemini API key:

```
GEMINI_API_KEY=...
```

The browser never receives this key; the AI request goes through `/api/ai/scan`.

## Database + Admin setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Add these server-only environment variables in Vercel:

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_PASSWORD=...
```

4. Open `/admin` to view pickup requests.

The service-role key must never be exposed in client-side code.

## Vercel

Set the environment variables in the Vercel project, then redeploy.

## Compliance

Replace placeholder compliance text with actual business registrations/authorizations. Do not claim CPCB authorization unless it is actually held.
