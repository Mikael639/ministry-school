import Sidebar from "@/components/Sidebar";
import AppHeader from "@/components/AppHeader";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, has_paid")
    .eq("id", user!.id)
    .single();

  if (!profile?.has_paid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-center">
        <p className="mb-1 text-sm font-medium tracking-wide text-muted">MINISTRY SCHOOL</p>
        <h1 className="mb-2 text-xl font-semibold text-foreground">
          Bonjour {profile?.full_name ?? ""}
        </h1>
        <div className="max-w-sm rounded-lg border border-border bg-background p-6">
          <p className="mb-1 text-sm font-medium text-foreground">Accès en attente de paiement</p>
          <p className="text-sm text-muted">
            Votre espace sera activé dès que votre inscription aura été réglée. Contactez
            l&apos;équipe administrative si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
          </p>
        </div>
        <div className="mt-4">
          <LogoutButton />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full">
      <Sidebar role="student" />
      <div className="flex min-h-screen flex-1 flex-col bg-surface">
        <AppHeader roleLabel="Étudiant" />
        <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
