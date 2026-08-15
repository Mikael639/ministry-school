import { createClient } from "@/lib/supabase/server";
import { getEnrollmentBreakdown, getGlobalStats } from "@/lib/data/admin";
import BarChart from "@/components/BarChart";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const [stats, breakdown] = await Promise.all([
    getGlobalStats(supabase),
    getEnrollmentBreakdown(supabase),
  ]);

  const cards = [
    { label: "Étudiants inscrits", value: stats.studentCount, hero: true },
    { label: "Inscriptions finalisées", value: stats.confirmedCount },
    { label: "En attente de confirmation", value: stats.pendingCount },
    { label: "Enseignants", value: stats.teacherCount },
    { label: "Séances programmées", value: stats.sessionCount },
    { label: "Supports publiés", value: stats.materialCount },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="rounded-lg border border-border bg-background p-6">
            <p className="text-sm text-muted">{c.label}</p>
            <p
              className={`mt-2 font-semibold text-foreground ${
                c.hero ? "text-5xl" : "text-3xl"
              }`}
            >
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <BarChart
        title="INSCRITS PAR MINISTÈRE"
        subtitle="Nombre d'étudiants ayant choisi chaque ministère."
        data={breakdown.byMinistry.map((m) => ({ label: m.name, value: m.count }))}
      />

      <BarChart
        title="RÉPARTITION PAR JOUR"
        subtitle="Jour de cours choisi par les étudiants."
        data={breakdown.byDay.map((d) => ({ label: d.day, value: d.count }))}
      />
    </>
  );
}
