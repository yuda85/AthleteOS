// AthleteOS content data — extracted from The Anchor Protocol (workout tables) and
// Athlete OS Architecture (philosophy) PDFs, updated per v1.1 program revisions:
// safer hinge progression, more horizontal pulling/pressing, carry rotation,
// lower-body power, daily spine hygiene, exercise tiers. Hebrew, RTL. Static data only.

const CATEGORY_META = {
  Skill: { label: 'מיומנות', color: 'var(--cat-skill)' },
  Strength: { label: 'כוח', color: 'var(--cat-strength)' },
  Core: { label: 'ליבה', color: 'var(--cat-core)' },
  Carry: { label: 'נשיאה', color: 'var(--cat-carry)' },
  Accessory: { label: 'עזר', color: 'var(--cat-core)' },
  Power: { label: 'כוח מתפרץ', color: 'var(--cat-power)' },
  Mobility: { label: 'תנועתיות', color: 'var(--cat-mobility)' },
  Activity: { label: 'פעילות', color: 'var(--cat-mobility)' },
};

const TIER_META = {
  primary: { label: 'ראשי' },
  secondary: { label: 'משני' },
  optional: { label: 'אופציונלי' },
};

// index 0..6 matches JS Date.getDay() (0 = Sunday ... 6 = Saturday)
const PLAN_DATA = [
  {
    id: 'sun',
    label: "יום א'",
    title: 'כוח אנכי',
    targetTime: '60 דקות',
    focus: 'משיכות אנכיות, עמידת ידיים, יציבות מעל הראש',
    sections: [
      {
        category: 'Skill',
        exercises: [
          { name: 'עמידת ידיים', icon: 'skillHandstand', reps: '10 דקות', note: 'תרגול רענן למערכת העצבים', tier: 'primary' },
        ],
      },
      {
        category: 'Strength',
        exercises: [
          { name: 'מתח עם משקל', icon: 'pull', sets: '4', reps: '5-8', rest: "2-3 דק'", note: 'משקל כבד, דגש אנכי', tier: 'primary' },
          { name: 'מקבילים עם משקל', icon: 'push', sets: '4', reps: '5-8', rest: "2-3 דק'", note: 'טווח תנועה מלא', tier: 'primary' },
          { name: 'לחיצת כתפיים (Landmine)', icon: 'push', sets: '3', reps: '8-10', rest: "2 דק'", note: 'ירידה איטית ומבוקרת', tier: 'secondary' },
          { name: 'חתירה בהישענות על ספסל', icon: 'pull', sets: '3', reps: '10-12', rest: "90 שנ'", note: 'משיכה אופקית — בריאות כתפיים ויציבות שכמות', tier: 'secondary' },
          { name: 'לחיצת שיפוע עם משקולות', icon: 'push', sets: '3', reps: '8-12', rest: "90 שנ'", note: 'דחיקה אופקית ידידותית לכתף', tier: 'optional' },
        ],
      },
      {
        category: 'Core',
        exercises: [
          { name: 'Pallof Press + נשיאת מזוודה', icon: 'core', sets: '3', reps: "12 חז' / 40 מ'", rest: "60 שנ'", note: 'מניעת רוטציה. סבב נשיאות שבועי: חקלאי / מזוודה / Front Rack / מלצר', tier: 'secondary' },
        ],
      },
      {
        category: 'Mobility',
        exercises: [
          { name: 'כתפיים ועמוד שדרה חזי', icon: 'mobility', reps: '5 דקות', note: 'זרימה ושחרור' },
          { name: 'היגיינת עמוד שדרה', icon: 'core', reps: '5-10 דקות', note: 'McGill Big 3, נשימה ותמיכה (Bracing)', tier: 'primary' },
        ],
      },
    ],
  },
  {
    id: 'mon',
    label: "יום ב'",
    title: 'רגליים, קרקע וסיבולת',
    targetTime: 'אימון כפול',
    focus: 'רגליים, ציר ירך בטוח, קימה מהרצפה, סיבולת אחר הצהריים',
    sections: [
      {
        category: 'Skill',
        exercises: [
          { name: 'קימה טורקית (TGU)', icon: 'skillTgu', reps: '10 דקות', note: 'מעברים חלקים ושליטה', tier: 'primary' },
        ],
      },
      {
        category: 'Strength',
        exercises: [
          { name: 'סקוואט בולגרי', icon: 'squat', sets: '3', reps: '8-10 / רגל', rest: "2 דק'", note: 'גוף זקוף', tier: 'primary' },
          { name: 'היפ תראסט / גשר ירכיים', icon: 'dumbbell', sets: '3', reps: '8-12', rest: "2 דק'", note: 'ציר ירך בעומס מינימלי על הגב — הבסיס לשרשרת האחורית', tier: 'primary' },
          { name: 'דדליפט רומני על רגל אחת', icon: 'squat', sets: '3', reps: '8-10', rest: "90 שנ'", note: 'התקדמות: RDL קטלבל ← סווינג ← RDL מוט (מתון) — רק ללא כאב', tier: 'secondary' },
          { name: 'גובלט סקוואט', icon: 'squat', sets: '3', reps: '10-12', rest: "90 שנ'", note: 'התקדמות עתידית: פרונט סקוואט / קטלבל כפול. לא רודפים סקוואט גב מקסימלי', tier: 'secondary' },
        ],
      },
      {
        category: 'Accessory',
        exercises: [
          { name: 'שכיבות סמיכה בטבעות', icon: 'push', sets: '3', reps: '10-15', rest: "90 שנ'", note: 'מתיחה עמוקה בתחתית', tier: 'secondary' },
          { name: 'חתירה בטבעות', icon: 'pull', sets: '3', reps: '8-12', rest: "90 שנ'", note: 'נפח משיכה אופקית — יציבה וטיפוס', tier: 'secondary' },
        ],
      },
      {
        category: 'Core',
        exercises: [
          { name: 'בירד דוג + פלאנק צד', icon: 'core', sets: '3', reps: "10 חז' / 45 שנ'", rest: "60 שנ'", note: 'שליטה אבסולוטית — חלק מהיגיינת עמוד השדרה', tier: 'primary' },
        ],
      },
      {
        category: 'Activity',
        exercises: [
          { name: 'רכיבת שטח eMTB', icon: 'bike', reps: '2-3 שעות', note: 'פעילות ערב' },
          { name: 'פיניש אתלטי', icon: 'carry', reps: '20 דקות', note: 'הליכת חקלאי, תלייה פסיבית, שהייה בסקוואט עמוק' },
        ],
      },
    ],
  },
  {
    id: 'tue',
    label: "יום ג'",
    title: 'טיפוס והתאוששות אקטיבית',
    targetTime: 'שעתיים',
    focus: 'רכישת מיומנות, אחיזה, תנועתיות מפרקים — ללא עומס משקלים כבד',
    sections: [
      {
        category: 'Skill',
        exercises: [
          { name: 'עמידת ידיים (חימום קדם-אימון)', icon: 'skillHandstand', reps: '10 דקות', note: 'לפני הטיפוס, כשהמערכת העצבית רעננה', tier: 'primary' },
        ],
      },
      {
        category: 'Activity',
        exercises: [
          { name: 'טיפוס בולדרינג', icon: 'climb', reps: 'שעתיים', note: 'עבודת רגליים טכנית, קריאת מסלולים ותנועה דינמית', tier: 'primary' },
        ],
      },
      {
        category: 'Mobility',
        exercises: [
          { name: 'תלייה (Hanging)', icon: 'grip', reps: '10 דקות', note: 'תלייה אקטיבית ופסיבית לפריקת עומס מעמוד השדרה' },
          { name: 'תנועתיות כתפיים (CARs)', icon: 'mobility', note: 'סיבובי מפרקים מבוקרים' },
          { name: 'תנועתיות ירכיים', icon: 'mobility', note: 'ישיבת 90/90 או שהייה ארוכה בסקוואט עמוק' },
        ],
      },
    ],
  },
  {
    id: 'wed',
    label: "יום ד'",
    title: 'דחיפה, כוח מתפרץ או ויסות עומסים',
    focus: 'לפי מצב גופני: רענן → Strength C. עייף → התאוששות אקטיבית',
    sections: [
      {
        category: 'Skill',
        exercises: [
          { name: 'עמידת ידיים', icon: 'skillHandstand', reps: '10 דקות', note: 'הכנת מפרקי כף היד תחילה', tier: 'primary' },
        ],
      },
      {
        category: 'Strength',
        exercises: [
          { name: 'לחיצת כתפיים בעמידה (OHP)', icon: 'push', sets: '4', reps: '5-8', rest: "2-3 דק'", note: 'ליבה מוחזקת היטב', tier: 'primary' },
          { name: 'מתח בקירוב עם משקל (Chin-Up)', icon: 'pull', sets: '4', reps: '5-8', rest: "2-3 דק'", note: 'נעילה מלאה בתחתית', tier: 'primary' },
          { name: 'חתירת משקולת ביד אחת', icon: 'pull', sets: '3', reps: '10-12 / יד', rest: "90 שנ'", note: 'נתמך על ספסל — משיכה אופקית ללא עומס גב', tier: 'secondary' },
          { name: 'עלייה מדרגה (Step Ups)', icon: 'squat', sets: '3', reps: '10 / רגל', rest: "90 שנ'", note: 'דחיפה מהעקב', tier: 'secondary' },
        ],
      },
      {
        category: 'Power',
        exercises: [
          { name: 'קפיצה לארגז / קפיצה לרוחק', icon: 'power', sets: '3', reps: '3-5', rest: "90 שנ'", note: 'כוח מתפרץ לפלג גוף תחתון — נחיתה רכה ומבוקרת', tier: 'primary' },
          { name: 'שק אגרוף — כוח מתפרץ', icon: 'power', sets: '3', reps: '3 דקות סבב', rest: "60 שנ'", note: 'כוח רוטציוני, כוונה מקסימלית', tier: 'secondary' },
        ],
      },
      {
        category: 'Core',
        exercises: [
          { name: 'נשיאת Front Rack + דד באג', icon: 'carry', sets: '3', reps: "40 מ' / 12 חז'", rest: "60 שנ'", note: 'סבב נשיאות: גם מלצר / קטלבל הפוך (Bottom-Up)', tier: 'secondary' },
        ],
      },
      {
        category: 'Mobility',
        exercises: [
          { name: 'היגיינת עמוד שדרה', icon: 'core', reps: '5-10 דקות', note: 'McGill Big 3 / תלייה / Hip Airplanes / נשימה', tier: 'primary' },
        ],
      },
    ],
  },
  {
    id: 'thu',
    label: "יום ה'",
    title: 'מיומנות יומית ותנועה חופשית',
    targetTime: '30-45 דקות',
    focus: 'חיווט עצבי, בריאות מפרקים, זרימת תנועה — היעד: אפס עייפות',
    sections: [
      {
        category: 'Skill',
        exercises: [
          { name: 'תרגול עמידת ידיים', icon: 'skillHandstand', reps: '10 דקות', note: 'לחץ אצבעות וקו גוף ישר', tier: 'primary' },
          { name: 'קימה טורקית (TGU)', icon: 'skillTgu', reps: '10 דקות', note: 'משקל קל, מכניקה מושלמת', tier: 'primary' },
        ],
      },
      {
        category: 'Accessory',
        exercises: [
          { name: 'רצף תנועה על טבעות', icon: 'flow', reps: '10 דקות', note: 'תמיכה, היפוך ומעברים', tier: 'secondary' },
        ],
      },
      {
        category: 'Mobility',
        exercises: [
          { name: 'Fat Grip / תלייה פסיבית', icon: 'grip', reps: '5 דקות', note: 'צבירת זמן כולל' },
          { name: 'פתיחת אגן וסקוואט עמוק', icon: 'mobility', reps: '10 דקות', note: 'מתיחות פסיביות ונשימה' },
        ],
      },
    ],
  },
  {
    id: 'fri',
    label: "יום ו'",
    title: 'בונוס, גמישות והתאוששות מוחלטת',
    focus: 'בחירת תנועה — כל אופציה תקפה',
    sections: [
      {
        category: 'Activity',
        exercises: [
          { name: 'אופציה א׳: רכיבת eMTB', icon: 'bike', note: 'סיבולת Zone 2' },
          { name: 'אופציה ב׳: שק אגרוף + קטלבלס', icon: 'dumbbell', note: 'מעגל קטלבלס + מוביליטי' },
          { name: 'אופציה ג׳: הליכת התאוששות', icon: 'walk', reps: '30-45 דקות', note: '+ 20 דקות גליל עיסוי' },
        ],
      },
    ],
  },
  {
    id: 'sat',
    label: 'שבת',
    title: 'המשבצת הפתוחה',
    focus: 'טיול משפחתי, אימון נוסף, או מנוחה מוחלטת',
    sections: [
      {
        category: 'Activity',
        exercises: [
          { name: 'יום פתוח', icon: 'rest', note: 'טיול משפחתי, אימון טיפוס נוסף, או מנוחה מוחלטת' },
        ],
      },
    ],
  },
];

