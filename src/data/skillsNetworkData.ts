export interface NetworkDomain {
  id: string;
  name: string;
  angle: number; // in radians
  color: string;
}

export interface NetworkRole {
  id: string;
  name: string;
  domainId: string;
  era: number; // 1, 2, 3, or 4
  distanceFactor: number; // 0.35 to 0.75 from center
  category: 'obsolescent' | 'transformed' | 'emergent' | 'enduring';
  physicalLoad: number; // 0-100
  cognitiveLoad: number; // 0-100
  displacingTech: string;
  tasks: {
    name: string;
    status: 'replaced' | 'hybrid' | 'created' | 'enduring';
    score: number; // 0-100 exposure/coverage
  }[];
}

export const NETWORK_DOMAINS: NetworkDomain[] = [
  { id: 'manufacturing', name: 'Industrial & Mechanical Trades', angle: 0.1, color: '#f97316' },
  { id: 'computation', name: 'Computer, Data & AI Systems', angle: 0.7, color: '#38bdf8' },
  { id: 'transport', name: 'Logistics, Transport & Ops', angle: 1.35, color: '#fb923c' },
  { id: 'creative', name: 'Arts, Media & Design', angle: 2.0, color: '#60a5fa' },
  { id: 'admin', name: 'Sales, Office & Financial Admin', angle: 2.65, color: '#f59e0b' },
  { id: 'healthcare', name: 'Healthcare & Clinical Science', angle: 3.3, color: '#2dd4bf' },
  { id: 'engineering', name: 'Architecture & Civil Engineering', angle: 3.95, color: '#818cf8' },
  { id: 'governance', name: 'Legal, Ethics & Policy', angle: 4.6, color: '#3b82f6' },
  { id: 'education', name: 'Education & Knowledge Curation', angle: 5.25, color: '#a78bfa' },
  { id: 'trades', name: 'Somatic Crafts & Field Services', angle: 5.9, color: '#fbbf24' },
];

