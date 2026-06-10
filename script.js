const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("open");
  });
}

function animateSectionByHash(hash) {
  if (!hash || !hash.startsWith("#")) return;
  const targetSection = document.querySelector(hash);
  if (!targetSection || !targetSection.classList.contains("section")) return;

  targetSection.classList.remove("section-animate");
  void targetSection.offsetWidth;
  targetSection.classList.add("section-animate");

  window.setTimeout(() => {
    targetSection.classList.remove("section-animate");
  }, 600);
}

const navAnchorLinks = document.querySelectorAll('.site-nav a[href^="#"], .hero a[href^="#"], .brand[href^="#"]');
navAnchorLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href");
    if (!href) return;
    window.setTimeout(() => animateSectionByHash(href), 80);
  });
});

window.addEventListener("hashchange", () => {
  animateSectionByHash(window.location.hash);
});

if (window.location.hash) {
  window.setTimeout(() => animateSectionByHash(window.location.hash), 150);
}

const advisorForm = document.getElementById("advisorForm");
const advisorOutput = document.getElementById("advisorOutput");

function getMaterialRecommendation(lokasi, budget, prioritas) {
  const db = {
    Pantai: { Ekonomis: "Hollow Galvanis", Menengah: "Hollow Galvanis + coating", Premium: "Stainless Steel" },
    Kota: { Ekonomis: "Hollow Hitam", Menengah: "Hollow Galvanis", Premium: "Stainless Steel" },
    Pedesaan: { Ekonomis: "Hollow Hitam", Menengah: "WF", Premium: "H Beam" }
  };

  const material = db[lokasi]?.[budget] || "Hollow Galvanis";

  const infoMap = {
    "Hollow Hitam": { plus: "Murah dan mudah didapat", minus: "Rentan karat jika tanpa pelapisan", life: "5-10 tahun", harga: "Rp 95.000 - Rp 130.000 / batang" },
    "Hollow Galvanis": { plus: "Lebih tahan korosi", minus: "Harga di atas hollow hitam", life: "10-15 tahun", harga: "Rp 135.000 - Rp 190.000 / batang" },
    "Stainless Steel": { plus: "Anti karat dan estetika tinggi", minus: "Biaya tinggi", life: "15-25 tahun", harga: "Rp 300.000 - Rp 650.000 / batang" },
    WF: { plus: "Kuat untuk struktur menengah-besar", minus: "Butuh handling pemasangan khusus", life: "15-25 tahun", harga: "Rp 12.000 - Rp 22.000 / kg" },
    "H Beam": { plus: "Sangat kuat untuk struktur berat", minus: "Paling mahal di kelas struktur", life: "20-30 tahun", harga: "Rp 14.000 - Rp 25.000 / kg" },
    "Hollow Galvanis + coating": { plus: "Proteksi ekstra terhadap korosi", minus: "Butuh biaya finishing tambahan", life: "12-18 tahun", harga: "Rp 155.000 - Rp 230.000 / batang" }
  };

  let chosen = material;
  if (prioritas === "Kuat" && (material === "Hollow Hitam" || material === "Hollow Galvanis")) chosen = "WF";
  else if (prioritas === "Anti Karat" || prioritas === "Estetika") chosen = "Stainless Steel";
  else if (prioritas === "Murah" && budget === "Ekonomis") chosen = lokasi === "Pantai" ? "Hollow Galvanis" : "Hollow Hitam";

  return { material: chosen, info: infoMap[chosen] || infoMap[material] };
}

if (advisorForm && advisorOutput) {
  advisorForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const lokasi = document.getElementById("lokasi").value;
    const budget = document.getElementById("budget").value;
    const prioritas = document.getElementById("prioritas").value;
    const result = getMaterialRecommendation(lokasi, budget, prioritas);

    advisorOutput.innerHTML = `
      <strong>Material Rekomendasi: ${result.material}</strong><br>
      <strong>Kelebihan:</strong> ${result.info.plus}<br>
      <strong>Kekurangan:</strong> ${result.info.minus}<br>
      <strong>Umur Pakai:</strong> ${result.info.life}<br>
      <strong>Estimasi Harga:</strong> ${result.info.harga}
    `;
  });
}

function numberFormat(n) {
  return new Intl.NumberFormat("id-ID").format(Math.round(n));
}

