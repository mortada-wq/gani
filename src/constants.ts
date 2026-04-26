/**
 * Music parameter definitions and auto-fill rules for Sahib App — Ghun Music Studio
 */

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
  "Automatic", "Bayat", "Rast", "Hijaz", "Saba", "Kurdess", "Sika", "Nahawand", "Lammi", "Hussaini", "Dasht"
];

export const RHYTHMS = [
  "Automatic", "Chobi", "Hacha'a", "Georgina", "Sama'i", "Moudha'af", "Wahda", "Yuruk"
];

export const LEAD_INSTRUMENTS = [
  "Automatic", "Joza (Spike Fiddle)", "Santur (Hammered Dulcimer)", "Oud", "Nay", "Qanun", "Violin"
];

export const VOCAL_STYLES = [
  "Automatic", "Mawwal", "Ataba", "Abuthiya", "Pesta", "Hussaini Chanting", "Modern Pop", "Traditional Maqam"
];

export const ERAS = [
  "Automatic", "1950s Radio", "1970s Vinyl", "1990s Cassette", "Modern Studio", "Lo-Fi Nostalgia"
];

export const PERCUSSION_KITS = [
  "Automatic", "Traditional Ensemble (Riq, Dumbak)", "Khishba (Southern Wood)", "Darbuka & Tabl", "Modern Hybrid"
];

export const EMOTIONS = [
  "Automatic", "Nostalgia", "Sorrow (Shjan)", "Pride", "Joy", "Spiritual", "Romantic", "Melancholy"
];

export const DIALECTS = [
  "Automatic", "Baghdadi", "Southern (Basra)", "Rural (Reefy)", "Classic Modern Standard"
];

export const REVERBS = [
  "Automatic", "Intimate Café", "Wedding Hall", "Grand Mosque", "Studio Dry", "Analog Chamber"
];

export const STRUCTURES = [
  "Automatic", "Traditional (Intro-Tahrir-Verse-Outro)", "Standard (Verse-Chorus)", "Symmetrical (Mawwal-Pesta-Mawwal)", "Cinematic Suite"
];

export const THEMES = [
  "Automatic", "Love & Longing", "Homeland & Exile", "Spiritual Devotion", "Social Struggle", "Nature & Tigris"
];

export const AUTO_FILL_RULES: Record<string, Partial<MusicParams>> = {
  "Chobi": {
    tempo: 110,
    emotionalCore: "Joy",
    vocalStyle: "Modern Pop",
    reverbSpace: "Wedding Hall",
    percussionKit: "Khishba (Southern Wood)"
  },
  "Mawwal": {
    tempo: 60,
    emotionalCore: "Nostalgia",
    rhythm: "Free (No Rhythm)",
    reverbSpace: "Intimate Café"
  },
  "Lammi": {
    emotionalCore: "Sorrow (Shjan)",
    tempo: 75,
    leadInstrument: "Joza (Spike Fiddle)",
    dialect: "Baghdadi"
  },
  "1970s Vinyl": {
    reverbSpace: "Analog Chamber",
    rhythm: "Georgina",
    tempo: 90
  },
  "Hussaini Chanting": {
    emotionalCore: "Spiritual",
    reverbSpace: "Grand Mosque",
    rhythm: "Free (No Rhythm)"
  },
  "Hacha'a": {
    tempo: 125,
    percussionKit: "Khishba (Southern Wood)",
    emotionalCore: "Pride"
  }
};

export const applyAutoFill = (currentParams: MusicParams): MusicParams => {
  const result = { ...currentParams };
  
  // Apply rhythm-based rules
  if (currentParams.rhythm && AUTO_FILL_RULES[currentParams.rhythm]) {
    const rules = AUTO_FILL_RULES[currentParams.rhythm];
    Object.entries(rules).forEach(([key, value]) => {
      if (!result[key as keyof MusicParams] || result[key as keyof MusicParams] === "Automatic") {
        (result as any)[key] = value;
      }
    });
  }

  // Apply vocal-style rules
  if (currentParams.vocalStyle && AUTO_FILL_RULES[currentParams.vocalStyle]) {
    const rules = AUTO_FILL_RULES[currentParams.vocalStyle];
    Object.entries(rules).forEach(([key, value]) => {
      if (!result[key as keyof MusicParams] || result[key as keyof MusicParams] === "Automatic") {
        (result as any)[key] = value;
      }
    });
  }

  // Apply era rules
  if (currentParams.era && AUTO_FILL_RULES[currentParams.era]) {
    const rules = AUTO_FILL_RULES[currentParams.era];
    Object.entries(rules).forEach(([key, value]) => {
      if (!result[key as keyof MusicParams] || result[key as keyof MusicParams] === "Automatic") {
        (result as any)[key] = value;
      }
    });
  }

  return result;
};

export const stitchGoldenPrompt = (params: MusicParams, lyrics?: string): string => {
  const p = { ...params };
  Object.keys(p).forEach(key => {
    if (p[key as keyof MusicParams] === "Automatic") {
      delete p[key as keyof MusicParams];
    }
  });

  const era = p.era || "High-fidelity";
  const maqam = p.maqam || "Iraqi Maqam";
  const dialect = p.dialect || "Iraqi style";
  const leadInst = p.leadInstrument || "Traditional instruments";
  const percussion = p.percussionKit || "Traditional percussion";
  const rhythm = p.rhythm || "Standard rhythm";
  const bpm = p.tempo || 90;
  const vocalStyle = p.vocalStyle || "Authentic";
  const emotion = p.emotionalCore || "Soulful";
  const structure = p.songStructure || "Standard structure";
  const reverb = p.reverbSpace || "Studio";

  let prompt = `A ${era} recording of ${maqam} Iraqi music in ${dialect}. 
Featuring a ${leadInst} as the primary melodic voice, accompanied by ${percussion}. 
The rhythm is ${rhythm} at ${bpm} BPM. ${vocalStyle} vocals with a ${emotion} mood. 
${structure}. ${reverb} acoustics.`;

  if (lyrics) {
    prompt += `\n\nLyrics:\n${lyrics}\n\nThe melodic line follows the Arabic lyrics with proper maqam ornamentation, microtonal slides, and syllable timing matched to the ${rhythm} rhythm pattern.`;
  }

  return prompt;
};
