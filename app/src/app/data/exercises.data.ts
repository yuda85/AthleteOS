import { Exercise } from '../models/models';

// Exercise library — ability-centered: each exercise feeds zero or more abilities.
export const EXERCISES: Exercise[] = [
  // Skill anchors
  { id: 'handstand', name: 'עמידת ידיים', category: 'Skill', icon: 'skillHandstand', metricType: 'time', abilityIds: ['handstand'] },
  { id: 'tgu', name: 'קימה טורקית (TGU)', category: 'Skill', icon: 'skillTgu', metricType: 'weightReps', abilityIds: ['tgu'] },

  // Strength — pull
  { id: 'weighted-pullup', name: 'מתח עם משקל', category: 'Strength', icon: 'pull', metricType: 'weightReps', abilityIds: [] },
  { id: 'weighted-chinup', name: 'מתח בקירוב עם משקל (Chin-Up)', category: 'Strength', icon: 'pull', metricType: 'weightReps', abilityIds: [] },
  { id: 'chest-supported-row', name: 'חתירה בהישענות על ספסל', category: 'Strength', icon: 'pull', metricType: 'weightReps', abilityIds: [] },
  { id: 'one-arm-db-row', name: 'חתירת משקולת ביד אחת', category: 'Strength', icon: 'pull', metricType: 'weightReps', abilityIds: [] },
  { id: 'ring-row', name: 'חתירה בטבעות', category: 'Accessory', icon: 'pull', metricType: 'weightReps', abilityIds: [] },

  // Strength — push
  { id: 'weighted-dips', name: 'מקבילים עם משקל', category: 'Strength', icon: 'push', metricType: 'weightReps', abilityIds: [] },
  { id: 'landmine-press', name: 'לחיצת כתפיים (Landmine)', category: 'Strength', icon: 'push', metricType: 'weightReps', abilityIds: [] },
  { id: 'incline-db-press', name: 'לחיצת שיפוע עם משקולות', category: 'Strength', icon: 'push', metricType: 'weightReps', abilityIds: [] },
  { id: 'ohp', name: 'לחיצת כתפיים בעמידה (OHP)', category: 'Strength', icon: 'push', metricType: 'weightReps', abilityIds: [] },
  { id: 'ring-pushups', name: 'שכיבות סמיכה בטבעות', category: 'Accessory', icon: 'push', metricType: 'weightReps', abilityIds: [] },

  // Strength — legs & hinge
  { id: 'bulgarian-split-squat', name: 'סקוואט בולגרי', category: 'Strength', icon: 'squat', metricType: 'weightReps', abilityIds: [] },
  { id: 'hip-thrust', name: 'היפ תראסט / גשר ירכיים', category: 'Strength', icon: 'dumbbell', metricType: 'weightReps', abilityIds: [] },
  { id: 'single-leg-rdl', name: 'דדליפט רומני על רגל אחת', category: 'Strength', icon: 'squat', metricType: 'weightReps', abilityIds: [] },
  { id: 'goblet-squat', name: 'גובלט סקוואט', category: 'Strength', icon: 'squat', metricType: 'weightReps', abilityIds: [] },
  { id: 'step-ups', name: 'עלייה מדרגה (Step Ups)', category: 'Strength', icon: 'squat', metricType: 'weightReps', abilityIds: [] },

  // Core & carries
  { id: 'pallof-suitcase', name: 'Pallof Press + נשיאת מזוודה', category: 'Core', icon: 'core', metricType: 'weightReps', abilityIds: [] },
  { id: 'birddog-sideplank', name: 'בירד דוג + פלאנק צד', category: 'Core', icon: 'core', metricType: 'time', abilityIds: [] },
  { id: 'frontrack-deadbug', name: 'נשיאת Front Rack + דד באג', category: 'Core', icon: 'carry', metricType: 'weightReps', abilityIds: [] },

  // Power
  { id: 'box-jump', name: 'קפיצה לארגז / קפיצה לרוחק', category: 'Power', icon: 'power', metricType: 'weightReps', abilityIds: [] },
  { id: 'heavy-bag', name: 'שק אגרוף — כוח מתפרץ', category: 'Power', icon: 'power', metricType: 'rounds', abilityIds: ['heavybag'] },

  // Mobility & spine hygiene
  { id: 'shoulder-tspine-mobility', name: 'כתפיים ועמוד שדרה חזי', category: 'Mobility', icon: 'mobility', metricType: 'time', abilityIds: [] },
  { id: 'spine-hygiene', name: 'היגיינת עמוד שדרה', category: 'Mobility', icon: 'core', metricType: 'time', abilityIds: [] },
  { id: 'hanging', name: 'תלייה (Hanging)', category: 'Mobility', icon: 'grip', metricType: 'time', abilityIds: [] },
  { id: 'shoulder-cars', name: 'תנועתיות כתפיים (CARs)', category: 'Mobility', icon: 'mobility', metricType: 'time', abilityIds: [] },
  { id: 'hip-mobility', name: 'תנועתיות ירכיים', category: 'Mobility', icon: 'mobility', metricType: 'time', abilityIds: [] },
  { id: 'fatgrip-hang', name: 'Fat Grip / תלייה פסיבית', category: 'Mobility', icon: 'grip', metricType: 'time', abilityIds: [] },
  { id: 'pelvis-squat-mobility', name: 'פתיחת אגן וסקוואט עמוק', category: 'Mobility', icon: 'mobility', metricType: 'time', abilityIds: [] },

  // Accessory flow
  { id: 'ring-flow', name: 'רצף תנועה על טבעות', category: 'Accessory', icon: 'flow', metricType: 'time', abilityIds: [] },

  // Activities
  { id: 'emtb', name: 'רכיבת שטח eMTB', category: 'Activity', icon: 'bike', metricType: 'session', abilityIds: ['emtb'] },
  { id: 'bouldering', name: 'טיפוס בולדרינג', category: 'Activity', icon: 'climb', metricType: 'session', abilityIds: ['climbing'] },
  { id: 'athletic-finish', name: 'פיניש אתלטי', category: 'Activity', icon: 'carry', metricType: 'time', abilityIds: [] },
  { id: 'kb-circuit', name: 'שק אגרוף + קטלבלס', category: 'Activity', icon: 'dumbbell', metricType: 'time', abilityIds: ['heavybag'] },
  { id: 'recovery-walk', name: 'הליכת התאוששות', category: 'Activity', icon: 'walk', metricType: 'session', abilityIds: [] },
  { id: 'open-day', name: 'יום פתוח', category: 'Activity', icon: 'rest', metricType: 'session', abilityIds: [] },
];
