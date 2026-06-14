// Delhi NCR Intelligence Dataset for ARGUS Platform

export interface Entity {
  id: string;
  type: 'person' | 'location' | 'vehicle' | 'organization' | 'event' | 'communication' | 'financial';
  name: string;
  properties: Record<string, any>;
  location?: { lat: number; lng: number; address: string };
  timestamp?: string;
  riskScore?: number;
  tags?: string[];
}

export interface Link {
  id: string;
  source: string;
  target: string;
  type: string;
  properties?: Record<string, any>;
  timestamp?: string;
  weight?: number;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  location?: { lat: number; lng: number };
  entityId?: string;
  acknowledged: boolean;
}

// ─── DELHI NCR LOCATIONS ──────────────────────────────────────────
const delhiLocations = {
  connaughtPlace: { lat: 28.6315, lng: 77.2167, address: 'Connaught Place, New Delhi' },
  indiaGate: { lat: 28.6129, lng: 77.2295, address: 'India Gate, New Delhi' },
  karolBagh: { lat: 28.6519, lng: 77.1909, address: 'Karol Bagh, Delhi' },
  chandniChowk: { lat: 28.6506, lng: 77.2334, address: 'Chandni Chowk, Delhi' },
  saket: { lat: 28.5244, lng: 77.2066, address: 'Saket, New Delhi' },
  dwarka: { lat: 28.5921, lng: 77.0460, address: 'Dwarka, New Delhi' },
  rohini: { lat: 28.7406, lng: 77.1167, address: 'Rohini, Delhi' },
  laxmiNagar: { lat: 28.6304, lng: 77.2773, address: 'Laxmi Nagar, Delhi' },
  nehruPlace: { lat: 28.5494, lng: 77.2501, address: 'Nehru Place, Delhi' },
  gurgaonHub: { lat: 28.4595, lng: 77.0266, address: 'Cyber City, Gurugram' },
  noidaSec62: { lat: 28.6270, lng: 77.3649, address: 'Sector 62, Noida' },
  noidaSec18: { lat: 28.5741, lng: 77.3257, address: 'Sector 18, Noida' },
  faridabad: { lat: 28.4089, lng: 77.3178, address: 'Faridabad, Haryana' },
  ghaziabad: { lat: 28.6692, lng: 77.4538, address: 'Ghaziabad, UP' },
  airportDEL: { lat: 28.5562, lng: 77.1000, address: 'IGI Airport T3, Delhi' },
  oldDelhiStation: { lat: 28.6425, lng: 77.2196, address: 'Old Delhi Railway Station' },
  nzStation: { lat: 28.6404, lng: 77.2440, address: 'New Delhi Railway Station' },
  cyberHub: { lat: 28.4947, lng: 77.0887, address: 'Cyber Hub, Gurugram' },
  vasantKunj: { lat: 28.5254, lng: 77.1548, address: 'Vasant Kunj, Delhi' },
  pitampura: { lat: 28.6900, lng: 77.1400, address: 'Pitampura, Delhi' },
};

