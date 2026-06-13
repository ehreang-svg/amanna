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

        console.log("RAW KWITANSI DATA:", d);
        console.log("KEYS:", Object.keys(d));

        // =========================
        // HELPER AMAN
        // =========================
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

        // =========================
        // IDENTITAS
        // =========================
        const nama = d.NAMA || "";
        const kelas = d.KELAS || "";

        // =========================
        // NILAI UTAMA
        // =========================
        const jumlahTabungan = Number(d.JUMLAHTABUNGAN || 0);

        // =========================
        // CABUTAN (SEMUA ITEM)
        // =========================
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

        // =========================
        // JUMLAH CABUTAN
        // =========================
        const jumlahCabutan =
            seragamOR +
            seragamSekolah +
            imtihan +
            bsekolah +
            bon +
            adm +
            kitab +
            wisuda +
            raport +
            infaq +
            renang;

        const sisaTabungan = jumlahTabungan - jumlahCabutan;

        // =========================
        // PDF
        // =========================
        const { jsPDF } = window.jspdf;

        const doc = new jsPDF({
            orientation: "portrait",
            unit: "cm",
            format: "a5"
        });

        let y = 1;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("KWITANSI TABUNGAN SISWA", 7.4, y, { align: "center" });

        y += 1;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);

        doc.text("Nama", 1, y);
        doc.text(": " + nama, 4, y);

        y += 0.6;

        doc.text("Kelas", 1, y);
        doc.text(": " + kelas, 4, y);

        y += 0.8;

        const rows = [
            ["Jumlah Tabungan", jumlahTabungan],
            ["Seragam OR", seragamOR],
            ["Seragam Sekolah", seragamSekolah],
            ["Imtihan", imtihan],
            ["B. Sekolah", bsekolah],
            ["BON", bon],
            ["ADM", adm],
            ["Kitab", kitab],
            ["Wisuda", wisuda],
            ["Raport", raport],
            ["Infaq", infaq],
            ["Renang", renang],
            ["Jumlah Cabutan", jumlahCabutan],
            ["Sisa Tabungan", sisaTabungan]
        ];

        rows.forEach(r => {
            doc.text(r[0], 1, y);
            doc.text(": Rp " + Number(r[1]).toLocaleString("id-ID"), 7, y);
            y += 0.55;
        });

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
