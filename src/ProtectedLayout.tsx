// src/ProtectedLayout.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (!token) {
            toast.error('Akses ditolak. Silakan login.')
            router.push('/login')
        }
    }, [router])

    return <>{children}</>
}
