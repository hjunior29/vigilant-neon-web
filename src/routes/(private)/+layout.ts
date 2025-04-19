import { redirect } from '@sveltejs/kit';
import { importSPKI, jwtVerify } from 'jose';
import { env } from '$env/dynamic/public';

export const ssr = false;

export const load = async () => {
    const token = localStorage.getItem('token');
    const rawPubKey = env.PUBLIC_KEY!;
    const pemPubKey = rawPubKey.replace(/\\n/g, '\n');

    if (!token) throw redirect(302, '/login');

    try {
        const key = await importSPKI(pemPubKey, 'RS256');
        await jwtVerify(token, key);
    } catch {
        localStorage.removeItem('token');
        throw redirect(302, '/login');

    }
};
