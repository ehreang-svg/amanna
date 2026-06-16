/* ================= TABUNGAN SISWA ================= */

async function loadKelasTabungan(){
    try{
        const res = await fetch(TABUNGAN_API + "?action=getDataSiswa"); const data = await res.json();
        if(!data.status){ alert("Gagal memuat data siswa"); return; }
        dataSiswaTabungan = data.data;
        const kelasUnik = [...new Set(data.data.map(x=>x.kelas))].sort();
        tabKelas.innerHTML = `<option value="">Pilih Kelas</option>`;
        kelasUnik.forEach(k=>{ tabKelas.innerHTML += `<option value="${k}">${k}</option>`; });
        tabNama.innerHTML = `<option value="">Pilih Nama Siswa</option>`;
    }catch(err){ console.log(err); }
}

function loadNamaTabungan(){
    const siswa = dataSiswaTabungan.filter(x => x.kelas == tabKelas.value);
    tabNama.innerHTML = `<option value="">Pilih Nama Siswa</option>`;
    siswa.forEach(s=>{ tabNama.innerHTML += `<option value="${s.nama}">${s.nama}</option>`; });
}


async function simpanTabungan() {
    console.log(tabNama.value);
    console.log(tabKelas.value);
    console.log(tabNominal.value);

    const payload = {
        action: "inputTabungan",
        nama: tabNama.value,
        kelas: tabKelas.value,
        nominal: tabNominal.value
    };

    console.log(payload);

    const res = await fetch(TABUNGAN_API, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(payload)
    });

    console.log(await res.text());
}

async function loadFilterKelasTabungan(){
    try{
        const res = await fetch(TABUNGAN_API + "?action=getDataSiswa"); const data = await res.json(); if(!data.status) return;
        dataSiswaTabungan = data.data; const kelasUnik = [...new Set(data.data.map(x=>x.kelas))].sort();
        filterKelasTabungan.innerHTML = '<option value="">Semua Kelas</option>';
        kelasUnik.forEach(k=>{ filterKelasTabungan.innerHTML += `<option value="${k}">${k}</option>`; });
        const user = JSON.parse(localStorage.getItem("user"));
        if((user.status || "").toLowerCase() === "siswa"){
            filterKelasTabungan.innerHTML = `<option value="${user.kelas}">${user.kelas}</option>`; filterKelasTabungan.disabled = true;
            document.getElementById("filterNamaTabungan").innerHTML = `<option value="${user.nama}">${user.nama}</option>`; document.getElementById("filterNamaTabungan").disabled = true;
            loadRekapTabungan(); return;
        }
        loadFilterNamaTabungan(); loadRekapTabungan();
    }catch(err){ console.log(err); }
}

function loadFilterNamaTabungan(){
    const kelas = document.getElementById("filterKelasTabungan").value; const selectNama = document.getElementById("filterNamaTabungan");
    selectNama.innerHTML = '<option value="">Semua Siswa</option>';
    let siswa = [...dataSiswaTabungan]; if(kelas){ siswa = siswa.filter(s => String(s.kelas).trim() === String(kelas).trim()); }
    const namaUnik = [...new Set(siswa.map(s => s.nama))].sort();
    namaUnik.forEach(nama=>{ selectNama.innerHTML += `<option value="${nama}">${nama}</option>`; });
}

async function loadRekapTabungan(){
    try{
        const user = JSON.parse(localStorage.getItem("user"));
        let nama = document.getElementById("filterNamaTabungan").value; let kelas = document.getElementById("filterKelasTabungan").value;
        const bulan = document.getElementById("filterBulanTabungan").value; const tanggal = document.getElementById("filterTanggalTabungan").value;
        if((user.status || "").toLowerCase() === "siswa"){ nama = user.nama; kelas = user.kelas; }
        const res = await fetch(`${TABUNGAN_API}?action=getRekapTabungan&nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}&bulan=${encodeURIComponent(bulan)}&tanggal=${encodeURIComponent(tanggal)}`);
        const data = await res.json(); if(!data.status){ alert(data.message); return; }
        let total = 0; let html = `<table><tr><th>Tanggal</th><th>Nama</th><th>Kelas</th><th>Nominal</th></tr>`;
        data.data.forEach(r=>{ total += Number(r.nominal); html += `<tr><td>${r.tanggal}</td><td>${r.nama}</td><td>${r.kelas}</td><td>Rp ${Number(r.nominal).toLocaleString("id-ID")}</td></tr>`; });
        html += `<tr><th colspan="3">TOTAL</th><th>Rp ${total.toLocaleString("id-ID")}</th></tr></table>`;
        rekapTabunganBox.innerHTML = html;
    }catch(err){ alert(err); }
}

