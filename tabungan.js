/* ================= GLOBAL STATE ================= */

let dataSiswaTabungan = [];
let dataSiswaCabutan = [];
let dataSiswaIdentitas = [];
let dataSiswaEdit = [];

/* ================= API WRAPPER ================= */

const TABUNGAN_API = TABUNGAN_API; // tetap

async function api(action, data = {}) {
    try {
        const res = await fetch(TABUNGAN_API, {
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

let dataSiswaTabungan = [];

/* ================= LOAD KELAS ================= */

async function loadKelasTabungan() {
    const data = await api("getDataSiswa");

    if (!data.status) {
        alert("Gagal memuat data siswa");
        return;
    }

    dataSiswaTabungan = data.data || [];

    const tabKelas = document.getElementById("tabKelas");
    const tabNama = document.getElementById("tabNama");

    if (!tabKelas || !tabNama) return;

    const kelasUnik = [...new Set(
        dataSiswaTabungan
            .map(x => String(x.kelas || "").trim())
            .filter(Boolean)
    )].sort();

    tabKelas.innerHTML = `<option value="">Pilih Kelas</option>`;
    kelasUnik.forEach(k => {
        tabKelas.innerHTML += `<option value="${k}">${k}</option>`;
    });

    tabNama.innerHTML = `<option value="">Pilih Nama Siswa</option>`;
}

/* ================= LOAD NAMA ================= */

function loadNamaTabungan() {
    const tabKelas = document.getElementById("tabKelas");
    const tabNama = document.getElementById("tabNama");

    if (!tabKelas || !tabNama) return;
    if (!dataSiswaTabungan.length) return;

    const siswa = dataSiswaTabungan.filter(x =>
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

    alert(result.message || "Sukses");
}

/* ================= REKAP ================= */

async function loadRekapTabungan() {
    try {
        const nama = document.getElementById("filterNamaTabungan").value;
        const kelas = document.getElementById("filterKelasTabungan").value;
        const bulan = document.getElementById("filterBulanTabungan").value;
        const tanggal = document.getElementById("filterTanggalTabungan").value;

        const res = await fetch(
            `${TABUNGAN_API}?action=getRekapTabungan&nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}&bulan=${encodeURIComponent(bulan)}&tanggal=${encodeURIComponent(tanggal)}`
        );

        const data = await res.json();

        if (!data.status) {
            alert(data.message);
            return;
        }

        let total = 0;
        let html = `<table><tr><th>Tanggal</th><th>Nama</th><th>Kelas</th><th>Nominal</th></tr>`;

        data.data.forEach(r => {
            total += Number(r.nominal || 0);
            html += `<tr>
                <td>${r.tanggal}</td>
                <td>${r.nama}</td>
                <td>${r.kelas}</td>
                <td>Rp ${Number(r.nominal).toLocaleString("id-ID")}</td>
            </tr>`;
        });

        html += `<tr><th colspan="3">TOTAL</th><th>Rp ${total.toLocaleString("id-ID")}</th></tr></table>`;
        document.getElementById("rekapTabunganBox").innerHTML = html;

    } catch (err) {
        console.error(err);
    }
}

/* ================= CABUTAN ================= */

let dataSiswaCabutan = [];

async function loadKelasCabutan() {
    const result = await api("getDataSiswa");
    if (!result.status) return;

    dataSiswaCabutan = result.data || [];

    const cabKelas = document.getElementById("cabKelas");
    if (!cabKelas) return;

    const kelasUnik = [...new Set(
        dataSiswaCabutan.map(x => String(x.kelas || "").trim()).filter(Boolean)
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

    const siswa = dataSiswaCabutan.filter(x =>
        String(x.kelas || "").trim() === String(cabKelas.value || "").trim()
    );

    cabNama.innerHTML = `<option value="">Pilih Nama Siswa</option>`;
    siswa.forEach(s => {
        cabNama.innerHTML += `<option value="${s.nama}">${s.nama}</option>`;
    });
}

async function simpanCabutan() {
    const data = {
        nama: document.getElementById("cabNama").value,
        kelas: document.getElementById("cabKelas").value,
        jenis: document.getElementById("cabJenis").value,
        nominal: Number(document.getElementById("cabNominal").value || 0)
    };

    const res = await api("inputCabutan", data);
    alert(res.message || "Sukses");
}

/* ================= IDENTITAS UPDATE ================= */

async function updateIdentitasSiswa() {
    try {
        const file = document.getElementById("editFoto").files[0];
        let foto = "";

        if (file) {
            foto = await new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.readAsDataURL(file);
            });
        }

        const data = {
            namaPanggilan: document.getElementById("editNamaPanggilan").value,
            nama: document.getElementById("editNama").value,
            kelas: document.getElementById("editKelas").value,
            nik: document.getElementById("editNik").value,
            nisn: document.getElementById("editNisn").value,
            jenisKelamin: document.getElementById("editGender").value,
            ttl: document.getElementById("editTTL").value,
            agama: document.getElementById("editAgama").value,
            anakKe: document.getElementById("editAnakKe").value,
            tahunMasuk: document.getElementById("editTahunMasuk").value,
            namaAyah: document.getElementById("editAyah").value,
            namaIbu: document.getElementById("editIbu").value,
            pekerjaanAyah: document.getElementById("editKerjaAyah").value,
            pekerjaanIbu: document.getElementById("editKerjaIbu").value,
            desa: document.getElementById("editDesa").value,
            kecamatan: document.getElementById("editKecamatan").value,
            kabupaten: document.getElementById("editKabupaten").value,
            provinsi: document.getElementById("editProvinsi").value,
            kodePos: document.getElementById("editKodePos").value,
            foto
        };

        const result = await api("updateIdentitasSiswa", data);

        if (!result.status) {
            alert(result.message || "Gagal update");
            return;
        }

        alert("Update berhasil");

    } catch (err) {
        console.error(err);
        alert(err.message);
    }
}

/* ================= INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
    loadKelasTabungan();
    loadKelasCabutan();

    document.getElementById("tabKelas")?.addEventListener("change", loadNamaTabungan);
    document.getElementById("cabKelas")?.addEventListener("change", loadNamaCabutan);

    show("splash");
});
