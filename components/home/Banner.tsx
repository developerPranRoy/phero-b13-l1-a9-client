"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    title: "Find Your Perfect Tutor",
    subtitle: "Connect with expert tutors across all subjects. Learn at your own pace, on your schedule.",
    bg: "from-blue-600 to-indigo-700",
    emoji: "📚",
  },
  {
    title: "Book Sessions Instantly",
    subtitle: "No more back-and-forth emails. Browse, book, and learn — all in one place.",
    bg: "from-purple-600 to-pink-600",
    emoji: "⚡",
  },
  {
    title: "Learn From Anywhere",
    subtitle: "Online, offline, or hybrid sessions available. Education has no boundaries.",
    bg: "from-teal-600 to-cyan-600",
    emoji: "🌍",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((p) => (p + 1) % slides.length), []);

  useEffect(() => {
    const id = setInterval(next, 4000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[current];

  return (
    <div className={`relative bg-gradient-to-r ${slide.bg} text-white transition-all duration-700 min-h-[480px] flex items-center`}>
      <div className="max-w-7xl mx-auto px-4 w-full py-16">
        <div className="max-w-2xl">
          <p className="text-6xl mb-4">{slide.emoji}</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{slide.title}</h1>
          <p className="text-lg text-white/80 mb-8">{slide.subtitle}</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="/tutors" className="inline-flex items-center px-6 py-3 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
              Browse Tutors
            </Link>
            <Link href="/register" className="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-all ${i === current ? "bg-white scale-125" : "bg-white/40"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      <button onClick={() => setCurrent((p) => (p - 1 + slides.length) % slides.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors"
        aria-label="Previous slide">‹</button>
      <button onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors"
        aria-label="Next slide">›</button>
    </div>
  );
}
