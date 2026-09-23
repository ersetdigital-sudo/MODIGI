import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Komponen kecil dashboard admin.
 *
 * Semuanya server component biasa (tanpa state) supaya halaman admin tetap ringan:
 * yang butuh interaksi hanya tombol submit (lihat `submit-button.tsx`) dan tombol
 * hapus (lihat `delete-button.tsx`).
 */

/**
 * Gaya input & select bersama — satu bentuk untuk seluruh dashboard.
 *
 * Warna batasnya `#8a8a90` (3,5:1 di atas putih) bukan abu muda: batas tipis
 * adalah satu-satunya penanda sebuah kolom itu bisa diisi, jadi ia harus lolos
 * ambang kontras elemen non-teks (3:1). Teks bantuan & placeholder memakai
 * `#6f6f74` (5,1:1) supaya tetap terbaca sebagai teks.
 */
export const inputClass =
  "h-11 w-full rounded-xl border border-[#8a8a90] bg-white px-3.5 text-[14px] text-[#151310] shadow-[0_1px_2px_rgba(16,16,20,0.04)] transition-colors placeholder:text-[#6f6f74] focus:border-[#151310] focus:outline-none focus:ring-2 focus:ring-[#151310]/10";

export const textareaClass =
  "w-full rounded-xl border border-[#8a8a90] bg-white px-3.5 py-3 text-[14px] leading-relaxed text-[#151310] shadow-[0_1px_2px_rgba(16,16,20,0.04)] transition-colors placeholder:text-[#6f6f74] focus:border-[#151310] focus:outline-none focus:ring-2 focus:ring-[#151310]/10";

export const selectClass = cn(inputClass, "appearance-none pr-9");

/** Judul halaman + aksi di kanan. */
export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-[24px] font-extrabold tracking-[-0.02em] sm:text-[28px]">{title}</h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-[#6f6f74]">{description}</p>
        ) : null}
      </div>

      {action}
    </header>
  );
}

/** Kartu putih dengan judul opsional. */
export function Card({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-[#e8e8ec] bg-white", className)}>
      {title || action ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0f0f3] px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-[16px] font-bold tracking-[-0.01em]">{title}</h2>
            {description ? <p className="mt-0.5 text-[13px] text-[#6f6f74]">{description}</p> : null}
          </div>
          {action}
        </header>
      ) : null}

      <div className={cn("px-5 py-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Satu field: label, petunjuk kecil, lalu kontrolnya. */
export function Field({
  label,
  htmlFor,
  hint,
  required,
  children,
  className,
}: {
  label: string;
  htmlFor?: string;
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={htmlFor} className="text-[13px] font-semibold text-[#3a3a3f]">
        {label}
        {required ? <span className="ml-0.5 text-[#c0392b]">*</span> : null}
      </label>

      {children}

      {hint ? <p className="text-[12px] leading-relaxed text-[#6f6f74]">{hint}</p> : null}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(textareaClass, props.className)} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(selectClass, props.className)} />;
}

const nadaPil = {
  netral: "bg-[#f1f1f4] text-[#4a4a50]",
  hijau: "bg-[#e6f6ec] text-[#186c3a]",
  kuning: "bg-[#fdf3e0] text-[#8a6100]",
  biru: "bg-[#e8effc] text-[#21459b]",
  merah: "bg-[#fdeceb] text-[#a32b1d]",
  emas: "bg-[#f8f1e0] text-[#7d5f28]",
} as const;

export type NadaPil = keyof typeof nadaPil;

/** Label kecil berwarna (status, kategori, dan sejenisnya). */
export function Pill({ tone = "netral", children }: { tone?: NadaPil; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-bold tracking-[0.02em]",
        nadaPil[tone],
      )}
    >
      {children}
    </span>
  );
}

/** Warna pil untuk status pesanan — satu tempat supaya konsisten. */
export function statusPesananNada(status: string): NadaPil {
  switch (status) {
    case "baru":
      return "biru";
    case "dikonfirmasi":
      return "kuning";
    case "dibayar":
      return "hijau";
    case "selesai":
      return "emas";
    case "batal":
      return "merah";
    default:
      return "netral";
  }
}

/** Warna pil untuk status pembayaran. */
export function statusBayarNada(status: string): NadaPil {
  switch (status) {
    case "lunas":
      return "hijau";
    case "pending":
      return "kuning";
    case "gagal":
      return "merah";
    case "refund":
      return "netral";
    default:
      return "netral";
  }
}

/** Pesan hasil aksi (dari query string) — sukses, gagal, atau informasi. */
export function Alert({ tone = "info", children }: { tone?: "info" | "sukses" | "gagal"; children: ReactNode }) {
  const gaya = {
    info: { kelas: "border-[#dbe4f7] bg-[#f2f6ff] text-[#21459b]", Icon: Info },
    sukses: { kelas: "border-[#d3ecdc] bg-[#f2fbf5] text-[#186c3a]", Icon: CheckCircle2 },
    gagal: { kelas: "border-[#f7d7d3] bg-[#fdf4f3] text-[#a32b1d]", Icon: AlertTriangle },
  }[tone];

  return (
    <div
      className={cn(
        "mb-5 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13.5px] font-medium",
        gaya.kelas,
      )}
    >
      <gaya.Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

/** Keadaan kosong: satu kalimat + satu tindakan. */
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#dcdce2] bg-white px-6 py-12 text-center">
      <p className="text-[15px] font-bold">{title}</p>
      {description ? <p className="mt-1.5 max-w-md text-[13.5px] text-[#6f6f74]">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
