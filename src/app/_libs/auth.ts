import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function isAuthenticated(): boolean {
  const cookieStore = cookies();
  const authCookie = cookieStore.get('auth');
  return authCookie?.value === 'true';
}

export function requireAuth() {
  if (!isAuthenticated()) {
    redirect('/login');
  }
}

export function requireGuest() {
  if (isAuthenticated()) {
    redirect('/budget');
  }
}
