// Bodygraph data - Centers, Channels, Gates
// Gate names (I-Ching hexagram names)
export const GATE_NAMES: Record<number, string> = {
  1: "The Creative",
  2: "The Receptive",
  3: "Ordering",
  4: "Youthful Folly",
  5: "Waiting",
  6: "Conflict",
  7: "The Army",
  8: "Contribution",
  9: "Focus",
  10: "Treading",
  11: "Peace",
  12: "Caution",
  13: "The Listener",
  14: "Power Skills",
  15: "Extremes",
  16: "Skills",
  17: "Following",
  18: "Correction",
  19: "Wanting",
  20: "The Now",
  21: "Hunter/Huntress",
  22: "Openness",
  23: "Assimilation",
  24: "Returning",
  25: "Innocence",
  26: "The Egoist",
  27: "Nourishment",
  28: "The Game Player",
  29: "Saying Yes",
  30: "Recognition of Feelings",
  31: "Leading",
  32: "Continuity",
  33: "Privacy",
  34: "Power",
  35: "Change",
  36: "Crisis",
  37: "Friendship",
  38: "The Fighter",
  39: "The Provocateur",
  40: "Aloneness",
  41: "Contraction",
  42: "Growth",
  43: "Insight",
  44: "Alertness",
  45: "The Gatherer",
  46: "Determination of Self",
  47: "Realization",
  48: "Depth",
  49: "Rejection",
  50: "Values",
  51: "Shock",
  52: "Stillness",
  53: "Beginnings",
  54: "Ambition",
  55: "Spirit",
  56: "Stimulation",
  57: "Intuition",
  58: "Aliveness",
  59: "Sexuality",
  60: "Acceptance",
  61: "Mystery",
  62: "Detail",
  63: "Doubt",
  64: "Confusion"
};

export const GATE_KEYWORDS: Record<number, string> = {
  1: "Self-Expression",
  2: "Direction of Self",
  3: "Ordering",
  4: "Formulization",
  5: "Fixed Rhythms",
  6: "Friction",
  7: "Role of the Self",
  8: "Contribution",
  9: "Focus",
  10: "Behavior of the Self",
  11: "Ideas",
  12: "Caution",
  13: "The Listener",
  14: "Power Skills",
  15: "Extremes",
  16: "Skills",
  17: "Opinions",
  18: "Correction",
  19: "Wanting",
  20: "The Now",
  21: "Hunter/Huntress",
  22: "Openness",
  23: "Assimilation",
  24: "Rationalizing",
  25: "Spirit of Self",
  26: "The Egoist",
  27: "Caring",
  28: "The Game Player",
  29: "Saying Yes",
  30: "Recognition of Feelings",
  31: "Leading",
  32: "Continuity",
  33: "Privacy",
  34: "Might",
  35: "Change",
  36: "Crisis",
  37: "Friendship",
  38: "Fighter",
  39: "The Provocateur",
  40: "Aloneness",
  41: "Contraction",
  42: "Growth",
  43: "Insight",
  44: "Alertness",
  45: "Gatherer",
  46: "Determination of Self",
  47: "Realizing",
  48: "Depth",
  49: "Rejection",
  50: "Values",
  51: "Shock",
  52: "Inaction",
  53: "Beginnings",
  54: "Ambition",
  55: "Spirit",
  56: "Stimulation",
  57: "Intuition",
  58: "Aliveness",
  59: "Sexuality",
  60: "Acceptance",
  61: "Mystery",
  62: "Detail",
  63: "Doubt",
  64: "Confusion"
};

// Center configuration
export interface CenterConfig {
  id: string;
  name: string;
  theme: string;
  notSelfTheme: string;
  gates: number[];
}

