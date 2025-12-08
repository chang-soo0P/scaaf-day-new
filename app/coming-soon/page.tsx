"use client";

import { useEffect, useState, useRef } from "react";
import { Mail, Zap, Sparkles, Inbox } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const parallaxRef = useRef<HTMLDivElement>(null);

  // Countdown timer --------------------------------------------------
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 30);

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = target.getTime() - now;

      if (diff > 0) {
        setTimeLeft({
          days: String(Math.floor(diff / (1000 * 60 * 60 * 24))).padStart(2, "0"),
          hours: String(Math.floor((diff / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
          minutes: String(Math.floor((diff / 1000 / 60) % 60)).padStart(2, "0"),
          seconds: String(Math.floor((diff / 1000) % 60)).padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Parallax mouse motion --------------------------------------------
  useEffect(() => {
    const root = parallaxRef.current;
    if (!root) return;

    const handler = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      root.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // Email submit -----------------------------------------------------
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setIsSubscribed(false);
    }, 2800);
  };

  return (
    <div className="relative min-h-screen bg-white text-gray-900 overflow-hidden">
      {/* Apple-like volumetric light */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(160,140,255,0.28),transparent_70%)]" />

      {/* Floating gradient fog */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] bg-purple-300 opacity-30 blur-[200px] animate-slowfloat" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] bg-indigo-300 opacity-30 blur-[200px] animate-slowfloat-reverse" />

      {/* Parallax layer */}
      <div ref={parallaxRef} className="absolute inset-0 transition-transform duration-300 ease-out pointer-events-none" />

      {/* Page content */}
      <div className="relative z-20 flex flex-col min-h-screen">

        {/* Header */}
        <header className="px-8 py-8 flex justify-between max-w-7xl mx-auto w-full fade-in">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-300/40">
              <Inbox className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Scaaf.day
            </span>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 pb-16">
          <div className="text-center max-w-4xl mx-auto fade-up space-y-14">

            {/* Apple Wave Ribbon */}
            <div className="relative h-24">
              <svg className="absolute inset-0 w-full h-full animate-waveribbon" viewBox="0 0 1200 140">
                <path
                  d="M0,60 Q300,15 600,60 T1200,60 L1200,140 L0,140 Z"
                  fill="url(#waveG)"
                />
                <defs>
                  <linearGradient id="waveG" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium shadow-sm fade-up-delayed">
              <Zap className="h-4 w-4" />
              AI-Powered Email Intelligence
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight fade-up-delayed2">
              Wrap up your inbox.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Focus on what matters.
              </span>
            </h1>

            {/* Subcopy */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto fade-up-delayed3">
              AI-powered email summaries that cut through the noise.  
              Less reading. More doing.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-10 pt-6 fade-up-delayed4">
              {[
                { icon: <Mail className="h-6 w-6 text-indigo-600" />, label: "Smart Summaries" },
                { icon: <Sparkles className="h-6 w-6 text-purple-600" />, label: "Instant Insights" },
                { icon: <Zap className="h-6 w-6 text-pink-600" />, label: "Time Saved" },
              ].map(({ icon, label }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 group transition-all hover:-translate-y-1 hover:scale-[1.03]"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shadow group-hover:shadow-lg transition-all">
                    {icon}
                  </div>
                  <span className="text-gray-700 font-medium">{label}</span>
                </div>
              ))}
            </div>

            {/* Countdown */}
            <div className="pt-12 fade-up-delayed5">
              <p className="text-gray-600 mb-6 text-lg">Launching in</p>
              <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                {[
                  ["Days", timeLeft.days],
                  ["Hours", timeLeft.hours],
                  ["Mins", timeLeft.minutes],
                  ["Secs", timeLeft.seconds],
                ].map(([label, value], i) => (
                  <div
                    key={i}
                    className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40 animate-softpulse"
                  >
                    <div className="text-5xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {value}
                    </div>
                    <div className="uppercase text-gray-500 text-xs tracking-wide mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Subscription */}
            <div className="max-w-lg mx-auto w-full pt-10 fade-up-delayed6">
              <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/40">

                <h2 className="text-2xl font-semibold mb-2">Be the first to know</h2>
                <p className="text-gray-600 mb-6">Get early access when we launch</p>

                {!isSubscribed ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="email"
                        placeholder="you@email.com"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 rounded-xl border-2 border-gray-200"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_20px_rgba(139,92,246,0.45)] transition-all"
                    >
                      Notify Me at Launch
                    </Button>
                  </form>
                ) : (
                  <div className="h-14 flex items-center justify-center text-green-700 bg-green-50 border border-green-400 rounded-xl animate-fadein">
                    <Sparkles className="h-6 w-6 mr-2" />
                    You're on the list!
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4 text-center">No spam. Unsubscribe anytime.</p>
              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="py-10 text-center text-gray-500 text-sm fade-up-delayed7">
          © {new Date().getFullYear()} Scaaf.day • All Rights Reserved
        </footer>
      </div>

      {/* Motion styles */}
      <style>{`
        @keyframes slowfloat {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(35px, -35px); }
        }
        .animate-slowfloat { animation: slowfloat 14s ease-in-out infinite; }

        @keyframes slowfloat-rev {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-35px, 35px); }
        }
        .animate-slowfloat-reverse { animation: slowfloat-rev 16s ease-in-out infinite; }

        @keyframes waveMotion {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-waveribbon { animation: waveMotion 7s ease-in-out infinite; }

        @keyframes softpulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.03); opacity: 0.95; }
        }
        .animate-softpulse { animation: softpulse 4s infinite ease-in-out; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in { animation: fadeUp 0.8s ease-out forwards; }
        .fade-up { animation: fadeUp 1s ease-out forwards; }
        .fade-up-delayed { animation: fadeUp 1.2s ease-out forwards; }
        .fade-up-delayed2 { animation: fadeUp 1.35s ease-out forwards; }
        .fade-up-delayed3 { animation: fadeUp 1.5s ease-out forwards; }
        .fade-up-delayed4 { animation: fadeUp 1.65s ease-out forwards; }
        .fade-up-delayed5 { animation: fadeUp 1.8s ease-out forwards; }
        .fade-up-delayed6 { animation: fadeUp 2s ease-out forwards; }
        .fade-up-delayed7 { animation: fadeUp 2.2s ease-out forwards; }
      `}</style>
    </div>
  );
}
