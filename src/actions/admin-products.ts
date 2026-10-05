"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  const ext = imageFile.name.split(".").pop() || "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filename, imageFile, { contentType: imageFile.type });

  if (uploadError) {
    console.error("[createProduct:upload]", uploadError.message);
    return { status: "error", message: "Couldn't upload that image." };
  }

  const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(filename);

  const { error } = await supabase.from("products").insert({
    name,
    price,
    currency,
    season,
    category,
    image_url: publicUrl,
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
