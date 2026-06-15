/**
 * PHASE 2: Real Data Connectors for ARGUS-NCR
 * 
 * Three live pipelines:
 * 1. News Scraper — Delhi NCR headlines from Indian media RSS feeds
 * 2. Beat Analytics — Crime pattern simulation by police district
 * 3. ANPR Tracker — Simulated automated number-plate recognition feeds
 * 
 * All feed into the daily intelligence intake.
 */

const https = require('https');
const http = require('http');

// ─── UTILITY ────────────────────────────────────────────────────────
function uid() { return require('crypto').randomBytes(3).toString('hex').toUpperCase(); }
function fetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject).on('timeout', function() { this.destroy(); reject(new Error('timeout')); });
  });
}

// ─── 1. NEWS SCRAPER ────────────────────────────────────────────────
// Delhi NCR-focused RSS feeds
const NEWS_FEEDS = [
  { name: 'TOI Delhi', url: 'https://timesofindia.indiatimes.com/city/delhi/rssfeedmostrecent.cms' },
  { name: 'The Hindu Delhi', url: 'https://www.thehindu.com/news/cities/Delhi/feeder/default.rss' },
  { name: 'Indian Express Delhi', url: 'https://indianexpress.com/section/cities/delhi/feed/' },
  { name: 'NDTV Cities', url: 'https://feeds.feedburner.com/ndtvnews-cities-news' },
  { name: 'Hindustan Times Delhi', url: 'https://www.hindustantimes.com/feeds/rss/cities/delhi-news/rssfeed.xml' },
];

async function scrapeNews() {
  const results = [];
  
  for (const feed of NEWS_FEEDS) {
    try {
      const xml = await fetch(feed.url);
      // Parse RSS items with basic regex (no heavy XML parser needed)
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;
      let count = 0;
      
      while ((match = itemRegex.exec(xml)) !== null && count < 3) {
        const item = match[1];
        const title = (item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/) || item.match(/<title>(.*?)<\/title>/))?.[1]?.trim() || '';
        const desc = (item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/) || item.match(/<description>(.*?)<\/description>/))?.[1]?.trim() || '';
        const link = (item.match(/<link>(.*?)<\/link>/))?.[1]?.trim() || '';
        const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/))?.[1] || '';
        
        if (title && title.length > 10) {
          results.push({
            source: feed.name,
            title: title.replace(/<[^>]*>/g, '').slice(0, 200),
            description: desc.replace(/<[^>]*>/g, '').slice(0, 300),
            link,
            pubDate: pubDate || new Date().toISOString(),
          });
          count++;
        }
      }
    } catch (err) {
      // Feed unavailable — skip silently
    }
  }
  
  return results;
}

// ─── 2. BEAT ANALYTICS — Delhi Police District Crime Sim ────────────
const DELHI_DISTRICTS = [
  { id: 'PD-CENTRAL', name: 'Central Delhi', lat: 28.6450, lng: 77.2200, pop: 580000 },
  { id: 'PD-SOUTH', name: 'South Delhi', lat: 28.5200, lng: 77.2100, pop: 2700000 },
  { id: 'PD-WEST', name: 'West Delhi', lat: 28.6200, lng: 77.0900, pop: 2500000 },
  { id: 'PD-NORTH', name: 'North Delhi', lat: 28.7100, lng: 77.2000, pop: 880000 },
  { id: 'PD-EAST', name: 'East Delhi', lat: 28.6300, lng: 77.3000, pop: 1700000 },
  { id: 'PD-NE', name: 'North-East Delhi', lat: 28.6800, lng: 77.2800, pop: 2200000 },
  { id: 'PD-SHAHDARA', name: 'Shahdara', lat: 28.6700, lng: 77.2900, pop: 940000 },
  { id: 'PD-NW', name: 'North-West Delhi', lat: 28.7300, lng: 77.1200, pop: 3600000 },
  { id: 'PD-SW', name: 'South-West Delhi', lat: 28.5600, lng: 77.0800, pop: 2300000 },
  { id: 'PD-OUTER', name: 'Outer Delhi', lat: 28.7700, lng: 77.0600, pop: 2100000 },
  { id: 'PD-GURUGRAM', name: 'Gurugram', lat: 28.4600, lng: 77.0300, pop: 1500000 },
  { id: 'PD-NOIDA', name: 'Noida/Gautam Buddha Nagar', lat: 28.5700, lng: 77.3200, pop: 1600000 },
  { id: 'PD-GHAZIABAD', name: 'Ghaziabad', lat: 28.6700, lng: 77.4500, pop: 2300000 },
  { id: 'PD-FARIDABAD', name: 'Faridabad', lat: 28.4100, lng: 77.3200, pop: 1800000 },
];

