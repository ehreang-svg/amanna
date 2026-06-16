/* ===========================
   DAFTAR HALAMAN
=========================== */

const pages = [
    "splash",
    "loginPage",
    "dashboard",
    "editAkun",
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
   STATE NAVIGASI
=========================== */

const pageHistory = [];
let currentPage = "splash";

/* ===========================
   SHOW PAGE
=========================== */

function show(id) {
    pages.forEach(p => {
        const el = document.getElementById(p);
        if (el) el.classList.add("hidden");
    });

    const target = document.getElementById(id);

    if (!target) {
        console.error("Page tidak ditemukan:", id);
        return;
    }

    target.classList.remove("hidden");
}

/* ===========================
   NAVIGASI AMAN
=========================== */

function nav(id) {
    if (currentPage && currentPage !== id) {
        pageHistory.push(currentPage);
    }

    currentPage = id;
    show(id);

    // lifecycle hooks
    if (id === "kognitifPage") loadKognitifSiswa?.();
    if (id === "raportPage") loadKelasRaport?.();
    if (id === "loginQuiz") mulai?.();
    if (id === "cabutanPage") loadKelasCabutan?.();
    if (id === "tabunganPage") loadKelasTabungan?.();
    if (id === "exportIdentitasPage") loadDataIdentitas?.();
    if (id === "editIdentitasPage") loadKelasEditIdentitas?.();
}

/* ===========================
   BACK BUTTON
=========================== */

function goBack() {
    if (!pageHistory.length) return;

    const last = pageHistory.pop();
    currentPage = last;
    show(last);
}
