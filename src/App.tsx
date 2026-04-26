import React, { useState, useRef, useEffect } from "react";
import { Music, History, Settings, User, Sparkles, Play, Pause, SkipForward, SkipBack, Share2, Download, Info, Type, Volume2, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Logo from "./components/Logo";
import PromptBar from "./components/PromptBar";
import JawzaChat, { JawzaBallIcon } from "./components/JawzaChat";
import { MusicParams, stitchGoldenPrompt } from "./constants";
import { GoogleGenAI, Modality } from "@google/genai";

// Initialize AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isJawzaOpen, setIsJawzaOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("gun-studio-theme") as 'dark' | 'light';
      if (saved) return saved;
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      return prefersDark ? "dark" : "light";
    }
    return "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("gun-studio-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  const [params, setParams] = useState<MusicParams>({
    tempo: 90,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSong, setGeneratedSong] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleGenerate = async (userInput: string, manualLyrics?: string) => {
    setIsLoading(true);
    setAudioUrl(null);
    setGeneratedSong(null);
    
    try {
      let finalLyrics = manualLyrics;

      // 1. Generate Lyrics if not provided
      if (!manualLyrics) {
        const lyricPrompt = `You are "Poet Sahib", an elite Iraqi poet. 
        Write 2 verses and a chorus in Iraqi dialect.
        Parameters: ${JSON.stringify(params)}
        User Topic: ${userInput}`;
        
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: lyricPrompt }] }]
        });
        finalLyrics = response.text;
      }

      // 2. Generate Music using Lyria 3 Pro
      const goldenPrompt = stitchGoldenPrompt(params, finalLyrics);
      
      const responseStream = await ai.models.generateContentStream({
        model: "lyria-3-pro-preview",
        contents: `Generate a full Iraqi track. Prompt: ${goldenPrompt}`,
        config: {
          responseModalities: [Modality.AUDIO],
        }
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

      // 3. Decode and create playable URL
      const binary = atob(audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      setGeneratedSong({
        title: userInput || `تكوين أطوار: ${params.maqam || "مقام أصيل"}`,
        lyrics: finalLyrics,
        params: { ...params },
        duration: "3:15", // In a real scenario, we'd calculate this from the buffer
        genre: `${params.maqam || "مقام"} - ${params.rhythm || "إيقاع"}`,
        metadata: metadata
      });

    } catch (error) {
      console.error("Lyria Generation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen flex overflow-hidden selection:bg-neon selection:text-void transition-colors duration-300">
      <audio 
        ref={audioRef} 
        src={audioUrl || undefined} 
        onEnded={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Sidebar Navigation - Collapsible */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 84,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className={`h-screen bg-[var(--bg-surface)] border-l border-[var(--color-slate)]/20 flex flex-col relative z-50 backdrop-blur-md transition-colors duration-300 ${isSidebarOpen ? 'p-4' : 'p-3 items-center'}`}
        style={{ direction: 'rtl' }}
      >
        {/* Creative Smoke/Flash Overlay */}
        <AnimatePresence mode="popLayout">
          {isSidebarOpen !== null && (
            <motion.div
              key={isSidebarOpen ? 'open' : 'closed'}
              initial={{ opacity: 1, filter: "blur(0px) brightness(1)" }}
              animate={{ opacity: 0, filter: "blur(20px) brightness(2)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute inset-0 bg-white/20 pointer-events-none z-[60]"
            />
          )}
        </AnimatePresence>

        <div 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`flex items-center gap-4 mb-10 w-full cursor-pointer hover:opacity-80 transition-opacity ${isSidebarOpen ? '' : 'justify-center'}`}
        >
          <Logo className="w-9 h-9 shrink-0 text-[var(--color-neon)] drop-shadow-[0_0_12px_rgba(18,255,235,0.3)] transition-transform duration-300 active:scale-90" />
        </div>

        <nav className="flex-1 flex flex-col gap-8">
          <MenuSection title={isSidebarOpen ? "القائمة" : ""}>
            <MenuItem icon={<Music className="w-4 h-4" />} label="الأطوار" active isOpen={isSidebarOpen} />
            <MenuItem icon={<History className="w-4 h-4" />} label="الأرشيف" isOpen={isSidebarOpen} />
            <MenuItem icon={<Sparkles className="w-4 h-4" />} label="الأنماط" isOpen={isSidebarOpen} />
          </MenuSection>

          <MenuSection title={isSidebarOpen ? "الحساب" : ""}>
            <MenuItem icon={<User className="w-4 h-4" />} label="الملف الشخصي" isOpen={isSidebarOpen} />
            <MenuItem icon={<Settings className="w-4 h-4" />} label="الإعدادات" isOpen={isSidebarOpen} />
            <MenuItem 
              onClick={toggleTheme}
              icon={theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} 
              label={theme === 'dark' ? "الوضع النهاري" : "الوضع الليلي"} 
              isOpen={isSidebarOpen} 
            />
            <MenuItem 
              onClick={() => setIsJawzaOpen(!isJawzaOpen)}
              icon={<JawzaBallIcon size={18} />} 
              label="جوزة AI" 
              active={isJawzaOpen}
              isOpen={isSidebarOpen} 
            />
          </MenuSection>
        </nav>
      </motion.aside>

      {/* Main Content & Panels Container */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300">
          <div className="p-8 lg:p-12 max-w-6xl mx-auto w-full flex flex-col h-full relative">
            
            {/* 1. TOP SECTION: Header */}
            <header className="flex justify-between items-start shrink-0 mb-8">
              <div />
            </header>
  
            {/* 2. MIDDLE SECTION: Gallery */}
            <section className="flex-1 overflow-y-auto min-h-0 mb-8 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4">
                {/* If no songs yet, show placeholders */}
                {!generatedSong && !isLoading && [1, 2, 3].map((i) => (
                  <div key={i} className="glass-panel p-6 border-dashed border-[var(--color-slate)] flex flex-col gap-4 opacity-30">
                    <div className="h-32 bg-[var(--bg-raised)] rounded-2xl flex items-center justify-center">
                      <div className="flex gap-1 items-end h-8">
                        {[1, 2, 3, 4, 3, 2, 5, 2, 3].map((b, idx) => (
                          <div key={idx} className="w-1 bg-[var(--color-slate)] rounded-full" style={{ height: `${b * 20}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="h-4 w-2/3 bg-[var(--bg-raised)] rounded-full" />
                  </div>
                ))}
  
                {isLoading && (
                  <div className="col-span-full py-20 flex flex-col items-center">
                     <Logo className="w-24 h-24 mb-8 animate-pulse text-[var(--color-neon)]" />
                     <h2 className="text-xl font-arabic text-[var(--color-neon)] animate-pulse mb-2 italic font-bold">نَصيغُ الألحَانَ بِروحِ العِراق...</h2>
                     <p className="text-[var(--text-secondary)] font-arabic text-[10px] uppercase tracking-widest opacity-60">جاري معالجة الأطوار والمقامات عبر Lyria 3 Pro</p>
                  </div>
                )}
  
                {generatedSong && !isLoading && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-panel p-6 border-[var(--color-slate)] shadow-lg group relative"
                  >
                    <div className="absolute top-4 right-4 bg-[var(--color-amber)]/20 text-[var(--color-amber)] text-[8px] px-2 py-0.5 rounded font-mono">
                      NEW_GEN
                    </div>
                    <div className="h-32 bg-[var(--bg-raised)] border border-[var(--color-slate)] rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative">
                      <div className="flex gap-1 items-end h-12">
                        {[1, 2, 4, 3, 5, 2, 6, 4, 3, 5, 2].map((b, idx) => (
                          <motion.div 
                            key={idx} 
                            animate={{ height: isPlaying ? [`${b * 12}%`, `${b * 16}%`, `${b * 12}%`] : `${b * 12}%` }}
                            transition={{ repeat: Infinity, duration: 0.5 + Math.random() }}
                            className="w-1.5 bg-[var(--color-neon)] rounded-full" 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-[var(--text-secondary)] font-bold uppercase tracking-widest mb-1 opacity-60">{generatedSong.genre}</span>
                        <h3 className="text-lg font-arabic text-[var(--text-primary)] leading-tight">{generatedSong.title}</h3>
                      </div>
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={togglePlayback}
                        className="w-12 h-12 rounded-full bg-[var(--color-teal)] text-white flex items-center justify-center hover:bg-[var(--color-neon)] transition-colors shadow-md"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 translate-x-0.5" />}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </div>
            </section>
  
            {/* 3. BOTTOM SECTION: Prompt Bar (Hero) */}
            <section className="shrink-0 pt-6">
              <PromptBar 
                params={params}
                setParams={setParams}
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            </section>
  
          </div>
  
          <footer className="px-8 pb-4 text-center text-[9px] text-[var(--text-secondary)] font-sans opacity-40 uppercase tracking-[4px]">
             Copyright &copy; 2026 Resonating Iraqi Heritage &bull; Gun Studio
          </footer>
        </main>
  
        {/* Jawza Side Panel */}
        <JawzaChat isOpen={isJawzaOpen} onClose={() => setIsJawzaOpen(false)} />
      </div>


      <div className="fixed -bottom-40 -left-40 w-[500px] h-[500px] bg-sahib-saffron/5 blur-[150px] pointer-events-none" />
      <div className="fixed -top-40 -right-20 w-[400px] h-[400px] bg-sahib-teal/5 blur-[120px] pointer-events-none" />
    </div>
  );
}


function MenuSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 mb-6">
      {title && <h3 className="px-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2 font-arabic">{title}</h3>}
      {children}
    </div>
  );
}

function MenuItem({ icon, label, active = false, isOpen = true, onClick }: { icon: React.ReactNode, label: string, active?: boolean, isOpen?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-full flex items-center transition-all duration-300 group outline-none
        ${isOpen ? 'px-3 py-2 gap-3 rounded-xl' : 'justify-center py-3 px-0 rounded-full'}
        ${active 
          ? 'bg-[var(--color-teal)]/10 text-[var(--color-teal)] shadow-[0_0_20px_rgba(14,175,169,0.05)]' 
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-raised)] hover:text-[var(--text-primary)]'}
      `}
      title={!isOpen ? label : undefined}
    >
      <span className={`shrink-0 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.span 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="text-sm font-bold font-arabic whitespace-nowrap"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function ActionButton({ icon, active = false, label = "" }: { icon: React.ReactNode, active?: boolean, label?: string }) {
  return (
    <button className={`p-4 rounded-2xl flex items-center gap-3 transition-all group ${active ? 'bg-[var(--color-teal)] text-white' : 'bg-[var(--bg-surface)] border border-[var(--color-slate)] text-[var(--text-secondary)] hover:bg-[var(--color-teal)] hover:border-[var(--color-teal)] hover:text-white shadow-sm'}`}>
      <span className={`${active ? 'text-white' : 'text-[var(--color-teal)] opacity-50 group-hover:opacity-100 group-hover:text-white'} transition-all`}>
        {icon}
      </span>
      <span className="text-xs font-bold font-arabic">{label}</span>
    </button>
  );
}
