/**
 * ARGUS-NCR Complete Documentation PDF Generator
 * Covers all 5 phases, every feature, every module.
 */

const { jsPDF } = require('jspdf');
const fs = require('fs');
const path = require('path');

const DOC = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
let y = 20;
const MARGIN = 20;
const WIDTH = 170; // A4 width minus margins (210 - 40)
const LINE_H = 5;
const PAGE_H = 277;

function newPage() { DOC.addPage(); y = 20; }
function checkSpace(needed) { if (y + needed > PAGE_H) { newPage(); } }

function header(text) {
  checkSpace(20);
  DOC.setFont('helvetica', 'bold');
  DOC.setFontSize(18);
  DOC.setTextColor(6, 182, 212);
  DOC.text(text, MARGIN, y);
  y += 10;
  // Underline
  DOC.setDrawColor(6, 182, 212);
  DOC.setLineWidth(0.5);
  DOC.line(MARGIN, y - 4, MARGIN + 50, y - 4);
  y += 4;
}

function subHeader(text) {
  checkSpace(15);
  DOC.setFont('helvetica', 'bold');
  DOC.setFontSize(13);
  DOC.setTextColor(59, 130, 246);
  DOC.text(text, MARGIN, y);
  y += 8;
}

function subSub(text) {
  checkSpace(12);
  DOC.setFont('helvetica', 'bold');
  DOC.setFontSize(11);
  DOC.setTextColor(168, 85, 247);
  DOC.text(text, MARGIN, y);
  y += 7;
}

function text(text, indent = 0) {
  checkSpace(8);
  DOC.setFont('helvetica', 'normal');
  DOC.setFontSize(9);
  DOC.setTextColor(226, 232, 240);
  const lines = DOC.splitTextToSize(text, WIDTH - indent);
  lines.forEach(line => {
    if (y + 5 > PAGE_H) newPage();
    DOC.text(line, MARGIN + indent, y);
    y += 5;
  });
}

function bullet(text, indent = 5) {
  checkSpace(7);
  DOC.setFont('helvetica', 'normal');
  DOC.setFontSize(9);
  DOC.setTextColor(148, 163, 184);
  const lines = DOC.splitTextToSize(`•  ${text}`, WIDTH - indent - 5);
  lines.forEach(line => {
    if (y + 5 > PAGE_H) newPage();
    DOC.text(line, MARGIN + indent, y);
    y += 5;
  });
}

function smallText(text) {
  checkSpace(6);
  DOC.setFont('helvetica', 'normal');
  DOC.setFontSize(7.5);
  DOC.setTextColor(100, 116, 139);
  DOC.text(text, MARGIN, y);
  y += 4;
}

function divider() {
  y += 2;
  DOC.setDrawColor(42, 53, 85);
  DOC.setLineWidth(0.3);
  DOC.line(MARGIN, y, MARGIN + WIDTH, y);
  y += 6;
}

// ─── COVER PAGE ─────────────────────────────────────────────────────
DOC.setFont('helvetica', 'bold');
DOC.setFontSize(32);
DOC.setTextColor(6, 182, 212);
DOC.text('ARGUS-NCR', MARGIN, 60);
DOC.setFontSize(14);
DOC.setTextColor(148, 163, 184);
DOC.text('Delhi NCR Intelligence Platform', MARGIN, 72);
DOC.setDrawColor(6, 182, 212);
DOC.setLineWidth(1);
DOC.line(MARGIN, 78, MARGIN + 60, 78);

DOC.setFontSize(10);
DOC.setTextColor(148, 163, 184);
DOC.text('Complete Technical Documentation', MARGIN, 90);
DOC.text('All Phases · All Features · All Modules', MARGIN, 97);

DOC.setFontSize(8);
DOC.text('Classification: UNCLASSIFIED (Demonstration Model)', MARGIN, 115);
DOC.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, MARGIN, 122);
DOC.text('Agent: winter4 · Platform: AutoClaw', MARGIN, 129);

// Architecture overview box
DOC.setDrawColor(42, 53, 85);
DOC.setFillColor(17, 24, 39);
DOC.roundedRect(MARGIN, 140, WIDTH, 30, 3, 3, 'FD');