const estimasiKalkulator = {
  jenis: null,
  biayaMaterial: 0,
  biayaJasa: 0,
  biayaTransport: 0,
  biayaFinishing: 0,
  total: 0
};

const layananKalkulatorForm = document.getElementById("layananKalkulatorForm");
const layananKalkulatorOutput = document.getElementById("layananKalkulatorOutput");
const kalkulatorLayananSelect = document.getElementById("kalkulatorLayanan");
const kalkulatorSubLayananSelect = document.getElementById("kalkulatorSubLayanan");

const detailLayananMap = {
  Rumah: ["Kanopi", "Pagar", "Tralis", "Tangga", "Balkon"],
  Komersial: ["Pintu Ruko", "Kanopi Ruko", "Pagar Gudang", "Rolling Grill", "Partisi Besi"],
  Industri: ["Struktur Baja", "Conveyor", "Tangki", "Pipe Support", "Platform Kerja"],
  Custom: ["Meja Besi", "Rak Besi", "Gerobak", "Furniture Besi", "Desain Khusus"]
};

function populateSubLayanan(layanan) {
  if (!kalkulatorSubLayananSelect) return;

  kalkulatorSubLayananSelect.innerHTML = '<option value="">Pilih Detail Layanan</option>';
  const detailList = detailLayananMap[layanan] || [];

  detailList.forEach((detail) => {
    const opt = document.createElement("option");
    opt.value = detail;
    opt.textContent = detail;
    kalkulatorSubLayananSelect.appendChild(opt);
  });
}

if (kalkulatorLayananSelect) {
  kalkulatorLayananSelect.addEventListener("change", (e) => {
    populateSubLayanan(e.target.value);
  });
}

const kalkulatorBahanSelect = document.getElementById("kalkulatorBahan");
const kalkulatorAreaSelect = document.getElementById("kalkulatorArea");

const hargaPerMeterMakassar = {
  Rumah: {
    Kanopi: { "Hollow Hitam": 375000, "Hollow Galvanis": 430000, "Stainless Steel": 690000, WF: 560000, "H Beam": 610000 },
    Pagar: { "Hollow Hitam": 410000, "Hollow Galvanis": 455000, "Stainless Steel": 720000, WF: 590000, "H Beam": 640000 },
    Tralis: { "Hollow Hitam": 390000, "Hollow Galvanis": 440000, "Stainless Steel": 700000, WF: 570000, "H Beam": 620000 },
    Tangga: { "Hollow Hitam": 520000, "Hollow Galvanis": 580000, "Stainless Steel": 860000, WF: 740000, "H Beam": 790000 },
    Balkon: { "Hollow Hitam": 450000, "Hollow Galvanis": 510000, "Stainless Steel": 780000, WF: 650000, "H Beam": 700000 }
  },
  Komersial: {
    "Pintu Ruko": { "Hollow Hitam": 490000, "Hollow Galvanis": 550000, "Stainless Steel": 830000, WF: 700000, "H Beam": 760000 },
    "Kanopi Ruko": { "Hollow Hitam": 470000, "Hollow Galvanis": 530000, "Stainless Steel": 810000, WF: 680000, "H Beam": 730000 },
    "Pagar Gudang": { "Hollow Hitam": 500000, "Hollow Galvanis": 560000, "Stainless Steel": 840000, WF: 710000, "H Beam": 770000 },
    "Rolling Grill": { "Hollow Hitam": 520000, "Hollow Galvanis": 580000, "Stainless Steel": 860000, WF: 730000, "H Beam": 790000 },
    "Partisi Besi": { "Hollow Hitam": 460000, "Hollow Galvanis": 515000, "Stainless Steel": 790000, WF: 660000, "H Beam": 720000 }
  },
  Industri: {
    "Struktur Baja": { "Hollow Hitam": 590000, "Hollow Galvanis": 650000, "Stainless Steel": 930000, WF: 810000, "H Beam": 880000 },
    Conveyor: { "Hollow Hitam": 620000, "Hollow Galvanis": 680000, "Stainless Steel": 960000, WF: 840000, "H Beam": 910000 },
    Tangki: { "Hollow Hitam": 610000, "Hollow Galvanis": 670000, "Stainless Steel": 950000, WF: 830000, "H Beam": 900000 },
    "Pipe Support": { "Hollow Hitam": 580000, "Hollow Galvanis": 640000, "Stainless Steel": 920000, WF: 800000, "H Beam": 870000 },
    "Platform Kerja": { "Hollow Hitam": 600000, "Hollow Galvanis": 660000, "Stainless Steel": 940000, WF: 820000, "H Beam": 890000 }
  },
  Custom: {
    "Meja Besi": { "Hollow Hitam": 430000, "Hollow Galvanis": 490000, "Stainless Steel": 760000, WF: 630000, "H Beam": 690000 },
    "Rak Besi": { "Hollow Hitam": 420000, "Hollow Galvanis": 480000, "Stainless Steel": 750000, WF: 620000, "H Beam": 680000 },
    Gerobak: { "Hollow Hitam": 440000, "Hollow Galvanis": 500000, "Stainless Steel": 770000, WF: 640000, "H Beam": 700000 },
    "Furniture Besi": { "Hollow Hitam": 450000, "Hollow Galvanis": 510000, "Stainless Steel": 780000, WF: 650000, "H Beam": 710000 },
    "Desain Khusus": { "Hollow Hitam": 480000, "Hollow Galvanis": 540000, "Stainless Steel": 820000, WF: 690000, "H Beam": 750000 }
  }
};

