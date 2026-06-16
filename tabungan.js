if (window.__TABUNGAN_LOADED__) {
    console.warn("tabungan.js sudah diload, skip");
    throw new Error("Duplicate load blocked");
}
window.__TABUNGAN_LOADED__ = true;

if (window.__TABUNGAN_LOADED__) {
    throw new Error("Duplicate tabungan.js blocked");
}
window.__TABUNGAN_LOADED__ = true;

/* ================= GLOBAL SAFE STATE ================= */

window.dataSiswaTabungan = window.dataSiswaTabungan || [];
window.dataSiswaCabutan = window.dataSiswaCabutan || [];
window.dataSiswaIdentitas = window.dataSiswaIdentitas || [];
window.dataSiswaEdit = window.dataSiswaEdit || [];

const TABUNGAN_API = window.TABUNGAN_API || "";

/* ================= API WRAPPER ================= */

async function api(action, data = {}) {
    try {
        const res = await fetch(TABUNGAN_API, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({ action, data })
        });

        const text = await res.text();

        try {
            return JSON.parse(text);
        } catch {
            console.error("RAW RESPONSE:", text);
            return { status: false, message: "Response bukan JSON" };
        }

    } catch (err) {
        console.error("API ERROR:", err);
        return { status: false, message: err.message };
    }
}

/* ================= TABUNGAN ================= */

async function loadKelasTabungan() {
    const data = await api("getDataSiswa");

    if (!data.status) return alert("Gagal load siswa");

    window.dataSiswaTabungan = data.data || [];

    const tabKelas = document.getElementById("tabKelas");
    const tabNama = document.getElementById("tabNama");

    const kelasUnik = [...new Set(
        window.dataSiswaTabungan.map(x => String(x.kelas || "").trim())
    )].filter(Boolean).sort();

    tabKelas.innerHTML = `<option value="">Pilih Kelas</option>`;
    kelasUnik.forEach(k => {
        tabKelas.innerHTML += `<option value="${k}">${k}</option>`;
    });

    tabNama.innerHTML = `<option value="">Pilih Nama</option>`;
}

function loadNamaTabungan() {
    const tabKelas = document.getElementById("tabKelas");
    const tabNama = document.getElementById("tabNama");

    const siswa = window.dataSiswaTabungan.filter(x =>
        String(x.kelas).trim() === String(tabKelas.value).trim()
    );

    tabNama.innerHTML = `<option value="">Pilih Nama</option>`;
    siswa.forEach(s => {
        tabNama.innerHTML += `<option value="${s.nama}