/* ===================== CABUTAN ===================== */

let dataSiswaCabutan = [];

/* ===================== LOAD KELAS ===================== */

async function loadKelasCabutan() {

    try {

        const res = await fetch(
            TABUNGAN_API + "?action=getDataSiswa"
        );

        const result = await res.json();

        if (!result.status) {
            alert("Gagal memuat data siswa");
            return;
        }

        dataSiswaCabutan = result.data;

        const cabKelas = document.getElementById("cabKelas");
        const cabNama = document.getElementById("cabNama");

        cabKelas.innerHTML =
            `<option value="">Pilih Kelas</option>`;

        const kelasUnik = [
            ...new Set(
                dataSiswaCabutan.map(x => x.kelas)
            )
        ].sort();

        kelasUnik.forEach(kelas => {

            cabKelas.innerHTML +=
                `<option value="${kelas}">
                    ${kelas}
                </option>`;

        });

        cabNama.innerHTML =
            `<option value="">Pilih Nama Siswa</option>`;

    } catch (err) {

        console.log(err);
        alert(err);

    }

}

/* ===================== LOAD NAMA ===================== */

function loadNamaCabutan() {

    const cabKelas =
        document.getElementById("cabKelas");

    const cabNama =
        document.getElementById("cabNama");

    const kelas = cabKelas.value;

    cabNama.innerHTML =
        `<option value="">Pilih Nama Siswa</option>`;

    const daftar = dataSiswaCabutan.filter(
        x => String(x.kelas).trim() === String(kelas).trim()
    );

    daftar.forEach(siswa => {

        cabNama.innerHTML +=
            `<option value="${siswa.nama}">
                ${siswa.nama}
            </option>`;

    });

}

/* ===================== SIMPAN CABUTAN ===================== */

