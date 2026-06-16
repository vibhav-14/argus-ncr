# ARGUS-NCR

Intelligence analysis platform for Delhi NCR — think Palantir Gotham, but built in a weekend on Next.js.

![logo](https://github.com/vibhav-14/argus-ncr/blob/master/public/ouroboros.webp)

> ⚠️ **This is a demonstration/simulation.** All data is synthetic. No real intelligence or PII is included. The scenario is fictional.

## What it does

5 analysis modules stacked on top of each other:

| Phase | Name | What you get |
|-------|------|-------------|
| P1 | Core Platform | Dashboard, dark-theme map of Delhi NCR (Leaflet), SVG force-directed entity graph, event timeline, alerts, data explorer |
| P2 | Data Connectors | Real RSS news (TOI, The Hindu, Indian Express, NDTV, HT), beat analytics across 14 police districts, ANPR vehicle tracking |
| P3 | AI Engine | Pattern-based entity extraction, co-occurrence relationship discovery, dynamic risk scoring, statistical anomaly detection |
| P4 | Operations | Case management, live GPS tracking, 6-agency fusion center, evidence chain-of-custody |
| P5 | Predictive | Crime hotspot forecasting, network disruption simulation ("what if we arrest X?"), 24/48/72hr threat forecasts |

The dataset is a fictional organized crime network: smuggling pipeline from IGI Airport, hawala trail through Chandni Chowk, corruption ring in municipal land deals, encrypted WhatsApp group coordinating operations. 28 entities, 30 relationship links, 8 live alerts.

## Setup

```bash
# Clone it
git clone https://github.com/vibhav-14/argus-ncr.git
cd argus-ncr

# Install deps
npm install

# Start dev server — this is the reliable way on Windows
npx next dev -p 3333

# Optional: run the data pipelines
node scripts/generate-feed.js        # daily intel signals
node scripts/phase2-connectors.js   # scrape news + beat reports
node scripts/phase3-engine.js       # AI analysis engine
```

Open `http://localhost:3333`. The sidebar has all 9 views — click through them.

> **Windows note:** `next start` kept dying on my machine. I wrote a `server.js` fallback but honestly `next dev` is more stable. If someone knows why Next 16 `next start` exits silently on Windows, PRs welcome.

## Generating the PDF

```bash
node scripts/generate-pdf.js
```

Drops a 12-page document at `public/ARGUS-NCR-Complete-Documentation.pdf` covering every feature.

## Architecture

```text
src/
├── app/              # Next.js App Router (page.tsx, layout.tsx, globals.css)
├── components/       # 12 React components, one per view
│   ├── dashboard     # Live stats + feed polling
│   ├── geospatial    # Leaflet dark map, entity markers, heat zones
│   ├── graphview     # Custom SVG force layout, 40-node physics
│   ├── timeline      # Chronological event rail
│   ├── alertsview    # Severity-sorted alert cards
│   ├── dataview      # Full entity table with search/filter/sort
│   ├── phase2-view   # News, beat analytics, ANPR
│   ├── phase3-view   # Entity extraction, relationships, risk, anomalies
│   ├── phase45-view  # Case mgmt, tracking, agencies, evidence, hotspots, disruption, forecast
│   ├── sidebar       # Ouroboros logo, nav rail
│   └── ouroboros-logo # SVG snake eating itself
├── lib/
│   ├── data.ts       # Base entity network (28 entities, 30 links, 8 alerts)
│   └── daily-feed.ts # Auto-generated daily intel signals
scripts/
├── generate-feed.js      # Daily intel feed generator (10-15 signals)
├── phase2-connectors.js  # RSS scraper + beat analytics + ANPR tracker
├── phase3-engine.js      # NER + relationships + risk scoring + anomaly detection
└── generate-pdf.js       # 12-page documentation PDF
public/
├── ouroboros.svg                         # Logo / favicon
├── daily-feed.json                       # Runtime feed (auto-generated)
├── phase2-feed.json                      # Live scraped data
├── phase3-feed.json                      # AI analysis output
└── ARGUS-NCR-Complete-Documentation.pdf  # Full PDF doc
```

## Tech stack

Next.js 16 (Turbopack) • TypeScript • Tailwind CSS • Leaflet • Recharts • Lucide Icons • jsPDF • Node.js cron scripts

No external APIs. No databases. The entire thing runs off JSON files in `public/`. The data pipelines are vanilla Node.js scripts — no ML libraries, just regex pattern matching and statistical baselines.

## Why this exists

I wanted to understand how intelligence platforms work under the hood. Data fusion, entity resolution, link analysis, geospatial visualization, predictive modeling — these are real problems that Palantir charges millions for. This is a weekend prototype that demonstrates the core concepts.

Built over a weekend with Next.js, Leaflet, and a lot of coffee.

## License

MIT — do whatever you want with it.
