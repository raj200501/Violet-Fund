# VioletFund

**Tagline:** Verified funding copilot for female founders (grants + accelerators + programs) with explainable matching, application tracking, and human-in-the-loop labeling that measurably improves results.

## Quickstart
For first-time setup (Docker, Git, PATH fixes), see **[getting-started.md](./getting-started.md)**.

#### Otherwise:
```bash
cp .env.example .env
make dev
```

Then open:
- Web app: http://localhost:3000
- API docs: http://localhost:8000/docs

### Common commands

```bash
make ingest   # re-ingest bundled dataset
make scrape   # optional scrape demo sources
make test     # api tests + web lint/build
make fmt      # format backend + web lint --fix
```

## Architecture

```mermaid
flowchart TD
  web["Web (apps/web)\nNext.js + TypeScript + Tailwind"]
  api["API (apps/api)\nFastAPI + SQLModel + Alembic"]
  db[(Postgres + pgvector)]
  embed["Local embeddings\nsentence-transformers"]
  data["Seed dataset\n(data/opportunities_seed.json)"]

  web -->|REST| api
  api --> db
  api --> embed
  data --> api

```

## Product walkthrough (3-minute demo script)

1. **Landing page**
   - Narration: "Funding should not be a barrier to women building companies. VioletFund is your verified funding copilot."
   - Click: **Start your funding plan**.

2. **Sign up + Profile wizard**
   - Enter a demo email/password and submit.
   - Fill in industry, stage, location, keywords, and goals.
   - Narration: "These fields power explainable matching and filters."

3. **Dashboard recommendations**
   - Navigate to **Dashboard**.
   - Narration: "Each result shows similarity score, explicit reasons, and evidence snippets from the source content."

4. **Opportunity detail**
   - Click into an opportunity.
   - Narration: "Details include eligibility and a deterministic application plan."
   - Click **Add to tracker**.

5. **Application tracker**
   - Open **Tracker**.
   - Drag the card across stages.
   - Narration: "Your pipeline moves across Saved → Planned → In Progress, etc."

6. **Verify & Improve**
   - Open **Verify & Improve**.
   - Correct missing fields, submit.
   - Narration: "We recompute embeddings and show the rank improvement immediately."

## How labeling improves ranking

When a user edits fields like eligibility, description, or raw text, VioletFund re-embeds the opportunity and re-ranks it for the active founder profile. The UI displays the before/after position (rank) so the user can see the measurable lift caused by their corrections.

## Screenshots

> Replace the placeholders below with real screenshots from your demo.

- Landing page: `docs/screenshots/landing.png`
- Dashboard: `docs/screenshots/dashboard.png`
- Tracker: `docs/screenshots/tracker.png`
- Labeling UI: `docs/screenshots/labeling.png`

## Dataset

`data/opportunities_seed.json` includes 250+ opportunities with real source URLs and short raw text excerpts to keep the demo fully offline-ready.

## Tech stack

- **Frontend:** Next.js + TypeScript + Tailwind
- **Backend:** FastAPI + SQLModel + Alembic
- **Database:** Postgres + pgvector
- **Embeddings:** sentence-transformers (local)

## Environment

See `.env.example` for defaults. No paid API keys are required; all embeddings run locally.
