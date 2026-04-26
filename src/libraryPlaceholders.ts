/**
 * Placeholder entries for the generation library UI (design-system gradients).
 */

export interface LibraryPlaceholder {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  badge: string;
  gradient: string;
  barTint: "orange" | "teal" | "sky" | "slate";
  /** Short mood tags on the art tile */
  tags: string[];
  /** Shown under «الموجه» like a model prompt */
  promptLine: string;
}

export interface HookSample {
  id: string;
  line: string;
  vibe: string;
}

export const HOOK_SAMPLES: HookSample[] = [
  { id: "hk-1", line: "يا ليل يا عين… موال خفيف على بيات", vibe: "موال · بيات" },
  { id: "hk-2", line: "إيقاع وحدة سريع — خلفية لأغنية شعبية", vibe: "وحدة · ١١٠" },
  { id: "hk-3", line: "لحن سينمائي قصير: دخول أوركسترالي ثم سكون", vibe: "دشت · سينما" },
  { id: "hk-4", line: "لازمة عود — مقام راست، بدون غناء", vibe: "عود · راست" },
  { id: "hk-5", line: "كورس حماسي بلهجة بغدادية، فرح بعد هدوء", vibe: "عراقي · كورس" },
];

export const LIBRARY_PLACEHOLDERS: LibraryPlaceholder[] = [
  {
    id: "ph-1",
    title: "موال بغدادي — مسودة",
    subtitle: "بيات · تشوبي · ٩٠ نبضة",
    duration: "٣:١٢",
    badge: "معاينة",
    gradient:
      "linear-gradient(145deg, color-mix(in srgb, var(--brand-orange) 72%, #2a1510) 0%, color-mix(in srgb, var(--brand-slate) 55%, #1a1c1e) 100%)",
    barTint: "orange",
    tags: ["بيات", "تشوبي", "حزين"],
    promptLine: "موال عراقي بطيء، بيات وتشوبي، نبرة حزينة وقاعة واسعة.",
  },
  {
    id: "ph-2",
    title: "هجعة جنوبية",
    subtitle: "حجاز · خشبة · ١١٠ نبضة",
    duration: "٢:٤٨",
    badge: "مسودة",
    gradient:
      "linear-gradient(145deg, color-mix(in srgb, var(--brand-blue) 65%, #0d2533) 0%, color-mix(in srgb, var(--brand-sky) 35%, #1e2a30) 100%)",
    barTint: "teal",
    tags: ["حجاز", "خشبة", "هجعة"],
    promptLine: "هجعة جنوبية، مقام حجاز، إيقاع خشبة، سرعة متوسطة مفعول.",
  },
  {
    id: "ph-3",
    title: "غناء مقامي — جلسة",
    subtitle: "راست · سماعي",
    duration: "٤:٠٥",
    badge: "أرشيف",
    gradient:
      "linear-gradient(145deg, color-mix(in srgb, var(--brand-sky) 50%, #152028) 0%, color-mix(in srgb, var(--brand-blue) 40%, #0c2028) 100%)",
    barTint: "sky",
    tags: ["راست", "سماعي", "جلسة"],
    promptLine: "تسجيل جلسة مقامية، راست إلى سماعي، صوت واضح وقليل تأثير.",
  },
  {
    id: "ph-4",
    title: "ليل فينيل",
    subtitle: "سبعينات · جرغينة",
    duration: "٣:٣٣",
    badge: "طابع",
    gradient:
      "linear-gradient(145deg, color-mix(in srgb, var(--brand-slate) 70%, #121416) 0%, color-mix(in srgb, var(--brand-orange) 45%, #24180c) 100%)",
    barTint: "slate",
    tags: ["سبعينات", "جرغينة", "فينيل"],
    promptLine: "طابع سبعينات عراقي، جرغينة، طبقة وارم خفيفة ونغم دافئ.",
  },
  {
    id: "ph-5",
    title: "عتابا ريفية",
    subtitle: "كُرد · وحدة",
    duration: "٢:١٩",
    badge: "مسودة",
    gradient:
      "linear-gradient(160deg, color-mix(in srgb, var(--brand-orange) 55%, #2c1810) 0%, color-mix(in srgb, var(--brand-blue) 35%, #142220) 100%)",
    barTint: "orange",
    tags: ["عتابا", "كُرد", "ريف"],
    promptLine: "عتابا بإيقاع كُرد، لهجة ريفية، طبقة إيقاع وحدة واضحة.",
  },
  {
    id: "ph-6",
    title: "لحن سينمائي قصير",
    subtitle: "دشت · إيقاع حر",
    duration: "١:٥٧",
    badge: "مشروع",
    gradient:
      "linear-gradient(145deg, color-mix(in srgb, var(--brand-blue) 55%, #0f1c24) 0%, color-mix(in srgb, var(--brand-sky) 30%, #1a2428) 100%)",
    barTint: "teal",
    tags: ["سينما", "دشت", "إيقاع حر"],
    promptLine: "مقطع سينمائي قصير، دشت، بناء تدريجي ثم ذروة خفيفة.",
  },
  {
    id: "ph-7",
    title: "صوفي — دورة هادئة",
    subtitle: "صبا · سماعي",
    duration: "٣:٠١",
    badge: "معاينة",
    gradient:
      "linear-gradient(150deg, color-mix(in srgb, var(--brand-sky) 45%, #162026) 0%, color-mix(in srgb, var(--brand-slate) 60%, #141618) 100%)",
    barTint: "sky",
    tags: ["صبا", "صوفي", "هادئ"],
    promptLine: "نغمة صوفية هادئة، صبا ثم لمسات سماعية، بدون إيقاع ثقيل.",
  },
  {
    id: "ph-8",
    title: "شوبي حماسي",
    subtitle: "نهاوند · ١٢٠",
    duration: "٢:٤٤",
    badge: "مسودة",
    gradient:
      "linear-gradient(145deg, color-mix(in srgb, var(--brand-orange) 60%, #301808) 0%, color-mix(in srgb, var(--brand-blue) 38%, #0e222c) 100%)",
    barTint: "orange",
    tags: ["شوبي", "نهاوند", "حماس"],
    promptLine: "شوبي سريع على نهاوند، فرح، إيقاع خفيف ونبض حوالي ١٢٠.",
  },
  {
    id: "ph-9",
    title: "مقدمة أوركسترالية",
    subtitle: "عجم · واسع",
    duration: "١:٢٢",
    badge: "مشروع",
    gradient:
      "linear-gradient(145deg, color-mix(in srgb, var(--brand-slate) 65%, #101214) 0%, color-mix(in srgb, var(--brand-sky) 40%, #182026) 100%)",
    barTint: "slate",
    tags: ["عجم", "أوركسترا", "مقدمة"],
    promptLine: "مقدمة واسعة عجم، طبقات وترية، بلا غناء، إحساس احتفالي خفيف.",
  },
];

const BAR_CLASS: Record<LibraryPlaceholder["barTint"], string> = {
  orange: "bg-[var(--brand-orange)]",
  teal: "bg-[var(--brand-blue)]",
  sky: "bg-[var(--brand-sky)]",
  slate: "bg-[var(--brand-slate)]",
};

export function placeholderWaveHeights(seed: number): number[] {
  const out: number[] = [];
  let s = seed;
  for (let i = 0; i < 12; i++) {
    s = (s * 9301 + 49297) % 233280;
    out.push(25 + (s % 75));
  }
  return out;
}

export function barClassForTint(tint: LibraryPlaceholder["barTint"]): string {
  return BAR_CLASS[tint];
}
