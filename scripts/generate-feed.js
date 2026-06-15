/**
 * ARGUS-NCR Daily Intelligence Feed Generator
 * 
 * Produces new intelligence every day — events, communications, alerts, 
 * financial activity — all connected to the existing entity network.
 * Designed to simulate a live intel fusion center receiving daily inputs.
 */

const crypto = require('crypto');

// ─── CONFIG ────────────────────────────────────────────────────────
const OUTPUT_FILE_TS = './src/lib/daily-feed.ts';
const OUTPUT_FILE_JSON = './public/daily-feed.json';
const TODAY = new Date();

// Helper to generate timestamps spread across the last 24 hours
function randomTimestamp(hoursBack = 24) {
  const d = new Date(TODAY.getTime() - Math.random() * hoursBack * 3600000);
  return d.toISOString();
}

function uid() {
  return crypto.randomBytes(3).toString('hex').toUpperCase();
}

// ─── BASE ENTITIES (from the network) ──────────────────────────────
const persons = [
  { id: 'P-001', name: 'Vikram Malhotra', location: 'Cyber City, Gurugram' },
  { id: 'P-002', name: 'Rashid Qureshi', location: 'Laxmi Nagar, Delhi' },
  { id: 'P-003', name: 'Anita Sharma', location: 'Connaught Place, Delhi' },
  { id: 'P-004', name: 'Deepak Tyagi', location: 'Sector 62, Noida' },
  { id: 'P-005', name: 'Farhan Siddiqui', location: 'Chandni Chowk, Delhi' },
  { id: 'P-006', name: 'Meera Kapoor', location: 'Saket, Delhi' },
  { id: 'P-007', name: 'Suresh Kalmadi', location: 'Dwarka, Delhi' },
];

const locations = [
  { lat: 28.6315, lng: 77.2167, addr: 'Connaught Place, New Delhi' },
  { lat: 28.6519, lng: 77.1909, addr: 'Karol Bagh, Delhi' },
  { lat: 28.6304, lng: 77.2773, addr: 'Laxmi Nagar, Delhi' },
  { lat: 28.4595, lng: 77.0266, addr: 'Cyber City, Gurugram' },
  { lat: 28.6270, lng: 77.3649, addr: 'Sector 62, Noida' },
  { lat: 28.6506, lng: 77.2334, addr: 'Chandni Chowk, Delhi' },
  { lat: 28.6692, lng: 77.4538, addr: 'Ghaziabad, UP' },
  { lat: 28.5562, lng: 77.1000, addr: 'IGI Airport, Delhi' },
  { lat: 28.5921, lng: 77.0460, addr: 'Dwarka, Delhi' },
  { lat: 28.4947, lng: 77.0887, addr: 'Cyber Hub, Gurugram' },
  { lat: 28.6300, lng: 77.3200, addr: 'Ghazipur Border, Delhi-UP' },
  { lat: 28.5680, lng: 77.2900, addr: 'Jamia Nagar, Okhla' },
  { lat: 28.7406, lng: 77.1167, addr: 'Rohini, Delhi' },
  { lat: 28.6900, lng: 77.1400, addr: 'Pitampura, Delhi' },
  { lat: 28.5244, lng: 77.2066, addr: 'Saket, New Delhi' },
];

const vehicles = ['DL-3C-AX-7842', 'UP-16-T-9054', 'HR-26-AB-1234'];
const orgs = ['Siddiqui Imports LLC', 'NCR Transport Syndicate', 'Delhi Infrastructure Corp'];

// ─── EVENT GENERATORS ──────────────────────────────────────────────

function generateMovementEvent() {
  const person = persons[Math.floor(Math.random() * persons.length)];
  const loc = locations[Math.floor(Math.random() * locations.length)];
  const vec = vehicles[Math.floor(Math.random() * vehicles.length)];
  return {
    id: `DE-${uid()}`,
    type: 'event',
    name: `Movement Tracked — ${person.name}`,
    properties: {
      person: person.name,
      vehicle: vec,
      destination: loc.addr,
      method: Math.random() > 0.5 ? 'ANPR camera' : 'toll plaza',
      confidence: `${Math.floor(65 + Math.random() * 30)}%`,
    },
    location: { lat: loc.lat, lng: loc.lng, address: loc.addr },
    timestamp: randomTimestamp(12),
    riskScore: Math.floor(30 + Math.random() * 55),
    tags: ['movement-track', 'daily-feed'],
    links: [person.id],
  };
}