export const CENTER_CONFIG: CenterConfig[] = [
  {
    id: 'head',
    name: 'Head',
    theme: 'Inspiration & mental pressure',
    notSelfTheme: 'Mental pressure to answer questions that are not your own',
    gates: [64, 61, 63]
  },
  {
    id: 'ajna',
    name: 'Ajna',
    theme: 'Awareness & conceptualization',
    notSelfTheme: 'Pretending to be certain about things',
    gates: [47, 24, 4, 17, 11, 43]
  },
  {
    id: 'throat',
    name: 'Throat',
    theme: 'Communication & manifestation',
    notSelfTheme: 'Trying to attract attention by speaking',
    gates: [62, 23, 56, 16, 20, 31, 8, 33, 35, 12, 45]
  },
  {
    id: 'g',
    name: 'G Center',
    theme: 'Identity & direction',
    notSelfTheme: 'Searching for love and direction in wrong places',
    gates: [1, 7, 13, 10, 25, 15, 46, 2]
  },
  {
    id: 'heart',
    name: 'Heart/Ego',
    theme: 'Willpower & self-worth',
    notSelfTheme: 'Constantly trying to prove yourself',
    gates: [21, 51, 26, 40]
  },
  {
    id: 'spleen',
    name: 'Spleen',
    theme: 'Intuition & survival',
    notSelfTheme: 'Holding onto what is unhealthy',
    gates: [48, 57, 44, 50, 32, 28, 18]
  },
  {
    id: 'solar',
    name: 'Solar Plexus',
    theme: 'Emotions & feelings',
    notSelfTheme: 'Avoiding confrontation and truth',
    gates: [36, 22, 37, 6, 49, 55, 30]
  },
  {
    id: 'sacral',
    name: 'Sacral',
    theme: 'Life force & work energy',
    notSelfTheme: "Not knowing when enough is enough",
    gates: [5, 14, 29, 59, 27, 34, 42, 3, 9]
  },
  {
    id: 'root',
    name: 'Root',
    theme: 'Pressure & adrenaline',
    notSelfTheme: 'Always in a hurry to get things done',
    gates: [53, 60, 52, 19, 54, 38, 58, 39, 41]
  }
];

// 36 Channels
export interface ChannelData {
  gates: [number, number];
  centers: [string, string];
  name: string;
  type: 'Individual' | 'Collective' | 'Tribal';
  circuit: string;
}