const CRIME_TYPES = [
  'theft', 'burglary', 'assault', 'vehicle-theft', 'chain-snatching',
  'cyber-fraud', 'domestic-violence', 'drug-possession', 'eve-teasing',
  'snatching', 'robbery', 'riot', 'murder', 'kidnapping', 'extortion',
];

function generateBeatReport() {
  const district = DELHI_DISTRICTS[Math.floor(Math.random() * DELHI_DISTRICTS.length)];
  const crimeType = CRIME_TYPES[Math.floor(Math.random() * CRIME_TYPES.length)];
  const incidents = Math.floor(1 + Math.random() * 5);
  const severity = incidents >= 3 ? 'high' : incidents >= 2 ? 'medium' : 'low';
  const now = new Date();
  const timestamp = new Date(now.getTime() - Math.random() * 43200000).toISOString(); // last 12h

  return {
    id: `BEAT-${uid()}`,
    type: 'beat-report',
    name: `${crimeType.replace(/-/g, ' ')} — ${district.name}`,
    properties: {
      district: district.name,
      districtId: district.id,
      crimeType,
      incidents,
      population: district.pop,
      rate: `${((incidents / district.pop) * 100000).toFixed(1)} per 100k`,
      source: 'Delhi Police Beat Analytics',
    },
    location: { lat: district.lat, lng: district.lng, address: `${district.name}, Delhi NCR` },
    timestamp,
    riskScore: Math.floor(20 + (incidents * 10) + Math.random() * 30),
    tags: ['beat-analytics', 'phase-2'],
    links: [],
  };
}

// ─── 3. ANPR MOVEMENT TRACKER — Simulated plate recognition ─────────
const VEHICLES_TRACKED = [
  { plate: 'DL-3C-AX-7842', owner: 'Vikram Malhotra', type: 'Innova', color: 'White' },
  { plate: 'UP-16-T-9054', owner: 'Rashid Qureshi', type: 'Tata Ace', color: 'Yellow' },
  { plate: 'HR-26-AB-1234', owner: 'Suresh Kalmadi', type: 'Creta', color: 'Black' },
  { plate: 'DL-1CQ-4521', owner: 'Farhan Siddiqui', type: 'Fortuner', color: 'Silver' },
  { plate: 'DL-4S-AM-9901', owner: 'Unknown', type: 'Swift Dzire', color: 'White' },
  { plate: 'UP-14-BT-7732', owner: 'Unknown', type: 'Bolero', color: 'Green' },
  { plate: 'HR-51-AT-5562', owner: 'Unknown', type: 'i20', color: 'Red' },
  { plate: 'DL-9CQ-1234', owner: 'Unknown', type: 'Scorpio', color: 'Black' },
];

const ANPR_LOCATIONS = [
  { name: 'DND Flyway Toll', lat: 28.5740, lng: 77.2950 },
  { name: 'NH-24 Ghazipur Border', lat: 28.6300, lng: 77.3200 },
  { name: 'IGI Airport Approach', lat: 28.5562, lng: 77.1000 },
  { name: 'Gurugram Toll Plaza', lat: 28.4700, lng: 77.0600 },
  { name: 'Delhi-Gurgaon Expressway', lat: 28.4900, lng: 77.0950 },
  { name: 'Dhaula Kuan Junction', lat: 28.5967, lng: 77.1703 },
  { name: 'AIIMS Flyover', lat: 28.5667, lng: 77.2100 },
  { name: 'ISBT Kashmere Gate', lat: 28.6689, lng: 77.2314 },
  { name: 'Sarai Kale Khan', lat: 28.5931, lng: 77.2522 },
  { name: 'Noida-Greater Noida Expressway', lat: 28.5500, lng: 77.3500 },
];