function generateCommunicationEvent() {
  const src = persons[Math.floor(Math.random() * persons.length)];
  const tgt = persons[Math.floor(Math.random() * persons.length)];
  const types = ['voice-call', 'SMS', 'WhatsApp', 'email', 'Signal'];
  const type = types[Math.floor(Math.random() * types.length)];
  const phrases = [
    '"the package is ready"', '"meet at the usual place"', '"route changed — use backup"',
    '"payment confirmed"', '"new shipment arrived"', '"keep it low profile"',
    '"docs are with accountant"', '"don\'t call this number again"',
  ];
  return {
    id: `DC-${uid()}`,
    type: 'communication',
    name: `Intercepted ${type.toUpperCase()} — ${src.name.split(' ')[0]} → ${tgt.name.split(' ')[0]}`,
    properties: {
      type,
      from: src.name,
      to: tgt.name,
      duration: `${Math.floor(1 + Math.random() * 8)}m ${Math.floor(Math.random() * 59)}s`,
      keyPhrase: phrases[Math.floor(Math.random() * phrases.length)],
      classification: Math.random() > 0.3 ? 'SECRET' : 'RESTRICTED',
    },
    timestamp: randomTimestamp(6),
    riskScore: Math.floor(40 + Math.random() * 50),
    tags: ['intercept', 'daily-feed'],
    links: [src.id, tgt.id],
  };
}

function generateFinancialEvent() {
  const person = persons[Math.floor(Math.random() * persons.length)];
  const loc = locations[Math.floor(Math.random() * locations.length)];
  const amounts = ['₹45L', '₹1.2Cr', '₹78L', '₹2.5Cr', '₹32L', '₹5Cr'];
  const amount = amounts[Math.floor(Math.random() * amounts.length)];
  const methods = ['RTGS', 'NEFT', 'cash-deposit', 'hawala-trace', 'crypto-wallet'];
  return {
    id: `DF-${uid()}`,
    type: 'financial',
    name: `Transaction Flag — ${amount}`,
    properties: {
      amount,
      method: methods[Math.floor(Math.random() * methods.length)],
      linkedTo: person.name,
      bank: ['SBI', 'HDFC', 'ICICI', 'PNB', 'Axis'][Math.floor(Math.random() * 5)],
      flag: Math.random() > 0.5 ? 'STR Filed' : 'CTR Filed',
    },
    location: { lat: loc.lat, lng: loc.lng, address: loc.addr },
    timestamp: randomTimestamp(18),
    riskScore: Math.floor(50 + Math.random() * 45),
    tags: ['financial-monitoring', 'daily-feed'],
    links: [person.id],
  };
}

function generateAlert() {
  const severities = ['critical', 'high', 'high', 'medium', 'medium', 'low'];
  const severity = severities[Math.floor(Math.random() * severities.length)];

  const alertTemplates = [
    {
      title: 'Border Checkpoint Alert — Suspicious Crossing',
      description: 'ANPR system flagged vehicle at Ghazipur border. Cargo manifest mismatch. Driver identity unverified.',
      loc: locations.find(l => l.addr.includes('Ghazipur')),
    },
    {
      title: 'Encrypted Channel Activity Spike',
      description: 'Surveillance detected 3x increase in encrypted messages within monitored network. Pattern matches pre-operation coordination.',
      loc: locations[Math.floor(Math.random() * locations.length)],
    },
    {
      title: 'Shell Company Transaction Detected',
      description: 'Real-time financial monitoring flagged circular transaction pattern through 4 shell entities. Linked to known network.',
      loc: locations[Math.floor(Math.random() * locations.length)],
    },
    {
      title: 'Iris Scan Match — Airport Watchlist',
      description: 'Biometric match at IGI Airport T3. Subject on secondary watchlist attempted domestic departure.',
      loc: locations.find(l => l.addr.includes('Airport')),
    },
    {
      title: 'Dark Web Marketplace Listing — Delhi NCR',
      description: 'Crawler detected new listing matching contraband profile. Seller signature matches known operation.',
      loc: { lat: 28.6139, lng: 77.2090, addr: 'Delhi NCR — General' },
    },
    {
      title: 'CCTV Anomaly — Unusual Gathering',
      description: 'Behavioral analytics flagged unusual gathering pattern near monitored location. 7-9 individuals, staggered arrival.',
      loc: locations[Math.floor(Math.random() * locations.length)],
    },
    {
      title: 'Drone Detection — Restricted Airspace',
      description: 'Counter-drone system detected unauthorized UAV near sensitive installation. Flight path suggests surveillance pattern.',
      loc: locations[Math.floor(Math.random() * locations.length)],
    },
  ];

  const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
  return {
    id: `DA-${uid()}`,
    severity,
    title: template.title,
    description: template.description,
    timestamp: randomTimestamp(8),
    location: template.loc ? { lat: template.loc.lat, lng: template.loc.lng } : undefined,
    entityId: `P-00${Math.floor(1 + Math.random() * 7)}`,
    acknowledged: false,
  };
}

