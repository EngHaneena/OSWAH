import Navbar from '@/components/layout/Navbar';
import MatchGameClient from '@/components/kids/MatchGameClient';
import Link from 'next/link';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-[#FFF8F0] flex flex-col" dir="rtl">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <div className="mb-6">
          <Link href="/kids" className="text-[#F4A261] font-bold hover:underline bg-white/50 px-4 py-2 rounded-full inline-block" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>
            ⬅️ عودة لقائمة الأطفال
          </Link>
        </div>
        
        <header className="text-center mb-8">
          <h1 className="text-4xl text-[#F4A261] mb-2" style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}>
            🎮 صِل الصحابي بخُلقه
          </h1>
          <p className="text-gray-600 font-medium">اسحب الخلق الصحيح وضعه بجانب الصحابي المناسب.</p>
        </header>

        <MatchGameClient />
      </main>
    </div>
  );
}
