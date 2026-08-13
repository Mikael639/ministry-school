import { createClient } from "@/lib/supabase/server";
import ProfileCard from "@/components/ProfileCard";

export default async function AdminProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user!.id)
    .single();

  return (
    <ProfileCard
      fullName={profile?.full_name ?? ""}
      email={user?.email ?? ""}
      roleLabel="Administrateur"
    />
  );
}
