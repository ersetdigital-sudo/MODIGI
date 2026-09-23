/**
 * Gaya tombol dashboard — **modul biasa, TANPA `"use client"`**.
 *
 * Ini bukan detail gaya penulisan: nilai yang diekspor dari file `"use client"`
 * berubah menjadi *client reference* saat diimpor oleh Server Component. Dipakai
 * sebagai `className`, nilainya jadi kosong — tombolnya kehilangan latar, padding,
 * dan `display: flex`, sehingga ikon dan teksnya bertumpuk vertikal. Itu yang
 * terjadi pada versi pertama dashboard ini.
 *
 * Karena itu kelas tombolnya tinggal di file `.ts` biasa (dipakai server component
 * maupun client component), sedangkan `buttons.tsx` (yang butuh `useFormStatus`)
 * hanya mengekspor komponennya.
 */
export type VarianTombol = keyof typeof tombol;

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
