export type BarDatum = { label: string; value: number };

/**
 * Comparaison de magnitude sur une seule mesure : une seule teinte,
 * pas de légende (le titre nomme ce qui est mesuré), valeur à la pointe.
 */
export default function BarChart({
  title,
  subtitle,
  data,
  unit = "",
}: {
  title: string;
  subtitle?: string;
  data: BarDatum[];
  unit?: string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <section className="rounded-lg border border-border bg-background p-6">
      <h2 className="text-sm font-medium tracking-wide text-muted">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}

      {total === 0 ? (
        <p className="mt-4 text-sm text-muted">Aucune donnée pour l&apos;instant.</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {data.map((d) => (
            <li key={d.label} className="grid grid-cols-[9rem_1fr_3rem] items-center gap-3">
              <span className="truncate text-sm text-foreground" title={d.label}>
                {d.label}
              </span>

              {/* Piste discrète + barre pleine, extrémité arrondie côté valeur */}
              <span className="h-3 w-full rounded-sm bg-surface" aria-hidden="true">
                <span
                  className="block h-3 bg-accent"
                  style={{
                    width: `${(d.value / max) * 100}%`,
                    borderRadius: "0 4px 4px 0",
                    minWidth: d.value > 0 ? "4px" : "0",
                  }}
                />
              </span>

              <span className="text-right text-sm font-medium tabular-nums text-foreground">
                {d.value}
                {unit}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