async function simpanCabutan() {

    try {

        const payload = {

            action: "inputCabutan",

            nama:
                document.getElementById("cabNama").value,

            kelas:
                document.getElementById("cabKelas").value,

            jenis:
                document.getElementById("cabJenis").value,

            nominal:
                Number(
                    document.getElementById("cabNominal").value || 0
                )

        };

        if (!payload.nama) {
            alert("Pilih nama siswa.");
            return;
        }

        const res = await fetch(
            TABUNGAN_API,
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },
                body: JSON.stringify(payload)
            }
        );

        const hasil = await res.json();

        alert(hasil.message);

        if (hasil.status) {
            document.getElementById("cabNominal").value = 0;
        }

    } catch (err) {

        console.log(err);
        alert(err);

    }

}
async function cetakKwitansi() {
    try {

        const namaFilter = document.getElementById("filterNamaTabungan").value;
        const kelasFilter = document.getElementById("filterKelasTabungan").value;

        if (!namaFilter || !kelasFilter) {
            alert("Pilih siswa terlebih dahulu");
            return;
        }

        const res = await fetch(
            TABUNGAN_API +
            "?action=getKwitansi" +
            "&nama=" + encodeURIComponent(namaFilter) +
            "&kelas=" + encodeURIComponent(kelasFilter)
        );

        const json = await res.json();

        if (!json.status) {
            alert(json.message);
            return;
        }

        const d = json.data;

        const cleanNumber = (v) => {
            if (v === null || v === undefined || v === "") return 0;
            return Number(String(v).replace(/\./g, "").replace(/,/g, "")) || 0;
        };

        const get = (...keys) => {
            for (let k of keys) {
                if (d[k] !== undefined && d[k] !== null && d[k] !== "") {
                    return cleanNumber(d[k]);
                }
            }
            return 0;
        };

        const nama = d.NAMA || "";
        const kelas = d.KELAS || "";

        const jumlahTabungan = Number(d.JUMLAHTABUNGAN || 0);

        const seragamOR = get("SERAGAMOR", "SERAGAM OR");
        const seragamSekolah = get("SERAGAMSEKOLAH", "SERAGAM SEKOLAH");
        const imtihan = get("IMTIHAN");
        const bsekolah = get("BSEKOLAH", "B SEKOLAH");

        const bon = get("BON");
        const adm = get("ADM");
        const kitab = get("KITAB");
        const wisuda = get("WISUDA");
        const raport = get("RAPORT");
        const infaq = get("INFAQ");
        const renang = get("RENANG");

        const jumlahCabutan =
            seragamOR + seragamSekolah + imtihan + bsekolah +
            bon + adm + kitab + wisuda + raport + infaq + renang;

        const sisaTabungan = jumlahTabungan - jumlahCabutan;

        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a6"
        });

        const pageW = doc.internal.pageSize.getWidth();

        let y = 10;

        // ================= HEADER BOX =================
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(5, 5, pageW - 10, 18);

        doc.setFont("courier", "bold");
        doc.setFontSize(12);
        doc.text("KWITANSI TABUNGAN SISWA", pageW / 2, 12, { align: "center" });

        doc.setFontSize(8);
        doc.setFont("courier", "bold");
        doc.text("YAYASAN AMANNA", pageW / 2, 17, { align: "center" });

        y = 28;

        // ================= IDENTITAS =================
        doc.setFontSize(9);
        doc.setFont("courier", "normal");

        doc.text("Nama", 6, y);
        doc.text(": " + nama, 22, y);

        y += 5;

        doc.text("Kelas", 6, y);
        doc.text(": " + kelas, 22, y);

        y += 6;

        // garis
        doc.line(5, y, pageW - 5, y);
        y += 6;

        // ================= TABLE =================
        const drawRow = (label, value, bold = false) => {
            doc.setFont("courier", bold ? "bold" : "normal");
            doc.text(label, 6, y);

            doc.text(
                ": Rp " + Number(value).toLocaleString("id-ID"),
                pageW - 6,
                y,
                { align: "right" }
            );
            y += 5;
        };

        drawRow("Jumlah Tabungan", jumlahTabungan);

        drawRow("Seragam Polisi + OR", seragamOR);
        drawRow("Seragam Sekolah", seragamSekolah);
        drawRow("Imtihan", imtihan);
        drawRow("B. Sekolah", bsekolah);
        drawRow("BON", bon);
        drawRow("ADM", adm);
        drawRow("Kitab", kitab);
        drawRow("Wisuda", wisuda);
        drawRow("Raport", raport);
        drawRow("Infaq", infaq);
        drawRow("Renang", renang);

        doc.line(5, y, pageW - 5, y);
        y += 6;

        drawRow("Jumlah Cabutan", jumlahCabutan, true);
        drawRow("Sisa Tabungan", sisaTabungan, true);

        // ================= FOOTER =================
        y += 5;
        doc.setFontSize(7);
        doc.text(
            "Dicetak otomatis oleh sistem Yayasan Amanna",
            pageW / 2,
            doc.internal.pageSize.getHeight() - 6,
            { align: "center" }
        );

        doc.save("Kwitansi_" + nama.replace(/\s+/g, "_") + ".pdf");

    } catch (err) {
        console.log(err);
        alert(err);
    }
}
async function exportBukuTabungan() {
    const { jsPDF } = window.jspdf; const doc = new jsPDF({ orientation: "landscape", unit: "cm", format: [10, 15] });
    const nama = document.getElementById("filterNamaTabungan").value || "-"; const kelas = document.getElementById("filterKelasTabungan").value || "-";
    const bulanValue = document.getElementById("filterBulanTabungan").value || "";
    const namaBulan = {"01":"Januari","02":"Februari","03":"Maret","04":"April","05":"Mei","06":"Juni","07":"Juli","08":"Agustus","09":"September","10":"Oktober","11":"November","12":"Desember"};
    const bulanText = namaBulan[bulanValue] || "Semua Bulan";

    const res = await fetch(`${TABUNGAN_API}?action=getRekapTabungan&nama=${encodeURIComponent(nama)}&kelas=${encodeURIComponent(kelas)}&bulan=${encodeURIComponent(bulanValue)}`);
    const data = await res.json(); if (!data.status) { alert("Data tidak ditemukan"); return; }

    const transaksi = {}; let maxHari = 0;
    data.data.forEach(r => {
        const tgl = String(r.tanggal).includes("/") ? parseInt(r.tanggal.split("/")[0]) : new Date(r.tanggal).getDate();
        transaksi[tgl] = (transaksi[tgl] || 0) + Number(r.nominal || 0); if (tgl > maxHari) maxHari = tgl;
    });

    const saldoPerHari = {}; let saldo = 0;
    for (let i = 1; i <= 31; i++) { if (transaksi[i]) { saldo += transaksi[i]; saldoPerHari[i] = saldo; } else { saldoPerHari[i] = null; } }

    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("YAYASAN AMANNA", 7.5, 0.8, { align: "center" });
    doc.setFontSize(8); doc.text("BUKU TABUNGAN SISWA", 7.5, 1.2, { align: "center" });
    doc.setFont("helvetica", "normal"); doc.text(`Nama  : ${nama}`, 0.6, 1.8); doc.text(`Kelas : ${kelas}`, 0.6, 2.2); doc.text(`Bulan : ${bulanText}`, 0.6, 2.6);
    doc.setDrawColor(210); doc.setLineWidth(0.004); const yStart = 3.0; doc.rect(0.5, yStart, 14, 6.6); const mid = 7.5; doc.line(mid, yStart, mid, yStart + 6.6);
    doc.line(1.3, yStart, 1.3, yStart + 6.6); doc.line(3.2, yStart, 3.2, yStart + 6.6); doc.line(5.8, yStart, 5.8, yStart + 6.6);
    doc.line(8.8, yStart, 8.8, yStart + 6.6); doc.line(10.7, yStart, 10.7, yStart + 6.6); doc.line(13.3, yStart, 13.3, yStart + 6.6);
    doc.setFontSize(7); doc.setFont("helvetica", "bold");
    doc.text("TGL", 0.7, yStart + 0.4); doc.text("SETOR", 2.0, yStart + 0.4); doc.text("SALDO", 4.5, yStart + 0.4);
    doc.text("TGL", 8.2, yStart + 0.4); doc.text("SETOR", 9.5, yStart + 0.4); doc.text("SALDO", 12.0, yStart + 0.4);
    doc.line(0.5, yStart + 0.6, 14.5, yStart + 0.6); doc.setFont("helvetica", "normal");

    let yL = yStart + 1.0; let yR = yStart + 1.0; const rightAlign = (text, x, y) => { doc.text(text, x, y, { align: "right" }); };
    for (let i = 1; i <= 31; i++) {
        const nominal = transaksi[i] ? "Rp " + transaksi[i].toLocaleString("id-ID") : "";
        const saldoTxt = saldoPerHari[i] !== null ? "Rp " + saldoPerHari[i].toLocaleString("id-ID") : "";
        if (i <= 16) { doc.text(String(i), 0.7, yL); rightAlign(nominal, 3.1, yL); rightAlign(saldoTxt, 5.7, yL); yL += 0.32; }
        else { doc.text(String(i), 8.2, yR); rightAlign(nominal, 10.6, yR); rightAlign(saldoTxt, 13.2, yR); yR += 0.32; }
    }
    const total = Object.values(transaksi).reduce((a, b) => a + b, 0); doc.rect(0.5, 9.0, 14, 0.7); doc.setFont("helvetica", "bold");
    doc.text("TOTAL SALDO : Rp " + total.toLocaleString("id-ID"), 0.7, 9.45); doc.setFont("helvetica", "normal"); doc.setFontSize(7);
    doc.text("Petugas", 2.2, 10.2); doc.text("Orang Tua", 10.7, 10.2); doc.line(1.5, 11.0, 4.5, 11.0); doc.line(9.8, 11.0, 13.0, 11.0); doc.save(`Buku_Tabungan_${nama}.pdf`);
}

