export type Step = 'hold' | 'cheapen' | 'own' | 'rest';

export interface JourneyTask {
  label: string;
  /** Where this task sits after the machine is adopted. */
  to: 'machine' | 'human' | 'owner';
}

export interface Source {
  title: string;
  detail: string;
}

export interface Station {
  id: string;
  nav: string;
  year: string;
  place: string;
  title: string;
  move: string;
  stat: string;
  note: string;
  human: string;
  machine: string;
  owner: string;
  steps: Record<Step, string>;
  tasks: JourneyTask[];
  sources: Source[];
}

export const STEPS: { id: Step; label: string }[] = [
  { id: 'hold', label: 'Holds' },
  { id: 'cheapen', label: 'Cheapens' },
  { id: 'own', label: 'Owns' },
  { id: 'rest', label: 'Remains' },
];

export const STATIONS: Station[] = [
  {
    id: 'cotton',
    nav: 'Thread',
    year: '1764–1835',
    place: 'Lancashire',
    title: 'The thread leaves the hand',
    move: 'Spinning left the cottage first. The weaver’s price followed.',
    stat: '20–30s → 4–5s',
    note: 'Cobbett, 1832, on weavers who once earned the higher sum. A witness, not a wage index.',
    human: 'Cottage',
    machine: 'Mule and loom',
    owner: 'Mill owner',
    steps: {
      hold: 'Cottage hands held spinning, then weaving. Pay was a piece-rate for the skill.',
      cheapen: 'A jenny, a mule, then a workable power loom cut the cost of each yard.',
      own: 'The mill owner bought the machines. A craft price became a wage for tending.',
      rest: 'Fingers still tied broken ends. Roberts’s self-acting mule, about 1830, took the spinner’s timing.',
    },
    tasks: [
      { label: 'Twist yarn', to: 'machine' },
      { label: 'Throw shuttle', to: 'machine' },
      { label: 'Tie ends', to: 'human' },
    ],
    sources: [
      {
        title: 'William Cobbett, Political Register, 20 June 1832',
        detail: 'Weavers who had earned 20 to 30 shillings a week were, he wrote, living on 5s, 4s, or less.',
      },
      {
        title: 'Robert C. Allen, The British Industrial Revolution in Global Perspective, 2009',
        detail: 'Labor-saving machines paid where wages were high and energy was cheap. His “Engels’ pause” paper the same year finds output per worker ahead of wages from about 1800 to 1840.',
      },
      {
        title: 'Richard Roberts, self-acting mule, patent 1825',
        detail: 'In use around 1830. Cartwright’s 1785 power loom did not win the mill. The looms that cut weaving prices spread in the 1810s–1830s. Early mills ran on water, not steam.',
      },
    ],
  },
  {
    id: 'law',
    nav: 'Law',
    year: '1812–1830',
    place: 'York and the South',
    title: 'The law picks the machine',
    move: 'They broke the frames that cut their pay. At York, seventeen were hanged.',
    stat: '17 hanged',
    note: 'York, January 1813. Three for killing mill owner William Horsfall. Fourteen more that month for Luddite attacks.',
    human: 'Cropper',
    machine: 'Gig and drum',
    owner: 'The statute',
    steps: {
      hold: 'Yorkshire croppers lived by the shears. Southern laborers lived by the winter flail.',
      cheapen: 'Gig mills sheared the cloth. Threshing drums took the winter work. Reapers were a later fight.',
      own: 'The 1812 Act made frame-breaking a hanging crime. It protected the owner’s machines.',
      rest: 'The 1830 Swing rising aimed at threshing machines. Courts hanged some and transported hundreds.',
    },
    tasks: [
      { label: 'Shear cloth', to: 'machine' },
      { label: 'Flail grain', to: 'machine' },
      { label: 'Protest', to: 'human' },
    ],
    sources: [
      {
        title: 'Frame Breaking Act, 1812',
        detail: 'Destroying stocking frames and similar machines became a capital felony.',
      },
      {
        title: 'York Special Commission, January 1813',
        detail: 'Seventeen men hanged. Three, on 8 January, for the murder of mill owner William Horsfall. Fourteen more on 16 January for Luddite offenses.',
      },
      {
        title: 'Eric Hobsbawm and George Rudé, Captain Swing, 1969',
        detail: 'The 1830 rising across southern and eastern England targeted threshing machines. The courts hanged 19 and transported hundreds.',
      },
    ],
  },
  {
    id: 'steel',
    nav: 'Steel',
    year: '1784 / 1856',
    place: 'The ironworks',
    title: 'The arm leaves the furnace',
    move: 'Puddling sold judgment in the heat. The converter did that blow in the firm’s vessel.',
    stat: 'A day → 20 min',
    note: 'Several tons. A puddling crew needed a day for what a Bessemer blow did in 10–20 minutes.',
    human: 'Puddler',
    machine: 'Converter',
    owner: 'The firm',
    steps: {
      hold: 'Cort’s patents, 1783–84, created the puddler. The skill was new, brutal, and paid.',
      cheapen: 'Bessemer announced the converter in 1856. Air through molten iron burned out the carbon.',
      own: 'The firm owned the vessel. A day’s stirring could not match tons per blow.',
      rest: 'Someone still read the flame. The stirring arm was no longer the product.',
    },
    tasks: [
      { label: 'Stir the heat', to: 'machine' },
      { label: 'Burn carbon', to: 'machine' },
      { label: 'Read flame', to: 'human' },
    ],
    sources: [
      {
        title: 'Henry Cort, puddling and rolling patents, 1783–1784',
        detail: 'Puddling turned pig iron into wrought iron with coal. It created a skilled furnace job. It did not replace medieval bloomeries overnight. Those were already marginal.',
      },
      {
        title: 'Henry Bessemer, British Association, 1856',
        detail: 'A blow converted several tons of iron into steel in 10–20 minutes. The same quantity had taken a puddling crew a full day of stirring.',
      },
      {
        title: 'Later control of the flame',
        detail: 'Blowers judged the heat by the flame from the converter mouth. Photoelectric reading of that flame came much later. The arm went first. The eye lingered.',
      },
    ],
  },
  {
    id: 'type',
    nav: 'Type',
    year: '1886',
    place: 'New York Tribune',
    title: 'The case of type goes cold',
    move: 'A compositor picked each letter. The Linotype cast the line for a paper that owned it.',
    stat: '3 July 1886',
    note: 'First commercial use, New York Tribune. Whitelaw Reid had paid to install the machines.',
    human: 'Compositor',
    machine: 'Linotype',
    owner: 'The paper',
    steps: {
      hold: 'The skill was the case: knowing where each letter lived, and setting it by hand.',
      cheapen: 'A keyboard gathered matrices. The machine cast a metal slug. Hand-picking lost the pace.',
      own: 'The Tribune owned the Linotype. The case was no longer the compositor’s capital.',
      rest: 'Someone still read the copy and corrected the slug. Loose type was not the job.',
    },
    tasks: [
      { label: 'Pick letters', to: 'machine' },
      { label: 'Cast the line', to: 'machine' },
      { label: 'Read copy', to: 'human' },
    ],
    sources: [
      {
        title: 'New York Tribune, 3 July 1886',
        detail: 'Ottmar Mergenthaler’s Linotype was first used commercially on that day’s paper. Reid’s syndicate had backed the machine.',
      },
      {
        title: 'What changed in the shop',
        detail: 'Operators set from a keyboard and the machine cast each line. That is a faster process. A single multiple for every shop would be a guess, so none is shown.',
      },
      {
        title: 'The union context',
        detail: 'Reid installed the machines against the typographic union. The tool and the bargaining power moved together.',
      },
    ],
  },
  {
    id: 'line',
    nav: 'Line',
    year: '1913–1914',
    place: 'Highland Park',
    title: 'The car becomes stations',
    move: 'Ford stopped paying for someone who could build a car. He paid for one motion, at his pace.',
    stat: '12½ h → 93 min',
    note: 'Model T chassis at Highland Park. A standing build, then the moving line, 1913–14.',
    human: 'Fitter',
    machine: 'The line',
    owner: 'Ford',
    steps: {
      hold: 'A fitter held the sequence of the whole car in his hands.',
      cheapen: 'The moving line broke that sequence into stations. The car’s price fell from $850 in 1908 to $490 in 1914.',
      own: 'January 1914: eligible men got $5 for eight hours, up from about $2.34 for nine. Turnover had hit 380%.',
      rest: 'The worker kept a few seconds of a task. The whole car lived in the line.',
    },
    tasks: [
      { label: 'Whole car', to: 'machine' },
      { label: 'The pace', to: 'owner' },
      { label: 'One motion', to: 'human' },
    ],
    sources: [
      {
        title: 'The Henry Ford; Library of Congress',
        detail: 'Moving assembly at Highland Park from 1913. Chassis time fell from 12½ hours to 93 minutes. The Model T list price fell from $850 in 1908 to $490 in 1914.',
      },
      {
        title: 'The five-dollar day, 5 January 1914',
        detail: 'About $2.34 for a nine-hour day became $5 for eight hours. Late 1913 turnover was 380%. The $5 mixed wages and profit-sharing.',
      },
      {
        title: 'Stephen Meyer, The Five Dollar Day, 1981',
        detail: 'Not every worker qualified. Men needed tenure and age, and Ford’s Sociological Department inspected how they lived.',
      },
    ],
  },
  {
    id: 'desk',
    nav: 'Desk',
    year: '1960–1998',
    place: 'United States',
    title: 'The rule leaves the clerk',
    move: 'Computers took tasks that can be written as a rule. The firm owned the program.',
    stat: 'Routine fell',
    note: 'US work, 1960–1998. Routine manual and routine cognitive tasks shrank. Nonroutine work grew.',
    human: 'Clerk',
    machine: 'Program',
    owner: 'The firm',
    steps: {
      hold: 'Clerks were paid to file, add, copy, and follow a procedure without error.',
      cheapen: 'A program repeats a rule the same way each time, at less than the wage.',
      own: 'The software sits on the firm’s machines. The rulebook leaves the clerk’s memory.',
      rest: 'ATMs cut tellers per branch. Teller jobs still rose for years, because banks opened more branches.',
    },
    tasks: [
      { label: 'Follow rule', to: 'machine' },
      { label: 'Copy', to: 'machine' },
      { label: 'Exception', to: 'human' },
    ],
    sources: [
      {
        title: 'Autor, Levy, and Murnane, Quarterly Journal of Economics, 2003',
        detail: '“The Skill Content of Recent Technological Change.” From 1960 to 1998, US jobs shifted out of routine tasks and toward nonroutine problem-solving and complex communication.',
      },
      {
        title: 'James Bessen, “Toil and Technology,” Finance & Development, 2015',
        detail: 'ATMs reduced tellers per branch. Teller employment rose for decades because a branch cost less, so banks opened more of them. Mobile banking cut the job later.',
      },
      {
        title: 'What this station does not claim',
        detail: 'No single percentage of “clerks replaced” is shown. The measured change is in the task mix of the workforce.',
      },
    ],
  },
  {
    id: 'model',
    nav: 'Model',
    year: '2023',
    place: 'Desk work, United States',
    title: 'The draft leaves the junior',
    move: 'A model drafts and codes what juniors learned by doing. The lab owns the weights.',
    stat: '15% → about half',
    note: 'Share of US tasks a 2023 study said could be sped up. Exposure, not a count of jobs already lost.',
    human: 'Junior',
    machine: 'Weights',
    owner: 'The lab',
    steps: {
      hold: 'The overlap is wider in higher-paid symbolic work than it was on the factory floor.',
      cheapen: 'A buyer can get the draft without paying for the years that taught the junior.',
      own: 'Training is expensive. One more draft is cheap. The lab paid the first and rents the second.',
      rest: 'Messy physical work is still mostly human. Easy for hands, hard for a model.',
    },
    tasks: [
      { label: 'Draft', to: 'machine' },
      { label: 'Code', to: 'machine' },
      { label: 'Hands', to: 'human' },
    ],
    sources: [
      {
        title: 'Eloundou, Manning, Mishkin, and Rock, 2023',
        detail: '“GPTs are GPTs.” About 15% of US work tasks could be done much faster at the same quality with a large language model. With software built on those models, they put the share near 47–56%. About 19% of workers are in jobs where half or more of the tasks are exposed to that software. The authors do not count jobs lost.',
      },
      {
        title: 'Hans Moravec, Mind Children, 1988',
        detail: 'High-level reasoning has proved easier to automate than the sensorimotor skill a person uses in an unfamiliar room.',
      },
      {
        title: 'Michael Polanyi, 1966; David Autor, 2014',
        detail: 'Polanyi: “We can know more than we can tell.” Autor named the limit Polanyi’s paradox: machines needed a rule. Language models imitate results without being handed the rule. They still do not carry the consequence.',
      },
    ],
  },
];