function getHargaPerMeter(layanan, subLayanan, bahan, area) {
  const defaultHarga = 450000;
  if (area !== "Makassar") return Math.round(defaultHarga * 1.05);
  return hargaPerMeterMakassar[layanan]?.[subLayanan]?.[bahan] || defaultHarga;
}

function getAreaTerhitung(layanan, subLayanan, panjang, lebar, tinggi) {
  const areaDasar = Math.max(0, panjang) * Math.max(0, lebar);
  const keliling = 2 * (Math.max(0, panjang) + Math.max(0, lebar));

  const subButuhKeliling = ["Pagar", "Tralis", "Rolling Grill", "Pipe Support"];
  const subButuhTinggiDominan = ["Tangga", "Platform Kerja"];

  if (subButuhKeliling.includes(subLayanan)) return Math.max(areaDasar, keliling * Math.max(1, tinggi));
  if (subButuhTinggiDominan.includes(subLayanan)) return Math.max(areaDasar, (panjang * Math.max(1, tinggi)) + (lebar * Math.max(1, tinggi)));
  if (layanan === "Custom" && subLayanan === "Desain Khusus") return Math.max(areaDasar, areaDasar + (tinggi * 0.5));

  return areaDasar;
}

if (layananKalkulatorForm && layananKalkulatorOutput) {
  layananKalkulatorForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const layanan = document.getElementById("kalkulatorLayanan").value;
    const subLayanan = document.getElementById("kalkulatorSubLayanan").value;
    const bahan = kalkulatorBahanSelect?.value || "";
    const area = kalkulatorAreaSelect?.value || "Makassar";

    const p = parseFloat(document.getElementById("kalkulatorPanjang").value) || 0;
    const l = parseFloat(document.getElementById("kalkulatorLebar").value) || 0;
    const t = parseFloat(document.getElementById("kalkulatorTinggi").value) || 0;

    if (!layanan || !subLayanan || !bahan || !area) {
      layananKalkulatorOutput.innerHTML = "Lengkapi layanan, detail, bahan, dan area terlebih dahulu.";
      return;
    }

    const areaTerhitung = getAreaTerhitung(layanan, subLayanan, p, l, t);
    const hargaMeter = getHargaPerMeter(layanan, subLayanan, bahan, area);
    const subtotal = Math.round(areaTerhitung * hargaMeter);

    layananKalkulatorOutput.innerHTML = `
      <strong>${layanan} — ${subLayanan}</strong><br>
      Bahan: <strong>${bahan}</strong><br>
      Area harga: <strong>${area}</strong><br>
      Luas terhitung: <strong>${areaTerhitung.toFixed(2)} m²</strong><br>
      Harga meteran (${area}): <strong>Rp ${numberFormat(hargaMeter)} / m²</strong><br>
      <strong>Subtotal Estimasi: Rp ${numberFormat(subtotal)}</strong><br>
      <small>Catatan: Estimasi awal, harga final mengikuti hasil survey lapangan.</small>
    `;

    estimasiKalkulator.jenis = `${layanan} - ${subLayanan}`;
    estimasiKalkulator.total = subtotal;
    updateEstimasiOutputGabungan();
  });
}