function generateAnprHit() {
  const vehicle = VEHICLES_TRACKED[Math.floor(Math.random() * VEHICLES_TRACKED.length)];
  const location = ANPR_LOCATIONS[Math.floor(Math.random() * ANPR_LOCATIONS.length)];
  const isFlagged = vehicle.owner !== 'Unknown' || Math.random() > 0.7;
  const direction = ['Northbound', 'Southbound', 'Eastbound', 'Westbound'][Math.floor(Math.random() * 4)];

  return {
    id: `ANPR-${uid()}`,
    type: 'anpr-hit',
    name: `ANPR Hit — ${vehicle.plate} at ${location.name}`,
    properties: {
      plate: vehicle.plate,
      vehicle: `${vehicle.color} ${vehicle.type}`,
      owner: vehicle.owner,
      location: location.name,
      direction,
      camera: `CAM-${location.name.slice(0, 3).toUpperCase()}-${Math.floor(Math.random() * 99)}`,
      confidence: `${(92 + Math.random() * 8).toFixed(1)}%`,
      flagged: isFlagged,
    },
    location: { lat: location.lat, lng: location.lng, address: location.name },
    timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    riskScore: isFlagged ? Math.floor(40 + Math.random() * 50) : Math.floor(5 + Math.random() * 20),
    tags: ['anpr-tracker', 'phase-2', ...(isFlagged ? ['flagged-vehicle'] : [])],
    links: isFlagged && vehicle.owner !== 'Unknown' ? [
      VEHICLES_TRACKED.indexOf(vehicle) === 0 ? 'P-001' :
      VEHICLES_TRACKED.indexOf(vehicle) === 1 ? 'P-002' :
      VEHICLES_TRACKED.indexOf(vehicle) === 2 ? 'P-007' : 'P-005'
    ] : [],
  };
}

// ─── MASTER CONNECTOR ───────────────────────────────────────────────

async function runPhase2Connectors() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   ARGUS-NCR Phase 2 Data Connectors         ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  const phase2Data = {
    generatedAt: new Date().toISOString(),
    news: [],
    beatReports: [],
    anprHits: [],
    stats: {
      newsArticles: 0,
      beatReports: 0,
      anprHits: 0,
      flaggedVehicles: 0,
    },
  };

  // 1. News Scraping
  console.log('📰 [1/3] Scraping Delhi NCR news feeds...');
  try {
    phase2Data.news = await scrapeNews();
    phase2Data.stats.newsArticles = phase2Data.news.length;
    console.log(`   ✓ ${phase2Data.news.length} articles from ${new Set(phase2Data.news.map(n => n.source)).size} sources`);
    phase2Data.news.slice(0, 5).forEach(n => console.log(`     - [${n.source}] ${n.title.slice(0, 80)}...`));
  } catch (e) {
    console.log(`   ⚠ News scraper error: ${e.message}`);
  }

  // 2. Beat Analytics
  console.log('\n🚔 [2/3] Generating beat analytics reports...');
  const beatCount = 4 + Math.floor(Math.random() * 4);
  for (let i = 0; i < beatCount; i++) {
    phase2Data.beatReports.push(generateBeatReport());
  }
  phase2Data.stats.beatReports = phase2Data.beatReports.length;
  console.log(`   ✓ ${phase2Data.beatReports.length} beat reports across Delhi NCR districts`);
  phase2Data.beatReports.forEach(b => console.log(`     - [${b.properties.districtId}] ${b.name} (${b.properties.rate})`));

  // 3. ANPR Tracker
  console.log('\n📸 [3/3] Running ANPR movement tracker...');
  const anprCount = 5 + Math.floor(Math.random() * 6);
  for (let i = 0; i < anprCount; i++) {
    phase2Data.anprHits.push(generateAnprHit());
  }
  phase2Data.stats.anprHits = phase2Data.anprHits.length;
  phase2Data.stats.flaggedVehicles = phase2Data.anprHits.filter(h => h.properties.flagged).length;
  console.log(`   ✓ ${phase2Data.anprHits.length} ANPR hits (${phase2Data.stats.flaggedVehicles} flagged)`);
  phase2Data.anprHits.filter(h => h.properties.flagged).forEach(h => console.log(`     - ⚠ ${h.properties.plate} (${h.properties.owner}) at ${h.properties.location}`));

  return phase2Data;
}

// ─── MAIN ───────────────────────────────────────────────────────────
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');

  runPhase2Connectors().then(data => {
    const outPath = path.join(__dirname, '..', 'public', 'phase2-feed.json');
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
    
    console.log(`\n✅ Phase 2 feed written: ${outPath}`);
    console.log(`   News: ${data.stats.newsArticles} | Beat: ${data.stats.beatReports} | ANPR: ${data.stats.anprHits} (${data.stats.flaggedVehicles} flagged)`);
  }).catch(err => {
    console.error('❌ Phase 2 connector failed:', err.message);
    process.exit(1);
  });
}

module.exports = { runPhase2Connectors };
