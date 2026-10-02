'use client';
import Link from 'next/link';
import { ASWA_VERSE, SITE_NAME } from '@/constants/verse';
import { ProphetGlow } from '@/components/ornaments/IslamicPattern';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#F6F1E3] to-[#EBE3CA] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative dynamic background */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none flex items-center justify-center" aria-hidden="true">
        <div className="w-[800px] h-[800px] border-[1px] border-[#3F5233] rounded-full animate-ping" style={{ animationDuration: '8s' }} />
        <div className="absolute w-[600px] h-[600px] border-[1px] border-[#B89B5E] rounded-full animate-ping" style={{ animationDuration: '10s' }} />
      </div>

      <div className="z-10 flex flex-col items-center animate-fade-in-up max-w-2xl text-center">
        {/* Glow Element */}
        <div className="relative mb-6 transform hover:scale-110 transition-transform duration-700">
          <ProphetGlow className="w-40 h-40 md:w-56 md:h-56" />
        </div>
        
        {/* App Title */}
        <h1 
          className="text-8xl md:text-[160px] text-[#22301B] mb-2 leading-none drop-shadow-sm transition-all"
          style={{ fontFamily: 'Aref Ruqaa, serif' }}
        >
          {SITE_NAME}
        </h1>
        
        {/* Verse */}
        <div 
          className="my-10 px-8 py-6 bg-white/50 rounded-[2rem] border border-[#B89B5E]/30 backdrop-blur-md shadow-sm relative animate-fade-in-up hover:bg-white/70 transition-colors"
          style={{ animationDelay: '0.3s' }}
        >
          <p className="text-2xl md:text-4xl text-[#3F5233] font-quran leading-[2.2] md:leading-[2.2]" dir="rtl">
            ﴿ {ASWA_VERSE.text} ﴾
          </p>
        </div>

        {/* Enter Button */}
        <Link 
          href="/wisdom"
          className="mt-4 group relative inline-flex items-center justify-center px-12 py-5 bg-[#3F5233] text-[#F6F1E3] rounded-full text-2xl shadow-xl hover:shadow-2xl hover:bg-[#22301B] hover:scale-105 active:scale-95 transition-all duration-300 animate-fade-in-up focus:outline-none focus:ring-4 focus:ring-[#B89B5E]"
          style={{ animationDelay: '0.6s' }}
          dir="rtl"
        >
          <span className="font-bold ml-4" style={{ fontFamily: 'Aref Ruqaa, serif' }}>دخول</span>
          <div className="bg-white/20 p-2 rounded-full transform group-hover:-translate-x-3 transition-transform duration-300">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
        </Link>
      </div>
    </main>
  );
}
