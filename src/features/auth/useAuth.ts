// src/features/auth/useAuth.ts
'use client'

import { useRouter } from 'next/navigation'
import { login as loginAPI, selectRole } from './api'
import { useState } from 'react'
import { toast } from 'sonner'

export function useAuth() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const login = async (username: string, password: string) => {
        setLoading(true)
        try {
            const res = await loginAPI(username, password)
            localStorage.setItem('accessToken', res.token)
            localStorage.setItem('user', JSON.stringify(res.user))
            localStorage.setItem('roles', JSON.stringify(res.roles))

            toast.success('Login berhasil')
            router.push('/select-role')
        } catch (err) {
            toast.error('Login gagal')
            throw err
        } finally {
            setLoading(false)
        }
    }

    const chooseRole = async (role_id: string) => {
        const token = localStorage.getItem('accessToken')
        if (!token) throw new Error('Token tidak ditemukan')

        const res = await selectRole(token, role_id)
        localStorage.setItem('accessToken', res.token)
        localStorage.setItem('selectedRole', JSON.stringify(res.selected_role))

        toast.success('Role dipilih')
        router.push('/dashboard')
    }

    const changeRole = () => {
        localStorage.removeItem('selectedRole')
        router.push('/select-role')
    }

    const logout = () => {
        localStorage.clear()
        router.push('/login')
    }

    return { login, chooseRole, logout, changeRole, loading }
}