DOC.setFontSize(9);
DOC.setTextColor(6, 182, 212);
DOC.text('Architecture', MARGIN + 3, 148);
DOC.setTextColor(148, 163, 184);
DOC.setFontSize(8);
DOC.text('Next.js 16 + React + TypeScript + Tailwind CSS', MARGIN + 3, 155);
DOC.text('Leaflet Maps · Custom SVG Graphs · Recharts · jspdf', MARGIN + 3, 160);
DOC.text('Node.js Data Pipelines · Cron Automation · Real-time JSON Feeds', MARGIN + 3, 165);

// Phase summary grid
DOC.setFontSize(9);
DOC.setTextColor(6, 182, 212);
DOC.text('Phase Overview', MARGIN, 180);

const phases = [
  ['Phase 1', 'Core Platform', 'Dashboard · Geo-Spatial · Graph · Timeline · Alerts · Data Explorer'],
  ['Phase 2', 'Data Connectors', 'News Scraper · Beat Analytics · ANPR Tracker'],
  ['Phase 3', 'AI Analysis', 'Entity Extraction · Relationship Discovery · Risk Scoring · Anomalies'],
  ['Phase 4', 'Operations', 'Case Management · Live Tracking · Agency Fusion · Evidence Chain'],
  ['Phase 5', 'Predictive', 'Hotspot Prediction · Disruption Simulation · Threat Forecast'],
];

phases.forEach((p, i) => {
  const py = 190 + i * 14;
  DOC.setTextColor(59, 130, 246);
  DOC.setFontSize(8);
  DOC.text(p[0], MARGIN, py);
  DOC.setTextColor(168, 85, 247);
  DOC.text(p[1], MARGIN + 25, py);
  DOC.setTextColor(148, 163, 184);
  DOC.setFontSize(7);
  DOC.text(p[2], MARGIN + 55, py);
});

newPage();

// ─── TABLE OF CONTENTS ──────────────────────────────────────────────
header('Table of Contents');
const toc = [
  '1. Phase 1 — Core Intelligence Platform',
  '2. Phase 2 — Live Data Connectors',
  '3. Phase 3 — AI-Powered Analysis',
  '4. Phase 4 — Operational Capabilities',
  '5. Phase 5 — Predictive Platform',
  '6. Dataset & Intelligence Scenario',
  '7. Automation & Scheduling',
  '8. Technical Architecture',
];
toc.forEach(t => { text(t); y += 1; });
newPage();

// ─── SECTION 1: PHASE 1 ─────────────────────────────────────────────
header('1. Phase 1 — Core Intelligence Platform');
text('The foundation of ARGUS-NCR. A dark-theme military-grade intelligence dashboard with six interconnected modules built on Next.js 16 with TypeScript and Tailwind CSS.');
divider();

subHeader('1.1 Operations Dashboard');
text('Real-time command center displaying the complete intelligence picture.');
bullet('8 live stat cards: Total Entities, Active Alerts, Critical Alerts, Persons of Interest, Locations Monitored, Links Traced, Communications Intercepted, Financial Anomalies');
bullet('Risk distribution pie chart — Critical / High / Medium / Low breakdown with color-coded segments');
bullet('Entity distribution bar chart — categorization by type (Person, Location, Vehicle, Organization, Event, Communication, Financial)');
bullet('Live activity feed with timestamps and severity indicators');
bullet('Active alerts panel with acknowledgment tracking and severity filtering');
bullet('30-second auto-polling for fresh data without page refresh');

subHeader('1.2 Geo-Spatial Analysis');
text('Interactive dark-themed CartoDB map of the entire Delhi NCR region (13 police districts, 15+ key locations).');
bullet('Entity markers color-coded by type: Person (blue), Location (green), Vehicle (yellow), Organization (purple), Event (orange), Communication (cyan), Financial (red)');
bullet('Risk heat zones — pulsing overlay circles sized by risk score, color-coded red/orange/yellow');
bullet('Police district boundaries — 13 districts across Delhi, Gurugram, Noida, Ghaziabad, Faridabad');
bullet('Relationship lines — dashed lines connecting linked entities on the map');
bullet('Layer controls — filter by entity type, toggle heat zones, toggle district boundaries');
bullet('Click-to-inspect detail panel showing properties, tags, risk score, connected entities');

