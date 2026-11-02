import { redirect } from 'next/navigation';

export const metadata = { title: 'ثبت‌نام' };

export default function RegisterPage() {
  redirect('/login?tab=register');
}