async function simpanIdentitasSiswa() {
    try {

        const fotoFile = document.getElementById("iFoto").files[0];
        let fotoBase64 = "";

        if (fotoFile) {
            fotoBase64 = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(fotoFile);
            });
        }

        const data = {
            namaPanggilan: document.getElementById("iNamaPanggilan").value,
            nama: document.getElementById("iNama").value,
            kelas: document.getElementById("iKelas").value,
            nik: document.getElementById("iNik").value,
            nisn: document.getElementById("iNisn").value,
            jenisKelamin: document.getElementById("iGender").value,
            ttl: document.getElementById("iTTL").value,
            agama: document.getElementById("iAgama").value,
            anakKe: document.getElementById("iAnakKe").value,
            tahunMasuk: document.getElementById("iTahunMasuk").value,
            namaAyah: document.getElementById("iAyah").value,
            namaIbu: document.getElementById("iIbu").value,
            pekerjaanAyah: document.getElementById("iKerjaAyah").value,
            pekerjaanIbu: document.getElementById("iKerjaIbu").value,
            desa: document.getElementById("iDesa").value,
            kecamatan: document.getElementById("iKecamatan").value,
            kabupaten: document.getElementById("iKabupaten").value,
            provinsi: document.getElementById("iProvinsi").value,
            kodePos: document.getElementById("iKodePos").value,
            foto: fotoBase64
        };

        const res = await fetch(TABUNGAN_API, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "simpanIdentitasSiswa",
                data: data
            })
        });

        const hasil = await res.text();
        alert(hasil);

        // Reset form setelah berhasil
        [
            "iNamaPanggilan",
            "iNama",
            "iKelas",
            "iNik",
            "iNisn",
            "iGender",
            "iTTL",
            "iAgama",
            "iAnakKe",
            "iTahunMasuk",
            "iAyah",
            "iIbu",
            "iKerjaAyah",
            "iKerjaIbu",
            "iDesa",
            "iKecamatan",
            "iKabupaten",
            "iProvinsi",
            "iKodePos"
        ].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.tagName === "SELECT") {
                    el.selectedIndex = 0;
                } else {
                    el.value = "";
                }
            }
        });

        // Reset input file
        const fotoInput = document.getElementById("iFoto");
        if (fotoInput) {
            fotoInput.value = "";
        }

    } catch (err) {
        console.error(err);
        alert("Terjadi kesalahan: " + err);
    }
}