subHeader('1.3 Graph Analysis');
text('Force-directed entity relationship graph with custom SVG physics simulation.');
bullet('28 entities, 30 relationship links in the base network');
bullet('Node sizing varies by entity type, high-risk entities have red warning rings');
bullet('Hover to highlight connections and display link labels');
bullet('Click to open detail panel with full properties, risk gauge, tags, connections');
bullet('Type-based filtering — show/hide entity types to isolate networks');
bullet('Dark grid background with glow effects on interaction');

subHeader('1.4 Event Timeline');
text('Chronological reconstruction of all timestamped intelligence events.');
bullet('Events grouped by date with severity-colored dots (Critical=Red, High=Orange, Medium=Yellow, Low=Green)');
bullet('Risk score display per event with visual gauge');
bullet('Property summaries and tag indicators inline');
bullet('Visual timeline rail with event markers for rapid scanning');

subHeader('1.5 Alerts Center');
text('Dedicated alert management system with filtering and acknowledgment workflow.');
bullet('Severity-ordered alert cards (Critical → Low) with color-coded borders');
bullet('Acknowledged/Unacknowledged sections for workflow tracking');
bullet('Timestamp, location coordinates, and linked entity references per alert');
bullet('Severity badges with iconography (Critical=Shield, High=AlertTriangle, etc.)');
bullet('8 base alerts covering cross-border movement, hawala, encrypted comms, customs, land fraud, financial');

subHeader('1.6 Data Explorer');
text('Full entity database with search, filter, sort, and expand capabilities.');
bullet('Search across name, type, tags, and property values');
bullet('Filter by entity type dropdown');
bullet('Sort by risk score (ascending/descending)');
bullet('Expandable rows showing properties and connections');
bullet('Inline risk score bar visualization');
bullet('Detail panel with full property dump, location, tags, connected entities');

newPage();

// ─── SECTION 2: PHASE 2 ─────────────────────────────────────────────
header('2. Phase 2 — Live Data Connectors');
text('Three real-time data pipelines feeding live intelligence into the platform. Runs hourly via cron automation.');
divider();

subHeader('2.1 News Scraper');
text('Real-time news aggregation from 5 Indian media RSS feeds focused on Delhi NCR.');
bullet('Sources: Times of India Delhi, The Hindu Delhi, Indian Express Delhi, NDTV Cities, Hindustan Times Delhi');
bullet('15 real articles per scrape with title, description, publication date, and source');
bullet('Items displayed with source badges, timestamps, and clickable external links');
bullet('Auto-refresh every hour via cron job');

subHeader('2.2 Beat Analytics');
text('Crime pattern simulation by police district across the entire NCR.');
bullet('14 police districts covered: all 10 Delhi districts + Gurugram, Noida, Ghaziabad, Faridabad');
bullet('15 crime types tracked: theft, burglary, assault, vehicle-theft, chain-snatching, cyber-fraud, domestic-violence, drug-possession, eve-teasing, snatching, robbery, riot, murder, kidnapping, extortion');
bullet('Per-capita incident rates calculated against district population');
bullet('Risk scores assigned based on incident count and crime type severity');
bullet('7 reports generated per hourly cycle');

subHeader('2.3 ANPR Tracker');
text('Simulated Automated Number Plate Recognition feed tracking vehicle movement.');
bullet('8 tracked vehicles including known POI vehicles and unknown flagged plates');
bullet('10 ANPR camera locations across Delhi NCR (toll plazas, junctions, border checkpoints)');
bullet('Vehicle details: plate number, make/model, color, registered owner');
bullet('Flagged vs un-flagged classification with confidence scores');
bullet('Direction tracking (Northbound/Southbound/Eastbound/Westbound)');
bullet('5-10 hits per hourly cycle with 60-75% flag rate');

newPage();

