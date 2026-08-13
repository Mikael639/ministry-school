import { createClient } from "@/lib/supabase/server";

type Palier = {
  id: string;
  label: string;
  start_date: string;
  end_date: string;
  description: string | null;
  sort_order: number;
  is_defined: boolean;
};

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${dateStr}T00:00:00`)
  );
}

function getStatus(p: Palier, today: string) {
  if (!p.is_defined) return { label: "Non défini", tone: "muted" as const };
  if (today < p.start_date) return { label: "À venir", tone: "muted" as const };
  if (today > p.end_date) return { label: "Terminé", tone: "muted" as const };
  return { label: "En cours", tone: "accent" as const };
}

export default async function StudentPalierPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("paliers").select("*").order("sort_order");
  const paliers = (data ?? []) as Palier[];
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="rounded-lg border border-border bg-background p-6">
      <h2 className="mb-1 text-sm font-medium tracking-wide text-muted">MON PALIER</h2>
      <p className="mb-6 text-sm text-muted">
        À partir de janvier, la formation par ministère avance par paliers d&apos;environ trois
        mois. Le nombre et le contenu des paliers suivants restent à confirmer par l&apos;équipe
        pédagogique.
      </p>

      <ul className="space-y-4">
        {paliers.map((p) => {
          const status = getStatus(p, today);
          return (
            <li key={p.id} className="rounded-md border border-border p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium text-foreground">{p.label}</p>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs ${
                    status.tone === "accent"
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border text-muted"
                  }`}
                >
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-muted">
                {formatDate(p.start_date)} — {formatDate(p.end_date)}
              </p>
              {p.description && <p className="mt-2 text-sm text-foreground/80">{p.description}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
