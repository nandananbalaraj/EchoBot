import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Flame, 
  Music, 
  Files, 
  Plus, 
  ChevronRight, 
  Volume2, 
  VolumeX,
  History,
  Zap,
  Library,
  Coffee
} from 'lucide-react';
import { chat, ChatMessage } from './services/ollamaService';
import SignIn from './SignIn';

interface Message extends ChatMessage {
  id: string;
  timestamp: Date;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPanicMode, setIsPanicMode] = useState(false);
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);
  const [isReceiptsOpen, setIsReceiptsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleSignIn = (username: string) => {
    setCurrentUser(username);
    setMessages([
      {
        id: '1',
        role: 'model',
        content: `yo ${username} 👋 i'm Echo — your academic strategist and vibe manager. ready to un-gatekeep some knowledge? what's the plan today? 📚✨`,
        timestamp: new Date(),
      }
    ]);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyForAI = [...messages, userMsg].map(({ role, content }) => ({ role, content }));
    const aiResponse = await chat(historyForAI, isPanicMode);

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      content: aiResponse,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  const toggleLofi = () => {
    if (audioRef.current) {
      if (isLofiPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Audio play failed (maybe user didn't interact yet)", e));
      }
      setIsLofiPlaying(!isLofiPlaying);
    }
  };

  if (!currentUser) {
    return <SignIn onSignIn={handleSignIn} />;
  }

  return (
    <div className="flex h-screen w-full flex-col bg-onyx text-off-white font-sans selection:bg-cyber-lime selection:text-onyx overflow-hidden">
      {/* Background Glows */}
      <div className="fixed -top-24 -left-24 h-96 w-96 rounded-full bg-cyber-lime/10 blur-[120px] pointer-events-none" />
      <div className="fixed -bottom-24 -right-24 h-96 w-96 rounded-full bg-soft-lavender/10 blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="flex h-16 items-center justify-between px-4 md:px-6 glass-dark z-20 shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-xl bg-cyber-lime text-onyx shadow-lg shadow-cyber-lime/20">
            <Zap size={18} className="md:w-5 md:h-5" fill="currentColor" />
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight uppercase italic">Echo</h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setIsPanicMode(!isPanicMode)}
            className={`flex items-center justify-center gap-2 rounded-full px-3 md:px-4 py-2 text-[10px] md:text-xs font-bold transition-all duration-300 min-h-[40px] ${
              isPanicMode 
                ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                : 'glass hover:bg-white/10'
            }`}
            id="panic-mode-btn"
          >
            <Flame size={14} className={isPanicMode ? 'animate-pulse' : ''} />
            <span className="hidden sm:inline">{isPanicMode ? 'PANIC ACTIVE' : 'PANIC MODE'}</span>
            <span className="sm:hidden">{isPanicMode ? 'PANIC' : 'PANIC'}</span>
          </button>
          
          <button 
            onClick={() => setIsReceiptsOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full px-3 md:px-4 py-2 text-[10px] md:text-xs font-bold glass hover:bg-white/10 min-h-[40px]"
            id="receipts-btn"
          >
            <Library size={14} />
            <span className="hidden sm:inline">RECEIPTS</span>
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="relative flex-1 overflow-y-auto px-4 py-4 md:py-6 scroll-smooth" ref={scrollRef}>
        <div className="mx-auto max-w-2xl space-y-6 md:space-y-8 pb-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`relative max-w-[90%] md:max-w-[85%] rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-xl glass transition-all ${
                    msg.role === 'user' 
                      ? 'border-soft-lavender/30 bg-soft-lavender/5 text-off-white glow-lavender rounded-tr-none' 
                      : 'border-cyber-lime/30 bg-cyber-lime/5 text-off-white glow-lime rounded-tl-none font-mono text-xs md:text-sm leading-relaxed'
                  }`}
                >
                  {msg.role === 'model' && (
                    <div className="mb-2 flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-cyber-lime">
                      <Zap size={10} fill="currentColor" />
                      Echo
                    </div>
                  )}
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                  <div className="mt-2 text-[9px] md:text-[10px] opacity-30">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="glass rounded-2xl md:rounded-3xl p-4 md:p-5 border-cyber-lime/20 glow-lime rounded-tl-none">
                <div className="flex gap-1.5">
                  <div className="h-1 w-1 md:h-1.5 md:w-1.5 animate-bounce rounded-full bg-cyber-lime" style={{ animationDelay: '0ms' }} />
                  <div className="h-1 w-1 md:h-1.5 md:w-1.5 animate-bounce rounded-full bg-cyber-lime" style={{ animationDelay: '150ms' }} />
                  <div className="h-1 w-1 md:h-1.5 md:w-1.5 animate-bounce rounded-full bg-cyber-lime" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Footer Controls */}
      <footer className="relative w-full px-4 pb-6 md:pb-8 z-20 pointer-events-none">
        <div className="mx-auto flex max-w-2xl items-center gap-2 md:gap-3 pointer-events-auto">
          {/* Lofi Widget */}
          <div className="flex h-12 w-12 md:h-14 md:w-14 items-center justify-center rounded-xl md:rounded-2xl glass-dark hover:bg-white/10 transition-colors pointer-events-auto group shrink-0">
            <button 
              onClick={toggleLofi}
              className={`relative flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg md:rounded-xl bg-onyx transition-all ${isLofiPlaying ? 'text-cyber-lime scale-105' : 'text-off-white/40'}`}
              title="Study Beats"
            >
              {isLofiPlaying ? <Volume2 size={18} className="md:w-5 md:h-5" /> : <VolumeX size={18} className="md:w-5 md:h-5" />}
              {isLofiPlaying && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-lime opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-lime"></span>
                </span>
              )}
            </button>
            <audio 
              ref={audioRef}
              src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
              loop 
              hidden 
            />
          </div>

          {/* Input Bar */}
          <div className="relative flex-1 group pointer-events-auto">
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-cyber-lime/20 to-soft-lavender/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isPanicMode ? "GO." : "vibe check?"}
              className="relative h-12 md:h-14 w-full rounded-[2rem] glass-dark border-white/5 px-5 md:px-6 py-2 text-sm md:text-base text-off-white outline-none focus:border-cyber-lime/30 transition-all placeholder:text-off-white/20"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-1.5 md:right-2 top-1.5 md:top-2 h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full bg-cyber-lime text-onyx hover:scale-105 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
            >
              <Send size={16} className="md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
      </footer>

      {/* Receipts Drawer */}
      <AnimatePresence>
        {isReceiptsOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReceiptsOpen(false)}
              className="fixed inset-0 z-40 bg-onyx/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 h-full w-full max-w-md glass-dark border-l border-white/10 p-8 shadow-2xl"
            >
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Library className="text-cyber-lime" />
                  <h2 className="text-2xl font-bold tracking-tighter uppercase italic">The Receipts</h2>
                </div>
                <button 
                  onClick={() => setIsReceiptsOpen(false)}
                  className="rounded-full p-2 glass hover:bg-white/10"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl p-4 glass border-white/10 bg-white/5">
                  <div className="flex items-center gap-3 mb-2">
                    <Coffee size={18} className="text-soft-lavender" />
                    <span className="text-xs font-bold uppercase tracking-widest text-soft-lavender">Session Logs</span>
                  </div>
                  <p className="text-sm opacity-60 leading-relaxed font-mono">
                    Echo is currently tracking sources from your chat. As you research, verified links will populate here. 
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-30">Recent Sources</h3>
                  <div className="flex flex-col gap-2">
                    {/* Mock Receipts for UI demonstration */}
                    <div className="flex h-16 items-center gap-4 rounded-xl glass px-4 hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-cyber-lime/10 text-cyber-lime">
                        <Files size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">Industrial Revolution - Wikipedia</p>
                        <p className="text-[10px] opacity-40 truncate">https://en.wikipedia.org/wiki/Industrial_Revolution</p>
                      </div>
                    </div>
                    <div className="flex h-16 items-center gap-4 rounded-xl glass px-4 hover:bg-white/5 transition-colors cursor-pointer group">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-soft-lavender/10 text-soft-lavender">
                        <Files size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">Steam Engines & Society</p>
                        <p className="text-[10px] opacity-40 truncate">https://history.com/topics/natural-science</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-8 right-8 text-[10px] opacity-20 text-center font-mono">
                ECHO v1.0 // NO GATEKEEPING ZONE
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
