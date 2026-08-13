"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function togglePayment(formData: FormData) {
  const supabase = await createClient();
  const userId = formData.get("user_id") as string;
  const nextValue = formData.get("next_value") === "true";

  await supabase.from("profiles").update({ has_paid: nextValue }).eq("id", userId);

  revalidatePath("/admin/utilisateurs");
}
