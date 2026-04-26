import React, { useState } from "react";
import { Music, Send, Type, ChevronDown, ChevronUp, Sparkles, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MusicParams, 
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !lyrics.trim()) return;
    onGenerate(prompt, lyrics);
    // Collapse curtain when generating
    setShowCurtain(false);
  };

  const handleParamChange = (key: keyof MusicParams, value: any) => {
    let newParams = { ...params, [key]: value };
    // Apply auto-fill logic if rhythmic or vocal or era changes
    if (key === "rhythm" || key === "vocalStyle" || key === "era") {
      newParams = applyAutoFill(newParams);
    }
    setParams(newParams);
  };

  const activeCount = Object.values(params).filter(v => v !== undefined && v !== "Automatic" && v !== 90).length;

  return (
    <div className="w-full max-w-5xl mx-auto relative flex flex-col">
      {/* Curtain Container - Absolute positioned to expand upwards without pushing the bar down */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: 10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 10 }}
            className="absolute bottom-full left-0 right-0 mb-6 overflow-hidden bg-[var(--bg-surface)]/95 backdrop-blur-xl border border-[var(--color-slate)] rounded-[2.5rem] p-8 shadow-2xl z-40 transition-colors duration-300"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-4 mb-6">
              {/* Row 1 */}
              <ParamSelect label="المقام" options={MAQAMS} value={params.maqam} onChange={(v) => handleParamChange("maqam", v)} />
              <ParamSelect label="الإيقاع" options={RHYTHMS} value={params.rhythm} onChange={(v) => handleParamChange("rhythm", v)} />
              <ParamSelect label="الآلة القائدة" options={LEAD_INSTRUMENTS} value={params.leadInstrument} onChange={(v) => handleParamChange("leadInstrument", v)} />
              <ParamSelect label="النمط الصوتي" options={VOCAL_STYLES} value={params.vocalStyle} onChange={(v) => handleParamChange("vocalStyle", v)} />
              
              {/* Row 2 */}
              <ParamSelect label="العصر / الطراز" options={ERAS} value={params.era} onChange={(v) => handleParamChange("era", v)} />
              <ParamSelect label="مجموعة الإيقاع" options={PERCUSSION_KITS} value={params.percussionKit} onChange={(v) => handleParamChange("percussionKit", v)} />
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-[var(--text-secondary)] font-arabic">سرعة النبض (BPM)</span>
                <input 
                  type="range" min="40" max="180" step="1" 
                  value={params.tempo} 
                  onChange={(e) => handleParamChange("tempo", parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-lg appearance-none bg-[var(--bg-raised)] cursor-pointer accent-[var(--color-teal)]"
                />
                <div className="flex justify-between text-[9px] text-[var(--text-secondary)] font-mono">
                  <span>40</span>
                  <span className="text-[var(--color-neon)] font-bold text-xs">{params.tempo}</span>
                  <span>180</span>
                </div>
              </div>
              <ParamSelect label="الجو العاطفي" options={EMOTIONS} value={params.emotionalCore} onChange={(v) => handleParamChange("emotionalCore", v)} />

              {/* Row 3 */}
              <ParamSelect label="اللهجة" options={DIALECTS} value={params.dialect} onChange={(v) => handleParamChange("dialect", v)} />
              <ParamSelect label="المساحة الصوتية" options={REVERBS} value={params.reverbSpace} onChange={(v) => handleParamChange("reverbSpace", v)} />
              <ParamSelect label="هيكل الأغنية" options={STRUCTURES} value={params.songStructure} onChange={(v) => handleParamChange("songStructure", v)} />
              <ParamSelect label="موضوع الكلمات" options={THEMES} value={params.lyricsTheme} onChange={(v) => handleParamChange("lyricsTheme", v)} />
            </div>

            <div className="border-t border-[var(--color-slate)] pt-6">
              <button 
                type="button"
                onClick={() => setShowLyricsParams(!showLyricsParams)}
                className="flex items-center justify-between w-full mb-4 group"
              >
                <div className="flex items-center gap-2">
                  <Type className="w-3.5 h-3.5 text-[var(--color-teal)]" />
                  <span className="text-xs font-bold font-arabic text-[var(--text-primary)] uppercase tracking-widest">تأليف الكلمات</span>
                </div>
                <div className={`p-1 rounded-md bg-[var(--bg-raised)] text-[var(--text-secondary)] group-hover:text-[var(--color-teal)] transition-all ${showLyricsParams ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>

              <AnimatePresence>
                {showLyricsParams && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
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

                    <AnimatePresence>
                      {lyricsMode === "manual" && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-6 max-w-4xl"
                        >
                          <div className="mb-3 flex justify-between items-center px-1">
                            <span className="text-[9px] text-[var(--text-secondary)] font-body italic">* الصق كلمات الأغنية هنا أو قم بتحميل ملف</span>
                            <label className="text-[9px] text-[var(--color-teal)] font-bold hover:underline cursor-pointer border border-[var(--color-teal)]/20 px-2 py-1 rounded-md bg-[var(--color-teal)]/5">
                              <input type="file" className="hidden" accept=".txt,.doc,.docx" />
                              حمل ملف
                            </label>
                          </div>
                          <textarea 
                            value={lyrics}
                            onChange={(e) => setLyrics(e.target.value)}
                            placeholder="اكتب هنا..."
                            className="w-full bg-[var(--bg-surface)] border border-[var(--color-slate)] rounded-2xl p-4 text-xs font-arabic resize-none min-h-[100px] text-[var(--text-primary)] focus:border-[var(--color-teal)]/50 outline-none transition-all shadow-inner"
                            dir="rtl"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
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

      <form 
        onSubmit={handleSubmit}
        className="relative group glass-panel rounded-[2rem] overflow-hidden border border-[var(--color-slate)] p-2 transition-all shadow-lg bg-[var(--bg-surface)]/80"
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-3 px-4 pb-1 relative">
            <button 
              type="button"
              onClick={() => setShowCurtain(!showCurtain)}
              className={`p-2 rounded-xl transition-all border ${showCurtain ? 'bg-[var(--color-teal)] text-white border-[var(--color-teal)]' : 'bg-[var(--color-teal)]/5 text-[var(--color-teal)] border-transparent hover:bg-[var(--color-teal)]/10'}`}
              title="نظام الـ ١٢ طوراً"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <div className="bg-[var(--color-teal)]/10 p-2 rounded-xl">
              <Music className="w-5 h-5 text-[var(--color-teal)]" />
            </div>
            <input 
              type="text" 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="صف ملامح اللحن.. مثل: 'موال حزين بنكهة ريفية'"
              className="flex-1 bg-transparent border-none focus:ring-0 text-base font-arabic py-4 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/40 outline-none"
              dir="rtl"
            />
            
            <button 
              type="submit"
              disabled={isLoading}
              style={{ background: !isLoading ? 'var(--brand-gradient)' : undefined }}
              className={`px-5 py-3 rounded-xl transition-all flex items-center justify-center ${isLoading ? 'bg-[var(--bg-raised)] text-[var(--text-secondary)]/30' : 'text-void hover:scale-110 active:scale-90 shadow-[0_0_20px_rgba(18,255,235,0.15)] hover:shadow-[0_0_30px_rgba(18,255,235,0.25)]'}`}
              title="صِغ اللحن"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-void/20 border-t-void rounded-full animate-spin" />
              ) : (
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 32 32" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="shrink-0 rotate-90 drop-shadow-sm"
                >
                  <path fill="currentColor" d="M2,6v20h28V6H2z M26,14h-4v4h-4v4h-4v-4h-4v-4H6v-4h4v4h4v4h4v-4h4v-4h4V14z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </form>
      
      <p className="text-center text-[10px] text-[var(--text-secondary)] px-10 italic mt-2 opacity-60">
        * يتم دمج اختياراتك اليدوية مع محرّك "غُـنّ" لضمان التوازن بين الإبداع والأصالة.
      </p>
    </div>
  );
}

function ParamSelect({ label, options, value, onChange }: { label: string, options: string[], value?: any, onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1 group">
      <label className="text-[10px] font-bold text-[var(--text-secondary)] font-arabic transition-all group-hover:text-[var(--color-teal)]">{label}</label>
      <select 
        value={value || "Automatic"} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[var(--bg-raised)] border border-[var(--color-slate)] rounded-lg px-2 py-1.5 text-[10px] font-arabic text-[var(--text-primary)] focus:border-[var(--color-teal)]/50 focus:ring-1 focus:ring-[var(--color-neon)]/10 outline-none transition-all appearance-none cursor-pointer hover:bg-[var(--bg-surface)] hover:border-[var(--color-teal)]/30"
        dir="rtl"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-[var(--bg-surface)] text-[var(--text-primary)] py-2">{opt === "Automatic" ? "تلقائي" : opt}</option>
        ))}
      </select>
    </div>
  );
}
