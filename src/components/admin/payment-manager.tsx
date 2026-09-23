import { Trash2 } from "lucide-react";

import { hapusPembayaranAction, simpanPembayaranAction } from "@/app/actions/admin";
import { ConfirmSubmit, SubmitButton } from "@/components/admin/buttons";
import { Card, Field, Input, Pill, Select, statusBayarNada } from "@/components/admin/ui";
import { formatRupiah, formatWaktu } from "@/lib/format";
import type { BarisPembayaran } from "@/lib/supabase";

/** Pilihan metode — nilainya disimpan apa adanya ke kolom `method`. */
const metode = [
  { value: "transfer", label: "Transfer bank" },
  { value: "qris", label: "QRIS" },
  { value: "ewallet", label: "E-wallet" },
  { value: "lain", label: "Lainnya" },
];

const statusBayar = [
  { value: "pending", label: "Pending — belum masuk" },
  { value: "lunas", label: "Lunas" },
  { value: "gagal", label: "Gagal" },
  { value: "refund", label: "Refund" },
];

/**
 * Pembayaran dicatat per pesanan.
 *
 * Ini yang membuat laporan uang masuk bisa dipercaya: satu pesanan boleh punya
 * beberapa baris pembayaran (mis. DP lalu pelunasan), dan setiap baris mencatat
 * metode, nominal, referensi transfer, serta waktu lunas.
 *
 * Status pesanan otomatis naik ke **dibayar** begitu ada baris berstatus lunas —
 * logikanya ada di server action, bukan di tampilan, supaya konsisten walau
 * dicatat dari halaman mana pun.
 */
export function PaymentManager({
  orderId,
  payments,
  sisa,
}: {
  orderId: string;
  payments: BarisPembayaran[];
  /** Total pesanan (dipakai sebagai nilai awal nominal). */
  sisa: number;
}) {
  const lunas = payments
    .filter((bayar) => bayar.status === "lunas")
    .reduce((total, bayar) => total + bayar.amount, 0);

  return (
    <div className="flex flex-col gap-5">
      <Card
        title="Catat pembayaran"
        description="Nominal diisi otomatis dengan total pesanan — ubah kalau pembayarannya bertahap."
      >
        <form action={simpanPembayaranAction} className="grid gap-5 sm:grid-cols-2">
          <input type="hidden" name="order_id" value={orderId} />

          <Field label="Metode" htmlFor="metode-baru">
            <Select id="metode-baru" name="method" defaultValue="transfer">
              {metode.map((pilihan) => (
                <option key={pilihan.value} value={pilihan.value}>
                  {pilihan.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Nominal (Rp)" htmlFor="nominal-baru">
            <Input id="nominal-baru" name="amount" inputMode="numeric" defaultValue={sisa} />
          </Field>

          <Field label="Status" htmlFor="status-baru">
            <Select id="status-baru" name="status" defaultValue="lunas">
              {statusBayar.map((pilihan) => (
                <option key={pilihan.value} value={pilihan.value}>
                  {pilihan.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field
            label="Referensi"
            htmlFor="referensi-baru"
            hint="Nama pengirim atau nomor transaksi — supaya mudah dicocokkan ke mutasi."
          >
            <Input id="referensi-baru" name="reference" placeholder="TRF 260923 09:12" />
          </Field>

          <div className="sm:col-span-2">
            <SubmitButton pendingLabel="Mencatat…">Catat pembayaran</SubmitButton>
          </div>
        </form>
      </Card>

      <Card
        title={`Riwayat pembayaran (${payments.length})`}
        description={`Tercatat lunas: ${formatRupiah(lunas)} dari ${formatRupiah(sisa)}.`}
      >
        {payments.length === 0 ? (
          <p className="text-[13.5px] text-[#6f6f74]">
            Belum ada pembayaran yang dicatat untuk pesanan ini.
          </p>
        ) : (
          <ul className="flex flex-col gap-4">
            {payments.map((bayar) => (
              <li
                key={bayar.id}
                className="rounded-xl border border-[#eeeef2] bg-[#fafafb] p-4"
              >
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <Pill tone={statusBayarNada(bayar.status)}>{bayar.status}</Pill>
                  <span className="text-[13px] font-semibold">{formatRupiah(bayar.amount)}</span>
                  <span className="text-[12.5px] text-[#6f6f74]">
                    {bayar.method} · dicatat {formatWaktu(bayar.created_at)}
                    {bayar.paid_at ? ` · lunas ${formatWaktu(bayar.paid_at)}` : ""}
                  </span>
                </div>

                <form action={simpanPembayaranAction} className="grid gap-4 sm:grid-cols-2">
                  <input type="hidden" name="order_id" value={orderId} />
                  <input type="hidden" name="id" value={bayar.id} />

                  <Field label="Metode" htmlFor={`metode-${bayar.id}`}>
                    <Select id={`metode-${bayar.id}`} name="method" defaultValue={bayar.method}>
                      {metode.map((pilihan) => (
                        <option key={pilihan.value} value={pilihan.value}>
                          {pilihan.label}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Nominal (Rp)" htmlFor={`nominal-${bayar.id}`}>
                    <Input
                      id={`nominal-${bayar.id}`}
                      name="amount"
                      inputMode="numeric"
                      defaultValue={bayar.amount}
                    />
                  </Field>

                  <Field label="Status" htmlFor={`status-${bayar.id}`}>
                    <Select id={`status-${bayar.id}`} name="status" defaultValue={bayar.status}>
                      {statusBayar.map((pilihan) => (
                        <option key={pilihan.value} value={pilihan.value}>
                          {pilihan.label}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field label="Referensi" htmlFor={`referensi-${bayar.id}`}>
                    <Input
                      id={`referensi-${bayar.id}`}
                      name="reference"
                      defaultValue={bayar.reference ?? ""}
                    />
                  </Field>

                  <div className="sm:col-span-2">
                    <SubmitButton variant="kedua" pendingLabel="Menyimpan…">
                      Simpan
                    </SubmitButton>
                  </div>
                </form>

                <form action={hapusPembayaranAction} className="mt-3 border-t border-[#eeeef2] pt-3">
                  <input type="hidden" name="id" value={bayar.id} />
                  <input type="hidden" name="order_id" value={orderId} />

                  <ConfirmSubmit message="Hapus catatan pembayaran ini?">
                    <Trash2 className="size-3.5" aria-hidden="true" />
                    Hapus
                  </ConfirmSubmit>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
