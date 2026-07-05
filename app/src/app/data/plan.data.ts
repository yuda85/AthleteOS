import { PlanDay } from '../models/models';

// Weekly plan — from The Anchor Protocol, v1.1 program revisions applied.
// Items reference the exercise library by id; display strings stay Hebrew.
export const PLAN_DAYS: PlanDay[] = [
  {
    id: 'sun',
    dayIndex: 0,
    label: "יום א'",
    title: 'כוח אנכי',
    targetTime: '60 דקות',
    focus: 'משיכות אנכיות, עמידת ידיים, יציבות מעל הראש',
    sections: [
      {
        category: 'Skill',
        items: [
          { exerciseId: 'handstand', reps: '10 דקות', note: 'תרגול רענן למערכת העצבים', tier: 'primary' },
        ],
      },
      {
        category: 'Strength',
        items: [
          { exerciseId: 'weighted-pullup', sets: '4', reps: '5-8', rest: "2-3 דק'", note: 'משקל כבד, דגש אנכי', tier: 'primary' },
          { exerciseId: 'weighted-dips', sets: '4', reps: '5-8', rest: "2-3 דק'", note: 'טווח תנועה מלא', tier: 'primary' },
          { exerciseId: 'landmine-press', sets: '3', reps: '8-10', rest: "2 דק'", note: 'ירידה איטית ומבוקרת', tier: 'secondary' },
          { exerciseId: 'chest-supported-row', sets: '3', reps: '10-12', rest: "90 שנ'", note: 'משיכה אופקית — בריאות כתפיים ויציבות שכמות', tier: 'secondary' },
          { exerciseId: 'incline-db-press', sets: '3', reps: '8-12', rest: "90 שנ'", note: 'דחיקה אופקית ידידותית לכתף', tier: 'optional' },
        ],
      },
      {
        category: 'Core',
        items: [
          { exerciseId: 'pallof-suitcase', sets: '3', reps: "12 חז' / 40 מ'", rest: "60 שנ'", note: 'מניעת רוטציה. סבב נשיאות שבועי: חקלאי / מזוודה / Front Rack / מלצר', tier: 'secondary' },
        ],
      },
      {
        category: 'Mobility',
        items: [
          { exerciseId: 'shoulder-tspine-mobility', reps: '5 דקות', note: 'זרימה ושחרור' },
          { exerciseId: 'spine-hygiene', reps: '5-10 דקות', note: 'McGill Big 3, נשימה ותמיכה (Bracing)', tier: 'primary' },
        ],
      },
    ],
  },
  {
    id: 'mon',
    dayIndex: 1,
    label: "יום ב'",
    title: 'רגליים, קרקע וסיבולת',
    targetTime: 'אימון כפול',
    focus: 'רגליים, ציר ירך בטוח, קימה מהרצפה, סיבולת אחר הצהריים',
    sections: [
      {
        category: 'Skill',
        items: [
          { exerciseId: 'tgu', reps: '10 דקות', note: 'מעברים חלקים ושליטה', tier: 'primary' },
        ],
      },
      {
        category: 'Strength',
        items: [
          { exerciseId: 'bulgarian-split-squat', sets: '3', reps: '8-10 / רגל', rest: "2 דק'", note: 'גוף זקוף', tier: 'primary' },
          { exerciseId: 'hip-thrust', sets: '3', reps: '8-12', rest: "2 דק'", note: 'ציר ירך בעומס מינימלי על הגב — הבסיס לשרשרת האחורית', tier: 'primary' },
          { exerciseId: 'single-leg-rdl', sets: '3', reps: '8-10', rest: "90 שנ'", note: 'התקדמות: RDL קטלבל ← סווינג ← RDL מוט (מתון) — רק ללא כאב', tier: 'secondary' },
          { exerciseId: 'goblet-squat', sets: '3', reps: '10-12', rest: "90 שנ'", note: 'התקדמות עתידית: פרונט סקוואט / קטלבל כפול. לא רודפים סקוואט גב מקסימלי', tier: 'secondary' },
        ],
      },
      {
        category: 'Accessory',
        items: [
          { exerciseId: 'ring-pushups', sets: '3', reps: '10-15', rest: "90 שנ'", note: 'מתיחה עמוקה בתחתית', tier: 'secondary' },
          { exerciseId: 'ring-row', sets: '3', reps: '8-12', rest: "90 שנ'", note: 'נפח משיכה אופקית — יציבה וטיפוס', tier: 'secondary' },
        ],
      },
      {
        category: 'Core',
        items: [
          { exerciseId: 'birddog-sideplank', sets: '3', reps: "10 חז' / 45 שנ'", rest: "60 שנ'", note: 'שליטה אבסולוטית — חלק מהיגיינת עמוד השדרה', tier: 'primary' },
        ],
      },
      {
        category: 'Activity',
        items: [
          { exerciseId: 'emtb', reps: '2-3 שעות', note: 'פעילות ערב' },
          { exerciseId: 'athletic-finish', reps: '20 דקות', note: 'הליכת חקלאי, תלייה פסיבית, שהייה בסקוואט עמוק' },
        ],
      },
    ],
  },
  {
    id: 'tue',
    dayIndex: 2,
    label: "יום ג'",
    title: 'טיפוס והתאוששות אקטיבית',
    targetTime: 'שעתיים',
    focus: 'רכישת מיומנות, אחיזה, תנועתיות מפרקים — ללא עומס משקלים כבד',
    sections: [
      {
        category: 'Skill',
        items: [
          { exerciseId: 'handstand', reps: '10 דקות', note: 'לפני הטיפוס, כשהמערכת העצבית רעננה', tier: 'primary' },
        ],
      },
      {
        category: 'Activity',
        items: [
          { exerciseId: 'bouldering', reps: 'שעתיים', note: 'עבודת רגליים טכנית, קריאת מסלולים ותנועה דינמית', tier: 'primary' },
        ],
      },
      {
        category: 'Mobility',
        items: [
          { exerciseId: 'hanging', reps: '10 דקות', note: 'תלייה אקטיבית ופסיבית לפריקת עומס מעמוד השדרה' },
          { exerciseId: 'shoulder-cars', note: 'סיבובי מפרקים מבוקרים' },
          { exerciseId: 'hip-mobility', note: 'ישיבת 90/90 או שהייה ארוכה בסקוואט עמוק' },
        ],
      },
    ],
  },
  {
    id: 'wed',
    dayIndex: 3,
    label: "יום ד'",
    title: 'דחיפה, כוח מתפרץ או ויסות עומסים',
    focus: 'לפי מצב גופני: רענן → Strength C. עייף → התאוששות אקטיבית',
    sections: [
      {
        category: 'Skill',
        items: [
          { exerciseId: 'handstand', reps: '10 דקות', note: 'הכנת מפרקי כף היד תחילה', tier: 'primary' },
        ],
      },
      {
        category: 'Strength',
        items: [
          { exerciseId: 'ohp', sets: '4', reps: '5-8', rest: "2-3 דק'", note: 'ליבה מוחזקת היטב', tier: 'primary' },
          { exerciseId: 'weighted-chinup', sets: '4', reps: '5-8', rest: "2-3 דק'", note: 'נעילה מלאה בתחתית', tier: 'primary' },
          { exerciseId: 'one-arm-db-row', sets: '3', reps: '10-12 / יד', rest: "90 שנ'", note: 'נתמך על ספסל — משיכה אופקית ללא עומס גב', tier: 'secondary' },
          { exerciseId: 'step-ups', sets: '3', reps: '10 / רגל', rest: "90 שנ'", note: 'דחיפה מהעקב', tier: 'secondary' },
        ],
      },
      {
        category: 'Power',
        items: [
          { exerciseId: 'box-jump', sets: '3', reps: '3-5', rest: "90 שנ'", note: 'כוח מתפרץ לפלג גוף תחתון — נחיתה רכה ומבוקרת', tier: 'primary' },
          { exerciseId: 'heavy-bag', sets: '3', reps: '3 דקות סבב', rest: "60 שנ'", note: 'כוח רוטציוני, כוונה מקסימלית', tier: 'secondary' },
        ],
      },
      {
        category: 'Core',
        items: [
          { exerciseId: 'frontrack-deadbug', sets: '3', reps: "40 מ' / 12 חז'", rest: "60 שנ'", note: 'סבב נשיאות: גם מלצר / קטלבל הפוך (Bottom-Up)', tier: 'secondary' },
        ],
      },
      {
        category: 'Mobility',
        items: [
          { exerciseId: 'spine-hygiene', reps: '5-10 דקות', note: 'McGill Big 3 / תלייה / Hip Airplanes / נשימה', tier: 'primary' },
        ],
      },
    ],
  },
  {
    id: 'thu',
    dayIndex: 4,
    label: "יום ה'",
    title: 'מיומנות יומית ותנועה חופשית',
    targetTime: '30-45 דקות',
    focus: 'חיווט עצבי, בריאות מפרקים, זרימת תנועה — היעד: אפס עייפות',
    sections: [
      {
        category: 'Skill',
        items: [
          { exerciseId: 'handstand', reps: '10 דקות', note: 'לחץ אצבעות וקו גוף ישר', tier: 'primary' },
          { exerciseId: 'tgu', reps: '10 דקות', note: 'משקל קל, מכניקה מושלמת', tier: 'primary' },
        ],
      },
      {
        category: 'Accessory',
        items: [
          { exerciseId: 'ring-flow', reps: '10 דקות', note: 'תמיכה, היפוך ומעברים', tier: 'secondary' },
        ],
      },
      {
        category: 'Mobility',
        items: [
          { exerciseId: 'fatgrip-hang', reps: '5 דקות', note: 'צבירת זמן כולל' },
          { exerciseId: 'pelvis-squat-mobility', reps: '10 דקות', note: 'מתיחות פסיביות ונשימה' },
        ],
      },
    ],
  },
  {
    id: 'fri',
    dayIndex: 5,
    label: "יום ו'",
    title: 'בונוס, גמישות והתאוששות מוחלטת',
    focus: 'בחירת תנועה — כל אופציה תקפה',
    sections: [
      {
        category: 'Activity',
        items: [
          { exerciseId: 'emtb', note: 'אופציה א׳: סיבולת Zone 2' },
          { exerciseId: 'kb-circuit', note: 'אופציה ב׳: מעגל קטלבלס + מוביליטי' },
          { exerciseId: 'recovery-walk', reps: '30-45 דקות', note: 'אופציה ג׳: + 20 דקות גליל עיסוי' },
        ],
      },
    ],
  },
  {
    id: 'sat',
    dayIndex: 6,
    label: 'שבת',
    title: 'המשבצת הפתוחה',
    focus: 'טיול משפחתי, אימון נוסף, או מנוחה מוחלטת',
    sections: [
      {
        category: 'Activity',
        items: [
          { exerciseId: 'open-day', note: 'טיול משפחתי, אימון טיפוס נוסף, או מנוחה מוחלטת' },
        ],
      },
    ],
  },
];

export const SYSTEM_RULE =
  'ימים ג׳, ה׳, ו׳ ושבת אינם עוגנים. אם החיים עמוסים ודילגת עליהם — השבוע עדיין הצלחה של 100%. שמור על העוגנים, ושחרר את השאר בסוף השבוע.';