// ─── ENTITIES ──────────────────────────────────────────────────────
export const entities: Entity[] = [
  // Persons of Interest
  {
    id: 'P-001', type: 'person', name: 'Vikram Malhotra',
    properties: { alias: 'VK', age: 42, nationality: 'Indian', occupation: 'Businessman', phone: '+91-98xxx-XXXX', aadhaar: 'XXXX-XXXX-7842' },
    location: { ...delhiLocations.gurgaonHub, address: 'Tower B, Cyber City, Gurugram' },
    riskScore: 78, tags: ['surveillance', 'financial-irregularity', 'POI']
  },
  {
    id: 'P-002', type: 'person', name: 'Rashid Qureshi',
    properties: { alias: 'RQ', age: 35, nationality: 'Indian', occupation: 'Transport Operator', phone: '+91-97xxx-XXXX' },
    location: { ...delhiLocations.laxmiNagar },
    riskScore: 91, tags: ['high-value-target', 'cross-border', 'surveillance']
  },
  {
    id: 'P-003', type: 'person', name: 'Anita Sharma',
    properties: { alias: 'AS', age: 38, nationality: 'Indian', occupation: 'Govt Official', department: 'MCD', phone: '+91-99xxx-XXXX' },
    location: { ...delhiLocations.connaughtPlace },
    riskScore: 45, tags: ['corruption-watch', 'internal-affairs']
  },
  {
    id: 'P-004', type: 'person', name: 'Deepak Tyagi',
    properties: { alias: 'DT', age: 29, nationality: 'Indian', occupation: 'Cyber Analyst', phone: '+91-88xxx-XXXX' },
    location: { ...delhiLocations.noidaSec62 },
    riskScore: 22, tags: ['witness', 'cooperative']
  },
  {
    id: 'P-005', type: 'person', name: 'Farhan Siddiqui',
    properties: { alias: 'FS', age: 44, nationality: 'Indian', occupation: 'Import/Export', phone: '+91-70xxx-XXXX' },
    location: { ...delhiLocations.chandniChowk },
    riskScore: 85, tags: ['surveillance', 'customs-alert', 'financial-irregularity']
  },
  {
    id: 'P-006', type: 'person', name: 'Meera Kapoor',
    properties: { alias: 'MK', age: 31, nationality: 'Indian', occupation: 'Journalist', outlet: 'NDTV', phone: '+91-98xxx-XXXX' },
    location: { ...delhiLocations.saket },
    riskScore: 15, tags: ['media-contact', 'cleared']
  },
  {
    id: 'P-007', type: 'person', name: 'Suresh Kalmadi',
    properties: { alias: 'SK', age: 55, nationality: 'Indian', occupation: 'Real Estate Developer', phone: '+91-98xxx-XXXX' },
    location: { ...delhiLocations.dwarka },
    riskScore: 67, tags: ['financial-irregularity', 'land-fraud']
  },
  {
    id: 'P-008', type: 'person', name: 'Priya Nair',
    properties: { alias: 'PN', age: 33, nationality: 'Indian', occupation: 'Bank Manager', bank: 'SBI Janakpuri', phone: '+91-80xxx-XXXX' },
    location: { ...delhiLocations.pitampura },
    riskScore: 52, tags: ['financial-monitoring', 'suspicious-transactions']
  },
  // Locations
  {
    id: 'L-001', type: 'location', name: 'Warehouse Complex - Ghaziabad',
    properties: { classification: 'industrial', ownership: 'disputed', lastInspected: '2026-05-20' },
    location: { ...delhiLocations.ghaziabad },
    riskScore: 72, tags: ['raid-target', 'contraband-suspected']
  },
  {
    id: 'L-002', type: 'location', name: 'Safe House - Jamia Nagar',
    properties: { classification: 'residential', ownership: 'rented', occupancy: '3-5 persons' },
    location: { lat: 28.5680, lng: 77.2900, address: 'Jamia Nagar, Okhla, Delhi' },
    riskScore: 88, tags: ['surveillance', 'high-value-target', 'raid-pending']
  },
  {
    id: 'L-003', type: 'location', name: 'Import Office - Chandni Chowk',
    properties: { classification: 'commercial', ownership: 'Siddiqui Imports LLC', registered: '2019' },
    location: { ...delhiLocations.chandniChowk },
    riskScore: 65, tags: ['customs-alert', 'financial-irregularity']
  },
  {
    id: 'L-004', type: 'location', name: 'IGI Airport Cargo Terminal',
    properties: { classification: 'transport-hub', throughput: '4500 tons/month', securityLevel: 'high' },
    location: { lat: 28.5627, lng: 77.1180, address: 'Cargo Terminal, IGI Airport' },
    riskScore: 40, tags: ['monitoring', 'customs-alert']
  },
  // Vehicles
  {
    id: 'V-001', type: 'vehicle', name: 'DL-3C-AX-7842',
    properties: { make: 'Toyota', model: 'Innova', color: 'White', owner: 'Vikram Malhotra', registration: 'DL-3C-AX-7842' },
    location: { ...delhiLocations.gurgaonHub },
    riskScore: 55, tags: ['tracked', 'POI-vehicle']
  },
  {
    id: 'V-002', type: 'vehicle', name: 'UP-16-T-9054',
    properties: { make: 'Tata', model: 'Ace', color: 'Yellow', owner: 'Rashid Qureshi', registration: 'UP-16-T-9054' },
    location: { ...delhiLocations.laxmiNagar },
    riskScore: 78, tags: ['tracked', 'high-value-target', 'frequent-border-crossing']
  },
  {
    id: 'V-003', type: 'vehicle', name: 'HR-26-AB-1234',
    properties: { make: 'Hyundai', model: 'Creta', color: 'Black', owner: 'Suresh Kalmadi', registration: 'HR-26-AB-1234' },
    location: { ...delhiLocations.cyberHub },
    riskScore: 35, tags: ['tracked']
  },
  // Organizations
  {
    id: 'O-001', type: 'organization', name: 'Siddiqui Imports LLC',
    properties: { incorporated: '2019', revenue: '₹45Cr', employees: 28, directors: ['Farhan Siddiqui', 'Vikram Malhotra'], pan: 'AABCS****K' },
    location: { ...delhiLocations.chandniChowk },
    riskScore: 82, tags: ['customs-alert', 'financial-irregularity', 'shell-company-suspected']
  },
  {
    id: 'O-002', type: 'organization', name: 'NCR Transport Syndicate',
    properties: { incorporated: '2015', revenue: '₹120Cr', employees: 450, keyPersons: ['Rashid Qureshi'], pan: 'AABNT****P' },
    location: { ...delhiLocations.laxmiNagar },
    riskScore: 75, tags: ['surveillance', 'cross-border']
  },
  {
    id: 'O-003', type: 'organization', name: 'Delhi Infrastructure Corp',
    properties: { incorporated: '2012', revenue: '₹500Cr', employees: 1200, keyPersons: ['Anita Sharma', 'Suresh Kalmadi'], pan: 'AACDI****R' },
    location: { ...delhiLocations.connaughtPlace },
    riskScore: 58, tags: ['corruption-watch', 'land-fraud']
  },
  // Events
  {
    id: 'E-001', type: 'event', name: 'Cargo Shipment - 14 Tons Electronics',
    properties: { origin: 'Dubai', destination: 'IGI Airport', customsCleared: false, value: '₹8.5Cr', handler: 'Siddiqui Imports' },
    location: { ...delhiLocations.airportDEL },
    timestamp: '2026-06-15T14:30:00+05:30',
    riskScore: 70, tags: ['customs-alert', 'contraband-suspected']
  },
  {
    id: 'E-002', type: 'event', name: 'Large Cash Deposit - SBI Janakpuri',
    properties: { amount: '₹2.4Cr', account: 'XXXX-XXXX-4521', branch: 'SBI Janakpuri', flag: 'STR Filed' },
    location: { ...delhiLocations.pitampura },
    timestamp: '2026-06-14T11:15:00+05:30',
    riskScore: 65, tags: ['financial-irregularity', 'suspicious-transactions']
  },
  {
    id: 'E-003', type: 'event', name: 'Interstate Movement - UP Border Check',
    properties: { vehicle: 'UP-16-T-9054', checkpoint: 'Ghazipur Border', cargo: 'Unlisted', passengers: 2 },
    location: { lat: 28.6300, lng: 77.3200, address: 'Ghazipur Border, Delhi-UP' },
    timestamp: '2026-06-15T22:45:00+05:30',
    riskScore: 80, tags: ['cross-border', 'high-value-target']
  },
  {
    id: 'E-004', type: 'event', name: 'Property Registration - Dwarka Sector 21',
    properties: { plotArea: '500 sqyd', value: '₹12Cr', buyer: 'Shell Corp Ltd', seller: 'Delhi Infrastructure Corp', registrar: 'Anita Sharma (witness)' },
    location: { ...delhiLocations.dwarka },
    timestamp: '2026-06-13T16:00:00+05:30',
    riskScore: 72, tags: ['land-fraud', 'corruption-watch']
  },
  // Communications
  {
    id: 'C-001', type: 'communication', name: 'Phone Intercept - Malhotra → Qureshi',
    properties: { duration: '4m 32s', type: 'voice', summary: 'Discussion of "shipment arrival" and "warehouse clearance"', classification: 'SECRET' },
    timestamp: '2026-06-15T20:15:00+05:30',
    riskScore: 88, tags: ['intercept', 'high-value-target']
  },
  {
    id: 'C-002', type: 'communication', name: 'Email - Siddiqui Imports → Dubai Trading Co',
    properties: { subject: 'Invoice #4482 - Revised Quantities', attachments: 3, classification: 'RESTRICTED' },
    timestamp: '2026-06-14T09:30:00+05:30',
    riskScore: 62, tags: ['customs-alert', 'financial-irregularity']
  },
  {
    id: 'C-003', type: 'communication', name: 'WhatsApp Group - "Project Alpha"',
    properties: { members: 7, messages: 234, keyPhrases: ['delivery next week', 'old place', 'new route'], classification: 'SECRET' },
    timestamp: '2026-06-15T18:00:00+05:30',
    riskScore: 90, tags: ['intercept', 'high-value-target', 'encrypted']
  },
  // Financial
  {
    id: 'F-001', type: 'financial', name: 'Hawala Transfer - ₹3.2Cr',
    properties: { source: 'Delhi', destination: 'Dubai', hawalaOperator: 'Unknown', method: 'hawala', status: 'traced' },
    location: { ...delhiLocations.chandniChowk },
    timestamp: '2026-06-12T15:00:00+05:30',
    riskScore: 92, tags: ['hawala', 'high-value-target', 'cross-border']
  },
  {
    id: 'F-002', type: 'financial', name: 'Property Payment - Shell Corp → DIC',
    properties: { amount: '₹6Cr', method: 'bank-transfer', bank: 'HDFC', flagged: true },
    location: { ...delhiLocations.dwarka },
    timestamp: '2026-06-11T10:00:00+05:30',
    riskScore: 68, tags: ['land-fraud', 'financial-irregularity']
  },
];

