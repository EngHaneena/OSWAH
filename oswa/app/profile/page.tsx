'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/account');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 text-sm text-[var(--color-ink-light)]">
      جارٍ التحويل إلى صفحة الحساب...
    </div>
  );
}
