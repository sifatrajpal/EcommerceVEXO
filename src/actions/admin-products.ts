"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/auth-server";
import { isCurrentUserAdmin } from "@/lib/admin";

export type CreateProductState = { status: "idle" | "success" | "error"; message?: string };

type SupabaseClient = Awaited<ReturnType<typeof createSupabaseServerClient>>;

/** Replaces a product's color (or size) stock rows with whatever the form just submitted. */
async function syncStock(
  supabase: SupabaseClient,
  table: "product_colors" | "product_sizes",
  fkColumn: "color_id" | "size_id",
  idsFieldName: string,
  qtyPrefix: string,
  productId: string,
  formData: FormData,
) {
  await supabase.from(table).delete().eq("product_id", productId);

  const ids = formData.getAll(idsFieldName).map(String).filter(Boolean);
  if (ids.length === 0) return;

  const rows = ids.map((id) => ({
    product_id: productId,
    [fkColumn]: id,
    quantity: Math.max(0, Math.trunc(Number(formData.get(`${qtyPrefix}${id}`)) || 0)),
  }));

  await supabase.from(table).insert(rows);
}

async function syncAllStock(supabase: SupabaseClient, productId: string, formData: FormData) {
  await syncStock(supabase, "product_colors", "color_id", "colorIds", "colorQty_", productId, formData);
  await syncStock(supabase, "product_sizes", "size_id", "sizeIds", "sizeQty_", productId, formData);
}

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
  const collection = String(formData.get("collection") ?? "").trim() || null;
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const material = String(formData.get("material") ?? "").trim() || null;
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

  const { data: inserted, error } = await supabase
    .from("products")
    .insert({
      name,
      price,
      currency,
      season,
      category,
      collection,
      brand,
      material,
      image_url: publicUrl,
      is_new_arrival: isNewArrival,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("[createProduct]", error?.message);
    return { status: "error", message: "Couldn't save that product." };
  }

  await syncAllStock(supabase, inserted.id, formData);

  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/admin");
  return { status: "success", message: `"${name}" added to the catalog.` };
}

export async function updateProduct(_prev: CreateProductState, formData: FormData): Promise<CreateProductState> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) return { status: "error", message: "Not authorized." };

  const productId = String(formData.get("productId") ?? "");
  if (!productId) return { status: "error", message: "Missing product." };

  const name = String(formData.get("name") ?? "").trim();
  const price = Number(formData.get("price"));
  const season = String(formData.get("season") ?? "Winter");
  const category = String(formData.get("category") ?? "unisex");
  const collection = String(formData.get("collection") ?? "").trim() || null;
  const brand = String(formData.get("brand") ?? "").trim() || null;
  const material = String(formData.get("material") ?? "").trim() || null;
  const isNewArrival = formData.get("isNewArrival") === "on";
  const imageFile = formData.get("imageFile");

  if (!name) return { status: "error", message: "Name is required." };
  if (!Number.isFinite(price) || price < 0) return { status: "error", message: "Enter a valid price." };
  if (!["men", "women", "unisex"].includes(category)) return { status: "error", message: "Invalid category." };

  const update: Record<string, unknown> = {
    name,
    price,
    season,
    category,
    collection,
    brand,
    material,
    is_new_arrival: isNewArrival,
  };

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!imageFile.type.startsWith("image/")) return { status: "error", message: "That file isn't an image." };

    const ext = imageFile.name.split(".").pop() || "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filename, imageFile, { contentType: imageFile.type });

    if (uploadError) {
      console.error("[updateProduct:upload]", uploadError.message);
      return { status: "error", message: "Couldn't upload that image." };
    }

    const { data: { publicUrl } } = supabase.storage.from("product-images").getPublicUrl(filename);
    update.image_url = publicUrl;
  }

  const { error } = await supabase.from("products").update(update).eq("id", productId);

  if (error) {
    console.error("[updateProduct]", error.message);
    return { status: "error", message: "Couldn't update that product." };
  }

  await syncAllStock(supabase, productId, formData);

  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath(`/products/${productId}`);
  return { status: "success", message: `"${name}" updated.` };
}

export async function deleteProduct(formData: FormData): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");
  if (!(await isCurrentUserAdmin())) redirect("/admin/products");

  const productId = String(formData.get("productId") ?? "");
  if (!productId) return;

  await supabase.from("products").delete().eq("id", productId);

  revalidatePath("/", "layout");
  revalidatePath("/shop");
  revalidatePath("/admin");
  redirect("/admin/products");
}
