"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitAssignment(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");

  const assignmentId = formData.get("assignment_id") as string;
  const content = formData.get("content") as string;

  await supabase.from("submissions").upsert(
    {
      assignment_id: assignmentId,
      student_id: user.id,
      content,
      submitted_at: new Date().toISOString(),
    },
    { onConflict: "assignment_id,student_id" }
  );

  revalidatePath("/etudiant/cours");
}
