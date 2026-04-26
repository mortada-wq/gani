import React from "react";
import { Play, Pause, ArrowUpRight } from "lucide-react";

export type PlayShelfCardProps = {
  title: string;
  tags: string[];
  promptText: string;
  artGradient: string;
  duration?: string;
  playState: "play" | "pause";
  onPlay: () => void;
  selected?: boolean;
  promptLabel?: string;
};

/**
 * Large preview card inspired by product music API pages: soft shell, square art with lens, prompt block.
 */
export default function PlayShelfCard({
  title,
  tags,
  promptText,
  artGradient,
  duration,
  playState,
  onPlay,
  selected,
  promptLabel = "الموجه",
}: PlayShelfCardProps) {
  return (
    <article
      className={`play-shelf-card group relative flex flex-col rounded-[1.65rem] border p-4 sm:p-5 transition-all duration-300 ${
        selected
          ? "border-[var(--brand-blue)]/45 bg-[var(--bg-surface)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--brand-blue)_22%,transparent),0_18px_40px_rgba(0,0,0,0.35)]"
          : "border-[var(--color-slate)]/28 bg-[color-mix(in_srgb,var(--bg-raised)_88%,var(--bg-surface))] hover:border-[var(--color-slate)]/45 hover:shadow-lg"
      }`}
      dir="rtl"
    >
      <button
        type="button"
        className="play-shelf-external absolute top-3 end-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-[var(--color-slate)]/35 bg-[var(--bg-void)]/55 text-[var(--text-secondary)] opacity-0 transition-opacity hover:text-[var(--brand-blue)] group-hover:opacity-100"
        aria-label="تفاصيل"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <ArrowUpRight className="h-4 w-4" strokeWidth={2} aria-hidden />
      </button>

      <div className="play-shelf-art-wrap mx-auto w-full max-w-[220px] sm:max-w-none">
        <div className="play-shelf-art relative aspect-square w-full overflow-hidden rounded-2xl" style={{ background: artGradient }}>
          <div className="play-shelf-lens" aria-hidden />
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-4">
            <h3 className="text-right font-arabic text-[0.7rem] font-bold leading-tight text-white/95 drop-shadow-md sm:text-sm">
              {title}
            </h3>
            <p className="text-right font-arabic text-[0.58rem] font-medium leading-snug text-white/88 drop-shadow sm:text-[0.68rem]">
              {tags.join(" · ")}
            </p>
          </div>
        </div>

        <div className="relative z-10 -mt-5 flex justify-center">
          <button
            type="button"
            onClick={onPlay}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-[var(--bg-void)]/92 text-[var(--text-primary)] shadow-xl backdrop-blur-sm transition-transform hover:scale-105 active:scale-95"
            aria-label={playState === "pause" ? "إيقاف" : "تشغيل"}
          >
            {playState === "pause" ? (
              <Pause className="h-5 w-5" strokeWidth={2} aria-hidden />
            ) : (
              <Play className="h-5 w-5 translate-x-0.5" strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>
      </div>

      <div className="mt-4 min-h-0 flex-1 text-right">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--text-secondary)]/75">
          {promptLabel}
        </p>
        <p className="mt-1 line-clamp-3 text-[0.7rem] leading-relaxed text-[var(--text-primary)]/92 sm:text-xs">
          {promptText}
        </p>
        {duration ? (
          <p className="mt-2 text-[0.65rem] font-mono tabular-nums text-[var(--brand-sky)]/90">{duration}</p>
        ) : null}
      </div>
    </article>
  );
}
