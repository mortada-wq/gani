/**
 * Music parameter definitions and auto-fill rules for Sahib App — Ghun Music Studio
 */

/** Sentinel value for “let the engine decide” — Arabic UI copy */
export const PARAM_AUTO = "تلقائي";

export interface MusicParams {
  maqam?: string;
  rhythm?: string;
  leadInstrument?: string;
  vocalStyle?: string;
  era?: string;
  percussionKit?: string;
  tempo?: number;
  emotionalCore?: string;
  dialect?: string;
  reverbSpace?: string;
  songStructure?: string;
  lyricsTheme?: string;
}

export const MAQAMS = [
  PARAM_AUTO,
  "بيات",
  "راست",
  "حجاز",
  "صبا",
  "كُرد",
  "سيكاه",
  "نهاوند",
  "لمّي",
  "حسيني",
  "دشت",
];

export const RHYTHMS = [
  PARAM_AUTO,
  "تشوبي",
  "هجعة",
  "جرغينة",
  "سماعي",
  "مضاعف",
  "وحدة",
  "يورُك",
  "إيقاع حر",
];

export const LEAD_INSTRUMENTS = [
  PARAM_AUTO,
  "الجوزة",
  "السنتور",
  "العود",
  "الناي",
  "القانون",
  "الكمان",
];

export const VOCAL_STYLES = [
  PARAM_AUTO,
  "موال",
  "عتابا",
  "أبوذية",
  "بِستة",
  "سرد حسيني",
  "غناء عصري",
  "غناء مقامي تراثي",
];

export const ERAS = [
  PARAM_AUTO,
  "إذاعة الخمسينات",
  "فينيل السبعينات",
  "كاسيت التسعينات",
  "استوديو عصري",
  "حنين لو-فاي",
];

export const PERCUSSION_KITS = [
  PARAM_AUTO,
  "مجموعة تراثية (رقّ ودُمبك)",
  "خشبة جنوبية",
  "دربكة وطبل",
  "دمج إيقاعي عصري",
];

export const EMOTIONS = [
  PARAM_AUTO,
  "حنين",
  "حزن شجَني",
  "فخر",
  "فرح",
  "روحاني",
  "غرام",
  "كَمَد لطيف",
];

export const DIALECTS = [
  PARAM_AUTO,
  "بغدادي",
  "جنوبي (بصري)",
  "ريفي",
  "فصحى عصرية رصينة",
];

export const REVERBS = [
  PARAM_AUTO,
  "مقهى حميم",
  "صالة أفراح",
  "جامع مهيب",
  "استوديو جاف",
  "حجرة أنالوج",
];

export const STRUCTURES = [
  PARAM_AUTO,
  "تراثي (مقدّمة — تحرير — بيت — خاتمة)",
  "معياري (بيت ولازمة)",
  "متوازن (موال — بِستة — موال)",
  "مسار سينمائي",
];

export const THEMES = [
  PARAM_AUTO,
  "غرام واشتياق",
  "وطن وغربة",
  "تقوى وخشوع",
  "نضال اجتماعي",
  "الطبيعة ودجلة",
];

export const AUTO_FILL_RULES: Record<string, Partial<MusicParams>> = {
  تشوبي: {
    tempo: 110,
    emotionalCore: "فرح",
    vocalStyle: "غناء عصري",
    reverbSpace: "صالة أفراح",
    percussionKit: "خشبة جنوبية",
  },
  موال: {
    tempo: 60,
    emotionalCore: "حنين",
    rhythm: "إيقاع حر",
    reverbSpace: "مقهى حميم",
  },
  لمّي: {
    emotionalCore: "حزن شجَني",
    tempo: 75,
    leadInstrument: "الجوزة",
    dialect: "بغدادي",
  },
  "فينيل السبعينات": {
    reverbSpace: "حجرة أنالوج",
    rhythm: "جرغينة",
    tempo: 90,
  },
  "سرد حسيني": {
    emotionalCore: "روحاني",
    reverbSpace: "جامع مهيب",
    rhythm: "إيقاع حر",
  },
  هجعة: {
    tempo: 125,
    percussionKit: "خشبة جنوبية",
    emotionalCore: "فخر",
  },
};

export const applyAutoFill = (currentParams: MusicParams): MusicParams => {
  const result = { ...currentParams };
  
  // Apply rhythm-based rules
  if (currentParams.rhythm && AUTO_FILL_RULES[currentParams.rhythm]) {
    const rules = AUTO_FILL_RULES[currentParams.rhythm];
    Object.entries(rules).forEach(([key, value]) => {
      if (!result[key as keyof MusicParams] || result[key as keyof MusicParams] === PARAM_AUTO) {
        (result as any)[key] = value;
      }
    });
  }

  // Apply vocal-style rules
  if (currentParams.vocalStyle && AUTO_FILL_RULES[currentParams.vocalStyle]) {
    const rules = AUTO_FILL_RULES[currentParams.vocalStyle];
    Object.entries(rules).forEach(([key, value]) => {
      if (!result[key as keyof MusicParams] || result[key as keyof MusicParams] === PARAM_AUTO) {
        (result as any)[key] = value;
      }
    });
  }

  // Apply era rules
  if (currentParams.era && AUTO_FILL_RULES[currentParams.era]) {
    const rules = AUTO_FILL_RULES[currentParams.era];
    Object.entries(rules).forEach(([key, value]) => {
      if (!result[key as keyof MusicParams] || result[key as keyof MusicParams] === PARAM_AUTO) {
        (result as any)[key] = value;
      }
    });
  }

  // Apply maqam-based rules (e.g. لمّي)
  if (currentParams.maqam && AUTO_FILL_RULES[currentParams.maqam]) {
    const rules = AUTO_FILL_RULES[currentParams.maqam];
    Object.entries(rules).forEach(([key, value]) => {
      if (!result[key as keyof MusicParams] || result[key as keyof MusicParams] === PARAM_AUTO) {
        (result as any)[key] = value;
      }
    });
  }

  return result;
};

export const stitchGoldenPrompt = (params: MusicParams, lyrics?: string): string => {
  const p = { ...params };
  Object.keys(p).forEach((key) => {
    if (p[key as keyof MusicParams] === PARAM_AUTO) {
      delete p[key as keyof MusicParams];
    }
  });

  const bpm = p.tempo || 90;
  const spec = JSON.stringify(p);

  let prompt = `Generate authentic Iraqi maqam music. Structured parameters (Arabic labels): ${spec}. Target tempo: ${bpm} BPM. Preserve microtonal inflection, idiomatic ornamentation, and Iraqi rhythmic feel.`;

  if (lyrics) {
    prompt += `\n\nLyrics (Iraqi dialect):\n${lyrics}\n\nAlign melody and syllable stress to the lyrics; honor the chosen rhythm and maqam.`;
  }

  return prompt;
};
