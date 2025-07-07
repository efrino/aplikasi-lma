// src/features/auth/api.ts
import { axiosInstance } from '@/lib/axios'

export async function login(username: string, password: string) {
    try {
        console.log('🔗 API LOGIN:', process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/login')
        const res = await axiosInstance.post('/auth/login', { username, password })
        console.log('✅ Login response:', res.data)
        return res.data
    } catch (error) {
        console.error('❌ Login error:', error)
        throw error
    }
}


export async function selectRole(token: string, role_id: string) {
    const res = await axiosInstance.post(
        '/auth/select-role',
        { role_id },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    )
    return res.data
}

export async function getMenuByRole(token: string, role_id: string) {
    const res = await axiosInstance.get(`/menus/role/${role_id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    return res.data
}