// ─── SECTION 3: PHASE 3 ─────────────────────────────────────────────
header('3. Phase 3 — AI-Powered Analysis');
text('Four AI engines processing Phase 2 data to extract intelligence, discover relationships, score risk dynamically, and detect anomalies.');
divider();

subHeader('3.1 Entity Extraction (NER)');
text('Pattern-based Named Entity Recognition optimized for Indian names, Delhi NCR locations, and organization types.');
bullet('Person extraction: matches Indian first names + surnames against comprehensive name database (35+ first names, 35+ surnames)');
bullet('Organization extraction: pattern-matches company/organization keywords (Corp, Ltd, LLC, Group, Syndicate, Police, Bureau, Bank, etc.)');
bullet('Location extraction: matches against 25+ known Delhi NCR locations with geo-coordinates');
bullet('Processes all 15 Phase 2 news articles per cycle');

subHeader('3.2 Relationship Discovery');
text('Co-occurrence analysis engine that finds hidden connections between entities.');
bullet('Cross-type co-occurrence: persons-to-organizations, persons-to-locations, orgs-to-locations');
bullet('Name-matching: detects when extracted entities match known database entities');
bullet('Confidence scoring: 55-95% based on co-occurrence frequency and pattern strength');
bullet('Evidence trail: links each discovered relationship back to source article');

subHeader('3.3 Dynamic Risk Scoring');
text('Behavioral analysis model that recalculates entity risk scores based on real-time activity patterns.');
bullet('Factor 1 — Communication Volume: number of intercepted comms in 24h window');
bullet('Factor 2 — Movement Patterns: flagged ANPR hits per entity');
bullet('Factor 3 — Financial Activity: flagged transactions per entity');
bullet('Factor 4 — Network Position: HVT designation and known threat tags');
bullet('Factor 5 — News Exposure: mentions in scraped news articles');
bullet('Trend indicators: Escalating ↑ / Stable → / Declining ↓');
bullet('8 entities tracked with recalculated scores per cycle');

subHeader('3.4 Anomaly Detection');
text('Statistical baseline deviation detection across four dimensions.');
bullet('Communication Spike: flags entities with 80%+ above-average comms volume');
bullet('Route Anomaly: flags vehicles detected at 3+ distinct locations (unusual movement)');
bullet('Financial Cluster: flags entities with 2+ flagged transactions in 24h');
bullet('Crime Cluster: flags districts with 4+ reported incidents (hotspot formation)');
bullet('Deviation percentage calculated against rolling baselines');
bullet('3 anomalies detected per average cycle');

newPage();

// ─── SECTION 4: PHASE 4 ─────────────────────────────────────────────
header('4. Phase 4 — Operational Capabilities');
text('Mission-ready operational tools for case management, live tracking, multi-agency coordination, and evidence chain custody.');
divider();

subHeader('4.1 Case Management');
text('Active investigation tracking system with 5 open cases across multiple agencies.');
bullet('Case IDs with severity classification (Critical/High/Medium)');
bullet('Lead agency assignment with color-coded agency badges');
bullet('Entity linking — each case tracks associated persons, orgs, vehicles');
bullet('Status tracking with last update timestamps');
bullet('Case descriptions with operational context');

subHeader('4.2 Live GPS/ANPR Tracking');
text('Real-time asset tracking with GPS coordinates, speed, heading, and status.');
bullet('4 tracked assets: 2 vehicles + 2 field units');
bullet('Live GPS coordinates with refresh indicators');
bullet('Speed, heading, and last-ping timestamps');
bullet('Active/Idle status with pulsing green indicators');
bullet('Integration with ANPR camera network');

subHeader('4.3 Agency Fusion Center');
text('Multi-agency coordination dashboard with 6 participating agencies.');
bullet('Agencies: Delhi Police (84,000 officers), NIA, Enforcement Directorate (2,000), Customs Intelligence (3,500), Intelligence Bureau (17,000), Cyber Cell (450)');
bullet('Per-agency case assignments with severity badges');
bullet('Secure comms indicator between agencies');
bullet('Total 359 active cases across all agencies');