async function exportIdentitasSiswa(nama, kelas) {

    try {

        const res = await fetch(

            TABUNGAN_API +

            "?action=exportIdentitasSiswa" +

            "&nama=" + encodeURIComponent(nama) +

            "&kelas=" + encodeURIComponent(kelas)

        );

        const data = await res.json();

        if (!data.status) {

            alert(data.message);

            return;

        }

        window.open(data.pdfUrl, "_blank");

    } catch (err) {

        alert(err);

    }

}


async function exportIdentitasDipilih() {

    const nama =
        document.getElementById("filterNamaIdentitas").value;

    const kelas =
        document.getElementById("filterKelasIdentitas").value;

    if (!nama || !kelas) {

        alert("Pilih kelas dan nama siswa terlebih dahulu.");

        return;

    }

    await exportIdentitasSiswa(nama, kelas);

}

async function loadDataIdentitas() {
    const res = await fetch(TABUNGAN_API + "?action=getDataSiswa");
    const result = await res.json();

    dataSiswaIdentitas = result.data || [];

    const kelasSelect = document.getElementById("filterKelasIdentitas");
    const namaSelect = document.getElementById("filterNamaIdentitas");

    kelasSelect.innerHTML = `<option value="">Pilih Kelas</option>`;
    namaSelect.innerHTML = `<option value="">Pilih Nama</option>`;

    const kelasUnik = [...new Set(dataSiswaIdentitas.map(x => x.kelas).filter(Boolean))];

    kelasUnik.forEach(k => {
        kelasSelect.innerHTML += `<option value="${k}">${k}</option>`;
    });
}

