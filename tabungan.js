/* =========================
GLOBAL STATE
========================= */

window.dataSiswaCabutan = window.dataSiswaCabutan || [];
window.dataSiswaTabungan = window.dataSiswaTabungan || [];
window.dataSiswaEdit = window.dataSiswaEdit || [];
window.dataSiswaIdentitas = window.dataSiswaIdentitas || [];

/* =========================
API WRAPPER
========================= */

async function api(action,data={}){

    const url =
        TABUNGAN_API +
        "?action=" +
        encodeURIComponent(action);

    console.log(url);

    const res = await fetch(url);

    return await res.json();

}

/* =========================
TABUNGAN
========================= */

async function loadKelasTabungan() {


const res = await fetch(
    TABUNGAN_API +
    "?action=getDataSiswa"
);

const result =
await res.json();

if (!result.status) {
    alert("Gagal memuat data siswa");
    return;
}

window.dataSiswaTabungan =
    result.data || [];

const tabKelas =
    document.getElementById("tabKelas");

const tabNama =
    document.getElementById("tabNama");

if (!tabKelas || !tabNama) return;

const kelasUnik = [

    ...new Set(
        window.dataSiswaTabungan
            .map(x => String(x.kelas || "").trim())
            .filter(Boolean)
    )

].sort();

tabKelas.innerHTML =
    '<option value="">Pilih Kelas</option>';

kelasUnik.forEach(k => {

    tabKelas.innerHTML +=
        `<option value="${k}">
            ${k}
        </option>`;

});

tabNama.innerHTML =
    '<option value="">Pilih Nama Siswa</option>';


}

function loadNamaTabungan() {


const tabKelas =
    document.getElementById("tabKelas");

const tabNama =
    document.getElementById("tabNama");

if (!tabKelas || !tabNama) return;

const siswa =
    window.dataSiswaTabungan.filter(
        x =>
            String(x.kelas).trim() ===
            String(tabKelas.value).trim()
    );

tabNama.innerHTML =
    '<option value="">Pilih Nama Siswa</option>';

siswa.forEach(s => {

    tabNama.innerHTML +=
        `<option value="${s.nama}">
            ${s.nama}
        </option>`;

});


}

async function simpanTabungan() {


const nama =
    document.getElementById("tabNama")?.value;

const kelas =
    document.getElementById("tabKelas")?.value;

const nominal =
    document.getElementById("tabNominal")?.value;

if (!nama) {
    alert("Pilih siswa");
    return;
}

if (!kelas) {
    alert("Pilih kelas");
    return;
}

if (!nominal || Number(nominal) <= 0) {
    alert("Nominal tidak valid");
    return;
}

const result =
    await api("inputTabungan", {
        nama,
        kelas,
        nominal
    });

alert(
    result.message ||
    "Berhasil disimpan"
);

const inputNominal =
    document.getElementById("tabNominal");

if (inputNominal) {
    inputNominal.value = "";
}


}

/* =========================
CABUTAN
========================= */

async function loadKelasCabutan() {


const res = await fetch(
    TABUNGAN_API +
    "?action=getDataSiswa"
);

const result =
await res.json();

if (!result.status) return;

window.dataSiswaCabutan =
    result.data || [];

const cabKelas =
    document.getElementById("cabKelas");

if (!cabKelas) return;

const kelasUnik = [

    ...new Set(
        window.dataSiswaCabutan
            .map(x => String(x.kelas || "").trim())
            .filter(Boolean)
    )

].sort();

cabKelas.innerHTML =
    '<option value="">Pilih Kelas</option>';

kelasUnik.forEach(k => {

    cabKelas.innerHTML +=
        `<option value="${k}">
            ${k}
        </option>`;

});


}

function loadNamaCabutan() {


const cabKelas =
    document.getElementById("cabKelas");

const cabNama =
    document.getElementById("cabNama");

if (!cabKelas || !cabNama) return;

const siswa =
    window.dataSiswaCabutan.filter(
        x =>
            String(x.kelas).trim() ===
            String(cabKelas.value).trim()
    );

cabNama.innerHTML =
    '<option value="">Pilih Nama Siswa</option>';

siswa.forEach(s => {

    cabNama.innerHTML +=
        `<option value="${s.nama}">
            ${s.nama}
        </option>`;

});


}

