"use client";

import { useActionState, useEffect, useRef } from "react";
import { createMetaItem, type MetaFormState, type MetaTable } from "@/actions/catalog-meta";

const initial: MetaFormState = { status: "idle" };

export function MetaAddForm({ table, withHex = false }: { table: MetaTable; withHex?: boolean }) {
  const [state, formAction, pending] = useActionState(createMetaItem, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="table" value={table} />
      <label className="flex flex-col gap-1.5 text-[13px] font-medium">
        Name
        <input
          name="name"
          required
          placeholder="e.g. Streetwear"
          className="rounded-lg border border-[#e4e5e8] bg-white px-3 py-2 text-[14px] outline-none focus:border-ink"
        />
      </label>
      {withHex && (
        <label className="flex flex-col gap-1.5 text-[13px] font-medium">
          Color
          <input name="hex" type="color" defaultValue="#141414" className="h-[38px] w-16 rounded-lg border border-[#e4e5e8]" />
        </label>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[#141414] px-4 py-2 text-[14px] font-medium text-white transition-colors hover:bg-[#2a2a2a] disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add"}
      </button>
      {state.status === "error" && <p className="text-[13px] text-[#c23434]">{state.message}</p>}
    </form>
  );
}
