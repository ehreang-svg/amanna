async function loadKelasIjazah() {

    try {

        const res = await fetch(TABUNGAN_API + "?action=getDataSiswa");
        const json = await res.json();

        if (!json.status) {
            alert(json.message);
            return;
        }

        dataIjazah = json.data;

        const kelasUnik = [...new Set(dataIjazah.map(s => s.kelas))]
            .filter(k => k)
            .sort();

        const kelas = document.getElementById("kelasIjazah");

        kelas.innerHTML = "<option value=''>Pilih Kelas</option>";

        kelasUnik.forEach(k => {
            kelas.innerHTML += `<option value="${k}">${k}</option>`;
        });

        document.getElementById("namaIjazah").innerHTML =
            "<option value=''>Pilih Nama</option>";

    } catch (err) {
        console.error(err);
        alert("Gagal memuat data siswa.");
    }

}

function loadNamaIjazah(){

    const kelas=document.getElementById("kelasIjazah").value;

    const nama=document.getElementById("namaIjazah");

    nama.innerHTML="<option value=''>Pilih Nama</option>";

    dataIjazah

    .filter(x=>x.kelas==kelas)

    .sort((a,b)=>a.nama.localeCompare(b.nama))

    .forEach(s=>{

        nama.innerHTML+=`
        <option value="${s.nik}">
            ${s.nama}
        </option>`;

    });

}

async function cetakIjazah() {

    const nik = document.getElementById("namaIjazah").value;

    if (!nik) {
        alert("Silakan pilih siswa terlebih dahulu.");
        return;
    }

    // Loading sederhana
    const tombol = event.target;
    const teksAsli = tombol.innerHTML;

    tombol.disabled = true;
    tombol.innerHTML = "⏳ Sedang membuat PDF...";

    try {

       const url =
  TABUNGAN_API +
  "?action=cetakIjazah" +
  "&nik=" + encodeURIComponent(nik);

const res = await fetch(url);

        const json = await res.json();

        tombol.disabled = false;
        tombol.innerHTML = teksAsli;

        if (!json.status) {
            alert(json.message);
            return;
        }

        alert("✅ Ijazah berhasil dibuat.");

        window.open(json.url, "_blank");

    } catch (err) {

        tombol.disabled = false;
        tombol.innerHTML = teksAsli;

        alert("Terjadi kesalahan.\n\n" + err);

    }

}
