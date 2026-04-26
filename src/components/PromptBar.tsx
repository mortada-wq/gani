import React, { useState } from "react";
import { Music, ChevronUp, SlidersHorizontal, AudioLines, Drum, Guitar, Mic2, Landmark } from "lucide-react";
import LyricsGlyphIcon from "./LyricsGlyphIcon";
import LyriaArrowIcon from "./LyriaArrowIcon";
import SubmitEqIcon from "./SubmitEqIcon";
import { motion, AnimatePresence } from "motion/react";
import { 
  MusicParams, 
  PARAM_AUTO,
  MAQAMS, 
  RHYTHMS, 
  LEAD_INSTRUMENTS, 
  VOCAL_STYLES, 
  ERAS, 
  PERCUSSION_KITS, 
  EMOTIONS, 
  DIALECTS, 
  REVERBS, 
  STRUCTURES, 
  THEMES,
  applyAutoFill
} from "../constants";

interface Props {
  onGenerate: (prompt: string, lyrics?: string) => void;
  isLoading: boolean;
  params: MusicParams;
  setParams: React.Dispatch<React.SetStateAction<MusicParams>>;
}

export default function PromptBar({ onGenerate, isLoading, params, setParams }: Props) {
  const [prompt, setPrompt] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [lyricsMode, setLyricsMode] = useState<"sahib" | "manual">("sahib");
  const [showCurtain, setShowCurtain] = useState(false);
  const [showLyricsParams, setShowLyricsParams] = useState(false);
  const [showSoundContext, setShowSoundContext] = useState(false);
  const [showRhythmPulse, setShowRhythmPulse] = useState(false);

  const closeFlyouts = () => {
    setShowCurtain(false);
    setShowLyricsParams(false);
    setShowSoundContext(false);
    setShowRhythmPulse(false);
  };

  const triggerLyriaGenerate = () => {
    if (!prompt.trim() && !lyrics.trim()) return;
    onGenerate(prompt, lyrics);
    closeFlyouts();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerLyriaGenerate();
  };

  const handleParamChange = (key: keyof MusicParams, value: any) => {
    let newParams = { ...params, [key]: value };
    // Apply auto-fill logic if rhythmic or vocal or era changes
    if (key === "rhythm" || key === "vocalStyle" || key === "era") {
      newParams = applyAutoFill(newParams);
    }
    setParams(newParams);
  };

  return (
    <div className="relative mx-auto flex w-full max-w-[721px] flex-col">
      {/* Curtain Container - Absolute positioned to expand upwards without pushing the bar down */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: 10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-6 overflow-hidden bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--color-slate)] rounded-[2.5rem] p-8 shadow-2xl z-40 transition-colors duration-300"
          >
            <div className="glass-tile-grid" role="group" aria-label="أبرز الأطوار الثلاثة">
              <GlassParamSelect
                label="المقام"
                options={MAQAMS}
                value={params.maqam}
                onChange={(v) => handleParamChange("maqam", v)}
                icon={<AudioLines aria-hidden />}
              />
              <GlassParamSelect
                label="الآلة القائدة"
                options={LEAD_INSTRUMENTS}
                value={params.leadInstrument}
                onChange={(v) => handleParamChange("leadInstrument", v)}
                icon={<Guitar aria-hidden />}
              />
              <GlassParamSelect
                label="النمط الصوتي"
                options={VOCAL_STYLES}
                value={params.vocalStyle}
                onChange={(v) => handleParamChange("vocalStyle", v)}
                icon={<Mic2 aria-hidden />}
              />
            </div>

            <div className="mb-6 max-w-xl">
              <ParamSelect label="الجو العاطفي" options={EMOTIONS} value={params.emotionalCore} onChange={(v) => handleParamChange("emotionalCore", v)} />
            </div>

            <button 
              onClick={() => setShowCurtain(false)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[var(--text-secondary)] hover:text-[var(--color-teal)] transition-all p-2 bg-[var(--bg-raised)] rounded-full border border-[var(--color-slate)]"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSoundContext && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: 10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-6 overflow-hidden bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--color-slate)] rounded-[2.5rem] p-8 shadow-2xl z-[42] transition-colors duration-300"
          >
            <div className="pb-12">
              <div className="flex items-start gap-3 mb-5 max-w-3xl" dir="rtl">
                <Landmark
                  className="h-6 w-6 shrink-0 text-[var(--color-teal)] mt-0.5"
                  strokeWidth={2}
                  aria-hidden
                />
                <div>
                  <h3 className="text-sm font-bold font-arabic text-[var(--text-primary)]">
                    سياق الصوت والمكان
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-arabic leading-relaxed mt-1">
                    العصر، اللهجة، خصائص الحيّز الصوتي، وطبقة الإيقاع — كأنّك تختار قاعة الحفل والهوية قبل التسجيل.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 max-w-3xl">
                <ParamSelect label="العصر / الطراز" options={ERAS} value={params.era} onChange={(v) => handleParamChange("era", v)} />
                <ParamSelect label="اللهجة" options={DIALECTS} value={params.dialect} onChange={(v) => handleParamChange("dialect", v)} />
                <ParamSelect label="المساحة الصوتية" options={REVERBS} value={params.reverbSpace} onChange={(v) => handleParamChange("reverbSpace", v)} />
                <ParamSelect label="مجموعة الإيقاع" options={PERCUSSION_KITS} value={params.percussionKit} onChange={(v) => handleParamChange("percussionKit", v)} />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSoundContext(false)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[var(--text-secondary)] hover:text-[var(--color-teal)] transition-all p-2 bg-[var(--bg-raised)] rounded-full border border-[var(--color-slate)]"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRhythmPulse && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: 10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-6 overflow-hidden bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--color-slate)] rounded-[2.5rem] p-8 shadow-2xl z-[43] transition-colors duration-300"
          >
            <div className="pb-12">
              <div className="flex items-start gap-3 mb-5 max-w-3xl" dir="rtl">
                <Music
                  className="h-6 w-6 shrink-0 text-[var(--color-teal)] mt-0.5"
                  strokeWidth={2}
                  aria-hidden
                />
                <div>
                  <h3 className="text-sm font-bold font-arabic text-[var(--text-primary)]">
                    النبض والإيقاع
                  </h3>
                  <p className="text-[10px] text-[var(--text-secondary)] font-arabic leading-relaxed mt-1">
                    سرعة اللحن ووزن الإيقاع — قلب الحركة الموسيقية قبل صياغة اللحن.
                  </p>
                </div>
              </div>

              <div className="max-w-md mx-auto mb-6">
                <GlassParamSelect
                  label="الإيقاع"
                  options={RHYTHMS}
                  value={params.rhythm}
                  onChange={(v) => handleParamChange("rhythm", v)}
                  icon={<Drum aria-hidden />}
                />
              </div>

              <div className="flex flex-col gap-2 max-w-xl mx-auto">
                <span className="text-xs font-bold text-[var(--text-secondary)] font-arabic">سرعة النبض (نبضة/دقيقة)</span>
                <input
                  type="range"
                  min={40}
                  max={180}
                  step={1}
                  value={params.tempo}
                  onChange={(e) => handleParamChange("tempo", parseInt(e.target.value, 10))}
                  className="w-full h-1.5 rounded-lg appearance-none bg-[var(--bg-raised)] cursor-pointer accent-[var(--color-teal)]"
                />
                <div className="flex justify-between text-[9px] text-[var(--text-secondary)] font-mono">
                  <span>40</span>
                  <span className="text-[var(--color-neon)] font-bold text-xs">{params.tempo}</span>
                  <span>180</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowRhythmPulse(false)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[var(--text-secondary)] hover:text-[var(--color-teal)] transition-all p-2 bg-[var(--bg-raised)] rounded-full border border-[var(--color-slate)]"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLyricsParams && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: 10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-6 overflow-hidden bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--color-slate)] rounded-[2.5rem] p-8 shadow-2xl z-[41] transition-colors duration-300"
          >
            <div className="space-y-4 pb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl">
                <button 
                  type="button"
                  onClick={() => setLyricsMode("sahib")}
                  className={`px-4 py-2 rounded-xl border transition-all text-right flex items-center justify-between group ${lyricsMode === "sahib" ? 'bg-[var(--color-teal)]/10 border-[var(--color-teal)]' : 'bg-[var(--bg-raised)] border-[var(--color-slate)] hover:bg-[var(--bg-surface)] hover:border-[var(--color-teal)]/30'}`}
                >
                  <span className="text-xs font-bold font-arabic text-[var(--text-primary)] italic">شاعر الأغنية: صاحب</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${lyricsMode === "sahib" ? 'bg-[var(--color-neon)] animate-pulse' : 'bg-[var(--text-secondary)]/20'}`} />
                </button>

                <button 
                  type="button"
                  onClick={() => setLyricsMode("manual")}
                  className={`px-4 py-2 rounded-xl border transition-all text-right flex items-center justify-between group ${lyricsMode === "manual" ? 'bg-[var(--color-teal)]/10 border-[var(--color-teal)]' : 'bg-[var(--bg-raised)] border-[var(--color-slate)] hover:bg-[var(--bg-surface)] hover:border-[var(--color-teal)]/30'}`}
                >
                  <span className="text-xs font-bold font-arabic text-[var(--text-primary)]">أضف كلماتك أو حمّلها</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${lyricsMode === "manual" ? 'bg-[var(--color-neon)] animate-pulse' : 'bg-[var(--text-secondary)]/20'}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <ParamSelect
                  label="موضوع الكلمات"
                  options={THEMES}
                  value={params.lyricsTheme}
                  onChange={(v) => handleParamChange("lyricsTheme", v)}
                />
                <ParamSelect
                  label="هيكل الأغنية"
                  options={STRUCTURES}
                  value={params.songStructure}
                  onChange={(v) => handleParamChange("songStructure", v)}
                />
              </div>

              <AnimatePresence>
                {lyricsMode === "manual" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden max-w-4xl"
                  >
                    <div className="mb-3 flex justify-between items-center px-1 gap-2 flex-wrap">
                      <span className="text-[9px] text-[var(--text-secondary)] font-arabic italic">* الصق كلمات الأغنية هنا أو قم بتحميل ملف</span>
                      <label className="text-[9px] text-[var(--color-teal)] font-bold hover:underline cursor-pointer border border-[var(--color-teal)]/20 px-2 py-1 rounded-md bg-[var(--color-teal)]/5 shrink-0">
                        <input type="file" className="hidden" accept=".txt,.doc,.docx" />
                        حمل ملف
                      </label>
                    </div>
                    <textarea 
                      value={lyrics}
                      onChange={(e) => setLyrics(e.target.value)}
                      placeholder="اكتب هنا..."
                      className="w-full bg-[var(--bg-raised)] border border-[var(--color-slate)] rounded-2xl p-4 text-xs font-arabic resize-none min-h-[100px] text-[var(--text-primary)] focus:border-[var(--color-teal)]/50 outline-none transition-all shadow-inner"
                      dir="rtl"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button 
              type="button"
              onClick={() => setShowLyricsParams(false)}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[var(--text-secondary)] hover:text-[var(--color-teal)] transition-all p-2 bg-[var(--bg-raised)] rounded-full border border-[var(--color-slate)]"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form 
        onSubmit={handleSubmit}
        className="relative prompt-bar-shell"
      >
        <div className="prompt-bar prompt-bar-inner">
          <div className="input-area">
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="صف ملامح اللحن.. مثل: 'موال حزين بنكهة ريفية'"
              className="w-full bg-transparent border-none focus:ring-0 text-base font-arabic py-1 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 outline-none"
              dir="rtl"
            />
          </div>

          <hr className="divider prompt-bar-divider" aria-hidden />

          {/* Figma: left arrow, spacer, then feather + 3 outline circles + audio (submit) — see index.css .icon-circle */}
          <div className="toolbar" dir="ltr">
            <button
              type="button"
              className="icon-circle pixel-icon"
              onClick={triggerLyriaGenerate}
              disabled={isLoading}
              title="صِغ اللحن (ليريا)"
              aria-label="صِغ اللحن عبر ليريا"
            >
              <LyriaArrowIcon className="block h-[22px] w-[25px] shrink-0" />
            </button>

            <div className="spacer" aria-hidden />

            <button
              type="button"
              className="icon-circle feather-btn"
              onClick={() => {
                setShowCurtain(false);
                setShowSoundContext(false);
                setShowRhythmPulse(false);
                setShowLyricsParams((v) => !v);
              }}
              aria-pressed={showLyricsParams}
              aria-expanded={showLyricsParams}
              title="تأليف الكلمات"
            >
              <LyricsGlyphIcon className="block shrink-0" />
            </button>

            <button
              type="button"
              className="icon-circle empty"
              onClick={() => {
                setShowLyricsParams(false);
                setShowSoundContext(false);
                setShowRhythmPulse(false);
                setShowCurtain((c) => !c);
              }}
              aria-pressed={showCurtain}
              aria-expanded={showCurtain}
              title="نظام الـ ١٢ طوراً"
              aria-label="نظام الـ ١٢ طوراً: المقام والآلة والنمط الصوتي"
            >
              <SlidersHorizontal
                className="h-6 w-6"
                style={{ color: "var(--prompt-bar-blue-glow)" }}
                strokeWidth={2}
                aria-hidden
              />
            </button>

            <button
              type="button"
              className="icon-circle empty"
              onClick={() => {
                setShowCurtain(false);
                setShowLyricsParams(false);
                setShowSoundContext(false);
                setShowRhythmPulse((v) => !v);
              }}
              aria-pressed={showRhythmPulse}
              aria-expanded={showRhythmPulse}
              title="النبض والإيقاع"
              aria-label="النبض والإيقاع: سرعة النبض ونمط الإيقاع"
            >
              <Music
                className="h-6 w-6"
                style={{ color: "var(--prompt-bar-blue-glow)" }}
                strokeWidth={2}
                aria-hidden
              />
            </button>

            <button
              type="button"
              className="icon-circle empty"
              onClick={() => {
                setShowCurtain(false);
                setShowLyricsParams(false);
                setShowRhythmPulse(false);
                setShowSoundContext((v) => !v);
              }}
              aria-pressed={showSoundContext}
              aria-expanded={showSoundContext}
              title="سياق الصوت والمكان"
              aria-label="سياق الصوت والمكان: العصر، اللهجة، المساحة الصوتية، مجموعة الإيقاع"
            >
              <Landmark
                className="h-6 w-6"
                style={{ color: "var(--prompt-bar-blue-glow)" }}
                strokeWidth={2}
                aria-hidden
              />
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="icon-circle audio-btn"
              title="صِغ اللحن"
            >
              {isLoading ? (
                <span
                  className="flex h-[59px] w-[59px] items-center justify-center"
                  aria-hidden
                >
                  <span className="h-7 w-7 rounded-full border-2 border-[#44baf3]/35 border-t-[#11b0ff] animate-spin" />
                </span>
              ) : (
                <SubmitEqIcon className="block shrink-0" />
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

function GlassParamSelect({
  label,
  options,
  value,
  onChange,
  icon,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
}) {
  const resolved = value || PARAM_AUTO;
  const isActive = resolved !== PARAM_AUTO;

  return (
    <div className={`glass-param-card ${isActive ? "glass-param-card--active" : ""}`}>
      <div className="glass-param-card-icon">{icon}</div>
      <span className="glass-param-card-label">{label}</span>
      <select
        value={resolved}
        onChange={(e) => onChange(e.target.value)}
        className="glass-param-card-select"
        dir="rtl"
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ParamSelect({ label, options, value, onChange }: { label: string, options: string[], value?: any, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1 group">
      <label className="text-[10px] font-bold text-[var(--text-secondary)] font-arabic transition-all group-hover:text-[var(--color-teal)]">{label}</label>
      <select 
        value={value || PARAM_AUTO} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--bg-raised)] border border-[var(--color-slate)] rounded-lg px-2 py-1.5 text-[10px] font-arabic text-[var(--text-primary)] focus:border-[var(--color-teal)]/50 focus:ring-1 focus:ring-[var(--color-neon)]/10 outline-none transition-all appearance-none cursor-pointer hover:bg-[var(--bg-surface)] hover:border-[var(--color-teal)]/30"
        dir="rtl"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[var(--bg-surface)] text-[var(--text-primary)] py-2">{opt}</option>
        ))}
      </select>
    </div>
  );
}
