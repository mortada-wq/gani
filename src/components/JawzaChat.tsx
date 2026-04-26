import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: "user" | "bot";
  text: string;
}

interface JawzaChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JawzaChat({ isOpen, onClose }: JawzaChatProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "أهلاً بك! أنا جوزة، مساعدك الذكي في ستوديو غُـنّ. كيف يمكنني مساعدتك في رحلتك الموسيقية اليوم؟" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
            { role: "user", parts: [{ text: `أنت «جوزة»، خبير تراثي رفيع المستوى في «ستوديو غُـنّ». شخصيتك شاعرية وحكيمة، وتتقن المقامات العراقية والإيقاعات (مثل التشوبي والجرغينة) والآلات. أجب بعربية فصيحة رصينة دون مبالغة، وبإيجاز ثري ثقافياً. سؤال المستخدم: ${userMsg}` }] }
        ],
      });

      const botText = response.text || "عذراً، حدث خطأ ما.";
      setMessages(prev => [...prev, { role: "bot", text: botText }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: "أواجه بعض الصعوبات التقنية حالياً." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 420, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="h-screen bg-[var(--bg-surface)]/95 backdrop-blur-3xl border-r border-[var(--color-slate)]/20 flex flex-col relative z-40 overflow-hidden"
          style={{ direction: 'rtl' }}
        >
          {/* Header */}
          <div className="bg-[var(--color-teal)]/5 p-6 flex items-center justify-between border-b border-[var(--color-slate)]/20 min-h-[90px]">
            <div className="flex items-center gap-4">
              <JawzaBallIcon size={32} />
              <div className="flex flex-col">
                <span className="font-title font-bold text-title-gradient text-xl">جوزة</span>
                <span className="text-[10px] text-[var(--color-teal)] uppercase tracking-widest font-bold opacity-80">عن التاريخ والأطوار</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-raised)] rounded-full text-[var(--text-secondary)] transition-all hover:rotate-90"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[var(--bg-void)]/10 custom-scrollbar"
          >
            {messages.map((msg, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}
              >
                <div className={`max-w-[85%] p-5 rounded-2xl text-sm font-arabic leading-relaxed shadow-sm transition-colors ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-teal)] text-[var(--color-void)] shadow-[0_4px_15px_rgba(0,168,255,0.22)]' 
                    : 'bg-[var(--bg-raised)] text-[var(--text-primary)] border border-[var(--color-slate)]/30'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-end p-2">
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-[10px] font-arabic text-[var(--color-teal)] italic"
                >
                  جوزة تبحث في أرشيفات المقامات...
                </motion.div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 bg-[var(--bg-surface)] border-t border-[var(--color-slate)]/20">
            <div className="relative">
              <textarea 
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="اسأل جوزة..."
                className="w-full bg-[var(--bg-raised)] border border-[var(--color-slate)]/20 rounded-2xl px-6 py-5 pr-14 text-sm font-arabic text-[var(--text-primary)] focus:border-[var(--color-teal)]/30 outline-none transition-all shadow-inner placeholder:text-[var(--text-secondary)]/30 resize-none no-scrollbar font-bold"
                dir="rtl"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="absolute right-3 top-5 p-3 text-[var(--color-teal)] hover:scale-110 disabled:opacity-20 disabled:scale-100 transition-all"
              >
                <Send className="w-6 h-6 rotate-180" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function JawzaBallIcon({ size = 24 }: { size?: number }) {
  return (
    <motion.div
      animate={{ rotateY: 360 }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      className="relative flex items-center justify-center shrink-0"
      style={{ width: size, height: size, perspective: '1000px' }}
    >
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--color-neon)]/85 via-[var(--color-teal)] to-[var(--brand-slate)] border border-[var(--color-sky)]/40 shadow-[0_0_15px_rgba(0,168,255,0.2)]">
        <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-white/30 blur-[1px] rounded-full" />
      </div>
      <Sparkles className="w-1/2 h-1/2 text-white/90 relative z-10 drop-shadow-sm" />
    </motion.div>
  );
}

