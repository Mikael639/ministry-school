import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getStudentCourses } from "@/lib/data/student";
import { formatSessionDate } from "@/lib/format";

export default async function StudentCoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const courses = await getStudentCourses(supabase, user!.id);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="rounded-lg border border-border bg-background p-6">
      <h2 className="mb-1 text-sm font-medium tracking-wide text-muted">MES COURS</h2>
      <p className="mb-6 text-sm text-muted">
        Ouvrez un cours pour accéder à ses objectifs, ses supports et ses consignes.
      </p>

      {courses.length ? (
        <ul className="space-y-3">
          {courses.map((c) => {
            const upcomingSessions = c.sessions.filter((s) => s.session_date >= today);
            const upcoming = upcomingSessions.length;
            const nextSession = upcomingSessions[0];
            return (
              <li key={c.id}>
                <Link
                  href={`/etudiant/cours/${c.id}`}
                  className="block rounded-md border border-border p-4 transition hover:border-accent/40 hover:bg-surface"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium text-foreground">{c.title}</p>
                    <span className="text-xs text-muted">
                      {c.sessions.length} séance{c.sessions.length > 1 ? "s" : ""}
                      {upcoming > 0 && ` · ${upcoming} à venir`}
                    </span>
                  </div>
                  {c.description && (
                    <p className="mt-1 text-sm text-muted">{c.description}</p>
                  )}
                  <p className="mt-2 text-xs text-muted">
                    {nextSession
                      ? `Prochaine séance : ${formatSessionDate(nextSession.session_date)}`
                      : "Toutes les séances de ce cours ont eu lieu."}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-muted">
          Aucun cours pour le moment. Vos cours apparaîtront ici une fois le programme de votre
          ministère publié.
        </p>
      )}
    </section>
  );
}
