import { EnduringSkill, SynthesisPoint } from '../types/history';

export const COMMON_THREAD_SYNTHESIS: {
  headline: string;
  summary: string;
  points: SynthesisPoint[];
  inversionQuote: string;
} = {
  headline: 'The Cognitive Inversion: Why the AI Shock Breaks Historical Precedent',
  summary:
    'For 250 years, technological revolutions systematically substituted mechanical and computational horsepower for human physical muscle and routine calculation, while human beings steadily migrated up the cognitive hierarchy toward abstract analysis, symbolic reasoning, and creative synthesis. The Fourth Industrial Revolution radically inverts this trajectory: for the first time, automation strikes directly at the apex of cognitive and symbolic work—language, logic, visual creation, and software synthesis—while leaving physical dexterity in unstructured environments remarkably resilient. Unlike steam, electricity, or microprocessors, AI expands at zero marginal reproduction cost, compressing the displacement cycle from generations into months.',
  inversionQuote:
    'Polanyi’s Paradox famously declared: "We know more than we can tell." For centuries, machines could only follow explicit rules. Generative AI fundamentally cracked tacit knowledge in the symbolic domain—it can write poetry and diagnose diseases without explicit rules—yet it still cannot fold a laundry basket or rewire an antique house with the ease of a teenager.',
  points: [
    {
      dimension: 'Target of Displacement',
      eras1to3:
        'Physical labor, musculoskeletal stamina, manual dexterity (Eras 1 & 2), and routine rule-based clerical/computational calculation (Era 3).',
      era4AI:
        'Non-routine symbolic reasoning, natural language synthesis, creative ideation, diagnostic classification, and code generation.',
      economicMechanism:
        'Capital previously substituted for muscle; today, algorithmic intelligence substitutes for high-wage cognitive labor.',
    },
    {
      dimension: 'Class Impact & Wage Hierarchy',
      eras1to3:
        'Displaced working-class artisans and middle-tier clerical workers; amplified the earnings and power of college-educated knowledge elites.',
      era4AI:
        'Compresses the junior knowledge-worker tier first; flattens the premium for routine college credentials while boosting skilled physical trades and elite orchestrators.',
      economicMechanism:
        'Skill-Biased Technological Change (SBTC) has transitioned into Cognitive-Routine Compression.',
    },
    {
      dimension: 'Speed of Diffusion',
      eras1to3:
        'Decades (30–60 years). Depended on heavy physical capital: digging canals, laying iron rails, building dynamos, stringing copper wires.',
      era4AI:
        'Instantaneous (Days to Months). Software foundation models are served via global cloud APIs to billions of connected smartphones and computers immediately.',
      economicMechanism:
        'Zero marginal distribution cost; instantaneous planetary supply-side shock without physical capital deployment bottlenecks.',
    },
    {
      dimension: 'Capital & Infrastructure Monopoly',
      eras1to3:
        'Geographically dispersed mills, national railroad networks, and decentralized personal computers and software companies.',
      era4AI:
        'Hyper-concentrated compute hyperscalers: training frontier models requires tens of billions in specialized chips and gigawatt power grids.',
      economicMechanism:
        'Extreme capital barriers at the frontier model layer, balanced by open-source weight democratization at the consumer edge.',
    },
    {
      dimension: 'The Training & Apprenticeship Ladder',
      eras1to3:
        'Novices entered as apprentices, drafting tracers, or junior ledger clerks, absorbing tacit craft wisdom by doing routine foundation tasks.',
      era4AI:
        'AI eliminates the entry-level tasks that once educated juniors, creating an acute systemic risk: how does a junior become an expert when novices are replaced?',
      economicMechanism:
        'The destruction of the junior cognitive apprenticeship pipeline.',
    },
  ],
};

