'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/features/auth/useAuth'
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

export default function LoginPage() {
    const { login, loading } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (token) {
            router.push('/dashboard')
        }
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(username, password)
            router.push('/dashboard') // ⬅️ langsung redirect ke dashboard
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Login gagal',
                description: 'Periksa kembali username atau password Anda',
            })
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <Card className="w-full max-w-sm shadow-xl">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Login</CardTitle>
                        <CardDescription>
                            Masukkan username dan password Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-1">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Loading...' : 'Login'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
