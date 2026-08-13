import Sidebar from "@/components/Sidebar";
import AppHeader from "@/components/AppHeader";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar role="admin" />
      <div className="flex min-h-screen flex-1 flex-col bg-surface">
        <AppHeader roleLabel="Administrateur" />
        <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