function loadNamaIdentitas() {
    const kelas = document.getElementById("filterKelasIdentitas").value;
    const namaSelect = document.getElementById("filterNamaIdentitas");

    namaSelect.innerHTML = `<option value="">Pilih Nama</option>`;

    const hasil = dataSiswaIdentitas.filter(s =>
        String(s.kelas).trim() === String(kelas).trim()
    );

    hasil.forEach(s => {
        namaSelect.innerHTML += `<option value="${s.nama}">${s.nama}</option>`;
    });

    console.log("FILTER RESULT:", hasil);
}

document.addEventListener("DOMContentLoaded", () => {
    loadDataIdentitas();

    document
        .getElementById("filterKelasIdentitas")
        .addEventListener("change", loadNamaIdentitas);
});

document.addEventListener("DOMContentLoaded", () => {

    loadDataIdentitas();

    setTimeout(() => {
        const el = document.getElementById("filterKelasIdentitas");

        if (!el) {
            console.error("filterKelasIdentitas tidak ditemukan");
            return;
        }

        el.addEventListener("change", () => {
            console.log("CHANGE OK");
            loadNamaIdentitas();
        });

    }, 500);
});

async function loadKartuSiswa(nama, kelas) {

  const res = await fetch(
    TABUNGAN_API +
    "?action=getKartuSiswa" +
    "&nama=" + encodeURIComponent(nama) +
    "&kelas=" + encodeURIComponent(kelas)
  );

  const json = await res.json();

  if (!json.status) {
    alert(json.message);
    return;
  }

  const d = json.data;

  document.getElementById("out-nama").textContent = ": " + d.nama;
  document.getElementById("out-nik").textContent = ": " + d.nik;
  document.getElementById("out-ttl").textContent = ": " + d.ttl;
  document.getElementById("out-ayah").textContent = ": " + d.namaAyah;

  if (d.foto) {
    const foto = document.getElementById("card-photo");
    foto.style.backgroundImage = `url(${d.foto})`;
    foto.textContent = "";
  }
}

async function exportKartuSiswa() {

  const nama = document.getElementById("filterNamaIdentitas").value;
  const kelas = document.getElementById("filterKelasIdentitas").value;

  if (!nama || !kelas) {
    alert("Pilih kelas dan nama siswa terlebih dahulu.");
    return;
  }

  const res = await fetch(
    TABUNGAN_API +
    "?action=exportKartuSiswa" +
    "&nama=" + encodeURIComponent(nama) +
    "&kelas=" + encodeURIComponent(kelas)
  );

  const json = await res.json();

  if (!json.status) {
    alert(json.message);
    return;
  }

  window.open(json.pdfUrl, "_blank");
}

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

        const data = {};

        // 🔥 ambil semua input edit otomatis
        document.querySelectorAll("#editIdentitasPage input, #editIdentitasPage select").forEach(el => {
            if (!el.id) return;
            if (el.type === "file") return;

            const key = el.id.replace("edit", "");
            data[key.charAt(0).toLowerCase() + key.slice(1)] = el.value;
        });

        data.foto = foto;

        const res = await fetch(TABUNGAN_API, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "updateIdentitasSiswa",
                data: data
            })
        });

        const hasil = await res.json();
        alert(hasil.message);

    } catch (err) {
        console.error(err);
        alert("Gagal update");
    }
}

