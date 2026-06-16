/* ================= GLOBAL STATE (SAFE) ================= */

window.dataSiswaCabutan = window.dataSiswaCabutan || [];
window.dataSiswaIdentitas = window.dataSiswaIdentitas || [];
window.dataSiswaEdit = window.dataSiswaEdit || [];
window.dataSiswaTabungan = window.dataSiswaTabungan || [];

/* ================= API CONFIG ================= */

// FIX BUG: jangan self-assign
// pastikan TABUNGAN_API sudah ada dari config.js
const API_URL = window.TABUNGAN_API;

/* ================= API WRAPPER ================= */

async function api(action, data = {}) {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ action, data })
        });

        return await res.json();
    } catch (err) {
        console.error("API error:", err);
        return { status: false, message: "Network error" };
    }
}

/* ================= TABUNGAN ================= */

async function loadKelasTabungan() {
    const data = await api("getDataSiswa");

    if (!data?.status) {
        alert("Gagal memuat data siswa");
        return;
    }

    window.dataSiswaTabungan = data.data || [];

    const tabKelas = document.getElementById("tabKelas");
    const tabNama = document.getElementById("tabNama");

    if (!tabKelas || !tabNama) return;

    const kelasUnik = [...new Set(
        window.dataSiswaTabungan
            .map(x => String(x.kelas || "").trim())
            .filter(Boolean)
    )].sort();

    tabKelas.innerHTML = `<option value="">Pilih Kelas</option>`;
    kelasUnik.forEach(k => {
        tabKelas.innerHTML += `<option value="${k}">${k}</option>`;
    });

    tabNama.innerHTML = `<option value="">Pilih Nama Siswa</option>`;
}

function loadNamaTabungan() {
    const tabKelas = document.getElementById("tabKelas");
    const tabNama = document.getElementById("tabNama");

    if (!tabKelas || !tabNama) return;
    if (!window.dataSiswaTabungan?.length) return;

    const siswa = window.dataSiswaTabungan.filter(x =>
        String(x.kelas || "").trim() === String(tabKelas.value || "").trim()
    );

    tabNama.innerHTML = `<option value="">Pilih Nama Siswa</option>`;
    siswa.forEach(s => {
        tabNama.innerHTML += `<option value="${s.nama}">${s.nama}</option>`;
    });
}

/* ================= SIMPAN TABUNGAN ================= */

async function simpanTabungan() {
    const payload = {
        nama: document.getElementById("tabNama")?.value,
        kelas: document.getElementById("tabKelas")?.value,
        nominal: document.getElementById("tabNominal")?.value
    };

    const result = await api("inputTabungan", payload);

    alert(result?.message || "Sukses");
}

/* ================= CABUTAN ================= */

async function loadKelasCabutan() {
    const result = await api("getDataSiswa");
    if (!result?.status) return;

    window.dataSiswaCabutan = result.data || [];

    const cabKelas = document.getElementById("cabKelas");
    if (!cabKelas) return;

    const kelasUnik = [...new Set(
        window.dataSiswaCabutan
            .map(x => String(x.kelas || "").trim())
            .filter(Boolean)
    )];

    cabKelas.innerHTML = `<option value="">Pilih Kelas</option>`;
    kelasUnik.forEach(k => {
        cabKelas.innerHTML += `<option value="${k}">${k}</option>`;
    });
}

function loadNamaCabutan() {
    const cabKelas = document.getElementById("cabKelas");
    const cabNama = document.getElementById("cabNama");

    if (!cabKelas || !cabNama) return;

    const siswa = window.dataSiswaCabutan.filter(x =>
        String(x.kelas || "").trim() === String(cabKelas.value || "").trim()
    );

    cabNama.innerHTML = `<option value="">Pilih Nama Siswa</option>`;
    siswa.forEach(s => {
        cabNama.innerHTML += `<option value="${s.nama}">${s.nama}</option>`;
    });
}

/* ================= UPDATE IDENTITAS ================= */

async function updateIdentitasSiswa() {
    try {
        const file = document.getElementById("editFoto")?.files?.[0];
        let foto = "";

        if (file) {
            foto = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        const data = {
            namaPanggilan: document.getElementById("editNamaPanggilan")?.value,
            nama: document.getElementById("editNama")?.value,
            kelas: document.getElementById("editKelas")?.value,
            nik: document.getElementById("editNik")?.value,
            nisn: document.getElementById("editNisn")?.value,
            jenisKelamin: document.getElementById("editGender")?.value,
            ttl: document.getElementById("editTTL")?.value,
            agama: document.getElementById("editAgama")?.value,
            anakKe: document.getElementById("editAnakKe")?.value,
            tahunMasuk: document.getElementById("editTahunMasuk")?.value,
            namaAyah: document.getElementById("editAyah")?.value,
            namaIbu: document.getElementById("editIbu")?.value,
            pekerjaanAyah: document.getElementById("editKerjaAyah")?.value,
            pekerjaanIbu: document.getElementById("editKerjaIbu")?.value,
            desa: document.getElementById("editDesa")?.value,
            kecamatan: document.getElementById("editKecamatan")?.value,
            kabupaten: document.getElementById("editKabupaten")?.value,
            provinsi: document.getElementById("editProvinsi")?.value,
            kodePos: document.getElementById("editKodePos")?.value,
            foto
        };

        const result = await api("updateIdentitasSiswa", data);

        if (!result?.status) {
            alert(result?.message || "Gagal update");
            return;
        }

        alert("Update berhasil");

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

/* ================= PLACEHOLDER SAFE ================= */

function loadKelasEditIdentitas() {
    console.warn("loadKelasEditIdentitas belum diimplementasi");
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    loadKelasTabungan();
    loadKelasCabutan();

    document.getElementById("tabKelas")?.addEventListener("change", loadNamaTabungan);
    document.getElementById("cabKelas")?.addEventListener("change", loadNamaCabutan);

    if (typeof show === "function") {
        show("splash");
    }
});
