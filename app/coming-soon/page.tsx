"use client";

import { useEffect, useState } from "react";
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

  // Launch date (30 days)
  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 30);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = target.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, "0"),
          hours: String(Math.floor((difference / (1000 * 60 * 60)) % 24)).padStart(2, "0"),
          minutes: String(Math.floor((difference / 1000 / 60) % 60)).padStart(2, "0"),
          seconds: String(Math.floor((difference / 1000) % 60)).padStart(2, "0"),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!email) return;

    // TODO: Supabase에 저장도 가능
    setIsSubscribed(true);

    setTimeout(() => {
      setIsSubscribed(false);
      setEmail("");
    }, 3000);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white text-gray-900">

      {/* Blurred floating gradients */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo-300 opacity-30 blur-[160px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[480px] w-[480px] rounded-full bg-purple-300 opacity-30 blur-[180px]" />

      {/* Content wrapper */}
      <div className="relative z-10 flex min-h-screen flex-col">

        {/* Header */}
        <header className="px-8 py-10 flex justify-between max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Inbox className="h-6 w-6 text-white" />
            </div>
            <div className="text-2xl font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Scaaf.day
            </div>
          </div>
        </header>

        {/* Main section */}
        <main className="flex flex-col items-center justify-center flex-1 px-6 py-10">
          <div className="max-w-4xl w-full text-center space-y-12">

            {/* Decorative wave */}
            <div className="relative h-24">
              <svg viewBox="0 0 1200 140" className="absolute inset-0 w-full h-full">
                <path
                  d="M0,50 Q300,0 600,50 T1200,50 L1200,140 L0,140 Z"
                  fill="url(#waveGradient)"
                  className="animate-pulse"
                />
                <defs>
                  <linearGradient id="waveGradient" x1="0%" x2="100%">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity="0.55" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0.55" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium shadow-sm">
              <Zap className="h-4 w-4" />
              AI-Powered Email Intelligence
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
              Wrap up your inbox.
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Focus on what matters.
              </span>
            </h1>

            {/* Subcopy */}
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              AI-powered email summaries that cut through the noise.
              Less reading. More doing.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-10 pt-4 text-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                Smart Summaries
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                Instant Insights
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-pink-600" />
                </div>
                Time Saved
              </div>
            </div>

            {/* Countdown */}
            <div className="pt-10">
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
                    className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-white/40"
                  >
                    <div className="text-5xl font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      {value}
                    </div>
                    <div className="uppercase text-gray-500 text-xs tracking-wide mt-1">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Subscription */}
            <div className="max-w-lg mx-auto w-full pt-10">
              <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/30">

                <h2 className="text-2xl font-semibold mb-2">Be the first to know</h2>
                <p className="text-gray-600 mb-6">Get early access when we launch</p>

                {!isSubscribed ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-12 h-14 rounded-xl border-2 border-gray-200"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Notify Me at Launch
                    </Button>
                  </form>
                ) : (
                  <div className="h-14 flex items-center justify-center text-green-700 bg-green-50 border border-green-400 rounded-xl">
                    <Sparkles className="h-6 w-6 mr-2" />
                    You're on the list!
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-4 text-center">
                  No spam. Unsubscribe anytime.
                </p>

              </div>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="py-10 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Scaaf.day • All Rights Reserved
        </footer>
      </div>
    </div>
  );
}
