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

    // Cari halaman yang sedang aktif
    let active = null;

    pages.forEach(function (p) {

        const el = document.getElementById(p);

        if (el && !el.classList.contains("hidden")) {
            active = p;
        }

    });

    // Simpan riwayat
    if (active && active !== id) {
        pageHistory.push(active);
    }

    // Tampilkan halaman tujuan
    show(id);

    // Jalankan fungsi khusus bila ada
    if (id === "kognitifPage") {

        if (typeof loadKognitifSiswa === "function") {
            loadKognitifSiswa();
        }

    }

    if (id === "raportPage") {

        if (typeof loadKelasRaport === "function") {
            loadKelasRaport();
        }

    }

    if (id === "loginQuiz") {

        if (typeof mulai === "function") {
            mulai();
        }

    }

    if (id === "cabutanPage") {

        if (typeof loadKelasCabutan === "function") {
            loadKelasCabutan();
        }

    }

    if (id === "exportIdentitasPage") {loadDataIdentitas();
        }

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