// ─── LINKS / RELATIONSHIPS ────────────────────────────────────────
export const links: Link[] = [
  { id: 'LK-001', source: 'P-001', target: 'P-002', type: 'communicates_with', properties: { frequency: 'high', lastContact: '2026-06-15' }, weight: 0.9 },
  { id: 'LK-002', source: 'P-001', target: 'O-001', type: 'director_of', weight: 0.8 },
  { id: 'LK-003', source: 'P-002', target: 'O-002', type: 'operates', weight: 0.85 },
  { id: 'LK-004', source: 'P-002', target: 'V-002', type: 'owns', weight: 0.7 },
  { id: 'LK-005', source: 'P-001', target: 'V-001', type: 'owns', weight: 0.7 },
  { id: 'LK-006', source: 'P-005', target: 'O-001', type: 'director_of', weight: 0.8 },
  { id: 'LK-007', source: 'O-001', target: 'E-001', type: 'involved_in', properties: { role: 'importer' }, weight: 0.9 },
  { id: 'LK-008', source: 'E-001', target: 'L-004', type: 'arrives_at', weight: 0.6 },
  { id: 'LK-009', source: 'P-002', target: 'L-002', type: 'frequents', properties: { visitCount: 14 }, weight: 0.75 },
  { id: 'LK-010', source: 'P-001', target: 'P-005', type: 'business_partner', weight: 0.85 },
  { id: 'LK-011', source: 'P-003', target: 'O-003', type: 'employee_of', weight: 0.5 },
  { id: 'LK-012', source: 'P-007', target: 'O-003', type: 'director_of', weight: 0.7 },
  { id: 'LK-013', source: 'O-003', target: 'E-004', type: 'party_to', weight: 0.8 },
  { id: 'LK-014', source: 'P-003', target: 'E-004', type: 'witnessed', weight: 0.6 },
  { id: 'LK-015', source: 'P-008', target: 'E-002', type: 'processed', weight: 0.7 },
  { id: 'LK-016', source: 'F-001', target: 'P-005', type: 'beneficiary', weight: 0.9 },
  { id: 'LK-017', source: 'F-001', target: 'P-001', type: 'originator', weight: 0.85 },
  { id: 'LK-018', source: 'C-001', target: 'P-001', type: 'involves', weight: 0.8 },
  { id: 'LK-019', source: 'C-001', target: 'P-002', type: 'involves', weight: 0.8 },
  { id: 'LK-020', source: 'C-003', target: 'P-002', type: 'involves', weight: 0.85 },
  { id: 'LK-021', source: 'L-001', target: 'O-002', type: 'used_by', weight: 0.6 },
  { id: 'LK-022', source: 'V-002', target: 'E-003', type: 'vehicle_in', weight: 0.9 },
  { id: 'LK-023', source: 'P-007', target: 'V-003', type: 'owns', weight: 0.5 },
  { id: 'LK-024', source: 'F-002', target: 'O-003', type: 'paid_to', weight: 0.7 },
  { id: 'LK-025', source: 'P-004', target: 'C-003', type: 'analyzed', weight: 0.3 },
  { id: 'LK-026', source: 'P-005', target: 'L-003', type: 'owns', weight: 0.7 },
  { id: 'LK-027', source: 'P-005', target: 'C-002', type: 'sent', weight: 0.75 },
  { id: 'LK-028', source: 'P-006', target: 'O-003', type: 'investigating', weight: 0.4 },
  { id: 'LK-029', source: 'P-002', target: 'P-005', type: 'communicates_with', properties: { frequency: 'medium' }, weight: 0.6 },
  { id: 'LK-030', source: 'L-002', target: 'E-003', type: 'origin_of', weight: 0.75 },
];

