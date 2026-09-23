const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const rating = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

/** 50000 -> "Rp 50.000" */
export function formatRupiah(value: number) {
  return rupiah.format(value);
}

/** 4.9 -> "4,9" */
export function formatRating(value: number) {
  return rating.format(value);
}

const tanggalWaktu = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

/** ISO -> "23 Sep 2026, 16.04 WIB" — dipakai dashboard admin. */
export function formatWaktu(iso: string | null | undefined) {
  if (!iso) return "—";

  const waktu = new Date(iso);
  if (Number.isNaN(waktu.getTime())) return "—";

  return `${tanggalWaktu.format(waktu)} WIB`;
}

/** 2100 -> "2,1K" — dipakai untuk jumlah ulasan agar ringkas di kartu produk. */
export function formatCompact(value: number) {
  if (value < 1000) return String(value);
  return `${(value / 1000).toFixed(1).replace(".", ",")}K`;
}
