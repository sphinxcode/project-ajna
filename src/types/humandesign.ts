export interface PlanetPosition {
  planet: string;
  gate: number;
  line: number;
  color: number;
  tone: number;
  base: number;
}

export interface ChartActivations {
  Sun: PlanetPosition;
  Earth: PlanetPosition;
  Rahu: PlanetPosition;  // North Node
  Ketu: PlanetPosition;  // South Node
  Moon: PlanetPosition;
  Mercury: PlanetPosition;
  Venus: PlanetPosition;
  Mars: PlanetPosition;
  Jupiter: PlanetPosition;
  Saturn: PlanetPosition;
  Uranus: PlanetPosition;
  Neptune: PlanetPosition;
  Pluto: PlanetPosition;
}

export type HumanDesignType = 'Generator' | 'Manifesting Generator' | 'Projector' | 'Manifestor' | 'Reflector';
export type Definition = 'Single' | 'Split' | 'Triple Split' | 'Quadruple Split' | 'None';
export type ActivationType = 'personality' | 'design' | 'both';

export interface HumanDesignChart {
  id: string;
  name?: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;

  // Core attributes
  type: HumanDesignType;
  strategy: string;
  authority: string;
  profile: string;
  definition: Definition;
  incarnationCross: string;

  // Activations
  personality: ChartActivations;
  design: ChartActivations;

  // Derived data
  definedCenters: string[];
  undefinedCenters: string[];
  activeChannels: Channel[];
  activeGates: GateActivation[];

  // Additional data from API
  variableType?: string;
  phs?: PHSData;
  ravePsychology?: RavePsychologyData;
}

export interface PHSData {
  determination: string;
  environment: string;
  cognition: string;
  sense: string;
}

export interface RavePsychologyData {
  motivation: string;
  transferrence: string;
  perspective: string;
  distraction: string;
}

export interface Center {
  id: string;
  name: string;
  defined: boolean;
  gates: number[];
  theme: string;
  notSelfTheme: string;
}

export interface Channel {
  id: string;
  gates: [number, number];
  centers: [string, string];
  name: string;
  type: 'Individual' | 'Collective' | 'Tribal';
  circuit: string;
  description: string;
}

export interface GateActivation {
  gate: number;
  line: number;
  planet: string;
  type: ActivationType;
  name?: string;
  iChingName?: string;
  description?: string;
  color?: number;
  tone?: number;
  base?: number;
}

export interface BirthData {
  name?: string;
  birthDate: string;
  birthTime: string;
  birthLocation: string;
}

// Birth info from API response
export interface BirthInfo {
  date: string;
  time: string;
  location: string;
  coordinates: string;
  timezone: string;
  locationSource: string;
}

// Center info from API
export interface CenterInfo {
  defined: boolean;
  type: string;
  description: string;
}

// API Response from Human Design Calculator
export interface HDAPIResponse {
  success: boolean;
  data?: {
    birthInfo: BirthInfo;
    type: HumanDesignType;
    strategy: string;
    authority: string;
    signature: string;
    notSelfTheme: string;
    profile: string;
    profileName: string;
    incarnationCross: string;
    variableType: string;
    phs: {
      digestion: string;
      digestionTone: string;
      environment: string;
      environmentalTone: string;
    };
    ravePsychology: {
      motivation: string;
      motivationTone: string;
      perspective: string;
      perspectiveTone: string;
    };
    personality: ChartActivations;
    design: ChartActivations;
    channels: string[];
    centers: Record<string, CenterInfo>;
    definedCenters: string[];
    extras?: Record<string, unknown>;
    version: string;
  };
  error?: string;
}

// Type strategies and themes
export const TYPE_INFO: Record<HumanDesignType, {
  strategy: string;
  notSelfTheme: string;
  signature: string;
  aura: string;
  population: string;
}> = {
  'Generator': {
    strategy: 'To Respond',
    notSelfTheme: 'Frustration',
    signature: 'Satisfaction',
    aura: 'Open and enveloping',
    population: '37%'
  },
  'Manifesting Generator': {
    strategy: 'To Respond, then Inform',
    notSelfTheme: 'Frustration and Anger',
    signature: 'Satisfaction',
    aura: 'Open and enveloping',
    population: '33%'
  },
  'Projector': {
    strategy: 'Wait for the Invitation',
    notSelfTheme: 'Bitterness',
    signature: 'Success',
    aura: 'Focused and absorbing',
    population: '20%'
  },
  'Manifestor': {
    strategy: 'To Inform',
    notSelfTheme: 'Anger',
    signature: 'Peace',
    aura: 'Closed and repelling',
    population: '9%'
  },
  'Reflector': {
    strategy: 'Wait a Lunar Cycle',
    notSelfTheme: 'Disappointment',
    signature: 'Surprise',
    aura: 'Resistant and sampling',
    population: '1%'
  }
};

// Center names and definitions
export const CENTERS = [
  { id: 'head', name: 'Head', theme: 'Inspiration & Pressure to Think', notSelfTheme: 'Mental Pressure' },
  { id: 'ajna', name: 'Ajna', theme: 'Conceptualization & Analysis', notSelfTheme: 'Mental Anxiety' },
  { id: 'throat', name: 'Throat', theme: 'Communication & Manifestation', notSelfTheme: 'Attention Seeking' },
  { id: 'g', name: 'G Center', theme: 'Identity & Direction', notSelfTheme: 'Searching for Love/Direction' },
  { id: 'heart', name: 'Heart/Ego', theme: 'Willpower & Material World', notSelfTheme: 'Proving Worth' },
  { id: 'spleen', name: 'Spleen', theme: 'Survival & Intuition', notSelfTheme: 'Fear & Unhealthy Attachments' },
  { id: 'solar', name: 'Solar Plexus', theme: 'Emotions & Desires', notSelfTheme: 'Emotional Overwhelm' },
  { id: 'sacral', name: 'Sacral', theme: 'Life Force & Sexuality', notSelfTheme: "Not Knowing When Enough is Enough" },
  { id: 'root', name: 'Root', theme: 'Adrenaline & Drive', notSelfTheme: 'Stress & Hurrying' }
];

// Gates by center
export const GATES_BY_CENTER: Record<string, number[]> = {
  head: [64, 61, 63],
  ajna: [47, 24, 4, 17, 43, 11],
  throat: [62, 23, 56, 35, 12, 45, 33, 8, 31, 20, 16],
  g: [7, 1, 13, 25, 46, 2, 15, 10],
  heart: [21, 40, 26, 51],
  spleen: [48, 57, 44, 50, 32, 28, 18],
  solar: [36, 22, 37, 6, 49, 55, 30],
  sacral: [5, 14, 29, 59, 9, 3, 42, 27, 34],
  root: [53, 60, 52, 19, 39, 41, 58, 38, 54]
};

// Planet glyphs for display
export const PLANET_GLYPHS: Record<string, string> = {
  Sun: '☉',
  Earth: '⊕',
  Moon: '☽',
  Rahu: '☊',
  Ketu: '☋',
  NorthNode: '☊',
  SouthNode: '☋',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇'
};
