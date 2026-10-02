import Navbar from '@/components/layout/Navbar';
import InteractiveStoryDemo from '@/components/kids/InteractiveStoryDemo';
import Link from 'next/link';

export default function StoryPage() {
  return (
    <div className="min-h-screen bg-[#E8F8F0] flex flex-col" dir="rtl">
      <Navbar />
      
      <main className="flex-1 px-4 py-8 max-w-2xl mx-auto w-full">
        <div className="mb-6">
          <Link href="/kids" className="text-[#48CAE4] font-bold hover:underline bg-white/50 px-4 py-2 rounded-full inline-block" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>
            ⬅️ عودة لقائمة الأطفال
          </Link>
        </div>
        
        <header className="text-center mb-8">
          <h1 className="text-4xl text-[#48CAE4] mb-2" style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}>
            📚 قصة تفاعلية
          </h1>
          <p className="text-gray-600 font-medium">اقرأ القصة ثم اختر الإجابة الصحيحة لتكملها.</p>
        </header>

        <InteractiveStoryDemo />
      </main>
    </div>
  );
}