const SYSTEM_RULE = 'ימים ג׳, ה׳, ו׳ ושבת אינם עוגנים. אם החיים עמוסים ודילגת עליהם — השבוע עדיין הצלחה של 100%. שמור על העוגנים, ושחרר את השאר בסוף השבוע.';

// ---- Philosophy content (from Athlete OS Architecture + v1.1 back-protection principle) ----

const PHILOSOPHY_TAGLINE = 'MOVE · TRAIN · BECOME';
const PHILOSOPHY_INTRO = 'שדרוג ממערכת הפעלה ממוקדת-שרירים למערכת מקיפה לחיים גמישים ועמידים. המטרה אינה להיות המרים הכי חזק בחדר — המטרה היא להפוך למי שמסוגל בצורה גבוהה, עם התמחות בכוח.';

const PHILOSOPHIES = [
  {
    icon: 'flow',
    title: '1. אימון לחיים',
    text: 'כל תרגיל חייב לשפר את היכולת לחיות, לזוז ולתפקד מחוץ לחדר הכושר. הכל בנוי סביב אופק של 20 שנה.',
  },
  {
    icon: 'mobility',
    title: '2. תנועה קודמת לכל',
    text: 'איכות התנועה יוצרת כוח. כוח לא בהכרח יוצר איכות תנועה. מכניקה נכונה קובעת את העומס.',
  },
  {
    icon: 'core',
    title: '3. יכולות > שרירים',
    text: 'האימון מאורגן סביב תבניות תנועה (דחיפה, משיכה, נשיאה, זחילה, טיפוס, קפיצה) ולא סביב קבוצות שרירים בודדות.',
  },
  {
    icon: 'rest',
    title: '4. בריאות לפני אגו',
    text: 'המטרה אינה לשבור שיאים אישיים במחיר הגוף. המטרה היא אימון רציף לאורך עשורים.',
  },
  {
    icon: 'skillHandstand',
    title: '5. הגנת הגב',
    text: 'לעולם לא מקריבים איכות תנועה בשביל עומס. עמוד שדרה ניטרלי, תמיכה (Bracing) מצוינת, טמפו מבוקר וטווח ללא כאב — עמידות לטווח ארוך לפני כוח לטווח קצר.',
  },
];