const estimasiForm = document.getElementById("estimasiForm");
const estimasiOutput = document.getElementById("estimasiOutput");

function updateEstimasiOutputGabungan() {
  if (!estimasiOutput) return;

  const paket = document.getElementById("paketEstimasi")?.value || "";
  const luas = parseFloat(document.getElementById("luasEstimasi")?.value) || 0;
  const kesulitan = document.getElementById("tingkatKesulitan")?.value || "";

  const manualMaterial = parseFloat(document.getElementById("biayaMaterial")?.value) || 0;
  const manualJasa = parseFloat(document.getElementById("biayaJasa")?.value) || 0;
  const manualTransport = parseFloat(document.getElementById("biayaTransport")?.value) || 0;
  const manualFinishing = parseFloat(document.getElementById("biayaFinishing")?.value) || 0;
  const totalManual = manualMaterial + manualJasa + manualTransport + manualFinishing;

  const paketHargaPerM2 = { Ekonomis: 350000, Standar: 500000, Premium: 750000 };
  const faktorKesulitan = { Mudah: 1, Sedang: 1.15, Sulit: 1.3 };

  const hargaDasarPerM2 = paketHargaPerM2[paket] || 0;
  const faktor = faktorKesulitan[kesulitan] || 0;
  const subtotalCepat = luas > 0 && hargaDasarPerM2 > 0 && faktor > 0 ? Math.round(luas * hargaDasarPerM2 * faktor) : 0;

  const totalKalkulator = estimasiKalkulator.total || 0;
  const totalGabungan = subtotalCepat + totalManual + totalKalkulator;
  const estimasiHari = Math.max(2, Math.ceil(totalGabungan / 7000000));
  const estimasiMin = Math.round(totalGabungan * 0.92);
  const estimasiMax = Math.round(totalGabungan * 1.12);

  const detailKalkulator = estimasiKalkulator.jenis ? `<br><strong>Tambahan dari Kalkulator (${estimasiKalkulator.jenis}):</strong> Rp ${numberFormat(totalKalkulator)}` : "";
  const detailManual = totalManual > 0 ? `<br><strong>Input detail lanjutan:</strong> Rp ${numberFormat(totalManual)}` : "";
  const detailCepat = subtotalCepat > 0
    ? `
      <strong>Paket:</strong> ${paket}<br>
      <strong>Luas:</strong> ${luas.toFixed(2)} m²<br>
      <strong>Harga Dasar:</strong> Rp ${numberFormat(hargaDasarPerM2)} / m²<br>
      <strong>Tingkat Kesulitan:</strong> ${kesulitan} (x${faktor})<br>
      <strong>Subtotal Estimasi Cepat:</strong> Rp ${numberFormat(subtotalCepat)}
    `
    : "Lengkapi paket, luas, dan tingkat kesulitan untuk estimasi cepat.";

  estimasiOutput.innerHTML = `
    ${detailCepat}
    ${detailManual}
    ${detailKalkulator}<br>
    <strong>Total Estimasi Saat Ini:</strong> Rp ${numberFormat(totalGabungan)}<br>
    <strong>Range Estimasi:</strong> Rp ${numberFormat(estimasiMin)} - Rp ${numberFormat(estimasiMax)}<br>
    <strong>Perkiraan Durasi:</strong> ${estimasiHari} hari kerja<br>
    <small>Catatan: Ini estimasi awal agar mudah dipahami. Harga final menyesuaikan hasil survey lapangan.</small>
  `;
}

if (estimasiForm && estimasiOutput) {
  estimasiForm.addEventListener("submit", (e) => {
    e.preventDefault();
    updateEstimasiOutputGabungan();
  });
}

const materialPesananEl = document.getElementById("materialPesanan");
const jenisLayananEl = document.getElementById("jenisLayanan");
const aiBantuBtn = document.getElementById("aiBantuBtn");
const aiBantuOutput = document.getElementById("aiBantuOutput");

function generateOrderNumber() {
  const key = "las_order_counter";
  const current = parseInt(localStorage.getItem(key) || "0", 10) + 1;
  localStorage.setItem(key, String(current));
  return `LAS-2026-${String(current).padStart(4, "0")}`;
}

