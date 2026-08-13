import { createClient } from "@/lib/supabase/server";
import { getCommonSessions, getEnrollmentCounts, getTeacherSessions } from "@/lib/data/teacher";
import { formatSessionDate, formatTimeRange } from "@/lib/format";
import WeekCalendar from "@/components/WeekCalendar";
import QuickLinks from "@/components/QuickLinks";

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [allSessions, commonSessions] = await Promise.all([
    getTeacherSessions(supabase, user!.id),
    getCommonSessions(supabase),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const nextSession = allSessions.filter((s) => s.session_date >= today)[0];
  const counts = await getEnrollmentCounts(supabase, allSessions);

  const calendarSessions = [...allSessions, ...commonSessions].map((s) => ({
    id: s.id,
    date: s.session_date,
    start_time: s.start_time,
    end_time: s.end_time,
    location: s.location,
    room: s.room,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <section className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 text-sm font-medium tracking-wide text-muted">PROCHAINE SÉANCE</h2>
          {nextSession ? (
            <div className="grid gap-1">
              <p className="text-lg font-semibold text-foreground">
                {formatSessionDate(nextSession.session_date)}
              </p>
              <p className="text-sm text-muted">
                {formatTimeRange(nextSession.start_time, nextSession.end_time)} ·{" "}
                {nextSession.location}
                {nextSession.room ? ` · ${nextSession.room}` : ""}
              </p>
              <p className="text-sm text-muted">
                {counts.get(nextSession.id) ?? 0} étudiant(s) inscrit(s)
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted">Aucune séance à venir.</p>
          )}
        </section>

        <QuickLinks
          links={[
            { label: "Supports & consignes", href: "/enseignant/supports", icon: "megaphone" },
            { label: "Mon calendrier", href: "/enseignant/calendrier", icon: "calendar" },
            { label: "Mes étudiants", href: "/enseignant/etudiants", icon: "users" },
            { label: "Vue promo", href: "/enseignant/programme", icon: "book" },
          ]}
        />
      </div>

      <WeekCalendar sessions={calendarSessions} />
    </div>
  );
}
