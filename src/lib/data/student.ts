import { SupabaseClient } from "@supabase/supabase-js";

export type StudentSession = {
  id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  location: string;
  room: string | null;
  day: string;
  session_type: "commun" | "ministere";
  description: string | null;
  teacher: { full_name: string } | null;
};

export async function getStudentProfile(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("full_name, preferred_day, ministries(name)")
    .eq("id", userId)
    .single();

  return {
    fullName: data?.full_name as string | undefined,
    preferredDay: data?.preferred_day as string | null | undefined,
    ministryName: (data?.ministries as unknown as { name: string } | null)?.name,
  };
}

async function getMinistrySessions(supabase: SupabaseClient, userId: string) {
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(
      "session_id, sessions(id, session_date, start_time, end_time, location, room, day, session_type, description, teacher:profiles!sessions_teacher_id_fkey(full_name))"
    )
    .eq("student_id", userId);

  return (enrollments ?? [])
    .map((e) => e.sessions as unknown as StudentSession)
    .filter((s) => s);
}

async function getCommonSessions(supabase: SupabaseClient) {
  const { data } = await supabase
    .from("sessions")
    .select("id, session_date, start_time, end_time, location, room, day, session_type, description")
    .eq("session_type", "commun");

  return (data ?? []).map((s) => ({ ...s, teacher: null })) as StudentSession[];
}

export async function getStudentSessions(supabase: SupabaseClient, userId: string) {
  const [ministrySessions, commonSessions] = await Promise.all([
    getMinistrySessions(supabase, userId),
    getCommonSessions(supabase),
  ]);

  const today = new Date().toISOString().slice(0, 10);

  return [...ministrySessions, ...commonSessions]
    .filter((s) => s.session_date >= today)
    .sort((a, b) => a.session_date.localeCompare(b.session_date));
}

export async function getStudentAllSessions(supabase: SupabaseClient, userId: string) {
  const [ministrySessions, commonSessions] = await Promise.all([
    getMinistrySessions(supabase, userId),
    getCommonSessions(supabase),
  ]);

  return [...ministrySessions, ...commonSessions].sort((a, b) =>
    a.session_date.localeCompare(b.session_date)
  );
}

export async function getStudentMaterials(supabase: SupabaseClient, sessionIds: string[]) {
  if (!sessionIds.length) return [];

  const { data } = await supabase
    .from("materials")
    .select("id, title, link_url, file_url, visible_at, session_id")
    .in("session_id", sessionIds)
    .lte("visible_at", new Date().toISOString())
    .order("visible_at", { ascending: false });

  return data ?? [];
}

export async function getStudentAssignments(supabase: SupabaseClient, sessionIds: string[]) {
  if (!sessionIds.length) return [];

  const { data } = await supabase
    .from("assignments")
    .select("id, instructions, session_id, created_at")
    .in("session_id", sessionIds)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getStudentSubmissions(
  supabase: SupabaseClient,
  userId: string,
  assignmentIds: string[]
) {
  if (!assignmentIds.length) return new Map<string, { content: string; submitted_at: string }>();

  const { data } = await supabase
    .from("submissions")
    .select("assignment_id, content, submitted_at")
    .eq("student_id", userId)
    .in("assignment_id", assignmentIds);

  const map = new Map<string, { content: string; submitted_at: string }>();
  for (const row of data ?? []) {
    map.set(row.assignment_id, { content: row.content, submitted_at: row.submitted_at });
  }
  return map;
}
