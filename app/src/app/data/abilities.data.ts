import { Ability, Milestone } from '../models/models';

export interface AbilitySeed {
  ability: Ability;
  milestones: Omit<Milestone, 'achieved' | 'achievedAt'>[];
}

// v1 seed: the two Anchor skills + three loggable activities.
// Year-2 skills (Planche, Front Lever, Muscle-Up, L-Sit) are added later by the user.
export const ABILITY_SEEDS: AbilitySeed[] = [
  {
    ability: {
      id: 'handstand',
      name: 'עמידת ידיים',
      icon: 'skillHandstand',
      kind: 'skill',
      metricType: 'hold',
      pillars: ['skill', 'staticStrength', 'core'],
      videos: [],
      notes: '',
      order: 0,
    },
    milestones: [
      { id: 'hs-1', title: "10 שנ' על קיר", order: 0 },
      { id: 'hs-2', title: "30 שנ' על קיר", order: 1 },
      { id: 'hs-3', title: "60 שנ' על קיר", order: 2 },
      { id: 'hs-4', title: "5 שנ' חופשי", order: 3 },
      { id: 'hs-5', title: "15 שנ' חופשי", order: 4 },
      { id: 'hs-6', title: "30 שנ' חופשי", order: 5 },
    ],
  },
  {
    ability: {
      id: 'tgu',
      name: 'קימה טורקית (TGU)',
      icon: 'skillTgu',
      kind: 'skill',
      metricType: 'load',
      pillars: ['skill', 'mobility', 'core'],
      videos: [],
      notes: '',
      order: 1,
    },
    milestones: [
      { id: 'tgu-1', title: '8 ק"ג', order: 0 },
      { id: 'tgu-2', title: '12 ק"ג', order: 1 },
      { id: 'tgu-3', title: '16 ק"ג', order: 2 },
      { id: 'tgu-4', title: '20 ק"ג', order: 3 },
      { id: 'tgu-5', title: '24 ק"ג', order: 4 },
      { id: 'tgu-6', title: '32 ק"ג — יעד שנה 1', order: 5 },
    ],
  },
  {
    ability: {
      id: 'climbing',
      name: 'טיפוס',
      icon: 'climb',
      kind: 'activity',
      metricType: 'session',
      pillars: ['grip', 'movement', 'skill'],
      videos: [],
      notes: '',
      order: 2,
    },
    milestones: [
      { id: 'cl-1', title: 'בולדר V2 נקי', order: 0 },
      { id: 'cl-2', title: 'בולדר V3 נקי', order: 1 },
      { id: 'cl-3', title: 'בולדר V4 נקי', order: 2 },
      { id: 'cl-4', title: 'בולדר V5 נקי', order: 3 },
    ],
  },
  {
    ability: {
      id: 'emtb',
      name: 'רכיבת eMTB',
      icon: 'bike',
      kind: 'activity',
      metricType: 'session',
      pillars: ['conditioning', 'resilience'],
      videos: [],
      notes: '',
      order: 3,
    },
    milestones: [
      { id: 'mt-1', title: 'רכיבת 20 ק"מ', order: 0 },
      { id: 'mt-2', title: 'רכיבת 35 ק"מ', order: 1 },
      { id: 'mt-3', title: 'רכיבת 50 ק"מ ולהרגיש רענן — יעד שנה 1', order: 2 },
    ],
  },
  {
    ability: {
      id: 'heavybag',
      name: 'שק אגרוף',
      icon: 'power',
      kind: 'activity',
      metricType: 'rounds',
      pillars: ['power', 'conditioning'],
      videos: [],
      notes: '',
      order: 4,
    },
    milestones: [
      { id: 'hb-1', title: '3 סבבים של 3 דקות', order: 0 },
      { id: 'hb-2', title: '5 סבבים של 3 דקות', order: 1 },
      { id: 'hb-3', title: '8 סבבים של 3 דקות', order: 2 },
    ],
  },
];