// ─── ALERTS ───────────────────────────────────────────────────────
export const alerts: Alert[] = [
  {
    id: 'ALT-001', severity: 'critical',
    title: 'Cross-Border Movement Detected - Rashid Qureshi',
    description: 'Vehicle UP-16-T-9054 crossed Ghazipur border at 22:45. Cargo manifest unlisted. Previously flagged for contraband association.',
    timestamp: '2026-06-15T22:45:00+05:30',
    location: { lat: 28.6300, lng: 77.3200 },
    entityId: 'P-002', acknowledged: false
  },
  {
    id: 'ALT-002', severity: 'critical',
    title: 'Hawala Network Identified - ₹3.2Cr Traced',
    description: 'Large hawala transfer traced from Chandni Chowk network to Dubai. Links to Siddiqui Imports and Vikram Malhotra confirmed.',
    timestamp: '2026-06-12T15:00:00+05:30',
    location: delhiLocations.chandniChowk,
    entityId: 'F-001', acknowledged: false
  },
  {
    id: 'ALT-003', severity: 'high',
    title: 'Encrypted Group Chat Decrypted - "Project Alpha"',
    description: 'WhatsApp group with 7 members, 234 messages. Key phrases suggest coordinated smuggling operation. Rashid Qureshi confirmed participant.',
    timestamp: '2026-06-15T18:00:00+05:30',
    entityId: 'C-003', acknowledged: false
  },
  {
    id: 'ALT-004', severity: 'high',
    title: 'Uncleared Cargo at IGI - 14 Tons Electronics',
    description: 'Shipment from Dubai flagged by customs analytics. Value discrepancy detected (declared ₹2.1Cr vs estimated ₹8.5Cr). Siddiqui Imports is consignee.',
    timestamp: '2026-06-15T14:30:00+05:30',
    location: delhiLocations.airportDEL,
    entityId: 'E-001', acknowledged: true
  },
  {
    id: 'ALT-005', severity: 'high',
    title: 'Suspicious Property Registration - Dwarka Sector 21',
    description: '₹12Cr property sold to shell company. Delhi Infrastructure Corp is seller. Anita Sharma (MCD) witnessed registration. Potential quid pro quo.',
    timestamp: '2026-06-13T16:00:00+05:30',
    location: delhiLocations.dwarka,
    entityId: 'E-004', acknowledged: false
  },
  {
    id: 'ALT-006', severity: 'medium',
    title: 'Large Cash Deposit - STR Filed - SBI Janakpuri',
    description: '₹2.4Cr cash deposit flagged by SBI. Suspicious Transaction Report filed. Account linked to network under surveillance.',
    timestamp: '2026-06-14T11:15:00+05:30',
    location: delhiLocations.pitampura,
    entityId: 'E-002', acknowledged: true
  },
  {
    id: 'ALT-007', severity: 'medium',
    title: 'Phone Intercept - Malhotra ↔ Qureshi',
    description: 'Monitored call discusses "shipment arrival" and "warehouse clearance". 4m 32s duration. Classification: SECRET.',
    timestamp: '2026-06-15T20:15:00+05:30',
    entityId: 'C-001', acknowledged: false
  },
  {
    id: 'ALT-008', severity: 'low',
    title: 'Media Inquiry - NDTV Journalist Probing DIC',
    description: 'Meera Kapoor (NDTV) making inquiries about Delhi Infrastructure Corp land deals. May complicate ongoing investigation.',
    timestamp: '2026-06-14T14:00:00+05:30',
    entityId: 'P-006', acknowledged: true
  },
];

