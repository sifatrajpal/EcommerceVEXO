"use client";

import { useActionState, useEffect, useRef } from "react";
import { createProduct, updateProduct, type CreateProductState } from "@/actions/admin-products";
import type { MetaItem } from "@/lib/data/catalog-meta";
import type { StockOption } from "@/lib/data/inventory";
import type { Product } from "@/lib/types";

const initial: CreateProductState = { status: "idle" };

const inputClasses = "w-full rounded-md border border-[#d8dade] bg-white px-3 py-2 text-[14px] outline-none focus:border-ink";
const labelClasses = "flex flex-col gap-1.5 text-[13px] font-medium";

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Props = {
  categories: MetaItem[];
  collections: MetaItem[];
  brands: MetaItem[];
  materials: MetaItem[];
  allColors: MetaItem[];
  allSizes: MetaItem[];
  colorStock?: StockOption[];
  sizeStock?: StockOption[];
  /** Pass an existing product to switch the form into edit mode (prefilled, image optional). */
  product?: Product;
};

export function AdminProductForm({
  categories,
  collections,
  brands,
  materials,
  allColors,
  allSizes,
  colorStock = [],
  sizeStock = [],
  product,
}: Props) {
  const isEdit = !!product;
  const [state, formAction, pending] = useActionState(isEdit ? updateProduct : createProduct, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success" && !isEdit) formRef.current?.reset();
  }, [state, isEdit]);

  return (
    <form ref={formRef} action={formAction} className="rounded-[14px] bg-white p-5">
      {isEdit && <input type="hidden" name="productId" value={product.id} />}

      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClasses}>
          Name
          <input name="name" required defaultValue={product?.name} placeholder="ASRV x Equinox ..." className={inputClasses} />
        </label>

        <label className={labelClasses}>
          Price (USD)
          <input name="price" type="number" step="0.01" min="0" required defaultValue={product?.price} placeholder="116.00" className={inputClasses} />
        </label>

        <label className={labelClasses}>
          Season
          <select name="season" defaultValue={product?.season ?? "Winter"} className={inputClasses}>
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </select>
        </label>

        <label className={labelClasses}>
          Category
          <select name="category" defaultValue={product?.category ?? "unisex"} className={inputClasses}>
            {categories.length > 0 ? (
              categories.map((c) => (
                <option key={c.id} value={c.name}>{capitalize(c.name)}</option>
              ))
            ) : (
              <>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="unisex">Unisex</option>
              </>
            )}
          </select>
        </label>

        <label className={labelClasses}>
          Collection
          <select name="collection" defaultValue={product?.collection ?? ""} className={inputClasses}>
            <option value="">None</option>
            {collections.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </label>

        <label className={labelClasses}>
          Brand
          <select name="brand" defaultValue={product?.brand ?? ""} className={inputClasses}>
            <option value="">None</option>
            {brands.map((b) => (
              <option key={b.id} value={b.name}>{b.name}</option>
            ))}
          </select>
        </label>

        <label className={labelClasses}>
          Material
          <select name="material" defaultValue={product?.material ?? ""} className={inputClasses}>
            <option value="">None</option>
            {materials.map((m) => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
        </label>

        <label className={`${labelClasses} md:col-span-2`}>
          Product image
          <input
            name="imageFile"
            type="file"
            accept="image/*"
            required={!isEdit}
            className={`${inputClasses} file:mr-3 file:rounded-md file:border-0 file:bg-[#141414] file:px-3 file:py-1.5 file:text-white`}
          />
          <span className="text-[12px] font-normal text-[#8e939a]">
            {isEdit
              ? "Leave empty to keep the current photo — choose a file only to replace it."
              : "Choose a photo from your computer — clicking opens your local file browser."}
          </span>
        </label>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-[13px] font-medium">Colors in stock</p>
          {allColors.length === 0 ? (
            <p className="text-[12px] text-[#8e939a]">Add some colors in Admin → Colors first.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {allColors.map((c) => {
                const existing = colorStock.find((s) => s.id === c.id);
                return (
                  <label key={c.id} className="flex items-center gap-2 rounded-md border border-[#d8dade] px-3 py-2">
                    <input type="checkbox" name="colorIds" value={c.id} defaultChecked={!!existing} className="size-4 shrink-0" />
                    <span className="size-3.5 shrink-0 rounded-full border border-[#e4e5e8]" style={{ backgroundColor: c.hex }} />
                    <span className="flex-1 truncate text-[13px]">{c.name}</span>
                    <input
                      type="number"
                      name={`colorQty_${c.id}`}
                      min="0"
                      defaultValue={existing?.quantity ?? 0}
                      aria-label={`${c.name} quantity`}
                      className="w-16 shrink-0 rounded border border-[#d8dade] px-1.5 py-1 text-[12px]"
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <p className="mb-2 text-[13px] font-medium">Sizes in stock</p>
          {allSizes.length === 0 ? (
            <p className="text-[12px] text-[#8e939a]">Add some sizes in Admin → Sizes first.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {allSizes.map((s) => {
                const existing = sizeStock.find((o) => o.id === s.id);
                return (
                  <label key={s.id} className="flex items-center gap-2 rounded-md border border-[#d8dade] px-3 py-2">
                    <input type="checkbox" name="sizeIds" value={s.id} defaultChecked={!!existing} className="size-4 shrink-0" />
                    <span className="flex-1 truncate text-[13px]">{s.name}</span>
                    <input
                      type="number"
                      name={`sizeQty_${s.id}`}
                      min="0"
                      defaultValue={existing?.quantity ?? 0}
                      aria-label={`${s.name} quantity`}
                      className="w-16 shrink-0 rounded border border-[#d8dade] px-1.5 py-1 text-[12px]"
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-[12px] text-[#8e939a]">
        Check a color or size to make it available, and set how many are in stock. Below 15 shows a low-stock warning on the product page.
      </p>

      <label className="mt-4 flex items-center gap-2 text-[13px]">
        <input name="isNewArrival" type="checkbox" defaultChecked={product?.isNewArrival ?? true} className="size-4" />
        New product
      </label>
      <p className="mt-1 text-[12px] text-[#8e939a]">
        Shows in &quot;New Arrivals&quot; and gets a NEW tag everywhere — the tag disappears on its own 10 days after adding.
      </p>

      {state.status !== "idle" && (
        <p className={`mt-3 text-[13px] ${state.status === "error" ? "text-[#c23434]" : "text-[#3aa15c]"}`}>{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded-lg bg-[#141414] px-5 py-2.5 text-[14px] font-medium text-white disabled:opacity-60"
      >
        {pending ? (isEdit ? "Saving…" : "Adding…") : isEdit ? "Save Changes" : "Add Product"}
      </button>
    </form>
  );
}
