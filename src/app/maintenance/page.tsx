"use client";

import { useState, useEffect } from "react";
import { Cog, Wrench, Settings, Clock, AlertTriangle } from "lucide-react";

export default function MaintenancePage() {
  // Target date: 20 days from a fixed start date (adjustable)
  const MAINTENANCE_START = new Date("2026-01-13");
  const MAINTENANCE_DAYS = 20;
  const targetDate = new Date(MAINTENANCE_START);
  targetDate.setDate(targetDate.getDate() + MAINTENANCE_DAYS);

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
  });

  // Sarcastic messages in English
  const sarcasticMessages = [
    "Our website decided to take a vacation... involuntarily!",
    "We're working hard... or at least pretending to!",
    "The site is in intensive care. Send prayers!",
    "If we were fixing a car, it'd be done by now. But this is code!",
    "Developer is fixing a bug... and creating 10 more!",
    "The hamsters powering our servers needed a break!",
    "We're not lazy, we're on 'energy-saving mode'!",
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      const totalDuration = MAINTENANCE_DAYS * 24 * 60 * 60 * 1000;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds, totalMs: difference });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotate sarcastic messages
  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % sarcasticMessages.length);
    }, 5000);

    return () => clearInterval(messageTimer);
  }, [sarcasticMessages.length]);

  // Calculate progress percentage based on time elapsed
  const totalDuration = MAINTENANCE_DAYS * 24 * 60 * 60 * 1000;
  const elapsed = totalDuration - timeLeft.totalMs;
  const progressPercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content container */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Gears Animation Container */}
        <div className="relative h-48 md:h-64 mb-8 flex items-center justify-center">
          {/* Large Gear - Left */}
          <div className="absolute left-1/2 -translate-x-28 md:-translate-x-36 animate-gear-rotate">
            <Cog 
              className="w-24 h-24 md:w-32 md:h-32 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" 
              strokeWidth={1.5}
            />
          </div>

          {/* Medium Gear - Right (rotates in reverse) */}
          <div className="absolute left-1/2 translate-x-8 md:translate-x-12 -translate-y-2 animate-gear-rotate-reverse">
            <Settings 
              className="w-20 h-20 md:w-28 md:h-28 text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.5)]" 
              strokeWidth={1.5}
            />
          </div>

          {/* Small Gear - Top Center */}
          <div className="absolute left-1/2 -translate-x-4 -translate-y-14 md:-translate-y-16 animate-gear-rotate">
            <Cog 
              className="w-12 h-12 md:w-16 md:h-16 text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" 
              strokeWidth={1.5}
            />
          </div>

          {/* Wrench Animation */}
          <div className="absolute left-1/2 translate-x-16 md:translate-x-24 translate-y-6 animate-wrench-move">
            <Wrench 
              className="w-10 h-10 md:w-14 md:h-14 text-gray-300 drop-shadow-lg" 
              strokeWidth={1.5}
            />
          </div>

          {/* Sparks */}


          {/* Warning Icon */}
          <div className="absolute left-1/2 -translate-x-1/2 translate-y-12 md:translate-y-16">
            <AlertTriangle className="w-8 h-8 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-orbitron">
          <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
            Under Maintenance
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-400 text-lg mb-4 font-rubik">
          We&apos;re making things better. Hang tight!
        </p>

        {/* Sarcastic Message */}
        <div className="h-16 flex items-center justify-center mb-8">
          <p
            className="text-lg md:text-xl text-gray-300 font-rubik transition-all duration-500 animate-fade-in italic"
            key={currentMessage}
          >
            &ldquo;{sarcasticMessages[currentMessage]}&rdquo;
          </p>
        </div>

        {/* Countdown Timer */}
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-amber-500/20 mb-8">
          <div className="flex items-center justify-center gap-2 text-gray-400 mb-4 text-lg font-rubik">
            <Clock className="w-5 h-5" />
            <span>Estimated Time to Launch</span>
          </div>
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            {[
              { value: timeLeft.days, label: "Days" },
              { value: timeLeft.hours, label: "Hours" },
              { value: timeLeft.minutes, label: "Minutes" },
              { value: timeLeft.seconds, label: "Seconds" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-5xl font-bold text-amber-400 font-orbitron mb-1 tabular-nums">
                  {String(item.value).padStart(2, "0")}
                </div>
                <div className="text-xs md:text-sm text-gray-400 font-rubik">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
          <p className="text-gray-500 mt-4 text-sm font-rubik">
            (Subject to change... because, you know, it&apos;s software! 😅)
          </p>
        </div>

        {/* Progress Bar - Linked to remaining time */}
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-2 font-rubik">
            Repair Progress: {progressPercent.toFixed(1)}% complete
          </p>
        </div>

        {/* Footer message */}
        <p className="text-gray-500 text-sm font-rubik">
          Need something urgent? Reach out on social media 📱
        </p>
      </div>
    </div>
  );
}