subHeader('4.4 Evidence Chain');
text('Custody chain tracking for all evidence items with multi-point verification.');
bullet('5 evidence items tracked with unique IDs');
bullet('Evidence types: Phone Intercept, Document, Financial Record, Bank Statement, Property Deed');
bullet('Custody location tracking per evidence item');
bullet('Chain-of-custody counter (number of custodians who handled each item)');
bullet('Case linkage — each evidence item mapped to parent case');

newPage();

// ─── SECTION 5: PHASE 5 ─────────────────────────────────────────────
header('5. Phase 5 — Predictive Platform');
text('Forward-looking analytical tools for hotspot prediction, network disruption simulation, and threat forecasting.');
divider();

subHeader('5.1 Hotspot Prediction');
text('District-level risk forecasting with confidence scores and contributing factors.');
bullet('6 districts under continuous prediction: Ghazipur Border Area (92/100), IGI Cargo (88/100), Chandni Chowk (85/100), Gurugram Cyber City (75/100), Dwarka (70/100), Jamia Nagar (68/100)');
bullet('Risk trend indicators: Rising/Stable with directional arrows');
bullet('Confidence scores: 68-85% based on data quality and pattern strength');
bullet('Contributing factors broken down per district (3-4 factors each)');

subHeader('5.2 Network Disruption Simulation');
text('What-if scenario modeling — simulates the impact of arresting specific targets on the overall network.');
bullet('3 simulation scenarios with varying target profiles');
bullet('Network fragmentation percentage — quantifies operation impact');
bullet('Downstream disruption listing — specific nodes affected');
bullet('Escaped node identification — operatives likely to evade');
bullet('Escalation risk assessment — Low/Medium/High with reasoning');
bullet('Coordinated raid scenario achieves 95% network fragmentation with high escalation risk');

subHeader('5.3 Threat Forecast');
text('24/48/72-hour threat probability forecasts with actionable recommendations.');
bullet('Three timeframes: 24-hour (72% probability), 48-hour (64%), 72-hour (55%)');
bullet('Projected threats per timeframe (3 threats each)');
bullet('Recommended counter-actions per timeframe (3 actions each)');
bullet('Probability decreases over time reflecting increasing uncertainty');
bullet('Action-items formatted as tactical directives for operational teams');

newPage();

// ─── SECTION 6: DATASET ─────────────────────────────────────────────
header('6. Dataset & Intelligence Scenario');
text('The ARGUS-NCR platform runs on a realistic, internally consistent intelligence scenario centered on organized crime networks in Delhi NCR.');
divider();

subHeader('6.1 Entity Network');
text('28 base entities distributed across 7 types:');
bullet('8 Persons of Interest: Vikram Malhotra (Risk 78), Rashid Qureshi (Risk 91 — HVT), Anita Sharma (Risk 45), Deepak Tyagi (Risk 22), Farhan Siddiqui (Risk 85), Meera Kapoor (Risk 15), Suresh Kalmadi (Risk 67), Priya Nair (Risk 52)');
bullet('4 Locations: Ghaziabad Warehouse (Risk 72), Jamia Nagar Safe House (Risk 88), Chandni Chowk Import Office (Risk 65), IGI Airport Cargo Terminal (Risk 40)');
bullet('3 Vehicles: DL-3C-AX-7842 (Innova, Malhotra), UP-16-T-9054 (Tata Ace, Qureshi), HR-26-AB-1234 (Creta, Kalmadi)');
bullet('3 Organizations: Siddiqui Imports LLC (Risk 82), NCR Transport Syndicate (Risk 75), Delhi Infrastructure Corp (Risk 58)');
bullet('4 Events: Cargo Shipment, Cash Deposit, Border Crossing, Property Registration');
bullet('3 Communications: Phone Intercept, Email Intercept, WhatsApp Group');
bullet('2 Financial: Hawala Transfer, Property Payment');

