import { createClient } from "@/lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AppHeader({ roleLabel }: { roleLabel: string }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", user.id)
      .single();
    fullName = profile?.full_name ?? "";
  }

  return (
    <header id="top" className="border-b border-border bg-background">
      <div className="flex items-center justify-between px-6 py-4">
        <p className="text-lg font-semibold text-foreground">
          {fullName ? `Bonjour ${fullName}` : "Bonjour"}
        </p>
        <div className="flex items-center gap-4">
          <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            {roleLabel}
          </span>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