export const ENDURING_HUMAN_CORE: EnduringSkill[] = [
  {
    id: 'core-1',
    name: 'High-Stakes Ethical Judgment, Responsibility & Governance',
    archetype: 'Moral & Fiduciary Agency',
    whyEnduring:
      'Machines can calculate probabilistic outcomes, but they cannot bear moral culpability, stand trial, or suffer consequences. Accountability in law, medicine, politics, and military command is inherently fiduciary—a contract between conscious human beings.',
    manifestationInEra1:
      'Magistrates and parliamentarians weighing human safety regulations in the first Factory Acts of 1833 against unbridled laissez-faire exploitation.',
    manifestationInEra2:
      'Public utility commissioners and Supreme Court justices arbitrating antitrust breakups (Standard Oil 1911) and child labor prohibitions.',
    manifestationInEra3:
      'Medical ethics boards and corporate governance committees establishing data privacy, informed consent, and nuclear safety protocols.',
    manifestationInEra4:
      'Adjudicating algorithmic lethal autonomous weapons, frontier model existential risk alignment, and judicial sentencing bias audits.',
    aiImmunityRationale:
      'Accountability is socially constituted. A machine cannot be imprisoned, shamed, or sworn to an oath; true liability requires a human bearer.',
  },
  {
    id: 'core-2',
    name: 'Tacit Somatic Dexterity in Unstructured Environments',
    archetype: 'Physical Adaptability (Moravec’s Paradox)',
    whyEnduring:
      'Billions of years of biological evolution perfected sensory-motor coordination across variable terrain, soft materials, and chaotic conditions. Controlled factory robotics succeed only in rigid fixtures; open-world physical flexibility remains deeply human.',
    manifestationInEra1:
      'Millwrights diagnosing wooden gear tooth wear by finger vibration; horse farriers fitting custom iron shoes to irregular hooves.',
    manifestationInEra2:
      'Linemen climbing iced telephone poles during blizzards to splice dangling high-voltage lines with insulated pliers.',
    manifestationInEra3:
      'Automotive collision repair body mechanics pulling bent steel unibodies; precision orthopedic trauma surgeons setting shattered bones.',
    manifestationInEra4:
      'Master residential electricians rewiring historic stone houses, pediatric emergency surgery, and high-dexterity plumbing in cramped crawl spaces.',
    aiImmunityRationale:
      'Actuator physics, energy storage density, and tactile sensory feedback in unstructured environments lag decades behind digital software intelligence.',
  },
  {
    id: 'core-3',
    name: 'Deep Empathetic Persuasion, Conflict Negotiation & Social Cohesion',
    archetype: 'Intersubjective Emotional Intelligence',
    whyEnduring:
      'Human motivation is deeply emotional, status-conscious, and relational. Resolving existential disputes, consoling the grieving, and inspiring collective sacrifice require authentic mutual vulnerability that synthetic agents cannot genuinely share.',
    manifestationInEra1:
      'Early trade union leaders (Tolpuddle Martyrs) binding disparate craft workers into collective mutual-aid societies under threat of exile.',
    manifestationInEra2:
      'Labor mediators like Frances Perkins negotiating historic New Deal labor treaties between militant industrial unions and corporate titans.',
    manifestationInEra3:
      'Hostage negotiators, psychotherapists treating trauma, and diplomat envoys brokering the Dayton Peace Accords.',
    manifestationInEra4:
      'Palliative hospice care, navigating complex family inheritance and custody mediation, and building high-trust sovereign alliances.',
    aiImmunityRationale:
      'Humans value knowing the listener has skin in the game. Synthetic empathy feels uncanny or manipulative when existential stakes are real.',
  },
  {
    id: 'core-4',
    name: 'Original Epistemic Problem Framing (First-Principles Inquiry)',
    archetype: 'Transcendent Epistemic Framing',
    whyEnduring:
      'Large Language Models are stochastic synthesizers of existing cultural and textual training corpora—they interpolate brilliantly within the distribution of past knowledge. Framing unprecedented questions and hypothesizing outside human consensus remains uniquely human.',
    manifestationInEra1:
      'Sadi Carnot conceiving the theoretical thermodynamics of the ideal heat engine by analogizing steam to water falling over a mill wheel.',
    manifestationInEra2:
      'Albert Einstein re-imagining the speed of light as a cosmic constant rather than an ether wave, breaking Newtonian spacetime.',
    manifestationInEra3:
      'Claude Shannon mathematically defining "information" as entropy reduction, founding the entire digital telecommunications paradigm.',
    manifestationInEra4:
      'Formulating entirely new philosophical, scientific, or social paradigms that have no historical precedent in the pre-training dataset.',
    aiImmunityRationale:
      'Models optimize for expected probabilities based on existing tokens. Truly revolutionary breakthroughs require defying the training distribution.',
  },
  {
    id: 'core-5',
    name: 'Authentic Provenance, Artisanal Stewardship & Human Meaning-Making',
    archetype: 'Intentionality & Cultural Provenance',
    whyEnduring:
      'As machine abundance drives the marginal cost of physical and digital goods to zero, human demand shifts decisively toward scarcity, intentional human labor, lived struggle, and cultural heritage.',
    manifestationInEra1:
      'The Arts & Crafts movement (William Morris, John Ruskin) celebrating handmade joinery and hand-block printing in revolt against factory uniformity.',
    manifestationInEra2:
      'The rise of haute couture fashion houses, bespoke Savile Row tailoring, and heritage mechanical watchmaking surviving mass assembly lines.',
    manifestationInEra3:
      'The vinyl record resurgence, craft microbrewing revolution, and independent artisanal sourdough bakeries rejecting industrial convenience.',
    manifestationInEra4:
      'Cryptographically verified human art, live acoustic musical performances, hand-signed literary essays, and human-guided spiritual pilgrimages.',
    aiImmunityRationale:
      'Value is not just functionality; it is communion. We do not value art because of the pixels; we value art because a mortal human being felt something and struggled to express it.',
  },
];

