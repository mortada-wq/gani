import React from "react";
import { ArrowRight, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./Logo";
import PlayShelfCard from "./PlayShelfCard";
import type { DockTrack } from "./NowPlayingDock";

export type GenerationPhase = "lyrics" | "audio" | "done" | "error";

type PlaybackSource = "none" | "generated" | "library";

type Props = {
  phase: GenerationPhase;
  isLoading: boolean;
  sessionPrompt: string;
  setSessionPrompt: (v: string) => void;
  sessionLyrics: string;
  setSessionLyrics: (v: string) => void;
  generatedSong: Record<string, unknown> | null;
  dockTrack: DockTrack | null;
  isPlaying: boolean;
  playbackSource: PlaybackSource;
  onPlayGenerated: () => void;
  onBack: () => void;
  onRegenerate: () => void;
};

function phaseLabel(phase: GenerationPhase, loading: boolean): { title: string; subtitle: string } {
  if (phase === "error") {
    return {
      title: "تعذّر إكمال التوليد",
      subtitle: "تحقق من الاتصال أو المفتاح، ثم أعد المحاولة.",
    };
  }
  if (loading && phase === "lyrics") {
    return {
      title: "صياغة الكلمات",
      subtitle: "نمذجة الشاعر الصاحب — عرضة، بيت، ولازمة باللهجة العراقية.",
    };
  }
  if (loading && phase === "audio") {
    return {
      title: "بناء الموجة الصوتية",
      subtitle: "ليريا يؤلّف اللحن والطبقات — قد يستغرق لحظات.",
    };
  }
  if (phase === "done" && !loading) {
    return {
      title: "جاهز للاستماع",
      subtitle: "عدّل الوصف أو الكلمات أدناه، ثم أعد التوليد كما في Suno أو ElevenLabs.",
    };
  }
  return { title: "جاري التحضير", subtitle: "…" };
}

/**
 * Post-submit workspace: no page scroll — focused generation, edit, and playback (Suno / ElevenLabs-style).
 */
export default function GenerationStudio({
  phase,
  isLoading,
  sessionPrompt,
  setSessionPrompt,
  sessionLyrics,
  setSessionLyrics,
  generatedSong,
  dockTrack,
  isPlaying,
  playbackSource,
  onPlayGenerated,
  onBack,
  onRegenerate,
}: Props) {
  const { title: phaseTitle, subtitle: phaseSubtitle } = phaseLabel(phase, isLoading);
  const showResultCard = phase === "done" && generatedSong && !isLoading;

  return (
    <div
      className="flex flex-1 flex-col min-h-0 overflow-hidden bg-[var(--bg-void)]"
      dir="rtl"
    >
      {/* Top chrome — compact, not a second fixed prompt bar */}
      <header className="shrink-0 flex items-center justify-between gap-3 border-b border-[var(--color-slate)]/22 px-4 py-3 sm:px-6 bg-[color-mix(in_srgb,var(--bg-surface)_55%,transparent)] backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border border-[var(--color-slate)]/35 bg-[var(--bg-raised)]/80 px-3 py-2 text-xs font-bold font-arabic text-[var(--text-primary)] transition-colors hover:border-[var(--brand-blue)]/40 disabled:opacity-45 disabled:pointer-events-none"
        >
          <ArrowRight className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          العودة للاستكشاف
        </button>
        <div className="flex items-center gap-2 min-w-0">
          <Logo className="h-8 w-auto shrink-0 opacity-95" />
          <span className="hidden sm:block text-[11px] font-bold font-arabic text-[var(--text-secondary)] truncate">
            استوديو التوليد
          </span>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-hidden">
        {/* Center stage — status + result (fits viewport; no body scroll) */}
        <section className="flex flex-[1.15] flex-col min-h-0 overflow-hidden items-center justify-center p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex max-w-md flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="absolute inset-0 animate-ping rounded-full bg-[var(--brand-blue)]/15" />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--color-slate)]/30 bg-[var(--bg-surface)] shadow-lg">
                    <Loader2 className="h-9 w-9 animate-spin text-[var(--brand-blue)]" strokeWidth={2} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[var(--brand-sky)] mb-2">
                  <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden />
                  <span className="text-[10px] font-bold uppercase tracking-wider font-arabic">
                    {phase === "lyrics" ? "الخطوة ١" : "الخطوة ٢"}
                  </span>
                </div>
                <h2 className="text-lg font-title font-bold text-[var(--text-primary)] leading-snug">
                  {phaseTitle}
                </h2>
                <p className="mt-2 text-xs font-arabic text-[var(--text-secondary)] leading-relaxed opacity-90">
                  {phaseSubtitle}
                </p>
              </motion.div>
            ) : showResultCard ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
              >
                <PlayShelfCard
                  title={String(generatedSong.title ?? "")}
                  tags={
                    typeof generatedSong.genre === "string"
                      ? generatedSong.genre
                          .split(/\s*-\s*/)
                          .map((s: string) => s.trim())
                          .filter(Boolean)
                      : ["توليد"]
                  }
                  promptText={
                    (generatedSong.metadata && String(generatedSong.metadata).trim()) ||
                    (typeof generatedSong.lyrics === "string"
                      ? generatedSong.lyrics.replace(/\s+/g, " ").trim().slice(0, 240)
                      : "توليد لحن عراقي وفق المقام والإيقاع المختارين.")
                  }
                  artGradient="linear-gradient(135deg, color-mix(in srgb, var(--brand-orange) 58%, #2a1510) 0%, color-mix(in srgb, var(--brand-blue) 52%, #0d2533) 100%)"
                  duration={String(generatedSong.duration ?? "")}
                  playState={isPlaying && playbackSource === "generated" ? "pause" : "play"}
                  onPlay={onPlayGenerated}
                  selected={dockTrack?.id === "generated"}
                  promptLabel="الموجه"
                />
              </motion.div>
            ) : phase === "error" ? (
              <motion.div
                key="err"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-sm text-center"
              >
                <p className="text-sm font-arabic text-[var(--text-secondary)]">{phaseSubtitle}</p>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>

        {/* Edit rail — internal scroll only if needed */}
        <aside className="flex w-full shrink-0 flex-col border-t border-[var(--color-slate)]/22 lg:w-[min(100%,380px)] lg:border-t-0 lg:border-s border-[var(--color-slate)]/22 bg-[color-mix(in_srgb,var(--bg-surface)_40%,transparent)] min-h-0 lg:max-h-full">
          <div className="flex flex-1 flex-col gap-4 overflow-y-auto min-h-0 p-4 sm:p-5 custom-scrollbar">
            <div>
              <label className="text-[10px] font-bold font-arabic text-[var(--text-secondary)]">
                وصف اللحن
              </label>
              <textarea
                value={sessionPrompt}
                onChange={(e) => setSessionPrompt(e.target.value)}
                rows={3}
                placeholder="صف المزاج، المقام، أو المشهد…"
                className="mt-1.5 w-full resize-none rounded-xl border border-[var(--color-slate)]/35 bg-[var(--bg-raised)] px-3 py-2.5 text-sm font-arabic text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/45 outline-none focus:border-[var(--brand-blue)]/45"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold font-arabic text-[var(--text-secondary)]">
                الكلمات (اختياري — لإعادة التوليد بنفس النص)
              </label>
              <textarea
                value={sessionLyrics}
                onChange={(e) => setSessionLyrics(e.target.value)}
                rows={6}
                placeholder="اتركها فارغة ليعيد النظام صياغة الكلمات تلقائياً."
                className="mt-1.5 w-full resize-none rounded-xl border border-[var(--color-slate)]/35 bg-[var(--bg-raised)] px-3 py-2.5 text-xs font-arabic text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/45 outline-none focus:border-[var(--brand-blue)]/45 leading-relaxed"
              />
            </div>
            <button
              type="button"
              disabled={isLoading || !sessionPrompt.trim()}
              onClick={onRegenerate}
              className="flex items-center justify-center gap-2 rounded-xl border border-[var(--brand-blue)]/35 bg-[color-mix(in_srgb,var(--brand-blue)_12%,transparent)] py-3 text-sm font-bold font-arabic text-[var(--text-primary)] transition-all hover:bg-[color-mix(in_srgb,var(--brand-blue)_18%,transparent)] disabled:opacity-45 disabled:pointer-events-none"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden />
              إعادة التوليد
            </button>
            <p className="text-[9px] font-arabic text-[var(--text-secondary)]/75 leading-relaxed">
              بعد الإرسال، تنتقل هنا مثل تجربة Suno أو ElevenLabs: حالة واضحة، ثم تعديل
              الوصف وإعادة التوليد دون تمرير الصفحة بالكامل.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