function normalizeWaNumber(raw) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

const ADMIN_WA_NUMBERS = [normalizeWaNumber("+62 821-9944-4471"), normalizeWaNumber("082293678295")];

function getServiceBasedMaterial(service) {
  const text = (service || "").toLowerCase();
  if (text.includes("rumah")) return "Hollow Galvanis";
  if (text.includes("komersial")) return "Hollow Hitam";
  if (text.includes("industri")) return "WF";
  if (text.includes("custom")) return "Stainless Steel";
  return "Hollow Galvanis";
}

if (aiBantuBtn && jenisLayananEl && materialPesananEl && aiBantuOutput) {
  aiBantuBtn.addEventListener("click", () => {
    const rekom = getServiceBasedMaterial(jenisLayananEl.value);
    materialPesananEl.value = rekom;
    aiBantuOutput.innerHTML = `AI merekomendasikan material: <strong>${rekom}</strong> berdasarkan jenis layanan.`;
  });
}

const bookingForm = document.getElementById("bookingForm");
const bookingOutput = document.getElementById("bookingOutput");
const lokasiOtomatisBtn = document.getElementById("lokasiOtomatisBtn");
const lokasiOtomatisInfo = document.getElementById("lokasiOtomatisInfo");

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`;
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Gagal mengambil alamat dari koordinat.");
  const data = await response.json();
  return data?.display_name || "";
}

function getGeoErrorMessage(err) {
  if (!err) return "Gagal mendeteksi lokasi.";
  if (err.code === 1) return "Izin lokasi ditolak. Aktifkan izin lokasi di browser.";
  if (err.code === 2) return "Lokasi tidak tersedia. Coba lagi di area dengan sinyal lebih baik.";
  if (err.code === 3) return "Waktu pencarian lokasi habis. Coba ulang.";
  return "Terjadi kendala saat mengambil lokasi.";
}

if (lokasiOtomatisBtn) {
  lokasiOtomatisBtn.addEventListener("click", () => {
    const alamatInput = document.getElementById("alamatSurvey");
    const mapsInput = document.getElementById("mapsSurvey");

    if (!navigator.geolocation) {
      if (lokasiOtomatisInfo) lokasiOtomatisInfo.textContent = "Browser tidak mendukung Geolocation.";
      return;
    }

    if (lokasiOtomatisInfo) lokasiOtomatisInfo.textContent = "Mendeteksi lokasi Anda...";
    lokasiOtomatisBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = Number(position.coords.latitude).toFixed(6);
          const lon = Number(position.coords.longitude).toFixed(6);
          const googleMapsLink = `https://www.google.com/maps?q=${lat},${lon}`;

          let alamatTeks = `Koordinat: ${lat}, ${lon}`;
          try {
            const alamatLengkap = await reverseGeocode(lat, lon);
            if (alamatLengkap) alamatTeks = alamatLengkap;
          } catch (_) {}

          if (alamatInput) alamatInput.value = alamatTeks;
          if (mapsInput) mapsInput.value = googleMapsLink;
          if (lokasiOtomatisInfo) lokasiOtomatisInfo.textContent = "Lokasi berhasil diisi otomatis.";
        } finally {
          lokasiOtomatisBtn.disabled = false;
        }
      },
      (err) => {
        if (lokasiOtomatisInfo) lokasiOtomatisInfo.textContent = getGeoErrorMessage(err);
        lokasiOtomatisBtn.disabled = false;
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  });
}

