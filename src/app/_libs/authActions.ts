'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    const password = formData.get('password') as string;
    const correctPassword = process.env.APP_PASSWORD;

    console.log('password', correctPassword);

    if (!correctPassword) {
        throw new Error('Password not configured');
    }

    if (password !== correctPassword) {
        throw new Error('Invalid password');
    }

    const cookieStore = await cookies();
    cookieStore.set('auth', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7
    });

    redirect('/budget');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('auth');
    redirect('/login');
}