// ─── DELHI NCR MAP BOUNDS ─────────────────────────────────────────
export const delhiNCRBounds = {
  southWest: { lat: 28.35, lng: 76.85 },
  northEast: { lat: 28.90, lng: 77.55 },
};

export const delhiNCRCenter = { lat: 28.6139, lng: 77.2090 };

// ─── SECTOR/POLICE DISTRICT BOUNDARIES (simplified) ───────────────
export const policeDistricts = [
  { id: 'PD-CENTRAL', name: 'Central District', center: { lat: 28.6450, lng: 77.2200 }, stations: 12 },
  { id: 'PD-SOUTH', name: 'South District', center: { lat: 28.5200, lng: 77.2100 }, stations: 10 },
  { id: 'PD-WEST', name: 'West District', center: { lat: 28.6200, lng: 77.0900 }, stations: 11 },
  { id: 'PD-NORTH', name: 'North District', center: { lat: 28.7100, lng: 77.2000 }, stations: 9 },
  { id: 'PD-EAST', name: 'East District', center: { lat: 28.6300, lng: 77.3000 }, stations: 10 },
  { id: 'PD-NE', name: 'North-East District', center: { lat: 28.6800, lng: 77.2800 }, stations: 8 },
  { id: 'PD-NW', name: 'North-West District', center: { lat: 28.7300, lng: 77.1200 }, stations: 10 },
  { id: 'PD-SW', name: 'South-West District', center: { lat: 28.5600, lng: 77.0800 }, stations: 9 },
  { id: 'PD-OUTER', name: 'Outer District', center: { lat: 28.7700, lng: 77.0600 }, stations: 8 },
  { id: 'PD-GURUGRAM', name: 'Gurugram Police', center: { lat: 28.4600, lng: 77.0300 }, stations: 14 },
  { id: 'PD-NOIDA', name: 'Noida Police', center: { lat: 28.5700, lng: 77.3200 }, stations: 12 },
  { id: 'PD-GHAZIABAD', name: 'Ghaziabad Police', center: { lat: 28.6700, lng: 77.4500 }, stations: 10 },
  { id: 'PD-FARIDABAD', name: 'Faridabad Police', center: { lat: 28.4100, lng: 77.3200 }, stations: 9 },
];