const PILLARS = [
  { title: 'מיומנות (Skill)', text: 'רכישת יכולות פיזיות חדשות.' },
  { title: 'כוח (Strength)', text: 'שימור תבניות תנועה כבדות.' },
  { title: 'כוח סטטי', text: 'שליטה בגוף באחיזות איזומטריות.' },
  { title: 'ליבה (Core)', text: 'ייצוב גלובלי והעברת כוח.' },
  { title: 'כוח מתפרץ (Power)', text: 'ייצור כוח מהיר.' },
  { title: 'תנועה (Movement)', text: 'מעברים חופשיים וטבעיים בגוף.' },
  { title: 'אחיזה (Grip)', text: 'מתח מלא בכל הגוף דרך הידיים.' },
  { title: 'סיבולת (Conditioning)', text: 'קיבולת אירובית ואנאירובית.' },
  { title: 'תנועתיות (Mobility)', text: 'טווחי תנועה שימושיים.' },
  { title: 'עמידות (Resilience)', text: 'עמידות מפרקים והתאוששות אקטיבית.' },
];

const DAILY_CHAIN = [
  { title: 'עוגן: מיומנות', text: 'דורש תרגול רציף. לעולם לא מדלגים.' },
  { title: 'מנוע: כוח', text: 'תנועות מורכבות וכבדות.' },
  { title: 'שריון: ליבה', text: 'ייצוב עמוק.' },
  { title: 'שלדה: נשיאה', text: 'תנועה תחת עומס.' },
  { title: 'תחזוקה: תנועתיות', text: 'טווחי תנועה, היגיינת עמוד שדרה והתאוששות.' },
];

const CLOSING_LINE = 'אל תתאמן כדי להרים יותר. תתאמן כדי להיות מסוגל יותר.';
