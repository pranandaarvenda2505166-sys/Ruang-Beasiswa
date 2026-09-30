# Ruang Beasiswa

Website statis (HTML, CSS, JavaScript murni), tanpa instalasi.

## Cara menjalankan di VS Code
1. Buka folder `ruang-beasiswa` di VS Code (File > Open Folder).
2. Pasang ekstensi **Live Server** (Ritwick Dey).
3. Klik kanan `index.html` > **Open with Live Server**.

Alternatif: klik dua kali `index.html` untuk membukanya langsung di browser.

## Struktur
- `index.html`: struktur halaman
- `style.css`: seluruh gaya (tema navy dan emas, mode terang/gelap otomatis)
- `mentor.js`: hero, grid mentor, filter, modal jadwal
- `app.js`: pencocok beasiswa, deadline, checklist dokumen, form mentor, asisten AI

Data mentor ada di `mentor.js` (array `M`), data beasiswa di `app.js` (array `S`). Semua data contoh.
