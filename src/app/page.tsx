import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // التوجيه إلى صفحة الـ admin
    router.push('/admin');
  }, [router]);

  return null; // أو يمكنك إرجاع loading أو شيء آخر هنا إذا كنت ترغب في إظهار شيء أثناء التوجيه
}
