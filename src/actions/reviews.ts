"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";

export type ReviewFormState = { status: "idle" | "success" | "error"; message?: string };

export async function submitReview(_prev: ReviewFormState, formData: FormData): Promise<ReviewFormState> {
  const productId = String(formData.get("productId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const rating = Number(formData.get("rating"));
  const comment = String(formData.get("comment") ?? "").trim();

  if (!productId) return { status: "error", message: "Missing product." };
  if (!name) return { status: "error", message: "Enter your name." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { status: "error", message: "Pick a star rating." };
  if (!comment) return { status: "error", message: "Enter a review." };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("reviews").insert({ product_id: productId, name, rating, comment });

  if (error) {
    console.error("[submitReview]", error.message);
    return { status: "error", message: "Couldn't submit that review — try again." };
  }

  revalidatePath(`/products/${productId}`);
  return { status: "success", message: "Thanks — your review is live." };
}