export const SCHOLAR_CITATIONS = [
  {
    author: 'Mokyr, Joel',
    year: '2002',
    title: 'The Gifts of Athena: Historical Origins of the Knowledge Economy',
    journal: 'Princeton University Press',
    keyTakeaway: 'Distinguishes between propositional knowledge ("what") and prescriptive knowledge ("how"), showing how industrial revolutions codify tacit craft into codified machine techniques.',
  },
  {
    author: 'Acemoglu, Daron & Restrepo, Pascual',
    year: '2019',
    title: 'Automation and New Tasks: How Technology Displaces and Reinstates Labor',
    journal: 'Journal of Economic Perspectives, 33(2), 3-30',
    keyTakeaway: 'Formalizes the battle between the displacement effect (machines replacing tasks) and the reinstatement effect (new technologies creating complex new human tasks).',
  },
  {
    author: 'Goldin, Claudia & Katz, Lawrence F.',
    year: '2008',
    title: 'The Race between Education and Technology',
    journal: 'Harvard University Press',
    keyTakeaway: 'Demonstrates that economic inequality surges whenever the speed of technological skill obsolescence outpaces the social institutions of human education and retraining.',
  },
  {
    author: 'Autor, David, Levy, Frank, & Murnane, Richard J.',
    year: '2003',
    title: 'The Skill Content of Recent Technological Change: An Empirical Exploration',
    journal: 'Quarterly Journal of Economics, 118(4), 1279-1333',
    keyTakeaway: 'Formulated the Task-Based Model showing computers readily automate routine algorithmic tasks while complementing non-routine cognitive and manual tasks.',
  },
  {
    author: 'Frey, Carl Benedikt & Osborne, Michael A.',
    year: '2017',
    title: 'The Future of Employment: How Susceptible Are Jobs to Computerisation?',
    journal: 'Technological Forecasting and Social Change, 114, 254-280',
    keyTakeaway: 'Estimated 47% of US employment at high risk of automation, establishing perception, manipulation, creative intelligence, and social intelligence as key human bottlenecks.',
  },
  {
    author: 'Brynjolfsson, Erik, Li, Danielle, & Raymond, Lindsey R.',
    year: '2023',
    title: 'Generative AI at Work',
    journal: 'National Bureau of Economic Research (NBER Working Paper No. 31161)',
    keyTakeaway: 'Empirical demonstration that generative AI disproportionately assists novice and low-skill workers, rapidly compressing skill dispersion and institutional learning curves.',
  },
  {
    author: 'Zuboff, Shoshana',
    year: '1988',
    title: 'In the Age of the Smart Machine: The Future of Work and Power',
    journal: 'Basic Books',
    keyTakeaway: 'Pioneered the duality of technology: machines can either "automate" (deskilling human labor into passive compliance) or "informate" (empowering workers with diagnostic insight).',
  },
];