export const NETWORK_ROLES: NetworkRole[] = [
  // Era 1 (1760-1840)
  {
    id: 'weaver',
    name: 'Handloom Weaver',
    domainId: 'manufacturing',
    era: 1,
    distanceFactor: 0.45,
    category: 'obsolescent',
    physicalLoad: 85,
    cognitiveLoad: 40,
    displacingTech: 'Power Loom & steam cam shaft',
    tasks: [
      { name: 'Pedal treadle timing', status: 'replaced', score: 95 },
      { name: 'Manual shuttle flicking', status: 'replaced', score: 98 },
      { name: 'Warp thread repair', status: 'hybrid', score: 50 },
      { name: 'Fabric inspection', status: 'hybrid', score: 40 },
    ],
  },
  {
    id: 'spinner',
    name: 'Drop-Spindle Spinner',
    domainId: 'manufacturing',
    era: 1,
    distanceFactor: 0.65,
    category: 'obsolescent',
    physicalLoad: 75,
    cognitiveLoad: 25,
    displacingTech: 'Spinning Jenny & Mule',
    tasks: [
      { name: 'Fleece drawing by fingers', status: 'replaced', score: 99 },
      { name: 'Spindle whorl twisting', status: 'replaced', score: 95 },
      { name: 'Yarn gauge inspection', status: 'hybrid', score: 60 },
    ],
  },
  {
    id: 'steam-eng',
    name: 'Stationary Steam Engineer',
    domainId: 'manufacturing',
    era: 1,
    distanceFactor: 0.55,
    category: 'emergent',
    physicalLoad: 60,
    cognitiveLoad: 75,
    displacingTech: 'Boulton & Watt Condensing Engine',
    tasks: [
      { name: 'Boiler pressure monitoring', status: 'created', score: 90 },
      { name: 'Governor valve calibration', status: 'created', score: 85 },
      { name: 'Tallow piston seal packing', status: 'created', score: 70 },
      { name: 'Thermodynamic diagnosis', status: 'created', score: 80 },
    ],
  },
  {
    id: 'blacksmith',
    name: 'Village Tool Blacksmith',
    domainId: 'manufacturing',
    era: 1,
    distanceFactor: 0.4,
    category: 'transformed',
    physicalLoad: 80,
    cognitiveLoad: 60,
    displacingTech: 'Slide-Rest Lathes & Industrial Shapers',
    tasks: [
      { name: 'Anvil hammer shaping', status: 'hybrid', score: 45 },
      { name: 'Micrometer slide adjustment', status: 'created', score: 80 },
      { name: 'Case-hardening iron', status: 'hybrid', score: 65 },
    ],
  },
  {
    id: 'millwright',
    name: 'Millwright & Gear Maker',
    domainId: 'trades',
    era: 1,
    distanceFactor: 0.5,
    category: 'enduring',
    physicalLoad: 70,
    cognitiveLoad: 70,
    displacingTech: 'Cast iron gearing replacement',
    tasks: [
      { name: 'Vibration acoustic diagnosis', status: 'enduring', score: 85 },
      { name: 'Timber tooth joinery', status: 'replaced', score: 70 },
      { name: 'Shaft alignment balance', status: 'enduring', score: 90 },
    ],
  },
  {
    id: 'surveyor',
    name: 'Railway Geodetic Surveyor',
    domainId: 'engineering',
    era: 1,
    distanceFactor: 0.6,
    category: 'emergent',
    physicalLoad: 50,
    cognitiveLoad: 85,
    displacingTech: 'Stephenson Locomotive trunk lines',
    tasks: [
      { name: 'Theodolite elevation sight', status: 'created', score: 95 },
      { name: '1:100 Gradient calculation', status: 'created', score: 90 },
      { name: 'Topographical curve leveling', status: 'created', score: 85 },
    ],
  },

  // Era 2 (1870-1914)
  {
    id: 'teamster',
    name: 'Urban Freight Teamster',
    domainId: 'transport',
    era: 2,
    distanceFactor: 0.6,
    category: 'obsolescent',
    physicalLoad: 85,
    cognitiveLoad: 50,
    displacingTech: 'Internal combustion truck & tram',
    tasks: [
      { name: 'Six-horse team management', status: 'replaced', score: 99 },
      { name: 'Wagon brake lever wrenching', status: 'replaced', score: 90 },
      { name: 'Urban route navigation', status: 'hybrid', score: 60 },
      { name: 'Animal fatigue evaluation', status: 'replaced', score: 95 },
    ],
  },
  {
    id: 'linotype',
    name: 'Hand Typesetter & Compositor',
    domainId: 'creative',
    era: 2,
    distanceFactor: 0.5,
    category: 'obsolescent',
    physicalLoad: 60,
    cognitiveLoad: 65,
    displacingTech: 'Mergenthaler Linotype Machine',
    tasks: [
      { name: 'Individual lead type picking', status: 'replaced', score: 98 },
      { name: 'Line justification by spacing', status: 'replaced', score: 95 },
      { name: 'Proof galley inking', status: 'hybrid', score: 65 },
    ],
  },
  {
    id: 'lineman',
    name: 'High-Voltage AC Lineman',
    domainId: 'trades',
    era: 2,
    distanceFactor: 0.65,
    category: 'emergent',
    physicalLoad: 85,
    cognitiveLoad: 80,
    displacingTech: 'Tesla/Westinghouse Polyphase Grid',
    tasks: [
      { name: 'Pole climbing & hot-line work', status: 'created', score: 95 },
      { name: 'Transformer splicing', status: 'created', score: 90 },
      { name: 'Insulator bushing testing', status: 'created', score: 85 },
    ],
  },
  {
    id: 'comptometer',
    name: 'Comptometer & Tabulator Clerk',
    domainId: 'admin',
    era: 2,
    distanceFactor: 0.45,
    category: 'transformed',
    physicalLoad: 40,
    cognitiveLoad: 55,
    displacingTech: 'Key-driven mechanical adding machines',
    tasks: [
      { name: 'Touch-key numeric cadence', status: 'hybrid', score: 80 },
      { name: 'Register clearance check', status: 'created', score: 85 },
      { name: 'Balance audit transcription', status: 'hybrid', score: 70 },
    ],
  },
  {
    id: 'assembly-worker',
    name: 'Moving Line Auto Assembler',
    domainId: 'manufacturing',
    era: 2,
    distanceFactor: 0.7,
    category: 'emergent',
    physicalLoad: 80,
    cognitiveLoad: 25,
    displacingTech: 'Ford Highland Park overhead conveyor',
    tasks: [
      { name: 'Torque cylinder head nuts', status: 'created', score: 95 },
      { name: '45-second takt cycle sync', status: 'created', score: 90 },
      { name: 'Pneumatic tool triggering', status: 'created', score: 85 },
    ],
  },
  {
    id: 'switchboard',
    name: 'PBX Telephone Operator',
    domainId: 'admin',
    era: 2,
    distanceFactor: 0.55,
    category: 'transformed',
    physicalLoad: 55,
    cognitiveLoad: 75,
    displacingTech: 'Automated Western Electric Switchboards',
    tasks: [
      { name: 'Spatial patchboard cord plugging', status: 'created', score: 90 },
      { name: 'Voice directory assistance', status: 'hybrid', score: 65 },
      { name: 'Trunk line routing triage', status: 'created', score: 80 },
    ],
  },

  // Era 3 (1969-2010)
  {
    id: 'stenographer',
    name: 'Typing Pool Stenographer',
    domainId: 'admin',
    era: 3,
    distanceFactor: 0.55,
    category: 'obsolescent',
    physicalLoad: 50,
    cognitiveLoad: 50,
    displacingTech: 'WordStar, MS Word & Office PC',
    tasks: [
      { name: 'Gregg shorthand listening', status: 'replaced', score: 98 },
      { name: 'Manual typewriter carriage pull', status: 'replaced', score: 99 },
      { name: 'Carbon paper filing', status: 'replaced', score: 95 },
    ],
  },
  {
    id: 'drafter',
    name: 'Manual Blueprint Drafter',
    domainId: 'engineering',
    era: 3,
    distanceFactor: 0.5,
    category: 'transformed',
    physicalLoad: 45,
    cognitiveLoad: 80,
    displacingTech: 'Autodesk AutoCAD & CATIA',
    tasks: [
      { name: 'Ink ruling pen line weight', status: 'replaced', score: 95 },
      { name: 'T-Square isometric geometry', status: 'replaced', score: 90 },
      { name: 'Parametric CAD 3D modeling', status: 'created', score: 95 },
      { name: 'Geometric tolerance constraint', status: 'hybrid', score: 85 },
    ],
  },
  {
    id: 'spot-welder',
    name: 'Manual Auto Body Welder',
    domainId: 'manufacturing',
    era: 3,
    distanceFactor: 0.65,
    category: 'obsolescent',
    physicalLoad: 85,
    cognitiveLoad: 35,
    displacingTech: 'Unimate & KUKA Robotic Arm Cells',
    tasks: [
      { name: 'Maneuver 80-lb weld tongs', status: 'replaced', score: 98 },
      { name: 'Visual seam alignment', status: 'replaced', score: 92 },
      { name: 'Robot cell trajectory audit', status: 'created', score: 70 },
    ],
  },
  {
    id: 'software-dev',
    name: 'Full-Stack Software Engineer',
    domainId: 'computation',
    era: 3,
    distanceFactor: 0.45,
    category: 'emergent',
    physicalLoad: 20,
    cognitiveLoad: 90,
    displacingTech: 'Microprocessors, UNIX & Internet',
    tasks: [
      { name: 'Relational SQL schema design', status: 'created', score: 95 },
      { name: 'Object-oriented programming', status: 'created', score: 95 },
      { name: 'API client-server architecture', status: 'created', score: 90 },
      { name: 'Memory pointer debugging', status: 'created', score: 85 },
    ],
  },
  {
    id: 'photolitho',
    name: 'Cleanroom Chip Lithographer',
    domainId: 'computation',
    era: 3,
    distanceFactor: 0.7,
    category: 'emergent',
    physicalLoad: 40,
    cognitiveLoad: 88,
    displacingTech: 'ASML Deep UV stepper lithography',
    tasks: [
      { name: 'Nanometer laser mask alignment', status: 'created', score: 95 },
      { name: 'Chemical vapor wafer etch', status: 'created', score: 90 },
      { name: 'Class-1 particulate yield QA', status: 'created', score: 85 },
    ],
  },
  {
    id: 'bank-teller',
    name: 'Retail Bank Cash Teller',
    domainId: 'admin',
    era: 3,
    distanceFactor: 0.6,
    category: 'transformed',
    physicalLoad: 35,
    cognitiveLoad: 45,
    displacingTech: 'ATMs & Online Core Banking',
    tasks: [
      { name: 'Cash counting & stamping', status: 'replaced', score: 92 },
      { name: 'Passbook reconciliation', status: 'replaced', score: 95 },
      { name: 'Client relationship advising', status: 'hybrid', score: 75 },
    ],
  },

  // Era 4 (2017-Present & Future)
  {
    id: 'junior-dev',
    name: 'Routine Syntax Coder',
    domainId: 'computation',
    era: 4,
    distanceFactor: 0.6,
    category: 'obsolescent',
    physicalLoad: 15,
    cognitiveLoad: 65,
    displacingTech: 'Generative AI Coding Models & Agents',
    tasks: [
      { name: 'Writing REST boilerplate', status: 'replaced', score: 90 },
      { name: 'Memorizing regex syntax', status: 'replaced', score: 95 },
      { name: 'Scaffolding unit tests', status: 'replaced', score: 88 },
      { name: 'CSS layout debugging', status: 'hybrid', score: 65 },
    ],
  },
  {
    id: 'agent-architect',
    name: 'AI Agent & Context Architect',
    domainId: 'computation',
    era: 4,
    distanceFactor: 0.35,
    category: 'emergent',
    physicalLoad: 10,
    cognitiveLoad: 95,
    displacingTech: 'Multi-agent frameworks & Foundation APIs',
    tasks: [
      { name: 'Prompt invariant verification', status: 'created', score: 95 },
      { name: 'Vector embedding graph design', status: 'created', score: 90 },
      { name: 'Agent tool-call orchestration', status: 'created', score: 95 },
      { name: 'Security jailbreak red-teaming', status: 'created', score: 90 },
    ],
  },
  {
    id: 'paralegal',
    name: 'Discovery Document Reviewer',
    domainId: 'governance',
    era: 4,
    distanceFactor: 0.65,
    category: 'obsolescent',
    physicalLoad: 15,
    cognitiveLoad: 60,
    displacingTech: 'Long-context LLMs & RAG Engines',
    tasks: [
      { name: 'Clause cross-checking', status: 'replaced', score: 92 },
      { name: 'Email disclosure discovery', status: 'replaced', score: 90 },
      { name: 'Jurisprudential risk audit', status: 'hybrid', score: 65 },
    ],
  },
  {
    id: 'radiologist',
    name: 'Multimodal Clinical Arbiter',
    domainId: 'healthcare',
    era: 4,
    distanceFactor: 0.45,
    category: 'transformed',
    physicalLoad: 30,
    cognitiveLoad: 95,
    displacingTech: 'Vision-Language AI Diagnostic Heatmaps',
    tasks: [
      { name: '2D pixel scanning for nodules', status: 'hybrid', score: 85 },
      { name: 'Multi-omic cancer board synthesis', status: 'created', score: 90 },
      { name: 'Bedside patient risk consultation', status: 'enduring', score: 95 },
      { name: 'Malpractice liability judgment', status: 'enduring', score: 99 },
    ],
  },
  {
    id: 'electrician',
    name: 'Master Residential Electrician',
    domainId: 'trades',
    era: 4,
    distanceFactor: 0.4,
    category: 'enduring',
    physicalLoad: 80,
    cognitiveLoad: 80,
    displacingTech: 'Immune to LLM software (Moravec Paradox)',
    tasks: [
      { name: 'Crawl space knob-and-tube rewire', status: 'enduring', score: 98 },
      { name: 'Tactile blind wire snake pull', status: 'enduring', score: 95 },
      { name: 'Dynamic thermal overload triage', status: 'enduring', score: 90 },
      { name: 'Historic structure code fitting', status: 'enduring', score: 92 },
    ],
  },
  {
    id: 'hospice-nurse',
    name: 'Palliative Care Physician/Nurse',
    domainId: 'healthcare',
    era: 4,
    distanceFactor: 0.35,
    category: 'enduring',
    physicalLoad: 65,
    cognitiveLoad: 85,
    displacingTech: 'AI lacks mortal vulnerability & genuine empathy',
    tasks: [
      { name: 'Active grief companioning', status: 'enduring', score: 99 },
      { name: 'Pain titration tactile sensing', status: 'enduring', score: 95 },
      { name: 'Family existential mediation', status: 'enduring', score: 98 },
    ],
  },
  {
    id: 'synbio-designer',
    name: 'Synthetic Protein Engineer',
    domainId: 'healthcare',
    era: 4,
    distanceFactor: 0.7,
    category: 'emergent',
    physicalLoad: 25,
    cognitiveLoad: 95,
    displacingTech: 'AlphaFold & Generative Molecular Diffusers',
    tasks: [
      { name: 'De novo antibody backbone design', status: 'created', score: 95 },
      { name: 'Enzyme active site optimization', status: 'created', score: 90 },
      { name: 'Wet-lab bioprinting verification', status: 'created', score: 85 },
    ],
  },
  {
    id: 'creative-director',
    name: 'Context & Provenance Curator',
    domainId: 'creative',
    era: 4,
    distanceFactor: 0.4,
    category: 'transformed',
    physicalLoad: 15,
    cognitiveLoad: 90,
    displacingTech: 'Generative Diffusion & Foundation Media',
    tasks: [
      { name: 'Synthetic media art direction', status: 'created', score: 90 },
      { name: 'Brand voice embedding alignment', status: 'created', score: 88 },
      { name: 'Authentic human origin provenance', status: 'enduring', score: 95 },
    ],
  },
];

