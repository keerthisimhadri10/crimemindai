import { CrimeRecord } from '../types';

const DISTRICTS_CONFIG = [
  { name: 'Mysuru', lat: 12.2958, lng: 76.6394, areas: ['Gokulam', 'Vijayanagar', 'Saraswathipuram', 'Devaraja Market', 'Nazarbad', 'Jayalakshmipuram', 'Kuvempunagar', 'Hebbal'] },
  { name: 'Bengaluru East', lat: 12.9716, lng: 77.6412, areas: ['Indiranagar', 'Koramangala', 'CV Raman Nagar', 'HAL Old Airport Rd', 'Domlur', 'Banaswadi', 'Kasturi Nagar'] },
  { name: 'Bengaluru West', lat: 12.9784, lng: 77.5612, areas: ['Rajajinagar', 'Malleshwaram', 'Vijayanagar', 'Basaveshwaranagar', 'Yeshwanthpur', 'Mahalakshmi Layout'] },
  { name: 'Whitefield', lat: 12.9698, lng: 77.7499, areas: ['ITPB Main Rd', 'Kadugodi', 'EPIP Zone', 'Varthur', 'Channasandra', 'Hoodi', 'Brookefield'] },
  { name: 'Mangaluru', lat: 12.9141, lng: 74.8560, areas: ['Panambur', 'Hampankatta', 'Kadri', 'Bejai', 'Surathkal', 'Urwa', 'Kodialbail'] },
  { name: 'Hubballi', lat: 15.3647, lng: 75.1240, areas: ['Gokul Road', 'Vidyanagar', 'Keshwapur', 'Old Hubli', 'Navanagar', 'Unkal'] },
  { name: 'Belagavi', lat: 15.8497, lng: 74.4977, areas: ['Tilakwadi', 'Shahapur', 'Camp Area', 'Vadgaon', 'Udyambag', 'Khanapur Road'] },
  { name: 'Kalaburagi', lat: 17.3297, lng: 76.8343, areas: ['Super Market', 'MSK Mill Rd', 'Sedam Road', 'Ring Road', 'GDA Layout'] },
  { name: 'Udupi', lat: 13.3409, lng: 74.7421, areas: ['Manipal', 'Malpe', 'Kalsanka', 'Santhekatte', 'Udyavara'] },
  { name: 'Shivamogga', lat: 13.9299, lng: 75.5681, areas: ['Vinoba Nagar', 'Jayanagar', 'Sagar Road', 'Gopala', 'Savlanga Road'] }
];

const CRIME_TYPES = [
  'House Burglary',
  'Armed Robbery',
  'Vehicle Theft',
  'Chain Snatching',
  'Cyber Fraud',
  'Narcotics Trafficking',
  'Assault & Extortion',
  'Commercial Heist'
];

const OFFICERS = [
  'Inspector R. Naik',
  'ACP S. Patil',
  'Inspector M. Gowda',
  'Sub-Inspector K. Rao',
  'Inspector V. Shettar',
  'ACP Divya Murthy',
  'Inspector Anand Kumar',
  'Sub-Inspector Rajesh V'
];

const SUSPECT_GANGS = [
  { name: 'Ravi @ Blackie', phone: '+91-9845012389', vehicle: 'Black Bajaj Pulsar KA-09-EX-4421', weapon: 'Iron Crowbar', associates: ['Pasha', 'Munna @ Snake'] },
  { name: 'Suresh Reddy Gang', phone: '+91-9740123984', vehicle: 'White Swift KA-04-MB-8802', weapon: 'Country Pistol', associates: ['Kiran Kumar', 'Ramesh V'] },
  { name: 'Imran Khan @ Bullet', phone: '+91-9900223344', vehicle: 'Red Honda Activa KA-03-HJ-1129', weapon: 'Machete', associates: ['Salim Pasha', 'Zubair'] },
  { name: 'Vicky @ Phantom', phone: '+91-9880112233', vehicle: 'Blue TVS Apache KA-01-EQ-9012', weapon: 'Digital Malware Toolkit', associates: ['Deepak S', 'Rahul M'] },
  { name: 'Unknown Motorcycle Syndicate', phone: '+91-9448001122', vehicle: 'Black Bajaj Pulsar KA-09-EX-4421', weapon: 'Lever Cutter', associates: ['Ravi @ Blackie', 'Unknown Rider'] },
  { name: 'Srinivas @ Scorpion', phone: '+91-9108992211', vehicle: 'Dark Grey KTM Duke KA-05-JL-3001', weapon: 'Razor Blade', associates: ['Ganesh', 'Manju'] }
];

