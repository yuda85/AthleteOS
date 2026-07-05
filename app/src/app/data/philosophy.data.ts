// Philosophy content — from Athlete OS Architecture + v1.1 back-protection principle.

export const PHILOSOPHY_TAGLINE = 'MOVE · TRAIN · BECOME';

export const PHILOSOPHY_INTRO =
  'שדרוג ממערכת הפעלה ממוקדת-שרירים למערכת מקיפה לחיים גמישים ועמידים. המטרה אינה להיות המרים הכי חזק בחדר — המטרה היא להפוך למי שמסוגל בצורה גבוהה, עם התמחות בכוח.';

export interface PhilosophyItem {
  icon: string;
  title: string;
  text: string;
}

export const PHILOSOPHIES: PhilosophyItem[] = [
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

export interface PillarInfo {
  key: string;
  title: string;
  text: string;
}

export const PILLARS: PillarInfo[] = [
  { key: 'skill', title: 'מיומנות (Skill)', text: 'רכישת יכולות פיזיות חדשות.' },
  { key: 'strength', title: 'כוח (Strength)', text: 'שימור תבניות תנועה כבדות.' },
  { key: 'staticStrength', title: 'כוח סטטי', text: 'שליטה בגוף באחיזות איזומטריות.' },
  { key: 'core', title: 'ליבה (Core)', text: 'ייצוב גלובלי והעברת כוח.' },
  { key: 'power', title: 'כוח מתפרץ (Power)', text: 'ייצור כוח מהיר.' },
  { key: 'movement', title: 'תנועה (Movement)', text: 'מעברים חופשיים וטבעיים בגוף.' },
  { key: 'grip', title: 'אחיזה (Grip)', text: 'מתח מלא בכל הגוף דרך הידיים.' },
  { key: 'conditioning', title: 'סיבולת (Conditioning)', text: 'קיבולת אירובית ואנאירובית.' },
  { key: 'mobility', title: 'תנועתיות (Mobility)', text: 'טווחי תנועה שימושיים.' },
  { key: 'resilience', title: 'עמידות (Resilience)', text: 'עמידות מפרקים והתאוששות אקטיבית.' },
];

export const DAILY_CHAIN: { title: string; text: string }[] = [
  { title: 'עוגן: מיומנות', text: 'דורש תרגול רציף. לעולם לא מדלגים.' },
  { title: 'מנוע: כוח', text: 'תנועות מורכבות וכבדות.' },
  { title: 'שריון: ליבה', text: 'ייצוב עמוק.' },
  { title: 'שלדה: נשיאה', text: 'תנועה תחת עומס.' },
  { title: 'תחזוקה: תנועתיות', text: 'טווחי תנועה, היגיינת עמוד שדרה והתאוששות.' },
];

export const CLOSING_LINE = 'אל תתאמן כדי להרים יותר. תתאמן כדי להיות מסוגל יותר.';
