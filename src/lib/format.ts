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

/** 2100 -> "2,1K" — dipakai untuk jumlah ulasan agar ringkas di kartu produk. */
export function formatCompact(value: number) {
  if (value < 1000) return String(value);
  return `${(value / 1000).toFixed(1).replace(".", ",")}K`;
}