const VICTIM_TYPES = [
  'Jewellery Palace',
  'Anand Traders',
  'Priya Sharma (IT Executive)',
  'TechCorp ATM Kiosk',
  'Sangeetha Mobiles Store',
  'Dr. Hegde Clinic & Residence',
  'Canara Bank Extension',
  'Sri Laxmi Silks',
  'Vijay Electricals Warehouse',
  'Resident Community Apartment'
];

const EVIDENCE_POOL = [
  'CCTV Footage (HD 1080p)',
  'Fingerprint Match on Glass Surface',
  'CDR Location Triangulation (+/- 50m)',
  'Witness Statement from Security Guard',
  'Tool Marks on Door Frame',
  'Recovered Stolen GPS Tracker Signal',
  'UPI Transaction Trail',
  'Helmet visor reflection scan',
  'ANPR Camera Vehicle Capture'
];

function generateRealisticCrimes(): CrimeRecord[] {
  const records: CrimeRecord[] = [];

  // Seed mandatory story cases for explicit queries
  // Case 102 (Mysuru Burglary)
  records.push({
    id: 'FIR-2026-102',
    crimeType: 'House Burglary',
    district: 'Mysuru',
    area: 'Gokulam',
    latitude: 12.3121,
    longitude: 76.6415,
    date: '2026-06-18',
    time: '22:15',
    suspect: 'Ravi @ Blackie',
    victim: 'Jewellery Palace',
    officer: 'Inspector R. Naik',
    status: 'Under Investigation',
    vehicle: 'Black Bajaj Pulsar KA-09-EX-4421',
    weapon: 'Iron Crowbar',
    phoneNumber: '+91-9845012389',
    knownAssociates: ['Pasha', 'Munna @ Snake'],
    previousFIRCount: 5,
    evidence: ['CCTV Footage (HD 1080p)', 'CDR Location Triangulation (+/- 50m)', 'Tool Marks on Door Frame'],
    severity: 'High',
    description: 'Back-door shutter forced open between 9:30 PM and 10:15 PM. Gold ornaments worth ₹18 Lakhs stolen. Black Pulsar motorcycle spotted on cameras.',
    moduiOperandi: 'Night time back-door shutter breaking using crowbar'
  });

  // Case 148 (Mysuru Jewelry Heist)
  records.push({
    id: 'FIR-2026-148',
    crimeType: 'House Burglary',
    district: 'Mysuru',
    area: 'Vijayanagar',
    latitude: 12.3250,
    longitude: 76.6210,
    date: '2026-06-25',
    time: '21:40',
    suspect: 'Ravi @ Blackie',
    victim: 'Sri Laxmi Silks & Gold',
    officer: 'Inspector R. Naik',
    status: 'Under Investigation',
    vehicle: 'Black Bajaj Pulsar KA-09-EX-4421',
    weapon: 'Iron Crowbar',
    phoneNumber: '+91-9845012389',
    knownAssociates: ['Pasha', 'Munna @ Snake'],
    previousFIRCount: 6,
    evidence: ['Fingerprint Match on Glass Surface', 'ANPR Camera Vehicle Capture'],
    severity: 'Critical',
    description: 'Bypassed secondary latch, disabled CCTV wire, stole ₹24 Lakhs worth silver and cash. Same phone number active near Vijayanagar tower.',
    moduiOperandi: 'Night time back-door shutter breaking using crowbar'
  });

  // Case 209 (Bengaluru East / Whitefield Gang connection)
  records.push({
    id: 'FIR-2026-209',
    crimeType: 'Armed Robbery',
    district: 'Whitefield',
    area: 'ITPB Main Rd',
    latitude: 12.9712,
    longitude: 77.7482,
    date: '2026-07-02',
    time: '23:10',
    suspect: 'Suresh Reddy Gang',
    victim: 'TechCorp ATM Kiosk',
    officer: 'ACP Divya Murthy',
    status: 'Pending Evidence',
    vehicle: 'White Swift KA-04-MB-8802',
    weapon: 'Country Pistol',
    phoneNumber: '+91-9740123984',
    knownAssociates: ['Kiran Kumar', 'Ramesh V', 'Ravi @ Blackie'],
    previousFIRCount: 8,
    evidence: ['CCTV Footage (HD 1080p)', 'Witness Statement from Security Guard'],
    severity: 'Critical',
    description: 'Armed assault on security guard at ATM loading dock. Cash chest tampered with country pistol threat.',
    moduiOperandi: 'Armed dock ambush'
  });

  // Generate remaining ~497 records deterministically
  let count = 210;
  for (let i = 0; i < 497; i++) {
    const dist = DISTRICTS_CONFIG[i % DISTRICTS_CONFIG.length];
    const area = dist.areas[i % dist.areas.length];
    const crimeType = CRIME_TYPES[i % CRIME_TYPES.length];
    const officer = OFFICERS[i % OFFICERS.length];
    const suspectObj = SUSPECT_GANGS[i % SUSPECT_GANGS.length];
    const victim = VICTIM_TYPES[i % VICTIM_TYPES.length];

    // Jitter coordinates slightly around center
    const latOffset = (Math.sin(i * 1.7) * 0.035);
    const lngOffset = (Math.cos(i * 2.3) * 0.035);

    // Dates across past 90 days
    const daysAgo = (i % 90);
    const eventDate = new Date(2026, 6, 20); // July 20, 2026
    eventDate.setDate(eventDate.getDate() - daysAgo);
    const dateStr = eventDate.toISOString().split('T')[0];

    const hour = Math.floor((i * 7) % 24).toString().padStart(2, '0');
    const min = Math.floor((i * 13) % 60).toString().padStart(2, '0');

    const statuses: CrimeRecord['status'][] = ['Under Investigation', 'Solved', 'Charge Sheet Filed', 'Pending Evidence', 'Cold Case'];
    const status = statuses[i % statuses.length];

    const severities: CrimeRecord['severity'][] = ['Low', 'Medium', 'High', 'Critical'];
    const severity = severities[(i + (dist.name === 'Mysuru' || dist.name === 'Bengaluru East' ? 2 : 0)) % severities.length];

    const selectedEvidence = [
      EVIDENCE_POOL[i % EVIDENCE_POOL.length],
      EVIDENCE_POOL[(i + 3) % EVIDENCE_POOL.length]
    ];

    records.push({
      id: `FIR-2026-${count}`,
      crimeType,
      district: dist.name,
      area,
      latitude: parseFloat((dist.lat + latOffset).toFixed(4)),
      longitude: parseFloat((dist.lng + lngOffset).toFixed(4)),
      date: dateStr,
      time: `${hour}:${min}`,
      suspect: suspectObj.name,
      victim: `${victim} (${area})`,
      officer,
      status,
      vehicle: suspectObj.vehicle,
      weapon: suspectObj.weapon,
      phoneNumber: suspectObj.phone,
      knownAssociates: suspectObj.associates,
      previousFIRCount: (i % 7),
      evidence: selectedEvidence,
      severity,
      description: `${crimeType} incident reported in ${area}, ${dist.name}. Involvement of ${suspectObj.vehicle} suspected during ${hour}:${min} hrs.`,
      moduiOperandi: `Pattern analysis indicates ${suspectObj.weapon} used during off-peak hours.`
    });

    count++;
  }

  return records;
}

