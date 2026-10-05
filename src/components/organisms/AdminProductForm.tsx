"use client";

import { useActionState, useEffect, useRef } from "react";
import { createProduct, type CreateProductState } from "@/actions/admin-products";

const initial: CreateProductState = { status: "idle" };

const inputClasses = "w-full rounded-md border border-[#d8dade] bg-white px-3 py-2 text-[14px] outline-none focus:border-ink";
const labelClasses = "flex flex-col gap-1.5 text-[13px] font-medium";

export function AdminProductForm() {
  const [state, formAction, pending] = useActionState(createProduct, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="rounded-[14px] bg-white p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClasses}>
          Name
          <input name="name" required placeholder="ASRV x Equinox ..." className={inputClasses} />
        </label>

        <label className={labelClasses}>
          Price (USD)
          <input name="price" type="number" step="0.01" min="0" required placeholder="116.00" className={inputClasses} />
        </label>

        <label className={labelClasses}>
          Season
          <select name="season" defaultValue="Winter" className={inputClasses}>
            <option value="Winter">Winter</option>
            <option value="Summer">Summer</option>
          </select>
        </label>

        <label className={labelClasses}>
          Category
          <select name="category" defaultValue="unisex" className={inputClasses}>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </label>

        <label className={labelClasses}>
          Collection
          <select name="collection" defaultValue="" className={inputClasses}>
            <option value="">None</option>
            <option value="Men Originals">Men Originals</option>
            <option value="Women Originals">Women Originals</option>
            <option value="Originals">Originals</option>
            <option value="Essentials">Essentials</option>
            <option value="Performance">Performance</option>
            <option value="Limited Edition">Limited Edition</option>
          </select>
        </label>

        <label className={`${labelClasses} md:col-span-2`}>
          Product image
          <input name="imageFile" type="file" accept="image/*" required className={`${inputClasses} file:mr-3 file:rounded-md file:border-0 file:bg-[#141414] file:px-3 file:py-1.5 file:text-white`} />
          <span className="text-[12px] font-normal text-[#8e939a]">
            Choose a photo from your computer — clicking opens your local file browser.
          </span>
        </label>
      </div>

      <label className="mt-4 flex items-center gap-2 text-[13px]">
        <input name="isNewArrival" type="checkbox" defaultChecked className="size-4" />
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
        {pending ? "Adding…" : "Add Product"}
      </button>
    </form>
  );
}