/* =========================
EDIT IDENTITAS
========================= */

async function loadKelasEditIdentitas() {


const res = await fetch(
    TABUNGAN_API +
    "?action=getDataSiswa"
);

const result =
await res.json();

if (!result.status) return;

window.dataSiswaEdit =
    result.data || [];

const kelasSelect =
    document.getElementById(
        "editFilterKelas"
    );

if (!kelasSelect) return;

const kelas = [

    ...new Set(
        window.dataSiswaEdit
            .map(x => x.kelas)
            .filter(Boolean)
    )

].sort();

kelasSelect.innerHTML =
    '<option value="">Pilih Kelas</option>';

kelas.forEach(k => {

    kelasSelect.innerHTML +=
        `<option value="${k}">
            ${k}
        </option>`;

});

}

function loadNamaEditIdentitas() {

const kelas =
    document.getElementById(
        "editFilterKelas"
    )?.value;

const namaSelect =
    document.getElementById(
        "editFilterNama"
    );

if (!namaSelect) return;

const siswa =
    window.dataSiswaEdit.filter(
        x => x.kelas === kelas
    );

namaSelect.innerHTML =
    '<option value="">Pilih Nama</option>';

siswa.forEach(s => {

    namaSelect.innerHTML +=
        `<option value="${s.nama}">
            ${s.nama}
        </option>`;

});

}

function loadEditIdentitas() {
const nama =
    document.getElementById(
        "editFilterNama"
    )?.value;

const siswa =
    window.dataSiswaEdit.find(
        x => x.nama === nama
    );

if (!siswa) return;

document.getElementById("editNamaPanggilan").value = siswa.namaPanggilan || "";
document.getElementById("editNama").value = siswa.nama || "";
document.getElementById("editKelas").value = siswa.kelas || "";
document.getElementById("editNik").value = siswa.nik || "";
document.getElementById("editNisn").value = siswa.nisn || "";
document.getElementById("editGender").value = siswa.jenisKelamin || "";
document.getElementById("editTTL").value = siswa.ttl || "";
document.getElementById("editAgama").value = siswa.agama || "";
document.getElementById("editAnakKe").value = siswa.anakKe || "";
document.getElementById("editTahunMasuk").value = siswa.tahunMasuk || "";
document.getElementById("editAyah").value = siswa.namaAyah || "";
document.getElementById("editIbu").value = siswa.namaIbu || "";
document.getElementById("editKerjaAyah").value = siswa.pekerjaanAyah || "";
document.getElementById("editKerjaIbu").value = siswa.pekerjaanIbu || "";
document.getElementById("editDesa").value = siswa.desa || "";
document.getElementById("editKecamatan").value = siswa.kecamatan || "";
document.getElementById("editKabupaten").value = siswa.kabupaten || "";
document.getElementById("editProvinsi").value = siswa.provinsi || "";
document.getElementById("editKodePos").value = siswa.kodePos || "";

}

/* =========================
UPDATE IDENTITAS
========================= */

async function updateIdentitasSiswa() {

try {

    const file =
        document.getElementById(
            "editFoto"
        )?.files?.[0];

    let foto = "";

    if (file) {

        foto =
            await new Promise(resolve => {

                const reader =
                    new FileReader();

                reader.onload =
                    e => resolve(
                        e.target.result
                    );

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

    const result =
        await api(
            "updateIdentitasSiswa",
            data
        );

    alert(
        result.message ||
        "Update berhasil"
    );

} catch (err) {

    console.error(err);
    alert(err.message);

}

}

/* =========================
INIT
========================= */

document.addEventListener(
"DOMContentLoaded",
() => {
    loadKelasTabungan();
    loadKelasCabutan();

    document
        .getElementById("tabKelas")
        ?.addEventListener(
            "change",
            loadNamaTabungan
        );

    document
        .getElementById("cabKelas")
        ?.addEventListener(
            "change",
            loadNamaCabutan
        );

}
);
