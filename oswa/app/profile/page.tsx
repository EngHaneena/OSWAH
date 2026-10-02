'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import { IslamicDivider } from '@/components/ornaments/IslamicPattern';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  // User profile data
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setName(user.user_metadata?.full_name || '');
        setGender(user.user_metadata?.gender || '');
        setAge(user.user_metadata?.age || '');
      }
      setLoading(false);
    }
    loadUser();
  }, [supabase.auth]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await supabase.auth.updateUser({
      data: { full_name: name, gender, age }
    });
    setSaving(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <div className="min-h-screen flex flex-col" dir="rtl">
      <Navbar />
      
      <main className="flex-1 px-4 py-12 max-w-lg mx-auto w-full">
        <div className="bg-white/60 dark:bg-black/20 backdrop-blur-md rounded-[2rem] p-8 shadow-sm border border-[#B89B5E]/30 animate-fade-in-up">
          <header className="text-center mb-6">
            <div className="w-20 h-20 bg-[#3F5233] text-white rounded-full flex items-center justify-center text-4xl mx-auto mb-4 shadow-md">
              👤
            </div>
            <h1 className="text-3xl text-[#22301B] dark:text-[#f0e9d6]" style={{ fontFamily: 'Aref Ruqaa, serif' }}>
              حسابي الشخصي
            </h1>
            <p className="text-[#4A6038] dark:text-[#a0a896] mt-1">{user?.email || 'حساب زائر'}</p>
          </header>

          <IslamicDivider />

          {loading ? (
            <div className="text-center py-10">جارٍ التحميل...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5 mt-6">
              <div>
                <label className="block text-sm font-medium text-[#3F5233] dark:text-[#b0bda6] mb-1">الاسم</label>
                <input 
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="أدخل اسمك"
                  className="w-full rounded-xl border border-[#3F5233]/20 bg-white/80 dark:bg-black/30 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3F5233] transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#3F5233] dark:text-[#b0bda6] mb-1">الجنس</label>
                  <select 
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full rounded-xl border border-[#3F5233]/20 bg-white/80 dark:bg-black/30 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3F5233] transition"
                  >
                    <option value="">اختر...</option>
                    <option value="male">ذكر</option>
                    <option value="female">أنثى</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#3F5233] dark:text-[#b0bda6] mb-1">العمر</label>
                  <input 
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="مثال: 25"
                    min="1"
                    className="w-full rounded-xl border border-[#3F5233]/20 bg-white/80 dark:bg-black/30 dark:text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#3F5233] transition"
                  />
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="w-full bg-[#3F5233] hover:bg-[#22301B] text-white rounded-xl py-3 font-bold transition-all disabled:opacity-50"
                >
                  {saving ? 'جارٍ الحفظ...' : 'حفظ البيانات'}
                </button>
                <button 
                  type="button" 
                  onClick={handleLogout}
                  className="w-full border border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl py-3 font-medium transition-all"
                >
                  تسجيل الخروج
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