if (bookingForm && bookingOutput) {
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("namaPemesan").value.trim();
    const kontak = document.getElementById("kontakPemesan").value.trim();
    const material = document.getElementById("materialPesanan").value;
    const jenis = document.getElementById("jenisLayanan").value.trim();
    const tgl = document.getElementById("tanggalSurvey").value;
    const jam = document.getElementById("jamSurvey").value;
    const alamat = document.getElementById("alamatSurvey").value.trim();
    const maps = document.getElementById("mapsSurvey").value.trim();
    const catatan = document.getElementById("catatanPesanan").value.trim();

    const orderNo = generateOrderNumber();
    const statusAwal = "Menunggu Persetujuan Admin";

    const orders = JSON.parse(localStorage.getItem("las_orders") || "{}");
    orders[orderNo] = { nama, kontak, material, jenis, tgl, jam, alamat, maps, catatan, status: statusAwal, lastUpdate: new Date().toLocaleString("id-ID") };
    localStorage.setItem("las_orders", JSON.stringify(orders));

    const msgAdmin = `Halo Admin Bengkel Las Gibran,%0A` +
      `Ada pesanan baru masuk 🙏%0A%0A` +
      `No Pesanan: ${orderNo}%0A` +
      `Nama: ${encodeURIComponent(nama)}%0A` +
      `No WA Pelanggan: ${encodeURIComponent(kontak)}%0A` +
      `Jenis Pekerjaan: ${encodeURIComponent(jenis)}%0A` +
      `Material: ${encodeURIComponent(material)}%0A` +
      `Jadwal Survey: ${encodeURIComponent(tgl)} ${encodeURIComponent(jam)}%0A` +
      `Alamat: ${encodeURIComponent(alamat)}%0A` +
      `Maps: ${encodeURIComponent(maps)}%0A` +
      `Catatan: ${encodeURIComponent(catatan || "-")}`;

    const waAdminUrl1 = `https://wa.me/${ADMIN_WA_NUMBERS[0]}?text=${msgAdmin}`;
    const waAdminUrl2 = `https://wa.me/${ADMIN_WA_NUMBERS[1]}?text=${msgAdmin}`;

    bookingOutput.innerHTML = `
      Pesanan berhasil dibuat ✅<br>
      <strong>No Pesanan: ${orderNo}</strong><br>
      Status awal: <strong>${statusAwal}</strong><br>
      <strong>⚠️ Peringatan:</strong> detail pesanan bisa saja berubah setelah survei lapangan.<br>
      Estimasi respon admin: <strong>maksimal 1x24 jam kerja</strong>.<br>
      <a class="btn btn-primary" href="${waAdminUrl1}" target="_blank" rel="noopener">Kirim ke WA Admin 1</a>
      <a class="btn btn-secondary" href="${waAdminUrl2}" target="_blank" rel="noopener">Kirim ke WA Admin 2</a>
    `;

    bookingForm.reset();
  });
}

const statusForm = document.getElementById("statusForm");
const statusOutput = document.getElementById("statusOutput");

if (statusForm && statusOutput) {
  statusForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nomor = document.getElementById("nomorPesananCek")?.value?.trim()?.toUpperCase();
    const orders = JSON.parse(localStorage.getItem("las_orders") || "{}");
    const data = orders[nomor];

    if (!data) {
      statusOutput.innerHTML = `Nomor pesanan <strong>${nomor}</strong> tidak ditemukan.`;
      return;
    }

    statusOutput.innerHTML = `
      <strong>No Pesanan:</strong> ${nomor}<br>
      <strong>Nama:</strong> ${data.nama}<br>
      <strong>Jenis Pekerjaan:</strong> ${data.jenis}<br>
      <strong>Material:</strong> ${data.material}<br>
      <strong>Status:</strong> ${data.status}<br>
      <strong>Update terakhir:</strong> ${data.lastUpdate || "-"}
    `;
  });
}

const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginInfo = document.getElementById("adminLoginInfo");
const adminContentManager = document.getElementById("adminContentManager");

let adminLoggedIn = false;

if (adminLoginForm && adminLoginInfo) {
  adminLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value.trim();

    if (username === "admin" && password === "admin123") {
      adminLoginInfo.textContent = "Login admin berhasil. Anda bisa mengelola tim dan portofolio.";
      adminLoginInfo.style.color = "#20c997";
      adminLoggedIn = true;
      if (adminContentManager) adminContentManager.classList.remove("hidden");
      renderWorkHistory();
    } else {
      adminLoginInfo.textContent = "Login admin gagal. Gunakan username: admin dan password: admin123";
      adminLoginInfo.style.color = "#ff8787";
      adminLoggedIn = false;
      if (adminContentManager) adminContentManager.classList.add("hidden");
    }

    adminLoginForm.reset();
  });
}

const workHistoryGallery = document.getElementById("workHistoryGallery");
const workHistoryForm = document.getElementById("workHistoryForm");
const workImageFileInput = document.getElementById("workImageFile");

