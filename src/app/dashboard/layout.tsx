import ProtectedLayout from '@/ProtectedLayout'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProtectedLayout>
            <div className="flex min-h-screen">
                <main className="flex-1 p-6">{children}</main>
            </div>
        </ProtectedLayout>
    )
}
