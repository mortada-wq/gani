import React, { useCallback } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "motion/react";

export type DockTrack = {
  id: string;
  title: string;
  artist: string;
  /** CSS gradient for thumbnail block */
  artworkGradient: string;
};

type Props = {
  track: DockTrack | null;
  hasAudio: boolean;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  volume: number;
  onVolume: (v: number) => void;
};

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function NowPlayingDock({
  track,
  hasAudio,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolume,
}: Props) {
  const pct = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const onBarChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = parseFloat(e.target.value);
      if (duration > 0) onSeek((v / 100) * duration);
    },
    [duration, onSeek]
  );

  return (
    <div className="relative z-40 shrink-0 px-3 sm:px-5 pb-3 pt-2" dir="rtl">
      <div className="player-dock-shell max-w-[1600px] mx-auto w-full">
        <div className="player-dock-inner player-dock">
          {/* Upper row — like prompt toolbar */}
          <div className="player-dock-row px-4 sm:px-6 py-3 min-h-[72px] justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-3 min-w-0 flex-[1.1] max-w-[min(100%,320px)]">
              <div
                className="player-dock-artwork w-12 h-12 sm:w-14 sm:h-14 shrink-0 overflow-hidden"
                style={{
                  background: track?.artworkGradient ?? "var(--bg-raised)",
                }}
              >
                {track && (
                  <div className="w-full h-full flex items-end justify-center gap-px pb-1.5 opacity-90">
                    {[40, 65, 35, 80, 50, 70, 45].map((h, i) => (
                      <div
                        key={i}
                        className="w-0.5 rounded-full bg-[var(--text-primary)]/35"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="min-w-0 text-right">
                {track ? (
                  <>
                    <p className="text-sm font-bold font-arabic text-[var(--text-primary)] truncate leading-tight">
                      {track.title}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] font-arabic truncate mt-0.5">
                      {track.artist}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-arabic text-[var(--text-secondary)]">لا يُعزَف شيء بعد</p>
                    <p className="text-[11px] text-[var(--text-secondary)]/70 font-arabic">
                      اختر مساراً أو صِغ لحناً
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 sm:gap-2 flex-1 min-w-[200px]">
              <button
                type="button"
                className="player-dock-ghost-btn opacity-75"
                aria-label="خلط"
              >
                <Shuffle className="w-4 h-4" strokeWidth={1.75} />
              </button>
              <button type="button" className="player-dock-ghost-btn" aria-label="السابق">
                <SkipBack className="w-5 h-5" strokeWidth={1.75} />
              </button>
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={onTogglePlay}
                disabled={!hasAudio}
                className="icon-circle audio-btn"
                aria-label={isPlaying ? "إيقاف" : "تشغيل"}
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" strokeWidth={2} />
                ) : (
                  <Play className="w-6 h-6 translate-x-0.5" strokeWidth={2} />
                )}
              </motion.button>
              <button type="button" className="player-dock-ghost-btn" aria-label="التالي">
                <SkipForward className="w-5 h-5" strokeWidth={1.75} />
              </button>
              <button
                type="button"
                className="player-dock-ghost-btn opacity-75"
                aria-label="تكرار"
              >
                <Repeat className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>

            <div className="hidden sm:flex items-center gap-2 flex-[0.9] justify-end max-w-[200px] min-w-[120px]">
              <button
                type="button"
                onClick={() => onVolume(volume > 0 ? 0 : 0.85)}
                className="player-dock-ghost-btn !p-2"
                aria-label="كتم"
              >
                {volume <= 0.02 ? (
                  <VolumeX className="w-4 h-4" strokeWidth={1.75} />
                ) : (
                  <Volume2 className="w-4 h-4" strokeWidth={1.75} />
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={volume}
                onChange={(e) => onVolume(parseFloat(e.target.value))}
                className="w-full max-w-[120px] h-1 rounded-full appearance-none cursor-pointer bg-[color-mix(in_srgb,var(--text-primary)_8%,transparent)]"
                aria-label="الصوت"
              />
            </div>
          </div>

          <hr className="player-dock-divider" />

          {/* Lower row — timeline like prompt divider + control strip */}
          <div className="player-dock-row px-4 sm:px-6 py-2.5 pb-3 gap-2">
            <span className="text-[10px] font-mono text-[var(--text-secondary)] tabular-nums w-9 text-left shrink-0">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={100}
              step={0.25}
              value={pct}
              onChange={onBarChange}
              disabled={!hasAudio || duration <= 0}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer bg-[color-mix(in_srgb,var(--text-primary)_10%,transparent)] disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="التقدم"
            />
            <span className="text-[10px] font-mono text-[var(--text-secondary)] tabular-nums w-9 text-right shrink-0">
              {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
