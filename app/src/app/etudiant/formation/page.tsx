import { createClient } from "@/lib/supabase/server";

const descriptions: Record<string, string> = {
  apotre: "Fondation, envoi et implantation — poser des bases solides pour l'œuvre.",
  prophete: "Écoute et direction — discerner et transmettre ce que dit l'Esprit.",
  evangeliste: "Annonce et transmission — porter la bonne nouvelle à l'extérieur.",
  pasteur: "Accompagnement et soin — prendre soin du troupeau au quotidien.",
  docteur: "Enseignement et formation — structurer et transmettre la connaissance.",
};

export default async function StudentFormationPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: ministries }, { data: profile }] = await Promise.all([
    supabase.from("ministries").select("id, slug, name").order("name"),
    supabase.from("profiles").select("ministry_id").eq("id", user!.id).single(),
  ]);

  return (
    <section className="rounded-lg border border-border bg-background p-6">
      <h2 className="mb-1 text-sm font-medium tracking-wide text-muted">FORMATION</h2>
      <p className="mb-6 text-sm text-muted">
        À partir de janvier, les cours se poursuivent par ministère à MLK Studio, le samedi et le
        dimanche (mêmes contenus, au choix de l&apos;étudiant).
      </p>

      <ul className="grid gap-3 sm:grid-cols-2">
        {(ministries ?? []).map((m) => {
          const isMine = m.id === profile?.ministry_id;
          return (
            <li
              key={m.id}
              className={`rounded-md border p-4 ${
                isMine ? "border-accent/30 bg-accent/5" : "border-border"
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium text-foreground">{m.name}</p>
                {isMine && (
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs text-accent">
                    Mon ministère
                  </span>
                )}
              </div>
              <p className="text-sm text-muted">{descriptions[m.slug] ?? ""}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
