import { createClient } from "@/lib/supabase/server";
import { getAllSessions, getCourses, getMinistries, getTeachers } from "@/lib/data/admin";
import { formatSessionDate, formatTimeRange } from "@/lib/format";
import SessionTypeBadge from "@/components/SessionTypeBadge";
import { createSession, deleteSession } from "./actions";

export default async function AdminSessionsPage() {
  const supabase = await createClient();
  const [sessions, ministries, teachers, courses] = await Promise.all([
    getAllSessions(supabase),
    getMinistries(supabase),
    getTeachers(supabase),
    getCourses(supabase),
  ]);

  return (
    <>
      <section className="rounded-lg border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-medium tracking-wide text-muted">
          PROGRAMMER UNE SÉANCE
        </h2>
        <form action={createSession} className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs text-muted">Type</label>
            <select
              name="session_type"
              required
              defaultValue="ministere"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="ministere">Par ministère</option>
              <option value="commun">Tronc commun</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Ministère</label>
            <select
              name="ministry_id"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="">— Tronc commun / non applicable —</option>
              {ministries.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Cours</label>
            <select
              name="course_id"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="">— Aucun cours rattaché —</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Enseignant</label>
            <select
              name="teacher_id"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="">— Non assigné —</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Jour</label>
            <select
              name="day"
              required
              defaultValue="samedi"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            >
              <option value="samedi">Samedi</option>
              <option value="dimanche">Dimanche</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Date</label>
            <input
              type="date"
              name="session_date"
              required
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs text-muted">Début</label>
              <input
                type="time"
                name="start_time"
                required
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted">Fin</label>
              <input
                type="time"
                name="end_time"
                required
                className="w-full rounded-md border border-border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Lieu</label>
            <input
              type="text"
              name="location"
              required
              placeholder="MLK Studio"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs text-muted">Salle (optionnel)</label>
            <input
              type="text"
              name="room"
              placeholder="Salle 2"
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs text-muted">Description (optionnel)</label>
            <textarea
              name="description"
              rows={2}
              className="w-full rounded-md border border-border px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-on-accent transition hover:opacity-90 sm:col-span-2 sm:w-fit"
          >
            Programmer la séance
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-border bg-background p-6">
        <h2 className="mb-4 text-sm font-medium tracking-wide text-muted">TOUTES LES SÉANCES</h2>
        {sessions.length ? (
          <ul className="divide-y divide-border">
            {sessions.map((s) => (
              <li
                key={s.id}
                className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex flex-wrap items-center gap-2 text-foreground">
                  {formatSessionDate(s.session_date)}
                  <SessionTypeBadge type={s.session_type} />
                  {s.courses && <span className="font-medium">· {s.courses.title}</span>}
                  {s.ministries && <span className="text-muted">· {s.ministries.name}</span>}
                </span>
                <span className="flex items-center gap-3 text-muted">
                  <span>
                    {formatTimeRange(s.start_time, s.end_time)} · {s.location}
                    {s.room ? ` · ${s.room}` : ""}
                    {s.teacher ? ` · ${s.teacher.full_name}` : ""}
                  </span>
                  <form action={deleteSession}>
                    <input type="hidden" name="session_id" value={s.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-600 transition hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </form>
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted">Aucune séance.</p>
        )}
      </section>
    </>
  );
}