// ─── STATISTICS ───────────────────────────────────────────────────
export const dashboardStats = {
  totalEntities: entities.length,
  activeAlerts: alerts.filter(a => !a.acknowledged).length,
  criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
  personsOfInterest: entities.filter(e => e.type === 'person' && (e.riskScore ?? 0) > 70).length,
  locationsMonitored: entities.filter(e => e.type === 'location').length,
  linksTraced: links.length,
  communicationsIntercepted: entities.filter(e => e.type === 'communication').length,
  financialAnomalies: entities.filter(e => e.type === 'financial').length,
  riskDistribution: {
    critical: entities.filter(e => (e.riskScore ?? 0) >= 80).length,
    high: entities.filter(e => (e.riskScore ?? 0) >= 60 && (e.riskScore ?? 0) < 80).length,
    medium: entities.filter(e => (e.riskScore ?? 0) >= 40 && (e.riskScore ?? 0) < 60).length,
    low: entities.filter(e => (e.riskScore ?? 0) < 40).length,
  },
  recentActivity: [
    { time: '22:45', event: 'Cross-border movement - Qureshi vehicle', severity: 'critical' },
    { time: '20:15', event: 'Phone intercept - Malhotra ↔ Qureshi', severity: 'high' },
    { time: '18:00', event: 'Encrypted group "Project Alpha" decrypted', severity: 'high' },
    { time: '14:30', event: 'Cargo flagged at IGI Airport', severity: 'high' },
    { time: '11:15', event: 'STR filed - SBI Janakpuri', severity: 'medium' },
    { time: '09:30', event: 'Email intercept - Siddiqui Imports', severity: 'medium' },
  ],
};