subHeader('6.2 Key Scenario Threads');
text('Four interconnected criminal networks form the intelligence picture:');
bullet('Smuggling Pipeline: Rashid Qureshi → cross-border movement → Ghaziabad warehouse → IGI cargo → Siddiqui Imports — 30 relationship links connecting the network');
bullet('Hawala Network: ₹3.2Cr traced from Chandni Chowk to Dubai, linked to Malhotra & Siddiqui — shell company suspected');
bullet('Corruption Ring: Anita Sharma (MCD official) + Suresh Kalmadi (developer) → shell company land deals via Delhi Infrastructure Corp — property registration in Dwarka flagged');
bullet('Encrypted Comms: "Project Alpha" WhatsApp group with 7 members and 234 messages coordinating smuggling operations — decrypted by signals intelligence');

subHeader('6.3 Network Connectivity');
text('30 relationship links connecting all entities into a cohesive intelligence graph:');
bullet('Communication links: Malhotra ↔ Qureshi (high frequency), Qureshi ↔ Siddiqui (medium frequency)');
bullet('Business links: Malhotra + Siddiqui are directors of Siddiqui Imports LLC');
bullet('Employment links: Anita Sharma + Suresh Kalmadi linked to Delhi Infrastructure Corp');
bullet('Ownership links: Vehicles traced to Malhotra, Qureshi, Kalmadi');
bullet('Event links: Cargo shipment tied to Siddiqui Imports, border crossing tied to Qureshi vehicle, property registration involving Sharma and Kalmadi');

newPage();

// ─── SECTION 7: AUTOMATION ──────────────────────────────────────────
header('7. Automation & Scheduling');
text('All data pipelines run on cron-based schedules ensuring the platform stays current without manual intervention.');
divider();

subHeader('7.1 Cron Jobs');
bullet('Daily Feed Generator: Runs at 6:00 AM IST daily — generates 10-15 new intelligence signals (events, comms, financial, alerts)');
bullet('Phase 2 Connectors: Runs every hour — scrapes 15 news articles, generates 7 beat reports, tracks 5-10 ANPR hits');
bullet('Phase 3 AI Engine: Runs every hour — processes Phase 2 output through entity extraction, relationship discovery, risk scoring, and anomaly detection');

subHeader('7.2 Data Flow Pipeline');
text('Phase 2 Connectors → phase2-feed.json (public/) → Phase 3 Engine reads phase2-feed.json → phase3-feed.json (public/)');
text('Dashboard polls daily-feed.json every 30 seconds');
text('Phase 2 view polls phase2-feed.json every 60 seconds');
text('Phase 3 view polls phase3-feed.json every 60 seconds');
text('No rebuild required — all feeds served as static JSON from the public/ directory');

subHeader('7.3 Output Files');
bullet('daily-feed.json — Synthetic daily intelligence (movement, comms, financial, alerts)');
bullet('phase2-feed.json — Live scraped news, beat reports, ANPR hits');
bullet('phase3-feed.json — Entity extraction results, discovered relationships, recalculated risk scores, anomaly flags');

// ─── SECTION 8: TECH ARCHITECTURE ───────────────────────────────────
header('8. Technical Architecture');
divider();

subHeader('8.1 Frontend Stack');
bullet('Framework: Next.js 16 with App Router and TypeScript');
bullet('Styling: Tailwind CSS with custom CSS variables for dark military-grade theme');
bullet('Maps: Leaflet with CartoDB dark tiles, dynamic import for SSR safety');
bullet('Charts: Recharts (PieChart, BarChart with dark theme customization)');
bullet('Graph: Custom SVG force-directed layout with velocity-based physics simulation');
bullet('Icons: Lucide React (60+ icons used across platform)');
bullet('PDF: jspdf for documentation generation');

subHeader('8.2 Backend & Data');
bullet('Data Pipelines: Node.js scripts (ES modules) with crypto for ID generation');
bullet('Web Scraping: Native http/https modules + regex-based RSS parsing');
bullet('NLP: Pattern-based NER with Indian name databases (70 names) and Delhi NCR gazetteer');
bullet('Analytics: Statistical deviation detection with rolling baselines and multiplicative thresholds');
bullet('Scheduling: OpenClaw cron system with isolated agent sessions');

