"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { isCurrentUserAdmin } from "@/lib/admin";

export type CreateProductState = { status: "idle" | "success" | "error"; message?: string };

export async function createProduct(_prev: CreateProductState, formData: FormData): Promise<CreateProductState> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) return { status: "error", message: "Not authorized." };

  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const currency = "USD";
  const season = String(formData.get("season") ?? "Winter");
  const category = String(formData.get("category") ?? "unisex");
  const isNewArrival = formData.get("isNewArrival") === "on";
  const imageFile = formData.get("imageFile");

  if (!name) return { status: "error", message: "Name is required." };
  if (!Number.isFinite(price) || price < 0) return { status: "error", message: "Enter a valid price." };
  if (!["men", "women", "unisex"].includes(category)) return { status: "error", message: "Invalid category." };
  if (!(imageFile instanceof File) || imageFile.size === 0) return { status: "error", message: "Choose an image file." };
  if (!imageFile.type.startsWith("image/")) return { status: "error", message: "That file isn't an image." };

  const ext = path.extname(imageFile.name) || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  const bytes = Buffer.from(await imageFile.arrayBuffer());
  await writeFile(path.join(process.cwd(), "public", "images", filename), bytes);
  const imageUrl = `/images/${filename}`;

  const { error } = await supabase.from("products").insert({
    name,
    price,
    currency,
    season,
    category,
    image_url: imageUrl,
    is_new_arrival: isNewArrival,
  });

  if (error) {
    console.error("[createProduct]", error.message);
    return { status: "error", message: "Couldn't save that product." };
  }

  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/admin");
  return { status: "success", message: `"${name}" added to the catalog.` };
}