// Timeline stream data points from 1760 to 2030 (every decade or era milestone)
export interface StreamDataPoint {
  year: number;
  label: string;
  era: number;
  obsolescent: number; // percentage of human skill tasks
  transformed: number;
  emergent: number;
  enduring: number;
  shockEvent: string;
}

export const STREAM_DATA: StreamDataPoint[] = [
  { year: 1760, label: '1760', era: 1, obsolescent: 5, transformed: 10, emergent: 5, enduring: 80, shockEvent: 'Cottage craft equilibrium' },
  { year: 1785, label: '1785', era: 1, obsolescent: 22, transformed: 18, emergent: 15, enduring: 45, shockEvent: 'Cartwright Power Loom & Watt Engine' },
  { year: 1815, label: '1815', era: 1, obsolescent: 35, transformed: 25, emergent: 20, enduring: 20, shockEvent: 'Luddite uprisings; textile factory concentration' },
  { year: 1840, label: '1840', era: 1, obsolescent: 28, transformed: 32, emergent: 25, enduring: 15, shockEvent: 'Trunk railway boom & steam foundries' },
  { year: 1870, label: '1870', era: 2, obsolescent: 18, transformed: 30, emergent: 35, enduring: 17, shockEvent: 'Bessemer steel & telegraph networks' },
  { year: 1895, label: '1895', era: 2, obsolescent: 32, transformed: 33, emergent: 22, enduring: 13, shockEvent: 'Electrification grid & chemical synthesis' },
  { year: 1914, label: '1914', era: 2, obsolescent: 40, transformed: 28, emergent: 22, enduring: 10, shockEvent: 'Ford moving assembly line & $5-a-day' },
  { year: 1940, label: '1940', era: 2, obsolescent: 20, transformed: 38, emergent: 32, enduring: 10, shockEvent: 'Industrial wartime mobilization & aviation' },
  { year: 1969, label: '1969', era: 3, obsolescent: 15, transformed: 35, emergent: 40, enduring: 10, shockEvent: 'Microprocessor birth (Intel 4004) & ARPANET' },
  { year: 1985, label: '1985', era: 3, obsolescent: 34, transformed: 32, emergent: 24, enduring: 10, shockEvent: 'PC revolution & typing pool evaporation' },
  { year: 2000, label: '2000', era: 3, obsolescent: 38, transformed: 30, emergent: 23, enduring: 9, shockEvent: 'Internet, relational ERP & dot-com surge' },
  { year: 2012, label: '2012', era: 3, obsolescent: 24, transformed: 42, emergent: 25, enduring: 9, shockEvent: 'Smartphones & Cloud hyperscaling' },
  { year: 2020, label: '2020', era: 4, obsolescent: 18, transformed: 44, emergent: 28, enduring: 10, shockEvent: 'Deep Learning & Transformer architectures' },
  { year: 2024, label: '2024', era: 4, obsolescent: 36, transformed: 34, emergent: 19, enduring: 11, shockEvent: 'Generative AI & LLM autonomous agent shock' },
  { year: 2030, label: '2030 (Proj)', era: 4, obsolescent: 42, transformed: 25, emergent: 20, enduring: 13, shockEvent: 'Embodied robotics & cognitive agent synthesis' },
];
