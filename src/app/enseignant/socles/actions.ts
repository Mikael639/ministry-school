"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateSocleLabel(formData: FormData) {
  const supabase = await createClient();
  const socleId = formData.get("socle_id") as string;
  const customLabel = formData.get("custom_label") as string;

  await supabase
    .from("paliers")
    .update({ custom_label: customLabel || null })
    .eq("id", socleId);

  revalidatePath("/enseignant/socles");
  revalidatePath("/etudiant/palier");
}
