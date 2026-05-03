import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';

interface SignInProps {
  onSignIn: (username: string) => void;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('fill in both fields, bestie.');
      return;
    }
    if (password.length < 4) {
      setError('password too short — min 4 chars.');
      return;
    }

    setIsLoading(true);
    // Simulate a brief auth delay for UX polish
    await new Promise((r) => setTimeout(r, 800));
    setIsLoading(false);
    onSignIn(username.trim());
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-onyx overflow-hidden font-sans">
      {/* Background glows */}
      <div className="fixed -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-cyber-lime/8 blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-soft-lavender/8 blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cyber-lime/3 blur-[120px] pointer-events-none" />

      {/* Subtle grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(204,255,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(204,255,0,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 120 }}
        className="relative w-full max-w-sm mx-4"
      >
        {/* Card */}
        <div className="glass-dark rounded-3xl p-8 shadow-2xl border border-white/10">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 flex flex-col items-center gap-3"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyber-lime shadow-lg shadow-cyber-lime/30">
              <Zap size={26} fill="currentColor" className="text-onyx" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight uppercase italic text-off-white">
                Echo
              </h1>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-off-white/30 mt-0.5">
                your academic strategist
              </p>
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Username */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-off-white/30 group-focus-within:text-cyber-lime transition-colors">
                <User size={15} />
              </div>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                autoComplete="username"
                className="w-full h-12 rounded-xl glass border-white/10 pl-10 pr-4 text-sm text-off-white outline-none focus:border-cyber-lime/40 focus:glow-lime transition-all placeholder:text-off-white/20 font-mono"
              />
            </div>

            {/* Password */}
            <div className="group relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-off-white/30 group-focus-within:text-cyber-lime transition-colors">
                <Lock size={15} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
                autoComplete="current-password"
                className="w-full h-12 rounded-xl glass border-white/10 pl-10 pr-4 text-sm text-off-white outline-none focus:border-cyber-lime/40 transition-all placeholder:text-off-white/20 font-mono"
              />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono"
              >
                <AlertCircle size={13} className="shrink-0" />
                {error}
              </motion.div>
            )}

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full h-12 mt-2 rounded-xl bg-cyber-lime text-onyx font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-cyber-lime/20 hover:shadow-cyber-lime/40 transition-all disabled:opacity-60 disabled:grayscale"
            >
              {isLoading ? (
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-onyx animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-onyx animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-onyx animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                <>
                  let's go
                  <ArrowRight size={15} />
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Footer hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 text-center text-[10px] font-mono text-off-white/20 uppercase tracking-widest"
          >
            no gatekeeping zone // echo v1.0
          </motion.p>
        </div>

        {/* Corner accent lines */}
        <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyber-lime/40 to-transparent" />
        <div className="absolute -bottom-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-soft-lavender/30 to-transparent" />
      </motion.div>
    </div>
  );
}
