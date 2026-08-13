import { createClient } from "@/lib/supabase/server";
import { getGlobalStats } from "@/lib/data/admin";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const stats = await getGlobalStats(supabase);

  const cards = [
    { label: "Étudiants", value: stats.studentCount },
    { label: "Enseignants", value: stats.teacherCount },
    { label: "Séances programmées", value: stats.sessionCount },
    { label: "Supports publiés", value: stats.materialCount },
    { label: "Devoirs rendus", value: stats.submissionCount },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((c) => (
        <div key={c.label} className="rounded-lg border border-border bg-background p-6">
          <p className="text-sm text-muted">{c.label}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{c.value}</p>
        </div>
      ))}
    </div>
  );
}