subHeader('8.3 File Structure');
text('Key files in the ARGUS-NCR codebase:');
bullet('src/lib/data.ts — Base entity network (28 entities, 30 links, 8 alerts)');
bullet('src/lib/daily-feed.ts — Daily intelligence feed (auto-generated)');
bullet('scripts/generate-feed.js — Daily feed generator');
bullet('scripts/phase2-connectors.js — News scraper + beat analytics + ANPR tracker');
bullet('scripts/phase3-engine.js — Entity extraction + relationship discovery + risk scoring + anomaly detection');
bullet('public/daily-feed.json — Runtime feed (no rebuild required)');
bullet('public/phase2-feed.json — Phase 2 runtime feed');
bullet('public/phase3-feed.json — Phase 3 runtime feed');
bullet('src/components/ — 12 React components (sidebar, dashboard, geospatial, graphview, timeline, alertsview, dataview, phase2-view, phase3-view, phase45-view, ouroboros-logo)');

subHeader('8.4 Performance');
bullet('Static exports: JSON feeds served directly from public/ directory — zero server processing');
bullet('Client-side polling: 30-60 second intervals with cache-busting params');
bullet('Map lazy loading: Leaflet dynamically imported in useEffect to avoid SSR window errors');
bullet('Graph physics: Client-side force simulation with 200 iterations, capped at 40 nodes');
bullet('Build size: ~37KB initial page, feeds under 50KB each');

// ─── FOOTER ─────────────────────────────────────────────────────────
newPage();
y = 60;
DOC.setFont('helvetica', 'bold');
DOC.setFontSize(22);
DOC.setTextColor(6, 182, 212);
DOC.text('ARGUS-NCR', MARGIN, y);
DOC.setFontSize(11);
DOC.setTextColor(148, 163, 184);
DOC.text('Delhi NCR Intelligence Platform', MARGIN, y + 10);
DOC.setDrawColor(6, 182, 212);
DOC.setLineWidth(1);
DOC.line(MARGIN, y + 16, MARGIN + 60, y + 16);

DOC.setFontSize(9);
DOC.setTextColor(148, 163, 184);
DOC.text('Platform Statistics', MARGIN, y + 28);
DOC.setFont('helvetica', 'normal');
DOC.setTextColor(226, 232, 240);
const stats = [
  '•  28 Base Entities · 30 Relationship Links · 8 Base Alerts',
  '•  5 Phase Pipeline: Core → Data → AI → Ops → Predictive',
  '•  12 React Components · 3 Node.js Engine Scripts',
  '•  3 Cron Jobs · 3 Live JSON Feeds · 7 Data Modules',
  '•  15 Real-time News Articles (Hourly) · 5 RSS Sources',
  '•  14 Police Districts · 15+ Key Locations · 15 Crime Types',
  '•  10 ANPR Camera Locations · 8 Tracked Vehicles',
  '•  6 Participating Agencies · 5 Active Cases · 5 Evidence Items',
  '•  6 Predictive Hotspots · 3 Disruption Scenarios · 3 Threat Forecasts',
];
stats.forEach(s => {
  if (y + 5 > PAGE_H) newPage();
  DOC.setFontSize(8);
  DOC.text(s, MARGIN + 5, y + 35 + stats.indexOf(s) * 8);
});

y = y + 35 + stats.length * 8 + 15;
DOC.setFontSize(8);
DOC.setTextColor(100, 116, 139);
DOC.text('Classification: UNCLASSIFIED | Demonstration Model with Synthetic Data', MARGIN, y);
DOC.text('Built with AutoClaw | Agent: winter4 | Stack: Next.js 16 + TypeScript + Tailwind', MARGIN, y + 5);
DOC.text('No real intelligence, PII, or classified information is included.', MARGIN, y + 10);

// ─── SAVE ────────────────────────────────────────────────────────────
const outPath = path.join(__dirname, '..', 'public', 'ARGUS-NCR-Complete-Documentation.pdf');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
const buffer = DOC.output('arraybuffer');
fs.writeFileSync(outPath, Buffer.from(buffer));
console.log(`✅ PDF generated: ${outPath}`);
console.log(`   ${DOC.getNumberOfPages()} pages · Complete documentation of all 5 phases`);
