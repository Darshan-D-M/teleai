"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen w-full bg-[#F8FAFC] flex flex-col font-sans select-none overflow-hidden justify-between py-2.5">
      {/* Navigation Bar */}
      <header className="max-w-6xl mx-auto w-full px-6 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" />
            </svg>
          </div>
          <div>
            <span className="text-base font-extrabold text-slate-900 tracking-tight block leading-tight">TeleAI</span>
            <span className="text-[10px] text-slate-400 font-bold block">Smart Prepaid Advisor</span>
          </div>
        </div>
        <button 
          onClick={() => router.push("/app")}
          className="rounded-xl bg-[#6366F1] text-white px-5 py-2 text-xs font-extrabold shadow-md hover:bg-indigo-700 transition flex items-center gap-1.5"
        >
          <span>💬</span> Launch Chatbot
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto w-full px-6 flex-1 grid gap-6 md:grid-cols-[1fr_1fr] items-center py-2.5">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50/70 border border-indigo-100/50 rounded-full px-3.5 py-1 text-[10px] font-black text-indigo-600 uppercase tracking-wider">
            ✦ AI-Powered
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-slate-955 text-slate-950 leading-[1.12] tracking-tight">
              Find the Perfect <br />
              Prepaid Plan with <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">AI</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
              Answer a few simple questions and let TeleAI recommend the best prepaid plans tailored just for you.
            </p>
          </div>

          {/* Bullet Feature List */}
          <div className="space-y-2 text-[11px] font-extrabold text-slate-600">
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[9px] text-indigo-600">🔒</span>
              <span>Compare Jio, Airtel, Vi and BSNL plans</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[9px] text-emerald-600">🔄</span>
              <span>Match plans to your budget & data needs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-5 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-[9px] text-rose-600">▶️</span>
              <span>Find plans with your favorite OTTs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-5 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-[9px] text-violet-600">🤖</span>
              <span>Get personalized AI recommendations</span>
            </div>
          </div>

          <div className="pt-1">
            <button 
              onClick={() => router.push("/app")}
              className="w-full sm:w-auto rounded-xl bg-[#6366F1] hover:bg-indigo-700 text-white px-6 py-3 text-xs font-black shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 flex items-center justify-center gap-2 transition"
            >
              <span>🤖</span>
              <span>Start AI Recommendation</span>
              <span>➔</span>
            </button>
            <p className="text-[9px] font-bold text-slate-400 mt-2 select-none flex items-center gap-1.5">
              <span className="text-emerald-500 font-extrabold">✓</span> 100% Secure • No Spam • Privacy First
            </p>
          </div>
        </div>

        {/* Right Hero: Unified Mockup Graphic */}
        <div className="flex justify-center items-center select-none pt-4 md:pt-0">
          <div className="relative w-full max-w-[420px]">
            <img 
              src="/robot_hero_landing.png" 
              alt="TeleAI Advisor Hero" 
              className="w-full max-h-[260px] md:max-h-[300px] object-contain"
            />
          </div>
        </div>
      </main>

      {/* Why choose TeleAI? Section */}
      <section className="max-w-6xl mx-auto w-full px-6 py-3 space-y-3 border-t border-slate-100/50">
        <div className="text-center select-none">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Why choose TeleAI?</h2>
        </div>

        <div className="grid gap-3 grid-cols-4">
          <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-3 transition hover:shadow-md hover:border-indigo-100">
            <div className="h-9 w-9 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-base shrink-0 select-none">
              👛
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[11px] font-black text-slate-950 leading-tight">Budget Optimization</h3>
              <p className="text-[9px] font-bold text-slate-400 leading-tight">
                Find plans that give you the best value within your budget.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-3 transition hover:shadow-md hover:border-indigo-100">
            <div className="h-9 w-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-base shrink-0 select-none">
              📶
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[11px] font-black text-slate-955 text-slate-950 leading-tight">Smart Plan Matching</h3>
              <p className="text-[9px] font-bold text-slate-400 leading-tight">
                AI analyzes data, validity, calls and more to find the perfect fit.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-3 transition hover:shadow-md hover:border-indigo-100">
            <div className="h-9 w-9 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-base shrink-0 select-none">
              ▶️
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[11px] font-black text-slate-955 text-slate-950 leading-tight">OTT Benefits Finder</h3>
              <p className="text-[9px] font-bold text-slate-400 leading-tight">
                Get plans with Hotstar, Prime, SonyLIV, Zee5 and more.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-sm flex items-center gap-3 transition hover:shadow-md hover:border-indigo-100">
            <div className="h-9 w-9 rounded-full bg-violet-50 border border-violet-100 flex items-center justify-center text-base shrink-0 select-none">
              🧠
            </div>
            <div className="space-y-0.5">
              <h3 className="text-[11px] font-black text-slate-955 text-slate-950 leading-tight">AI Recommendation Engine</h3>
              <p className="text-[9px] font-bold text-slate-400 leading-tight">
                Advanced AI scans 100+ plans to recommend the best for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works? Section */}
      <section className="max-w-6xl mx-auto w-full px-6 py-3 space-y-3 border-t border-slate-100/50">
        <div className="text-center select-none">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">How it works?</h2>
        </div>

        <div className="flex items-center justify-between gap-2 select-none">
          
          {/* Step 1 */}
          <div className="relative bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
            <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
              1
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-sm mb-1">
              👤
            </div>
            <h4 className="text-[10px] font-black text-slate-955 text-slate-950 leading-tight">Tell us your operator</h4>
            <p className="text-[8px] font-semibold text-slate-400 leading-tight mt-0.5">Choose your current mobile operator.</p>
          </div>

          <span className="text-slate-300 text-xs font-black select-none">➔</span>

          {/* Step 2 */}
          <div className="relative bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
            <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
              2
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-sm mb-1">
              ₹
            </div>
            <h4 className="text-[10px] font-black text-slate-955 text-slate-955 text-slate-950 leading-tight">Enter your budget</h4>
            <p className="text-[8px] font-semibold text-slate-400 leading-tight mt-0.5">Select your monthly recharge budget.</p>
          </div>

          <span className="text-slate-300 text-xs font-black select-none">➔</span>

          {/* Step 3 */}
          <div className="relative bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
            <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
              3
            </div>
            <div className="h-8 w-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 text-sm mb-1">
              📤
            </div>
            <h4 className="text-[10px] font-black text-slate-955 text-slate-950 leading-tight">Choose data needs</h4>
            <p className="text-[8px] font-semibold text-slate-400 leading-tight mt-0.5">Tell us how much data you use daily.</p>
          </div>

          <span className="text-slate-300 text-xs font-black select-none">➔</span>

          {/* Step 4 */}
          <div className="relative bg-white border border-slate-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
            <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
              4
            </div>
            <div className="h-8 w-8 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 text-sm mb-1">
              🎬
            </div>
            <h4 className="text-[10px] font-black text-slate-955 text-slate-950 leading-tight">Select OTTs</h4>
            <p className="text-[8px] font-semibold text-slate-400 leading-tight mt-0.5">Pick your favorite OTT platforms.</p>
          </div>

          <span className="text-slate-300 text-xs font-black select-none">➔</span>

          {/* Step 5 */}
          <div className="relative bg-indigo-50 border border-indigo-100 rounded-2xl p-3 flex flex-col items-center text-center w-full h-24 justify-center">
            <div className="absolute top-1.5 left-1.5 h-4 w-4 rounded-full bg-[#6366F1] text-white text-[8px] font-black flex items-center justify-center">
              5
            </div>
            <div className="h-8 w-8 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-sm mb-1">
              🎯
            </div>
            <h4 className="text-[10px] font-black text-indigo-955 text-indigo-950 leading-tight">Get AI recommendation</h4>
            <p className="text-[8px] font-semibold text-indigo-500 leading-tight mt-0.5">Receive the best prepaid plans personalized for you.</p>
          </div>

        </div>
      </section>

      {/* Supported Operators Section */}
      <section className="max-w-6xl mx-auto w-full px-6 py-3 space-y-3 border-t border-slate-100/50">
        <div className="text-center select-none">
          <h2 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Supported Operators</h2>
        </div>

        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
            <img src="/jio.png" className="h-9 w-9 rounded-full object-cover shrink-0 select-none shadow-sm" alt="Jio" />
            <div>
              <h4 className="text-xs font-black text-slate-955 text-slate-950">Jio</h4>
              <p className="text-[9px] text-slate-400 font-bold">Digital Life</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
            <img src="/airtel.png" className="h-9 w-9 rounded-full object-cover shrink-0 select-none shadow-sm" alt="Airtel" />
            <div>
              <h4 className="text-xs font-black text-slate-955 text-slate-950">Airtel</h4>
              <p className="text-[9px] text-slate-400 font-bold">The Smart Network</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
            <img src="/vi.png" className="h-9 w-9 rounded-full object-cover shrink-0 select-none shadow-sm" alt="Vi" />
            <div>
              <h4 className="text-xs font-black text-slate-955 text-slate-950">Vi</h4>
              <p className="text-[9px] text-slate-400 font-bold">Together for Tomorrow</p>
            </div>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl p-3 flex items-center gap-3">
            <img src="/bsnl.png" className="h-9 w-9 rounded-full object-cover shrink-0 select-none shadow-sm" alt="BSNL" />
            <div>
              <h4 className="text-xs font-black text-slate-955 text-slate-950">BSNL</h4>
              <p className="text-[9px] text-slate-400 font-bold">Connecting India</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
