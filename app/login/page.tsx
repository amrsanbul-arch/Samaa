import type { Metadata } from 'next';
import LoginScreen from '@/components/LoginScreen';

export const metadata: Metadata = {
  title: 'سماء · تسجيل الدخول',
  description: 'سجّل الدخول إلى سماء لمتابعة الطقس في مدن العالم.',
};

export default function LoginPage() {
  return <LoginScreen />;
}