export const MOCK_CRIME_RECORDS: CrimeRecord[] = generateRealisticCrimes();

export function searchCrimeRecords(query: string, filters?: { district?: string; crimeType?: string; severity?: string }): CrimeRecord[] {
  const q = query.toLowerCase().trim();
  return MOCK_CRIME_RECORDS.filter((r) => {
    if (filters?.district && filters.district !== 'All' && r.district !== filters.district) return false;
    if (filters?.crimeType && filters.crimeType !== 'All' && r.crimeType !== filters.crimeType) return false;
    if (filters?.severity && filters.severity !== 'All' && r.severity !== filters.severity) return false;

    if (!q) return true;

    return (
      r.id.toLowerCase().includes(q) ||
      r.crimeType.toLowerCase().includes(q) ||
      r.district.toLowerCase().includes(q) ||
      r.area.toLowerCase().includes(q) ||
      r.suspect.toLowerCase().includes(q) ||
      r.victim.toLowerCase().includes(q) ||
      r.vehicle.toLowerCase().includes(q) ||
      r.weapon.toLowerCase().includes(q) ||
      r.phoneNumber.toLowerCase().includes(q) ||
      r.officer.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q)
    );
  });
}

export function getCrimeStats() {
  const total = MOCK_CRIME_RECORDS.length;
  const openCases = MOCK_CRIME_RECORDS.filter(r => r.status === 'Under Investigation' || r.status === 'Pending Evidence').length;
  const solved = MOCK_CRIME_RECORDS.filter(r => r.status === 'Solved' || r.status === 'Charge Sheet Filed').length;
  const critical = MOCK_CRIME_RECORDS.filter(r => r.severity === 'Critical').length;

  const repeatOffenders = Array.from(new Set(MOCK_CRIME_RECORDS.map(r => r.suspect)))
    .filter(s => s !== 'Unknown')
    .length;

  // Hotspots count (districts with highest critical/high cases)
  const hotspotsCount = 4; // Mysuru, Bengaluru East, Whitefield, Mangaluru

  return {
    total,
    openCases,
    solved,
    critical,
    repeatOffenders,
    hotspotsCount,
    solveRate: Math.round((solved / total) * 100)
  };
}
