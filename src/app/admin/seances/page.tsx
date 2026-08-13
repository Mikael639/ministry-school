import { createClient } from "@/lib/supabase/server";
import { getAllSessions } from "@/lib/data/admin";
import { formatSessionDate, formatTimeRange } from "@/lib/format";
import SessionTypeBadge from "@/components/SessionTypeBadge";

export default async function AdminSessionsPage() {
  const supabase = await createClient();
  const sessions = await getAllSessions(supabase);

  return (
    <section className="rounded-lg border border-border bg-background p-6">
      <h2 className="mb-4 text-sm font-medium tracking-wide text-muted">TOUTES LES SÉANCES</h2>
      {sessions.length ? (
        <ul className="divide-y divide-border">
          {sessions.map((s) => (
            <li key={s.id} className="flex flex-col gap-1 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span className="flex items-center gap-2 text-foreground">
                {formatSessionDate(s.session_date)}
                <SessionTypeBadge type={s.session_type} />
                {s.ministries && <span className="text-muted">· {s.ministries.name}</span>}
              </span>
              <span className="text-muted">
                {formatTimeRange(s.start_time, s.end_time)} · {s.location}
                {s.room ? ` · ${s.room}` : ""}
                {s.teacher ? ` · ${s.teacher.full_name}` : ""}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Aucune séance.</p>
      )}
    </section>
  );
}
