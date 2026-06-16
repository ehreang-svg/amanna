/* ===========================
   DAFTAR HALAMAN
=========================== */

const pages = [
    "splash",
    "loginPage",
    "dashboard",
    "submenuPage",
    "contentPage",
    "absenGuruPage",
    "rekapPage",
    "absenSiswaPage",
    "rekapSiswaPage",
    "tabunganPage",
    "rekapTabunganPage",
    "raportPage",
    "previewRaportPage",
    "kognitifPage",
    "previewKognitifPage",
    "loginQuiz",
    "cabutanPage",
    "identitasPage",
   "editIdentitasPage",
    "exportIdentitasPage"
];

/* ===========================
   RIWAYAT NAVIGASI
=========================== */

const pageHistory = [];

/* ===========================
   TAMPILKAN HALAMAN
=========================== */

function show(id) {

    // Sembunyikan semua halaman
    pages.forEach(function (p) {

        const el = document.getElementById(p);

        if (el) {
            el.classList.add("hidden");
        }

    });

    // Tampilkan halaman tujuan
    const target = document.getElementById(id);

    if (target) {

        target.classList.remove("hidden");

    } else {

        console.error("Target tidak ditemukan :", id);

    }

}

/* ===========================
   NAVIGASI
=========================== */

function nav(id) {

    let active = null;

    pages.forEach(function (p) {
        const el = document.getElementById(p);
        if (el && !el.classList.contains("hidden")) {
            active = p;
        }
    });

    if (active && active !== id) {
        pageHistory.push(active);
    }

    show(id);

    if (id === "kognitifPage" && typeof loadKognitifSiswa === "function") {
        loadKognitifSiswa();
    }

    if (id === "raportPage" && typeof loadKelasRaport === "function") {
        loadKelasRaport();
    }

    if (id === "loginQuiz" && typeof mulai === "function") {
        mulai();
    }

    if (id === "cabutanPage" && typeof loadKelasCabutan === "function") {
        loadKelasCabutan();
    }

    if (id === "exportIdentitasPage" && typeof loadDataIdentitas === "function") {
        loadDataIdentitas();
    }

    if (id === "editIdentitasPage" && typeof loadKelasEditIdentitas === "function") {
        loadKelasEditIdentitas();
    }
}

/* ===========================
   KEMBALI
=========================== */

function goBack() {

    if (pageHistory.length === 0) {
        return;
    }

    const lastPage = pageHistory.pop();

    show(lastPage);

}
