import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Library,
  Archive,
  Palette,
  CircleUser,
  Cog,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./components/Logo";
import PromptBar from "./components/PromptBar";
import PlayShelfCard from "./components/PlayShelfCard";
import GenerationStudio, { type GenerationPhase } from "./components/GenerationStudio";
import JawzaChat, { JawzaBallIcon } from "./components/JawzaChat";
import NowPlayingDock, { type DockTrack } from "./components/NowPlayingDock";
import { MusicParams, stitchGoldenPrompt } from "./constants";
import { LIBRARY_PLACEHOLDERS, HOOK_SAMPLES, type LibraryPlaceholder } from "./libraryPlaceholders";
import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SHELF_COLS = 3;
const SHELF_ROWS = 3;

type PlaybackSource = "none" | "generated" | "library";

type AppView = "explore" | "studio";

function chunkShelfRows(items: LibraryPlaceholder[], cols: number, rows: number): LibraryPlaceholder[][] {
  const slice = items.slice(0, cols * rows);
  const out: LibraryPlaceholder[][] = [];
  for (let r = 0; r < rows; r++) {
    out.push(slice.slice(r * cols, r * cols + cols));
  }
  return out;
}

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isJawzaOpen, setIsJawzaOpen] = useState(false);

  const [params, setParams] = useState<MusicParams>({
    tempo: 90,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSong, setGeneratedSong] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevBlobRef = useRef<string | null>(null);

  const [dockTrack, setDockTrack] = useState<DockTrack | null>(null);
  const [playbackSource, setPlaybackSource] = useState<PlaybackSource>("none");
  const [volume, setVolume] = useState(0.88);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [appView, setAppView] = useState<AppView>("explore");
  const [generationPhase, setGenerationPhase] = useState<GenerationPhase>("lyrics");
  const [sessionPrompt, setSessionPrompt] = useState("");
  const [sessionLyrics, setSessionLyrics] = useState("");

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (prevBlobRef.current && prevBlobRef.current !== audioUrl) {
      URL.revokeObjectURL(prevBlobRef.current);
    }
    prevBlobRef.current = audioUrl;
  }, [audioUrl]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTime = () => setCurrentTime(a.currentTime);
    const onMeta = () => setDuration(Number.isFinite(a.duration) ? a.duration : 0);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
    };
  }, [audioUrl]);

  useEffect(() => {
    setCurrentTime(0);
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  const hasDockAudio = playbackSource === "generated" && !!audioUrl;

  const togglePlayback = useCallback(() => {
    if (!hasDockAudio || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play();
    }
  }, [hasDockAudio, isPlaying]);

  const onSeek = useCallback(
    (seconds: number) => {
      if (!audioRef.current || !hasDockAudio) return;
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    },
    [hasDockAudio]
  );

  const selectLibraryPreview = (item: LibraryPlaceholder) => {
    setPlaybackSource("library");
    setDockTrack({
      id: item.id,
      title: item.title,
      artist: `${item.subtitle} · مكتبة غُنّ`,
      artworkGradient: item.gradient,
    });
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const selectGeneratedForPlayback = () => {
    if (!generatedSong || !audioUrl) return;
    setPlaybackSource("generated");
    setDockTrack({
      id: "generated",
      title: generatedSong.title,
      artist: "غُنّ ستوديو · مورتداغزار",
      artworkGradient:
        "linear-gradient(135deg, color-mix(in srgb, var(--brand-orange) 55%, transparent), color-mix(in srgb, var(--brand-blue) 45%, transparent))",
    });
  };

  const runFullGeneration = async (userInput: string, manualLyrics?: string) => {
    setIsLoading(true);
    setAudioUrl(null);
    setGeneratedSong(null);
    setPlaybackSource("none");
    setDockTrack(null);

    const trimmedManual = manualLyrics?.trim();
    if (trimmedManual) {
      setGenerationPhase("audio");
    } else {
      setGenerationPhase("lyrics");
    }

    try {
      let finalLyrics: string | undefined = trimmedManual;

      if (!finalLyrics) {
        const lyricPrompt = `You are "Poet Sahib", an elite Iraqi poet. 
        Write 2 verses and a chorus in Iraqi dialect.
        Parameters: ${JSON.stringify(params)}
        User Topic: ${userInput}`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: lyricPrompt }] }],
        });
        finalLyrics = response.text;
      }

      setGenerationPhase("audio");

      const goldenPrompt = stitchGoldenPrompt(params, finalLyrics);

      const responseStream = await ai.models.generateContentStream({
        model: "lyria-3-pro-preview",
        contents: `Generate a full Iraqi track. Prompt: ${goldenPrompt}`,
        config: {
          responseModalities: [Modality.AUDIO],
        },
      });

      let audioBase64 = "";
      let metadata = "";
      let mimeType = "audio/wav";

      for await (const chunk of responseStream) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;

        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
          if (part.text && !metadata) {
            metadata = part.text;
          }
        }
      }

      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const title = userInput || `تكوين أطوار: ${params.maqam || "مقام أصيل"}`;
      setGeneratedSong({
        title,
        lyrics: finalLyrics,
        params: { ...params },
        duration: "3:15",
        genre: `${params.maqam || "مقام"} - ${params.rhythm || "إيقاع"}`,
        metadata: metadata,
      });

      setSessionLyrics(typeof finalLyrics === "string" ? finalLyrics : "");

      setPlaybackSource("generated");
      setDockTrack({
        id: "generated",
        title,
        artist: "غُنّ ستوديو · مورتداغزار",
        artworkGradient:
          "linear-gradient(135deg, color-mix(in srgb, var(--brand-orange) 55%, transparent), color-mix(in srgb, var(--brand-blue) 45%, transparent))",
      });

      setGenerationPhase("done");
    } catch (error) {
      console.error("Lyria Generation failed:", error);
      setGenerationPhase("error");
    } finally {
      setIsLoading(false);
    }
  };

  const beginGeneration = (userInput: string, manualLyrics?: string) => {
    setSessionPrompt(userInput);
    setSessionLyrics(manualLyrics?.trim() ?? "");
    setAppView("studio");
    void runFullGeneration(userInput, manualLyrics);
  };

  const iconProps = { className: "w-5 h-5", strokeWidth: 1.75 } as const;

  const shelfRows = chunkShelfRows(LIBRARY_PLACEHOLDERS, SHELF_COLS, SHELF_ROWS);

  const playGeneratedFromCard = () => {
    const a = audioRef.current;
    if (!audioUrl || !a) return;
    if (playbackSource === "generated" && dockTrack?.id === "generated" && !a.paused) {
      a.pause();
      return;
    }
    selectGeneratedForPlayback();
    void a.play();
  };

  return (
    <div className="min-h-screen flex overflow-hidden transition-colors duration-300">
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />

      <motion.aside
        initial={false}
        animate={{
          width: isSidebarOpen ? 252 : 72,
        }}
        transition={{ type: "spring", damping: 22, stiffness: 320 }}
        className={`h-screen bg-[var(--bg-surface)] border-l border-[var(--color-slate)]/20 flex flex-col relative z-50 backdrop-blur-md transition-colors duration-300 shrink-0 ${
          isSidebarOpen ? "px-2.5 py-3" : "px-1.5 py-2.5 items-center"
        }`}
        style={{ direction: "rtl" }}
      >
        <div
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center gap-3 mb-5 w-full cursor-pointer hover:opacity-85 transition-opacity ${
            isSidebarOpen ? "" : "justify-center"
          }`}
        >
          <Logo className="h-9 w-auto shrink-0 transition-transform duration-300 active:scale-90" />
        </div>

        <nav className="flex-1 flex flex-col gap-3.5 min-h-0 overflow-y-auto custom-scrollbar">
          <MenuSection>
            <MenuItem
              icon={<LayoutDashboard {...iconProps} />}
              label="لوحة الأطوار"
              active
              isOpen={isSidebarOpen}
            />
            <MenuItem icon={<Library {...iconProps} />} label="مكتبة التوليد" isOpen={isSidebarOpen} />
            <MenuItem icon={<Archive {...iconProps} />} label="الأرشيف" isOpen={isSidebarOpen} />
            <MenuItem icon={<Palette {...iconProps} />} label="لوح الأنماط" isOpen={isSidebarOpen} />
          </MenuSection>

          <MenuSection>
            <MenuItem icon={<CircleUser {...iconProps} />} label="الملف الشخصي" isOpen={isSidebarOpen} />
            <MenuItem icon={<Cog {...iconProps} />} label="الإعدادات" isOpen={isSidebarOpen} />
            <MenuItem
              onClick={() => setIsJawzaOpen(!isJawzaOpen)}
              icon={<JawzaBallIcon size={20} />}
              label="جوزة"
              active={isJawzaOpen}
              isOpen={isSidebarOpen}
            />
          </MenuSection>
        </nav>

        <div
          className={`mt-auto pt-3 border-t border-[var(--color-slate)]/25 shrink-0 ${
            isSidebarOpen ? "px-0.5" : "px-0"
          }`}
        >
          <div
            className={`flex items-center gap-2.5 rounded-xl bg-[var(--bg-raised)]/80 border border-[var(--color-slate)]/20 ${
              isSidebarOpen ? "px-2.5 py-2" : "p-1.5 justify-center"
            }`}
          >
            <div
              className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white font-arabic shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, var(--brand-orange) 0%, var(--brand-blue) 55%, var(--brand-sky) 100%)",
              }}
              aria-hidden
            >
              مـح
            </div>
            <AnimatePresence mode="wait">
              {isSidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.18 }}
                  className="min-w-0 flex-1 text-right"
                >
                  <p className="text-xs font-bold font-arabic text-[var(--text-primary)] truncate">
                    مازن الحداد
                  </p>
                  <p className="text-[10px] text-[var(--text-secondary)] font-arabic truncate">
                    ملحن · بغداد
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      <div className="flex-1 flex overflow-hidden relative min-w-0">
        <main className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 min-w-0 bg-[var(--bg-void)]">
          <div className="flex flex-col flex-1 min-h-0 min-w-0">
            {appView === "studio" ? (
              <GenerationStudio
                phase={generationPhase}
                isLoading={isLoading}
                sessionPrompt={sessionPrompt}
                setSessionPrompt={setSessionPrompt}
                sessionLyrics={sessionLyrics}
                setSessionLyrics={setSessionLyrics}
                generatedSong={generatedSong}
                dockTrack={dockTrack}
                isPlaying={isPlaying}
                playbackSource={playbackSource}
                onPlayGenerated={playGeneratedFromCard}
                onBack={() => setAppView("explore")}
                onRegenerate={() => {
                  const ly = sessionLyrics.trim();
                  void runFullGeneration(sessionPrompt, ly || undefined);
                }}
              />
            ) : (
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar relative">
              <div
                className="px-5 sm:px-8 lg:px-12 pt-6 pb-10 max-w-6xl mx-auto w-full min-h-full"
                style={{
                  background:
                    "radial-gradient(80% 50% at 50% 0%, color-mix(in srgb, var(--brand-orange) 11%, transparent) 0%, transparent 52%), radial-gradient(65% 38% at 85% 12%, color-mix(in srgb, var(--brand-blue) 9%, transparent) 0%, transparent 42%), var(--bg-void)",
                }}
              >
                <div className="max-w-[900px] mx-auto flex flex-col items-center gap-5 pb-10" dir="rtl">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5 text-center sm:text-right">
                    <Logo className="h-[5.625rem] w-auto sm:h-[7.125rem] shrink-0" />
                    <div className="flex flex-col gap-0.5 min-w-0 max-w-md leading-snug">
                      <p
                        className="font-title text-[1.35rem] sm:text-[1.6rem] tracking-tight bg-clip-text text-transparent"
                        style={{
                          backgroundImage:
                            "linear-gradient(105deg, var(--brand-blue) 0%, var(--brand-sky) 45%, var(--brand-orange) 100%)",
                        }}
                      >
                        غَن يا صاح
                      </p>
                      <p className="font-arabic text-sm sm:text-[0.95rem] text-[var(--text-secondary)] font-medium">
                        واحرس أغاني النهر والمقام
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex justify-center min-w-0">
                    <PromptBar
                      params={params}
                      setParams={setParams}
                      onGenerate={beginGeneration}
                      isLoading={isLoading}
                    />
                  </div>
                </div>

                <div className={isLoading ? "opacity-45 pointer-events-none" : ""}>
                  <div className="flex items-end justify-between gap-4 mb-4" dir="rtl">
                    <h2 className="text-[11px] font-bold font-arabic text-[var(--text-secondary)] tracking-wide">
                      مكتبة المسارات
                    </h2>
                    <span className="text-[9px] font-mono text-[var(--text-secondary)]/70 tabular-nums">
                      {SHELF_COLS * SHELF_ROWS} معروض
                    </span>
                  </div>

                  <div className="flex flex-col gap-5 sm:gap-6">
                    {shelfRows.map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                      >
                        {row.map((item) => (
                          <PlayShelfCard
                            key={item.id}
                            title={item.title}
                            tags={item.tags}
                            promptText={item.promptLine}
                            artGradient={item.gradient}
                            duration={item.duration}
                            playState="play"
                            onPlay={() => selectLibraryPreview(item)}
                            selected={dockTrack?.id === item.id}
                            promptLabel="الموجه"
                          />
                        ))}
                      </div>
                    ))}
                  </div>

                  <section className="mt-10 pt-8 border-t border-[var(--color-slate)]/22" dir="rtl">
                    <h2 className="text-[11px] font-bold font-arabic text-[var(--text-secondary)] mb-1 tracking-wide">
                      خطافات ومسارات قصيرة
                    </h2>
                    <p className="text-[10px] text-[var(--text-secondary)]/80 font-arabic mb-4 leading-relaxed max-w-xl">
                      أفكار جاهزة لبداية لحن أو لازمة — انسخها إلى حقل الوصف عند الحاجة.
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scroll-smooth">
                      {HOOK_SAMPLES.map((hook) => (
                        <button
                          key={hook.id}
                          type="button"
                          className="shrink-0 w-[min(100%,260px)] text-right rounded-2xl border border-[var(--color-slate)]/30 bg-[var(--bg-surface)]/70 px-4 py-3 transition-all hover:border-[var(--brand-blue)]/35 hover:bg-[var(--bg-raised)]/90"
                        >
                          <p className="text-xs font-bold font-arabic text-[var(--text-primary)] leading-snug line-clamp-2">
                            {hook.line}
                          </p>
                          <p className="text-[10px] text-[var(--brand-sky)]/90 font-arabic mt-1.5">
                            {hook.vibe}
                          </p>
                        </button>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
            )}

            <div className="shrink-0 border-t border-[var(--color-slate)]/22 bg-[color-mix(in_srgb,var(--bg-void)_94%,transparent)] backdrop-blur-md">
              <NowPlayingDock
                track={dockTrack}
                hasAudio={hasDockAudio}
                isPlaying={isPlaying}
                onTogglePlay={togglePlayback}
                currentTime={currentTime}
                duration={duration}
                onSeek={onSeek}
                volume={volume}
                onVolume={setVolume}
              />
            </div>
          </div>
        </main>

        <JawzaChat isOpen={isJawzaOpen} onClose={() => setIsJawzaOpen(false)} />
      </div>
    </div>
  );
}

function MenuSection({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-0.5 mb-2">{children}</div>;
}

function MenuItem({
  icon,
  label,
  active = false,
  isOpen = true,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isOpen?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full flex items-center transition-all duration-200 group outline-none
        ${isOpen ? "px-2 py-1.5 gap-2.5 rounded-xl" : "justify-center py-2 px-0 rounded-xl min-h-[40px]"}
        ${
          active
            ? "bg-[var(--color-teal)]/12 text-[var(--color-teal)] shadow-[0_0_16px_rgba(0,168,255,0.07)]"
            : "text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]"
        }
      `}
      title={!isOpen ? label : undefined}
    >
      <span
        className={`shrink-0 flex items-center justify-center transition-transform duration-200 ${
          active ? "scale-105" : "group-hover:scale-105"
        }`}
      >
        {icon}
      </span>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.15 }}
            className="text-[13px] font-bold font-arabic whitespace-nowrap truncate"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
