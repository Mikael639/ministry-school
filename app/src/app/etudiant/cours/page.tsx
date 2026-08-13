import { createClient } from "@/lib/supabase/server";
import {
  getStudentAllSessions,
  getStudentAssignments,
  getStudentMaterials,
  getStudentSubmissions,
} from "@/lib/data/student";
import { submitAssignment } from "./actions";

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
  const assignmentIds = assignments.map((a) => a.id);
  const submissions = await getStudentSubmissions(supabase, user!.id, assignmentIds);

  return (
    <>
      <section className="rounded-lg border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-medium tracking-wide text-muted">SUPPORTS DE COURS</h2>
        {materials.length ? (
          <ul className="divide-y divide-border">
            {materials.map((m) => (
              <li key={m.id} className="flex items-center justify-between py-3 text-sm">
                {m.link_url || m.file_url ? (
                  <a
                    href={m.link_url ?? m.file_url ?? "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-accent hover:underline"
                  >
                    {m.title}
                  </a>
                ) : (
                  <span className="font-medium text-foreground">{m.title}</span>
                )}
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
          <ul className="space-y-5">
            {assignments.map((a) => {
              const submission = submissions.get(a.id);
              return (
                <li key={a.id} className="border-b border-border pb-5 last:border-0 last:pb-0">
                  <p className="mb-3 text-sm text-foreground">{a.instructions}</p>

                  {submission ? (
                    <div className="rounded-md bg-surface p-3">
                      <p className="mb-1 text-xs text-muted">
                        Rendu le{" "}
                        {new Intl.DateTimeFormat("fr-FR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(submission.submitted_at))}
                      </p>
                      <p className="text-sm text-foreground">{submission.content}</p>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-accent">
                          Modifier ma réponse
                        </summary>
                        <form action={submitAssignment} className="mt-2 grid gap-2">
                          <input type="hidden" name="assignment_id" value={a.id} />
                          <textarea
                            name="content"
                            required
                            defaultValue={submission.content}
                            rows={3}
                            className="rounded-md border border-border px-3 py-2 text-sm"
                          />
                          <button
                            type="submit"
                            className="w-fit rounded-md bg-accent px-3 py-2 text-sm font-medium text-on-accent transition hover:opacity-90"
                          >
                            Mettre à jour
                          </button>
                        </form>
                      </details>
                    </div>
                  ) : (
                    <form action={submitAssignment} className="grid gap-2">
                      <input type="hidden" name="assignment_id" value={a.id} />
                      <textarea
                        name="content"
                        required
                        rows={3}
                        placeholder="Votre réponse..."
                        className="rounded-md border border-border px-3 py-2 text-sm"
                      />
                      <button
                        type="submit"
                        className="w-fit rounded-md bg-accent px-3 py-2 text-sm font-medium text-on-accent transition hover:opacity-90"
                      >
                        Envoyer
                      </button>
                    </form>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-muted">Aucune consigne pour le moment.</p>
        )}
      </section>
    </>
  );
}
