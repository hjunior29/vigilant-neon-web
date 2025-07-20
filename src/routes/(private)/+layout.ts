import { redirect } from '@sveltejs/kit';

export const ssr = false;

export const load = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw redirect(302, '/login');
    }
};