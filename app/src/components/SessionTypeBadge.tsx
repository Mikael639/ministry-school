export default function SessionTypeBadge({ type }: { type: "commun" | "ministere" }) {
  if (type !== "commun") return null;

  return (
    <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-xs text-accent">
      Tronc commun
    </span>
  );
}
