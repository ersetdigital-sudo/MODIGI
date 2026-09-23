"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

import { tombol, type VarianTombol } from "@/components/admin/tombol";
import { cn } from "@/lib/utils";

/**
 * Dua tombol kecil yang butuh JavaScript:
 *
 * 1. `<SubmitButton />` — memakai `useFormStatus` supaya tombolnya mati dan
 *    berubah teks saat Server Action sedang jalan. Tanpa ini, admin bisa menekan
 *    "Simpan" dua kali dan membuat dua produk.
 * 2. `<ConfirmSubmit />` — tombol hapus yang meminta konfirmasi lebih dulu.
 *
 * Keduanya ditaruh DI DALAM `<form action={...}>` — jadi kalau JavaScript belum
 * termuat, form-nya tetap bisa dikirim (hanya tanpa konfirmasi/pending state).
 *
 * Gaya tombolnya ada di `tombol.ts` (modul biasa) — lihat penjelasan di sana soal
 * kenapa tidak boleh diekspor dari file `"use client"`.
 */

export function SubmitButton({
  children,
  pendingLabel = "Menyimpan…",
  variant = "utama",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: VarianTombol;
  className?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} className={cn(tombol[variant], className)}>
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
      {pending ? pendingLabel : children}
    </button>
  );
}

export function ConfirmSubmit({
  children,
  message,
  variant = "bahaya",
  className,
  title,
}: {
  children: React.ReactNode;
  /** Pertanyaan konfirmasi, mis. "Hapus produk ini?" */
  message: string;
  variant?: VarianTombol;
  className?: string;
  title?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      title={title}
      disabled={pending}
      className={cn(tombol[variant], className)}
      onClick={(event) => {
        // `window.confirm` cukup di sini: konfirmasi hanya untuk mencegah salah
        // klik, bukan pengamanan (penjagaan sesi ada di server action).
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
