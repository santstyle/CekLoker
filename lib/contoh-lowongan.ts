/**
 * Teks contoh iklan lowongan yang dipakai tombol "Muat contoh iklan" di /cek.
 *
 * Dipisahkan dari halaman agar bisa diuji langsung: pengujian regresi memastikan
 * contoh "risiko rendah" memang menghasilkan band rendah, dan contoh "risiko
 * tinggi" tetap memicu temuan. Nominal upah pada contoh sengaja diberi jarak di
 * atas upah minimum dan tidak mengutip angka UMP tertentu agar tidak cepat basi
 * ketika data upah diperbarui.
 */

export const CONTOH_LOWONGAN_MENCURIGAKAN = `LOWONGAN KERJA URGENT STAFF ADMIN & DATA ENTRY
PT Contoh Maju Bersama — Jakarta Pusat

Kualifikasi:
- Pria/Wanita usia 18 - 35 tahun
- Pendidikan minimal SMP/SMA/SMK Sederajat
- Pengalaman tidak diutamakan (Langsung diterima)
- Siap kerja minggu ini juga

Fasilitas & Gaji:
- Gaji pokok Rp 8.500.000 - Rp 15.000.000 / bulan
- Uang harian & transport Rp 100.000 / hari
- Bonus komisi rekrutmen member baru tanpa batas

Catatan Penting:
- Wajib membayar biaya administrasi berkas & seragam kerja sebesar Rp 150.000 yang ditransfer sebelum jadwal wawancara kerja.
- Kirim data diri langsung melalui pesan WhatsApp pribadi HRD: 0812-0000-0000 (Tidak menerima telepon).`;

export const CONTOH_LOWONGAN_WAJAR = `LOWONGAN PEKERJAAN: JUNIOR ACCOUNTANT
PT Contoh Berkat Abadi (Kawasan Industri Pulogadung, Jakarta Timur)

Tanggung Jawab:
- Melakukan pencatatan jurnal transaksi harian dan rekonsiliasi kas/bank.
- Membantu penyusunan laporan keuangan bulanan sesuai PSAK.
- Menyiapkan berkas perpajakan (PPh 21, PPh 23, dan PPN).

Kualifikasi:
- Lulusan D3/S1 Akuntansi dari perguruan tinggi terakreditasi.
- Memahami software akuntansi Accurate atau SAP menjadi nilai tambah.
- Memiliki ketelitian tinggi dan integritas kerja.

Kompensasi & Hak Kerja:
- Gaji pokok Rp 8.000.000 per bulan, di atas ketentuan upah minimum DKI Jakarta yang berlaku, ditambah tunjangan kesehatan BPJS Ketenagakerjaan & BPJS Kesehatan.
- Jam kerja: Senin - Jumat, 08.30 - 17.30 WIB (40 jam per minggu).

Pendaftaran:
Kirimkan CV dan portofolio Anda melalui email resmi rekrutmen: karir@contohberkat.example dengan subjek "Posisi Akuntan - [Nama Anda]". Proses seleksi bebas biaya apa pun.`;

/** Lokasi pendamping tiap contoh, dipakai saat mengisi formulir /cek. */
export const LOKASI_CONTOH = {
  mencurigakan: "Jakarta Pusat",
  wajar: "Jakarta Timur",
} as const;
