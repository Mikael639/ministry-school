import { createClient } from "@/lib/supabase/server";
import {
  getStudentAllSessions,
  getStudentAssignments,
  getStudentMaterials,
} from "@/lib/data/student";
import MaterialLink from "@/components/MaterialLink";

function isRecentlyShared(visibleAt: string) {
  const diffMs = Date.now() - new Date(visibleAt).getTime();
  return diffMs >= 0 && diffMs < 1000 * 60 * 60 * 3;
}

export default async function StudentCoursesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const sessions = await getStudentAllSessions(supabase, user!.id);
  const sessionIds = sessions.map((s) => s.id);
  const [materials, assignments] = await Promise.all([
    getStudentMaterials(supabase, sessionIds),
    getStudentAssignments(supabase, sessionIds),
  ]);

  return (
    <>
      <section className="rounded-lg border border-border bg-background p-6">
        <h2 className="mb-1 text-sm font-medium tracking-wide text-muted">SUPPORTS DE COURS</h2>
        <p className="mb-4 text-sm text-muted">
          Les documents s&apos;ouvrent dans un nouvel onglet.
        </p>
        {materials.length ? (
          <ul className="divide-y divide-border">
            {materials.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
              >
                <MaterialLink title={m.title} url={m.link_url ?? m.file_url ?? null} />
                {isRecentlyShared(m.visible_at) && (
                  <span className="flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    Partagé à l&apos;instant
                  </span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">
            Aucun support disponible pour l&apos;instant. Les supports apparaissent ici une fois
            publiés par l&apos;enseignant.
          </p>
        )}
      </section>

      <section className="rounded-lg border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-medium tracking-wide text-muted">CONSIGNES</h2>
        {assignments.length ? (
          <ul className="space-y-3">
            {assignments.map((a) => (
              <li
                key={a.id}
                className="border-b border-border pb-3 text-sm text-foreground last:border-0 last:pb-0"
              >
                {a.instructions}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Aucune consigne pour le moment.</p>
        )}
      </section>
    </>
  );
}
