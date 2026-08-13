import { SupabaseClient } from "@supabase/supabase-js";

export async function getGlobalStats(supabase: SupabaseClient) {
  const [
    { count: studentCount },
    { count: teacherCount },
    { count: sessionCount },
    { count: materialCount },
    { count: submissionCount },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "student"),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "teacher"),
    supabase.from("sessions").select("id", { count: "exact", head: true }),
    supabase.from("materials").select("id", { count: "exact", head: true }),
    supabase.from("submissions").select("id", { count: "exact", head: true }),
  ]);

  return {
    studentCount: studentCount ?? 0,
    teacherCount: teacherCount ?? 0,
    sessionCount: sessionCount ?? 0,
    materialCount: materialCount ?? 0,
    submissionCount: submissionCount ?? 0,
  };
}

export type AdminSession = {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string;
  room: string | null;
  session_type: "commun" | "ministere";
  ministries: { name: string } | null;
  teacher: { full_name: string } | null;
};

export async function getAllSessions(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("sessions")
    .select(
      "id, session_date, start_time, end_time, location, room, session_type, ministries(name), teacher:profiles!sessions_teacher_id_fkey(full_name)"
    )
    .order("session_date", { ascending: true });

  return (data ?? []) as unknown as AdminSession[];
}

export type AdminUser = {
  id: string;
  full_name: string;
  role: string;
  has_paid: boolean;
  ministries: { name: string } | null;
};

export async function getAllUsers(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, role, has_paid, ministries(name)")
    .order("role")
    .order("full_name");

  return (data ?? []) as unknown as AdminUser[];
}
