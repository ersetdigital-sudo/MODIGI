"use client";

import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";

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
 */

/** Gaya tombol bersama. */
export const tombol = {
  utama:
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#151310] px-5 text-[14px] font-bold text-white transition-colors hover:bg-[#2a2723] focus-visible:ring-2 focus-visible:ring-[#151310]/30 focus-visible:outline-none disabled:opacity-60",
  kedua:
    "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e2e2e7] bg-white px-5 text-[14px] font-bold text-[#151310] transition-colors hover:bg-[#f7f7f9] focus-visible:ring-2 focus-visible:ring-[#151310]/20 focus-visible:outline-none disabled:opacity-60",
  kecil:
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#e2e2e7] bg-white px-3 text-[13px] font-semibold text-[#3a3a3f] transition-colors hover:bg-[#f7f7f9] focus-visible:ring-2 focus-visible:ring-[#151310]/20 focus-visible:outline-none disabled:opacity-60",
  bahaya:
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#f0d5d1] bg-[#fdf4f3] px-3 text-[13px] font-semibold text-[#a32b1d] transition-colors hover:bg-[#fbe9e7] focus-visible:ring-2 focus-visible:ring-[#a32b1d]/25 focus-visible:outline-none disabled:opacity-60",
} as const;

export function SubmitButton({
  children,
  pendingLabel = "Menyimpan…",
  variant = "utama",
  className,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: keyof typeof tombol;
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
  variant?: keyof typeof tombol;
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
