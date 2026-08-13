import { createClient } from "@/lib/supabase/server";
import { getAllUsers } from "@/lib/data/admin";
import { togglePayment } from "./actions";

const roleLabels: Record<string, string> = {
  student: "Étudiant",
  teacher: "Enseignant",
  admin: "Administrateur",
};

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const users = await getAllUsers(supabase);

  return (
    <section className="rounded-lg border border-border bg-background p-6">
      <h2 className="mb-4 text-sm font-medium tracking-wide text-muted">UTILISATEURS</h2>
      {users.length ? (
        <ul className="divide-y divide-border">
          {users.map((u) => (
            <li key={u.id} className="flex items-center justify-between py-3 text-sm">
              <span className="text-foreground">{u.full_name}</span>
              <span className="flex items-center gap-2 text-muted">
                {u.ministries?.name && <span>{u.ministries.name}</span>}
                <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">
                  {roleLabels[u.role] ?? u.role}
                </span>
                {u.role === "student" && (
                  <>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs ${
                        u.has_paid
                          ? "border border-green-600/30 bg-green-600/10 text-green-700"
                          : "border border-amber-600/30 bg-amber-600/10 text-amber-700"
                      }`}
                    >
                      {u.has_paid ? "Payé" : "Non payé"}
                    </span>
                    <form action={togglePayment}>
                      <input type="hidden" name="user_id" value={u.id} />
                      <input type="hidden" name="next_value" value={(!u.has_paid).toString()} />
                      <button
                        type="submit"
                        className="rounded-md border border-border px-2.5 py-1 text-xs text-foreground/80 transition hover:bg-surface"
                      >
                        {u.has_paid ? "Marquer non payé" : "Marquer payé"}
                      </button>
                    </form>
                  </>
                )}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">Aucun utilisateur.</p>
      )}
    </section>
  );
}
