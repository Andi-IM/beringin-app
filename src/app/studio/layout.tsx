import { StudioSidebar } from '@/app/components/admin/StudioSidebar'

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <StudioSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