function generateActivityEntry() {
  const activities = [
    `Vehicle ${vehicles[Math.floor(Math.random() * 3)]} tracked at toll plaza — ${locations[Math.floor(Math.random() * locations.length)].addr}`,
    `New STR filed by ${['SBI', 'HDFC', 'ICICI'][Math.floor(Math.random() * 3)]} — Branch Manager ${['Janakpuri', 'Chandni Chowk', 'Karol Bagh'][Math.floor(Math.random() * 3)]}`,
    `SATCOM intercept: ${Math.random() > 0.5 ? 'encrypted burst transmission' : 'voice call'} detected — ${['Gurugram', 'Noida', 'Ghaziabad'][Math.floor(Math.random() * 3)]} cell`,
    `HUMINT report received: ${persons[Math.floor(Math.random() * persons.length)].name} observed meeting unknown contact`,
    `OSINT alert: social media post matches geolocation trigger — ${['Saket', 'Dwarka', 'Rohini'][Math.floor(Math.random() * 3)]}`,
    `Cyber cell dashboard: new phishing domain registered targeting ${orgs[Math.floor(Math.random() * 3)]}`,
  ];
  return {
    time: new Date(TODAY.getTime() - Math.random() * 86400000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }),
    event: activities[Math.floor(Math.random() * activities.length)],
    severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
  };
}

// ─── GENERATE DAILY FEED ──────────────────────────────────────────

function generateDailyFeed() {
  const dateStr = TODAY.toISOString().slice(0, 10);
  const timeStr = TODAY.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false });

  const dailyEvents = Array.from({ length: Math.floor(3 + Math.random() * 4) }, () => generateMovementEvent());
  const dailyComms = Array.from({ length: Math.floor(2 + Math.random() * 3) }, () => generateCommunicationEvent());
  const dailyFinancial = Array.from({ length: Math.floor(1 + Math.random() * 3) }, () => generateFinancialEvent());
  const dailyAlerts = Array.from({ length: Math.floor(2 + Math.random() * 3) }, () => generateAlert());
  const dailyActivity = Array.from({ length: Math.floor(4 + Math.random() * 4) }, () => generateActivityEntry());

  const allEntities = [...dailyEvents, ...dailyComms, ...dailyFinancial];
  const stats = {
    date: dateStr,
    lastUpdated: `${dateStr} ${timeStr}`,
    newEvents: dailyEvents.length + dailyComms.length + dailyFinancial.length,
    newAlerts: dailyAlerts.length,
    newActivityItems: dailyActivity.length,
    alertsBySeverity: {
      critical: dailyAlerts.filter(a => a.severity === 'critical').length,
      high: dailyAlerts.filter(a => a.severity === 'high').length,
      medium: dailyAlerts.filter(a => a.severity === 'medium').length,
      low: dailyAlerts.filter(a => a.severity === 'low').length,
    },
  };

  const feed = {
    generatedAt: new Date().toISOString(),
    stats,
    entities: allEntities,
    alerts: dailyAlerts,
    activity: dailyActivity,
  };

  return { feed, stats };
}

// ─── MAIN ─────────────────────────────────────────────────────────
const { feed, stats } = generateDailyFeed();
const fs = require('fs');
const path = require('path');

// Write TypeScript module (build-time baseline)
const tsPath = path.join(__dirname, '..', OUTPUT_FILE_TS);
fs.mkdirSync(path.dirname(tsPath), { recursive: true });
const ts = `// Auto-generated daily intelligence feed — ${stats.date} ${stats.lastUpdated.split(' ')[1]} IST
// ⚠️ Do not edit manually. Regenerated by scripts/generate-feed.js

export interface DailyFeed {
  generatedAt: string;
  stats: {
    date: string;
    lastUpdated: string;
    newEvents: number;
    newAlerts: number;
    newActivityItems: number;
    alertsBySeverity: { critical: number; high: number; medium: number; low: number };
  };
  entities: any[];
  alerts: any[];
  activity: any[];
}

export const dailyFeed: DailyFeed = ${JSON.stringify(feed, null, 2)};
`;
fs.writeFileSync(tsPath, ts, 'utf-8');

// Write JSON to public/ (served at runtime — no rebuild needed for daily updates!)
const jsonPath = path.join(__dirname, '..', OUTPUT_FILE_JSON);
fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
fs.writeFileSync(jsonPath, JSON.stringify(feed, null, 2), 'utf-8');

console.log(`✓ Daily feed generated: ${stats.date}`);
console.log(`  Events: ${stats.newEvents} | Alerts: ${stats.newAlerts} | Activity: ${stats.newActivityItems}`);
console.log(`  Critical: ${stats.alertsBySeverity.critical} | High: ${stats.alertsBySeverity.high} | Medium: ${stats.alertsBySeverity.medium}`);
console.log(`  TS:   ${tsPath}`);
console.log(`  JSON: ${jsonPath}`);