function getWorkHistoryItems() {
  return JSON.parse(localStorage.getItem("las_work_history") || "[]");
}

function saveWorkHistoryItems(items) {
  localStorage.setItem("las_work_history", JSON.stringify(items));
}

function renderWorkHistory() {
  if (!workHistoryGallery) return;

  const defaultItems = [
    { image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1000&q=80", caption: "Kanopi rumah — hasil pemasangan" },
    { image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1000&q=80", caption: "Pagar besi — proyek komersial" },
    { image: "https://images.unsplash.com/photo-1581093588401-22d04b8f0d8a?auto=format&fit=crop&w=1000&q=80", caption: "Tangga besi — area usaha" }
  ];

  const savedItems = getWorkHistoryItems();
  const items = savedItems.length ? savedItems : defaultItems;

  workHistoryGallery.innerHTML = items.map((item, idx) => `
    <article class="gallery-item">
      <img src="${item.image}" alt="Riwayat pekerjaan ${idx + 1}" />
      <div class="gallery-caption-row">
        <div class="gallery-caption">${item.caption}</div>
        ${adminLoggedIn ? `<button type="button" class="delete-work-btn" data-index="${idx}" aria-label="Hapus gambar">🗑</button>` : ""}
      </div>
    </article>
  `).join("");

  if (adminLoggedIn) {
    workHistoryGallery.querySelectorAll(".delete-work-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const index = Number(btn.getAttribute("data-index"));
        if (Number.isNaN(index)) return;
        const currentItems = getWorkHistoryItems();
        if (!currentItems.length) return;
        currentItems.splice(index, 1);
        saveWorkHistoryItems(currentItems);
        renderWorkHistory();
      });
    });
  }

  if (!savedItems.length) saveWorkHistoryItems(defaultItems);
}

if (workHistoryForm && workHistoryGallery) {
  workHistoryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!adminLoggedIn) return;

    const imageUrlInput = document.getElementById("workImageUrl");
    const caption = document.getElementById("workImageCaption").value.trim();
    const file = workImageFileInput?.files?.[0];
    const imageUrl = imageUrlInput ? imageUrlInput.value.trim() : "";

    if (!caption) return;

    const persistWorkHistoryItem = (image) => {
      if (!image) return;
      const items = getWorkHistoryItems();
      items.unshift({ image, caption });
      saveWorkHistoryItems(items);
      renderWorkHistory();
      workHistoryForm.reset();
    };

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === "string" ? reader.result : "";
        persistWorkHistoryItem(result);
      };
      reader.readAsDataURL(file);
      return;
    }

    persistWorkHistoryItem(imageUrl);
  });
}

const portfolioStoryForm = document.getElementById("portfolioStoryForm");
const portfolioStoryList = document.getElementById("portfolioStoryList");

if (portfolioStoryForm && portfolioStoryList) {
  portfolioStoryForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!adminLoggedIn) return;

    const title = document.getElementById("storyTitle").value.trim();
    const problem = document.getElementById("storyProblem").value.trim();
    const solution = document.getElementById("storySolution").value.trim();
    const duration = document.getElementById("storyDuration").value.trim();
    const result = document.getElementById("storyResult").value.trim();

    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <h3>${title}</h3>
      <p><strong>Masalah:</strong> ${problem}</p>
      <p><strong>Solusi:</strong> ${solution}</p>
      <p><strong>Durasi:</strong> ${duration}</p>
      <p><strong>Hasil:</strong> ${result}</p>
    `;
    portfolioStoryList.appendChild(el);
    portfolioStoryForm.reset();
  });
}

const steps = Array.from(document.querySelectorAll("#trackingTimeline .step"));
const nextStatusBtn = document.getElementById("nextStatusBtn");
const trackingTimestamp = document.getElementById("trackingTimestamp");
let currentStep = 0;

renderWorkHistory();

if (nextStatusBtn && steps.length) {
  nextStatusBtn.addEventListener("click", () => {
    if (currentStep < steps.length - 1) {
      steps[currentStep].classList.remove("active");
      currentStep += 1;
      steps[currentStep].classList.add("active");
      if (trackingTimestamp) trackingTimestamp.textContent = `Update terakhir: ${new Date().toLocaleString("id-ID")} oleh Admin`;
    }
  });
}
