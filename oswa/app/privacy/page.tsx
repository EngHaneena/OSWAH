import Link from 'next/link';
import { IslamicDivider } from '@/components/ornaments/IslamicPattern';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F6F1E3] px-4 py-10" dir="rtl">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-[#B89B5E] text-sm hover:underline mb-6 inline-block">
          ← العودة للرئيسية
        </Link>
        <h1 className="text-3xl text-[#22301B] mb-2" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
          سياسة الخصوصية
        </h1>
        <IslamicDivider />
        
        <div className="space-y-6 text-[#22301B] leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-2 text-[#3F5233]">1. ما نجمعه</h2>
            <p>
              <strong>نصوص المشاكل:</strong> لا تُخزّن افتراضياً. يُحفظ نص فقط عند موافقتك الصريحة في خاصية «أبلغ عن خطأ».
            </p>
            <p className="mt-2">
              <strong>البريد الإلكتروني:</strong> عند إنشاء حساب، يُحفظ بريدك لتسجيل الدخول فقط.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-[#3F5233]">2. ما لا نفعله</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>لا نَستنتج ميولك الديني أو الشخصي.</li>
              <li>لا نبيع بياناتك لأي جهة ثالثة.</li>
              <li>لا نستخدم بياناتك للدعاية التجارية.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-[#3F5233]">3. الذكاء الاصطناعي</h2>
            <p>
              تستخدم المنصة نماذج ذكاء اصطناعي لتقديم عبارات تعاطف وصياغة عبر. النصوص الشرعية تأتي من قاعدة بياناتنا مباشرة، ولا للنموذج.
            </p>
            <p className="mt-2 ai-badge inline-flex">
              معدّ بمساعدة الذكاء الاصطناعي
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2 text-[#3F5233]">4. حذف بياناتك</h2>
            <p>
              يمكنك حذف حسابك وجميع بياناتك بالتواصل معنا عبر صفحة البلاغ.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
