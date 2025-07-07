'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { getMenuByRole } from '@/features/auth/api'
import { buildMenuTree, MenuItem } from '@/utils/buildMenuTree'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { Card } from '@/components/ui/card'
import { ChevronDown, ChevronRight } from 'lucide-react'

export default function DashboardPage() {
    const { logout, chooseRole } = useAuth()
    const [selectedRole, setSelectedRole] = useState<any | null>(null)
    const [menuTree, setMenuTree] = useState<MenuItem[]>([])
    const [roles, setRoles] = useState<any[]>([])
    const [showRoleDialog, setShowRoleDialog] = useState(false)
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({})

    useEffect(() => {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const savedRole = localStorage.getItem('selectedRole')
        const storedRoles = localStorage.getItem('roles')

        if (storedRoles) setRoles(JSON.parse(storedRoles))

        if (savedRole) {
            const role = JSON.parse(savedRole)
            setSelectedRole(role)
            fetchMenus(role.id)
        } else {
            setShowRoleDialog(true)
        }
    }, [])

    const fetchMenus = async (roleId: string) => {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const data = await getMenuByRole(token, roleId)
        const tree = buildMenuTree(data)
        setMenuTree(tree)
    }

    const handleSelectRole = async (roleId: string | null) => {
        if (roleId === null) {
            localStorage.removeItem('selectedRole')
            setSelectedRole(null)
            setMenuTree([])
            setShowRoleDialog(false)
            return
        }

        await chooseRole(roleId)
        const selected = roles.find((r) => r.id === roleId)
        setSelectedRole(selected)
        fetchMenus(roleId)
        setShowRoleDialog(false)
    }

    const toggleOpen = (menuId: string) => {
        setOpenMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }))
    }

    return (
        <div className="p-10 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">
                    📊 Dashboard {selectedRole ? `(${selectedRole.name})` : ''}
                </h1>
                <div className="flex gap-2">
                    <Button onClick={() => setShowRoleDialog(true)} variant="outline">
                        {selectedRole ? 'Ganti Role' : 'Pilih Role'}
                    </Button>
                    <Button onClick={logout} variant="destructive">
                        Logout
                    </Button>
                </div>
            </div>

            {selectedRole ? (
                <div className="space-y-4">
                    {menuTree.map((parent) => (
                        <Card key={parent.id} className="p-4 bg-white border rounded shadow-sm">
                            <div
                                className="flex justify-between items-center cursor-pointer"
                                onClick={() => toggleOpen(parent.id)}
                            >
                                <h3 className="font-semibold text-lg">{parent.name}</h3>
                                {openMenus[parent.id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                            {openMenus[parent.id] && parent.children && parent.children.length > 0 && (
                                <ul className="mt-2 space-y-1 pl-4 text-sm text-muted-foreground">
                                    {parent.children.map((child) => (
                                        <li key={child.id} className="hover:text-black cursor-pointer">
                                            ▸ {child.name} <span className="ml-2 text-xs text-gray-400">{child.path}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="p-6 text-center bg-blue-50 border-blue-200 border rounded-md shadow-sm">
                    <h2 className="text-xl font-semibold mb-2">Selamat Datang!</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Anda belum memilih peran aktif. Silakan pilih role untuk melanjutkan ke menu yang sesuai.
                    </p>
                    <Button onClick={() => setShowRoleDialog(true)}>Pilih Role</Button>
                </Card>
            )}

            <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pilih Role</DialogTitle>
                        <DialogDescription>
                            Pilih role aktif Anda untuk melihat menu yang sesuai.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        {roles.map((role) => (
                            <Button
                                key={role.id}
                                className="w-full justify-center"
                                onClick={() => handleSelectRole(role.id)}
                                variant="outline"
                            >
                                {role.name}
                            </Button>
                        ))}
                        {selectedRole && (
                            <Button
                                variant="ghost"
                                className="w-full justify-center text-red-500 hover:bg-red-100"
                                onClick={() => handleSelectRole(null)}
                            >
                                ❌ Keluar dari Role Aktif
                            </Button>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}