export const CHANNELS: ChannelData[] = [
  // Head-Ajna
  { gates: [64, 47], centers: ['head', 'ajna'], name: 'Abstraction', type: 'Collective', circuit: 'Sensing' },
  { gates: [61, 24], centers: ['head', 'ajna'], name: 'Awareness', type: 'Individual', circuit: 'Knowing' },
  { gates: [63, 4], centers: ['head', 'ajna'], name: 'Logic', type: 'Collective', circuit: 'Logic' },

  // Ajna-Throat
  { gates: [17, 62], centers: ['ajna', 'throat'], name: 'Acceptance', type: 'Collective', circuit: 'Logic' },
  { gates: [43, 23], centers: ['ajna', 'throat'], name: 'Structuring', type: 'Individual', circuit: 'Knowing' },
  { gates: [11, 56], centers: ['ajna', 'throat'], name: 'Curiosity', type: 'Collective', circuit: 'Sensing' },

  // G-Throat
  { gates: [7, 31], centers: ['g', 'throat'], name: 'The Alpha', type: 'Collective', circuit: 'Logic' },
  { gates: [1, 8], centers: ['g', 'throat'], name: 'Inspiration', type: 'Individual', circuit: 'Knowing' },
  { gates: [13, 33], centers: ['g', 'throat'], name: 'The Prodigal', type: 'Collective', circuit: 'Sensing' },

  // Integration channels
  { gates: [10, 20], centers: ['g', 'throat'], name: 'Awakening', type: 'Individual', circuit: 'Integration' },
  { gates: [10, 34], centers: ['g', 'sacral'], name: 'Exploration', type: 'Individual', circuit: 'Integration' },
  { gates: [10, 57], centers: ['g', 'spleen'], name: 'Perfected Form', type: 'Individual', circuit: 'Integration' },
  { gates: [20, 57], centers: ['throat', 'spleen'], name: 'The Brainwave', type: 'Individual', circuit: 'Integration' },
  { gates: [20, 34], centers: ['throat', 'sacral'], name: 'Charisma', type: 'Individual', circuit: 'Integration' },
  { gates: [34, 57], centers: ['sacral', 'spleen'], name: 'Power', type: 'Individual', circuit: 'Integration' },

  // G-Heart
  { gates: [25, 51], centers: ['g', 'heart'], name: 'Initiation', type: 'Individual', circuit: 'Centering' },

  // Heart-Throat
  { gates: [21, 45], centers: ['heart', 'throat'], name: 'Money', type: 'Tribal', circuit: 'Ego' },

  // Heart-Spleen
  { gates: [26, 44], centers: ['heart', 'spleen'], name: 'Surrender', type: 'Tribal', circuit: 'Ego' },

  // Heart-Solar Plexus
  { gates: [40, 37], centers: ['heart', 'solar'], name: 'Community', type: 'Tribal', circuit: 'Ego' },

  // G-Sacral
  { gates: [46, 29], centers: ['g', 'sacral'], name: 'Discovery', type: 'Collective', circuit: 'Sensing' },
  { gates: [2, 14], centers: ['g', 'sacral'], name: 'The Beat', type: 'Individual', circuit: 'Knowing' },
  { gates: [15, 5], centers: ['g', 'sacral'], name: 'Rhythm', type: 'Collective', circuit: 'Logic' },

  // Throat-Spleen
  { gates: [16, 48], centers: ['throat', 'spleen'], name: 'The Wavelength', type: 'Collective', circuit: 'Logic' },

  // Throat-Solar Plexus
  { gates: [12, 22], centers: ['throat', 'solar'], name: 'Openness', type: 'Individual', circuit: 'Knowing' },
  { gates: [35, 36], centers: ['throat', 'solar'], name: 'Transitoriness', type: 'Collective', circuit: 'Sensing' },

  // Spleen-Sacral
  { gates: [50, 27], centers: ['spleen', 'sacral'], name: 'Preservation', type: 'Tribal', circuit: 'Defense' },

  // Spleen-Root
  { gates: [18, 58], centers: ['spleen', 'root'], name: 'Judgment', type: 'Collective', circuit: 'Logic' },
  { gates: [28, 38], centers: ['spleen', 'root'], name: 'Struggle', type: 'Individual', circuit: 'Knowing' },
  { gates: [32, 54], centers: ['spleen', 'root'], name: 'Transformation', type: 'Tribal', circuit: 'Ego' },

  // Solar Plexus-Sacral
  { gates: [6, 59], centers: ['solar', 'sacral'], name: 'Intimacy', type: 'Tribal', circuit: 'Defense' },

  // Solar Plexus-Root
  { gates: [30, 41], centers: ['solar', 'root'], name: 'Recognition', type: 'Collective', circuit: 'Sensing' },
  { gates: [49, 19], centers: ['solar', 'root'], name: 'Synthesis', type: 'Tribal', circuit: 'Defense' },
  { gates: [55, 39], centers: ['solar', 'root'], name: 'Emoting', type: 'Individual', circuit: 'Knowing' },

  // Sacral-Root
  { gates: [3, 60], centers: ['sacral', 'root'], name: 'Mutation', type: 'Individual', circuit: 'Knowing' },
  { gates: [9, 52], centers: ['sacral', 'root'], name: 'Concentration', type: 'Collective', circuit: 'Logic' },
  { gates: [42, 53], centers: ['sacral', 'root'], name: 'Maturation', type: 'Collective', circuit: 'Sensing' }
];

// Planet glyphs for displaying planetary activations
export const PLANET_GLYPHS: Record<string, string> = {
  Sun: '\u2609',
  Earth: '\u2A01',
  Moon: '\u263D',
  NorthNode: '\u260A',
  SouthNode: '\u260B',
  Rahu: '\u260A',
  Ketu: '\u260B',
  Mercury: '\u263F',
  Venus: '\u2640',
  Mars: '\u2642',
  Jupiter: '\u2643',
  Saturn: '\u2644',
  Uranus: '\u2645',
  Neptune: '\u2646',
  Pluto: '\u2647'
};

