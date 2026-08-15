import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  getStudentAllSessions,
  getStudentNewCounts,
  getStudentProfile,
} from "@/lib/data/student";
import { formatSessionDate, formatTimeRange } from "@/lib/format";
import WeekCalendar from "@/components/WeekCalendar";
import ProgressRing from "@/components/ProgressRing";
import SessionTypeBadge from "@/components/SessionTypeBadge";
import QuickLinks from "@/components/QuickLinks";
import { markNotificationsSeen } from "./actions";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { ministryName, preferredDay, notificationsSeenAt } = await getStudentProfile(
    supabase,
    user!.id
  );
  const allSessions = await getStudentAllSessions(supabase, user!.id);

  const sessionIds = allSessions.map((s) => s.id);
  const newCounts = await getStudentNewCounts(supabase, sessionIds, notificationsSeenAt);
  const totalNew = newCounts.materials + newCounts.assignments;

  const today = new Date().toISOString().slice(0, 10);
  const nextSession = allSessions.find((s) => s.session_date >= today);
  const completedCount = allSessions.filter((s) => s.session_date < today).length;
  const totalCount = allSessions.length;
  const progress = totalCount ? (completedCount / totalCount) * 100 : 0;

  const calendarSessions = allSessions.map((s) => ({
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
        {ministryName && (
          <p className="text-sm text-muted">
            Ministère : <span className="font-medium text-foreground">{ministryName}</span>
            {preferredDay && (
              <>
                {" · "}
                <span className="font-medium text-foreground capitalize">{preferredDay}</span>
              </>
            )}
          </p>
        )}

        {totalNew > 0 && (
          <section className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <span className="flex h-2 w-2 shrink-0 rounded-full bg-accent" />
                <span>
                  {newCounts.assignments > 0 && (
                    <>
                      <span className="font-medium">
                        {newCounts.assignments} nouvelle{newCounts.assignments > 1 ? "s" : ""}{" "}
                        consigne{newCounts.assignments > 1 ? "s" : ""}
                      </span>
                    </>
                  )}
                  {newCounts.assignments > 0 && newCounts.materials > 0 && " · "}
                  {newCounts.materials > 0 && (
                    <span className="font-medium">
                      {newCounts.materials} nouveau{newCounts.materials > 1 ? "x" : ""} document
                      {newCounts.materials > 1 ? "s" : ""}
                    </span>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/etudiant/cours"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Voir mes cours
                </Link>
                <form action={markNotificationsSeen}>
                  <button type="submit" className="text-xs text-muted hover:text-foreground">
                    Marquer comme lu
                  </button>
                </form>
              </div>
            </div>
          </section>
        )}

        <section className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 text-sm font-medium tracking-wide text-muted">PROCHAINE SÉANCE</h2>

          {nextSession ? (
            <div className="grid gap-1">
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold text-foreground">
                  {formatSessionDate(nextSession.session_date)}
                </p>
                <SessionTypeBadge type={nextSession.session_type} />
              </div>
              <p className="text-sm text-muted">
                {formatTimeRange(nextSession.start_time, nextSession.end_time)} ·{" "}
                {nextSession.location}
                {nextSession.room ? ` · ${nextSession.room}` : ""}
              </p>
              {nextSession.teacher && (
                <p className="text-sm text-muted">Intervenant : {nextSession.teacher.full_name}</p>
              )}
              {nextSession.session_type === "commun" && nextSession.description && (
                <p className="text-sm text-muted">{nextSession.description}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted">Aucune séance à venir pour le moment.</p>
          )}
        </section>

        <section className="rounded-lg border border-border bg-background p-6">
          <h2 className="mb-4 text-sm font-medium tracking-wide text-muted">MA PROGRESSION</h2>
          {totalCount ? (
            <ProgressRing
              percentage={progress}
              label={`${completedCount} sur ${totalCount} séances effectuées`}
              sublabel="Progression sur votre parcours"
            />
          ) : (
            <p className="text-sm text-muted">Votre progression apparaîtra ici une fois inscrit à des séances.</p>
          )}
        </section>

        <QuickLinks
          links={[
            { label: "Mes cours", href: "/etudiant/cours", icon: "book" },
            { label: "Mon calendrier", href: "/etudiant/calendrier", icon: "calendar" },
            { label: "Ma formation", href: "/etudiant/palier", icon: "layers" },
            { label: "Ministères", href: "/etudiant/formation", icon: "compass" },
          ]}
        />
      </div>

      <WeekCalendar sessions={calendarSessions} />
    </div>
  );
}
