import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function KidsMenuPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F0] to-[#E8F8F0] flex flex-col" dir="rtl">
      <Navbar />
      
      <main className="flex-1 px-4 py-12 max-w-4xl mx-auto w-full flex flex-col items-center">
        <header className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl text-[#E07B39] mb-4 drop-shadow-sm" style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}>
            ⭐ ركن الأطفال ⭐
          </h1>
          <p className="text-[#48CAE4] text-xl md:text-2xl font-bold bg-white/60 px-6 py-2 rounded-full inline-block shadow-sm" style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}>
            ماذا تريد أن تفعل اليوم يا بطل؟
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
          {/* كرت القصة */}
          <Link 
            href="/kids/story"
            className="group flex flex-col items-center justify-center gap-6 bg-white rounded-[3rem] p-10 shadow-lg border-4 border-transparent hover:border-[#48CAE4] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="text-8xl transform group-hover:scale-110 transition-transform duration-300">
              📚
            </div>
            <div className="text-center">
              <h2 className="text-4xl text-[#48CAE4] mb-2" style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}>
                قصة تفاعلية
              </h2>
              <p className="text-gray-500 font-medium text-lg">
                اقرأ قصة ممتعة من سيرة الصحابة وشارك في أحداثها!
              </p>
            </div>
            <div className="mt-2 bg-[#48CAE4] text-white px-8 py-3 rounded-full font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>
              ابدأ القراءة ⬅️
            </div>
          </Link>

          {/* كرت اللعبة */}
          <Link 
            href="/kids/game"
            className="group flex flex-col items-center justify-center gap-6 bg-white rounded-[3rem] p-10 shadow-lg border-4 border-transparent hover:border-[#F4A261] hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in-up"
            style={{ animationDelay: '0.2s' }}
          >
            <div className="text-8xl transform group-hover:scale-110 transition-transform duration-300">
              🎮
            </div>
            <div className="text-center">
              <h2 className="text-4xl text-[#F4A261] mb-2" style={{ fontFamily: 'Baloo Bhaijaan 2, cursive' }}>
                لعبة المطابقة
              </h2>
              <p className="text-gray-500 font-medium text-lg">
                اختبر معلوماتك واربط كل صحابي بالخُلق الذي تميّز به!
              </p>
            </div>
            <div className="mt-2 bg-[#F4A261] text-white px-8 py-3 rounded-full font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontFamily: 'Baloo Bhaijaan 2' }}>
              العب الآن ⬅️
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