// Planet order for display
export const PLANET_ORDER = [
  'Sun',
  'Earth',
  'Rahu',
  'Ketu',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto'
];

// Authority descriptions
export const AUTHORITY_INFO: Record<string, { description: string; strategy: string }> = {
  'Emotional': {
    description: 'Wait for emotional clarity over time. Never make decisions in the heat of the moment.',
    strategy: 'Sleep on important decisions. Wait for the emotional wave to settle before committing.'
  },
  'Solar Plexus': {
    description: 'Wait for emotional clarity over time. Never make decisions in the heat of the moment.',
    strategy: 'Sleep on important decisions. Wait for the emotional wave to settle before committing.'
  },
  'Sacral': {
    description: 'Trust your gut response - the sounds and sensations that arise in your body.',
    strategy: 'Wait to respond to life. Your body knows the answer through guttural sounds (uh-huh, uhn-uhn).'
  },
  'Splenic': {
    description: 'Trust your spontaneous intuition - the quiet knowing that comes in the moment.',
    strategy: 'Act on your first instinct. The splenic voice speaks only once and very softly.'
  },
  'Spleen': {
    description: 'Trust your spontaneous intuition - the quiet knowing that comes in the moment.',
    strategy: 'Act on your first instinct. The splenic voice speaks only once and very softly.'
  },
  'Ego Projected': {
    description: 'Listen to what you say about what you want. Your will knows the way.',
    strategy: 'Make commitments that serve your heart. Your ego knows what it can and cannot do.'
  },
  'Ego Manifested': {
    description: 'Listen to what you say about what you want. Your will knows the way.',
    strategy: 'Make commitments that serve your heart. Your ego knows what it can and cannot do.'
  },
  'Self-Projected': {
    description: 'Listen to your own voice as you speak to trusted others about your decisions.',
    strategy: 'Talk through decisions with trusted friends and listen to what you say.'
  },
  'Self Projected': {
    description: 'Listen to your own voice as you speak to trusted others about your decisions.',
    strategy: 'Talk through decisions with trusted friends and listen to what you say.'
  },
  'Mental': {
    description: 'You have no inner authority - rely on your environment and trusted others.',
    strategy: 'Discuss decisions with trusted advisors who can reflect back what they see.'
  },
  'Outer Authority': {
    description: 'You have no inner authority - rely on your environment and trusted others.',
    strategy: 'Discuss decisions with trusted advisors who can reflect back what they see.'
  },
  'Lunar': {
    description: 'Wait a full lunar cycle (28+ days) before making major decisions.',
    strategy: 'Sample different perspectives over a month to gain clarity.'
  },
  'None (Lunar)': {
    description: 'Wait a full lunar cycle (28+ days) before making major decisions.',
    strategy: 'Sample different perspectives over a month to gain clarity.'
  }
};

// Profile descriptions
export const PROFILE_INFO: Record<string, { name: string; theme: string }> = {
  '1/3': { name: 'Investigator/Martyr', theme: 'Learning through research and trial & error' },
  '1/4': { name: 'Investigator/Opportunist', theme: 'Building foundations and sharing with your network' },
  '2/4': { name: 'Hermit/Opportunist', theme: 'Natural talent called out by others in your network' },
  '2/5': { name: 'Hermit/Heretic', theme: 'Natural talent with universal appeal' },
  '3/5': { name: 'Martyr/Heretic', theme: 'Learning through experience with practical solutions' },
  '3/6': { name: 'Martyr/Role Model', theme: 'Trial and error evolving to wisdom' },
  '4/6': { name: 'Opportunist/Role Model', theme: 'Influential network that evolves to role model' },
  '4/1': { name: 'Opportunist/Investigator', theme: 'Networking based on solid foundations' },
  '5/1': { name: 'Heretic/Investigator', theme: 'Practical solutions built on deep research' },
  '5/2': { name: 'Heretic/Hermit', theme: 'Universal solutions from natural talent' },
  '6/2': { name: 'Role Model/Hermit', theme: 'Wisdom from experience with natural gifts' },
  '6/3': { name: 'Role Model/Martyr', theme: 'Wisdom earned through trial and error' }
};