async function loadKelasEditIdentitas() {
    try {
        const res = await fetch(TABUNGAN_API + "?action=getDataSiswa");
        const result = await res.json();

        if (!result.status) {
            alert("Gagal memuat data siswa");
            return;
        }

        dataSiswaIdentitas = result.data || [];

        const kelasSelect = document.getElementById("editFilterKelas");
        const namaSelect = document.getElementById("editFilterNama");

        kelasSelect.innerHTML = `<option value="">Pilih Kelas</option>`;
        namaSelect.innerHTML = `<option value="">Pilih Nama</option>`;

        const kelasUnik = [...new Set(
            dataSiswaIdentitas
                .map(x => x.kelas)
                .filter(Boolean)
        )].sort();

        kelasUnik.forEach(k => {
            kelasSelect.innerHTML += `<option value="${k}">${k}</option>`;
        });

    } catch (err) {
        console.error(err);
        alert("Error load kelas identitas");
    }
}

function loadNamaEditIdentitas() {
    const kelas = document.getElementById("editFilterKelas").value;
    const namaSelect = document.getElementById("editFilterNama");

    namaSelect.innerHTML = `<option value="">Pilih Nama</option>`;

    if (!kelas) return;

    const hasil = dataSiswaIdentitas.filter(s =>
        String(s.kelas).trim() === String(kelas).trim()
    );

    hasil.forEach(s => {
        namaSelect.innerHTML += `
            <option value="${s.nama}">
                ${s.nama}
            </option>`;
    });

    console.log("NAMA FILTER:", hasil);
}

async function loadEditIdentitas() {
    try {

        const nama = document.getElementById("editFilterNama").value;
        const kelas = document.getElementById("editFilterKelas").value;

        if (!nama || !kelas) {
            alert("Pilih kelas dan nama dulu");
            return;
        }

        const res = await fetch(TABUNGAN_API + "?action=getDataSiswa");
        const result = await res.json();

        if (!result.status) {
            alert("Gagal ambil data");
            return;
        }

        const siswa = result.data.find(s =>
            String(s.nama).trim() === String(nama).trim() &&
            String(s.kelas).trim() === String(kelas).trim()
        );

        if (!siswa) {
            alert("Data tidak ditemukan");
            return;
        }

        // =========================
        // AMBIL DATA DENGAN FALLBACK KEY
        // =========================
        const get = (obj, ...keys) => {
            for (let k of keys) {
                if (obj[k] !== undefined && obj[k] !== null) return obj[k];
            }
            return "";
        };

        document.getElementById("editNamaPanggilan").value =
            get(siswa, "namaPanggilan", "nama_panggilan");

        document.getElementById("editNama").value =
            get(siswa, "nama", "nama_lengkap");

        document.getElementById("editKelas").value =
            get(siswa, "kelas");

        document.getElementById("editNik").value =
            get(siswa, "nik");

        document.getElementById("editNisn").value =
            get(siswa, "nisn");

        document.getElementById("editGender").value =
            get(siswa, "jenisKelamin", "jenis_kelamin");

        document.getElementById("editTTL").value =
            get(siswa, "ttl", "tempat_tanggal_lahir");

        document.getElementById("editAgama").value =
            get(siswa, "agama");

        document.getElementById("editAnakKe").value =
            get(siswa, "anakKe", "anak_ke");

        document.getElementById("editTahunMasuk").value =
            get(siswa, "tahunMasuk", "tahun_masuk");

        document.getElementById("editAyah").value =
            get(siswa, "namaAyah", "nama_ayah");

        document.getElementById("editIbu").value =
            get(siswa, "namaIbu", "nama_ibu");

        document.getElementById("editKerjaAyah").value =
            get(siswa, "pekerjaanAyah", "pekerjaan_ayah");

        document.getElementById("editKerjaIbu").value =
            get(siswa, "pekerjaanIbu", "pekerjaan_ibu");

        document.getElementById("editDesa").value =
            get(siswa, "desa");

        document.getElementById("editKecamatan").value =
            get(siswa, "kecamatan");

        document.getElementById("editKabupaten").value =
            get(siswa, "kabupaten");

        document.getElementById("editProvinsi").value =
            get(siswa, "provinsi");

        document.getElementById("editKodePos").value =
            get(siswa, "kodePos");

        console.log("FULL DATA:", siswa);

    } catch (err) {
        console.error(err);
        alert("Error load data");
    }
}
