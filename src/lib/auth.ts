import { cookies } from 'next/headers'

export async function isAdmin() {
    const cookieStore = await cookies();
    const adminBypass = cookieStore.get('admin_bypass');
    return adminBypass?.value === 'true';
}
