/* ================= RAPORT SISWA ================= */

async function loadKelasRaport(){

    try{

        const res = await fetch(
            TABUNGAN_API + "?action=getDataSiswa"
        );

        const result = await res.json();

        console.log("DATA SISWA:", result);

        if(!result.status){

            alert("Gagal memuat data siswa");
            return;

        }

        dataSiswaRaport = result.data || [];

        const kelasUnik = [
            ...new Set(
                dataSiswaRaport.map(x => x.kelas)
            )
        ].sort();

        rKelas.innerHTML =
        '<option value="">Pilih Kelas</option>';

        kelasUnik.forEach(k=>{

            rKelas.innerHTML += `
                <option value="${k}">
                    ${k}
                </option>
            `;

        });

    }catch(err){

        console.log(err);

    }

}

function loadNamaRaport(){

    const kelas = rKelas.value;

    const siswa = dataSiswaRaport.filter(
        x => String(x.kelas).trim() === String(kelas).trim()
    );

    rNama.innerHTML =
    '<option value="">Pilih Nama Siswa</option>';

    siswa.forEach(s=>{

        rNama.innerHTML += `
            <option value="${s.nama}">
                ${s.nama}
            </option>
        `;

    });

    rNik.value = "";

}

function isiNikRaport(){

    const nama = String(rNama.value).trim();
    const kelas = String(rKelas.value).trim();

    const siswa = dataSiswaRaport.find(x =>

        String(x.nama).trim() === nama &&
        String(x.kelas).trim() === kelas

    );

    console.log("Cari:", nama, kelas);
    console.log("Ketemu:", siswa);

    if(!siswa){

        rNik.value = "";
        return;

    }

    rNik.value = siswa.nik
        ? String(siswa.nik)
        : "";

}
    
    /* ================= KOGNITIF SISWA ================= */


async function loadKognitifSiswa(){
    try{

        const res = await fetch(
            TABUNGAN_API + "?action=getDataSiswa"
        );

        const data = await res.json();

        if(!data.status){
            alert("Gagal memuat data siswa");
            return;
        }

        dataSiswaKognitif = data.data;

        const kelasUnik =
        [...new Set(
            data.data.map(x => x.kelas)
        )].sort();

        kKelas.innerHTML =
        '<option value="">Pilih Kelas</option>';

        kelasUnik.forEach(k=>{
            kKelas.innerHTML +=
            `<option value="${k}">${k}</option>`;
        });

    }catch(err){
        console.log(err);
    }
}

function loadNamaKognitif(){

    const siswa =
    dataSiswaKognitif.filter(
        x => x.kelas == kKelas.value
    );

    kNama.innerHTML =
    '<option value="">Pilih Nama Siswa</option>';

    siswa.forEach(s=>{
        kNama.innerHTML +=
        `<option value="${s.nama}">
            ${s.nama}
        </option>`;
    });
}



/* ================= PROSES GENERATE & EXPORT RAPORT TEMPLATE BARU ================= */
async function imageToBase64(file){
    return new Promise(resolve=>{
        const reader=new FileReader(); reader.onload=e=>resolve(e.target.result); reader.readAsDataURL(file);
    });
}

async function previewRaport(){
    nav("previewRaportPage");
    raportContainer.innerHTML = `<h3 style='text-align:center; padding:50px; color:#000;'>Memproses data & gambar, mohon tunggu...</h3>`;

    const agama = fotoAgama.files[0] ? await imageToBase64(fotoAgama.files[0]) : "";
    const jati = fotoJati.files[0] ? await imageToBase64(fotoJati.files[0]) : "";
    const literasi = fotoLiterasi.files[0] ? await imageToBase64(fotoLiterasi.files[0]) : "";
    const p5 = fotoP5.files[0] ? await imageToBase64(fotoP5.files[0]) : "";

    // Render HTML berdasarkan stuktur template baku baru
    raportContainer.innerHTML = `
    <div class="container">
        <div class="header">
            <img src="https://iili.io/CKZXD4j.png" alt="Logo KB PAUD Nurul Iman" class="logo">
            <div class="school">
                <span style="font-weight: bold; font-size: 20px; display: block; margin-bottom: 2px;">YAYASAN NURUL IMAN</span>
                <span style="font-weight: bold; font-size: 18px; display: block; margin-bottom: 2px;">KELOMPOK BERMAIN PENDIDIKAN ANAK USIA DINI</span>
                <span style="font-weight: bold; font-size: 20px; display: block; margin-bottom: 5px;">KB PAUD NURUL IMAN</span>
                <span style="font-style: italic; font-size: 10px; display: block; line-height: 1.3;">Jl. Anggabaya Blok Penanggul Desa Jagapura Kulon Kecamatan Gegesik Kabupaten Cirebon Jawa Barat 45164</span>
            </div>
        </div>

        <div class="title-cetak">LAPORAN HASIL BELAJAR PESERTA DIDIK</div>

        <!-- Cari dan ganti tabel pertama dengan kode ini -->
        <table style="width: 100%;hight: 120px; border-collapse: collapse;">
            <tr>
                <td class="label" style="border: 1px solid #ffffff !important;font-weight:normal;">Nama</td>
                <td class="value" style="border: 1px solid #ffffff !important;text-transform: capitalize;">: ${rNama.value}</td>
                <td class="label" style="border: 1px solid #ffffff !important;font-weight:normal;">Kelas</td>
                <td class="value" style="border: 1px solid #ffffff !important;">: ${rKelas.value}</td>
            </tr>
            <tr>
                <td class="label" style="border: 1px solid #ffffff !important;font-weight:normal;">NIK</td>
                <td style="border: 1px solid #ffffff !important;">: ${rNik.value}</td>
                <td class="label" style="border: 1px solid #ffffff !important;font-weight:normal;">Fase</td>
                <td style="border: 1px solid #ffffff !important;">: ${rFase.value}</td>
            </tr>
            <tr>
                <td class="label" style="border: 1px solid #ffffff !important;font-weight:normal;">Tahun Ajaran</td>
                <td style="border: 1px solid #ffffff !important;">: ${rTahun.value}</td>
                <td class="label" style="border: 1px solid #ffffff !important;font-weight:normal;">Tinggi Badan</td>
                <td style="border: 1px solid #ffffff !important;">: ${rTinggi.value} cm (Normal)</td>
            </tr>
            <tr>
                <td class="label" style="border: 1px solid #ffffff !important;font-weight:normal;">Semester</td>
                <td style="border: 1px solid #ffffff !important;">: ${rSemester.value}</td>
                <td class="label" style="border: 1px solid #ffffff !important;font-weight:normal;">Berat Badan</td>
                <td style="border: 1px solid #ffffff !important;">: ${rBerat.value} Kg (Normal)</td>
            </tr>
        </table>

        <table>
            <tr><td class="section-title">Nilai Agama dan Budi Pekerti</td></tr>
            <tr><td class="text-area">
          Ananda ${rNama.value} menunjukkan perkembangan ${rAgama.value} dalam nilai agama dan budi pekerti, Dia
mulai memahami konsep dasar keagamaan sesuai dengan agama yang dianutnya. Ananda ${rNama.value}
juga terlihat rajin mengikuti kegiatan doa bersama di kelas dan mampu menirukan
gerakan ibadah sederhana. Dalam hal budi pekerti Ananda ${rNama.value} menunjukkan sikap sopan
kepada guru dan teman-temannya. Dia sering berbagi mainan dan membantu teman
yang kesulitan.</td></tr>

            <tr><td class="photo">${agama ? `<img src="${agama}">` : '-'}</td></tr>
        </table>

        <table>
            <tr><td class="section-title">Jati Diri</td></tr>
            <tr><td class="text-area">
           Perkembangan jati diri Ananda ${rNama.value} terlihat ${rJatiDiri.value} dalam mengenali diri sendiri.
Ananda ${rNama.value} dapat menyebutkan nama lengkap usia dan alamat rumahnya dengan benar, dia
juga mulai menunjukkan kemandirian dalam kegiatan sehari-hari di sekolah seperti
memakai sepatu sendiri dan membereskan mainan setelah bermain. Ananda ${rNama.value} memiliki
kepercayaan diri yang baik saat tampil di depan kelas untuk bercerita atau bernyanyi.</td></tr>

            <tr><td class="photo">${jati ? `<img src="${jati}">` : '-'}</td></tr>
        </table>

        <table>
            <tr><td class="section-title">Dasar-Dasar Literasi, Matematika, Sains, Rekayasa, Teknologi, dan Seni</td></tr>
            <tr><td class="text-area">
            Dalam aspek literasi dan STEAM, Ananda ${rNama.value} ${rLiterasi.value} terhadap buku-buku
cerita bergambar, dia mampu mengenali huruf-huruf dasar dan mulai membaca
kata-kata sederhana. Ananda ${rNama.value}senang melakukan eksperimen sederhana seperti
mencampur warna dan mengamati perubahan yang terjadi serta menunjukkan
ketertarikan pada gadget dan mampu mengoperasikan tablet edukatif dengan panduan.
Ananda ${rNama.value} suka bermain dengan balok-balok dan mampu membangun struktur sederhana.
Kreativitasnya terlihat dalam kegiatan menggambar dan mewarnai. Dalam matematika,
Ananda ${rNama.value} dapat menghitung benda-benda sampai angka 20 dan mengenali bentuk-bentuk
dasar geometri.</td></tr>

            <tr><td class="photo">${literasi ? `<img src="${literasi}">` : '-'}</td></tr>
        </table>

        <table>
            <tr><td class="section-title">Projek Penguatan Profil Pelajar Pancasila</td></tr>
            <tr><td class="text-area">
            Dalam proyek P5, Ananda ${rNama.value} menunjukkan
perkembangan yang ${rP5.value} sesuai dengan usianya, dia mulai memahami konsep Tuhan dan
menunjukkan rasa syukur. Ananda ${rNama.value} bisa berteman dengan anak-anak dari latar belakang
yang berbeda menunjukkan sikap berkebinekaan global. Dia sering membantu teman
dan guru dalam kegiatan kelas, mencerminkan semangat gotong royong. Kreativitasnya
terlihat dalam bermain dan berkesenian. Dia mulai mengajukan pertanyaan-pertanyaan
sederhana tentang lingkungan sekitarnya. menunjukkan kemampuan bernalar kritis.
Kemandiriannya terlihat dalam kegiatan sehari-hari di sekolah.</td></tr>
            
            <tr><td class="photo">${p5 ? `<img src="${p5}">` : '-'}</td></tr>
        </table>

        <table class="reflection">
            <tr><td class="section-title">Refleksi Orang Tua/Wali</td></tr>
            <tr><td>1. Apa yang sudah berkembang pada diri anak saya?<br><br></td></tr>
            <tr><td>2. Apa saja yang masih perlu dikembangkan pada diri anak saya?<br><br></td></tr>
            <tr><td>3. Langkah-langkah apa yang dapat saya lakukan untuk membantu anak saya mengembangkan hal tersebut?<br><br></td></tr>
        </table>

        <table>
            <tr><td class="section-title">Informasi Mengenai Perkembangan Anak</td></tr>
            <tr><td class="text-area">
            nanda ${rNama.value} adalah anak yang aktif dan memiliki rasa ingin tahu yang tinggi. Dia menunjukkan
perkembangan yang ${rPerkembangan.value} dalam berbagai aspek. Namun Ia terkadang masih perlu bimbingan dalam mengelola emosinya. terutama saat merasa frustrasi. Guru perlu
memberikan dukungan lebih dalam aspek ini dengan mengajarkan teknik-teknik
sederhana untuk mengenali dan mengekspresikan emosi secara positif.</td></tr>
        </table>

        <table>
            <tr><th colspan="3" class="section-title">Ketidakhadiran</th></tr>
            <tr>
                <th style="text-align:center; font-weight:bold;">Sakit</th>
                <th style="text-align:center; font-weight:bold;">Izin</th>
                <th style="text-align:center; font-weight:bold;">Tanpa Keterangan</th>
            </tr>
            <tr>
                <td style="text-align:center;">${rSakit.value || 0} Hari</td>
                <td style="text-align:center;">${rIzin.value || 0} Hari</td>
                <td style="text-align:center;">${rAlpa.value || 0} Hari</td>
            </tr>
        </table>

        <table class="signature">
            <tr>
                <td style="width:40%;">
                    Orang Tua/Wali
                    <div class="footer-sign"></div>
                    <strong>${rOrtu.value}</strong>
                </td>
                <td style="width:20%;"></td>
                <td style="width:40%;">Cirebon, 26 Juni 2026<br>
                    Guru Kelas
                    <div class="footer-sign"></div>
                    <strong>${rGuru.value}</strong>
                </td>
            </tr>
            <tr>
                <td colspan="3" style="text-align:center; padding-top:15px !important;">
                    Mengetahui,<br>
                    Kepala KB PAUD NURUL IMAN
                    <div class="footer-sign"></div>
                    <strong>IIS ANISA</strong>
                </td>
            </tr>
        </table>
    </div>`;
}

    function cekKolom(nilai,target){

    return nilai === target
    ? "✓"
    : "";

}

    function getPredikat(nilai){
    nilai = Number(nilai);  

    if(nilai >= 90) return "A";
    if(nilai >= 80) return "B";
    if(nilai >= 70) return "C";
    return "D";

}

    function getHuruf(nilai){
    nilai = Number(nilai);  

    if(nilai >= 90) return "Sangat baik";
    if(nilai >= 80) return "Baik";
    if(nilai >= 70) return "Cukup baik";
    return "Perlu bimbingan";

}

async function simpanRaportPAUD(){

  try{

    const payload = {

      action:"simpanRaportPAUD",

      data:{

        nama:rNama.value,
        kelas:rKelas.value,
        nik:rNik.value,

        fase:rFase.value,
        tahun:rTahun.value,
        semester:rSemester.value,
        tinggi:rTinggi.value,
        berat:rBerat.value,

        agama:rAgama.value,
        jati:rJatiDiri.value,
        literasi:rLiterasi.value,
        p5:rP5.value,
        perkembangan:rPerkembangan.value,

        sakit:rSakit.value,
        izin:rIzin.value,
        alpa:rAlpa.value,

        ortu:rOrtu.value,
        guru:rGuru.value

      }

    };

    const res =
    await fetch(
      TABUNGAN_API,
      {

        method:"POST",

        headers:{
  "Content-Type":"text/plain;charset=utf-8"
},

        body:
        JSON.stringify(payload)

      }
    );

    const text =
    await res.text();

    console.log(
      "Response:",
      text
    );

    const hasil =
    JSON.parse(text);

    if(hasil.status){

      alert(
        "Data berhasil disimpan"
      );

    }else{

      alert(
        hasil.message
      );

    }

  }catch(err){

    alert(
      "ERROR : " + err
    );

    console.error(err);

  }

}

    async function generateRaport(){

  try{

    const fotoAgamaFile =
    document.getElementById("fotoAgama");

    const fotoJatiFile =
    document.getElementById("fotoJati");

    const fotoLiterasiFile =
    document.getElementById("fotoLiterasi");

    const fotoP5File =
    document.getElementById("fotoP5");

    const fotoAgama =
    fotoAgamaFile.files[0]
    ? await fileToBase64(
        fotoAgamaFile.files[0]
      )
    : "";

    const fotoJati =
    fotoJatiFile.files[0]
    ? await fileToBase64(
        fotoJatiFile.files[0]
      )
    : "";

    const fotoLiterasi =
    fotoLiterasiFile.files[0]
    ? await fileToBase64(
        fotoLiterasiFile.files[0]
      )
    : "";

    const fotoP5 =
    fotoP5File.files[0]
    ? await fileToBase64(
        fotoP5File.files[0]
      )
    : "";

    const payload = {

      action:"generateRaport",

      data: {
    nama: rNama.value,
    kelas: rKelas.value
  }
};

    const res =
    await fetch(
      TABUNGAN_API,
      {
        method:"POST",
        headers:{
          "Content-Type":
          "text/plain;charset=utf-8"
        },
        body:JSON.stringify(payload)
      }
    );

    const txt =
    await res.text();

    const hasil =
    JSON.parse(txt);

    if(hasil.status){

      window.open(
        hasil.url,
        "_blank"
      );

    }else{

      alert(
        hasil.message
      );

    }

  }catch(err){

    alert(err);

  }

}

    
function previewKognitif(){

    nav("previewKognitifPage");

    const nama = kNama.value;
    const kelas = kKelas.value;
    const semester = kSemester.value;
    const tahun = kTahun.value;

    // Ambil data siswa yang dipilih
    const siswa = dataSiswaKognitif.find(
        x => x.nama === nama
    ) || {};

    const nik = siswa.nik || "-";
    const nisn = siswa.nisn || siswa.nis || "-";

    const iqro = Number(kIqro.value || 0);
    const shalat = Number(kShalat.value || 0);
    const surah = Number(kSurah.value || 0);
    const praktek = Number(kPraktek.value || 0);
    const membaca = Number(kMembaca.value || 0);
    const tajwid = Number(kTajwid.value || 0);

    const doa = Number(kDoa.value || 0);
    const kitabah = Number(kKitabah.value || 0);
    const dinul = Number(kDinul.value || 0);
    const isRAA = String(kelas).trim().toUpperCase() === "RA.A";

const inggris = isRAA
    ? "-"
    : Number(kInggris.value || 0);

// Nilai numerik untuk perhitungan
const nilaiInggris = isRAA
    ? 0
    : Number(kInggris.value || 0);
    const berhitung = Number(kBerhitung.value || 0);

    const jumlah =
        iqro +
        shalat +
        surah +
        praktek +
        membaca +
        tajwid +
        doa +
        kitabah +
        dinul +
        inggris +
        berhitung;

    const sehat = kSehat.value;
    const bersih = kBersih.value;
    const disiplin = kDisiplin.value;
    const kerjasama = kKerjasama.value;
    const adaptasi = kAdaptasi.value;
    const vokal = kVokal.value;
    const kreatif = kKreatif.value;

    const saran = kSaran.value;

    const tempat = kTempat.value;
    const tanggal = kTanggal.value;
    
    const jumlahMapel = isRAA ? 10 : 11;
    const rata = Math.round(jumlah / jumlahMapel);

    kognitifContainer.innerHTML = `

<!-- ================= COVER ================= -->
<div class="pageKognitif coverPage noWatermark">

    <div style="
        height:100%;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        text-align:center;
        padding:40px 20px;
        box-sizing:border-box;
        background:#ffffff;
        position:relative;
        z-index:999;
    ">

        <!-- JUDUL -->
        <div>

            <h2 style="
                font-family:serif;
                margin-top:20px;
                font-size:20pt;
                font-weight:bold;
            ">
                YAYASAN AMANNA
            </h2>

            <h1 style="
                margin-top:30px;
                font-family:serif;
                font-size:24pt;
                font-weight:bold;
                letter-spacing:1px;
            ">
                LAPORAN HASIL BELAJAR
            </h1>

            <h2 style="
                margin-top:15px;
                font-family:serif;
                font-size:18pt;
            ">
                RAUDLATUL ATHFAL AMANNA
            </h2>

            <h3 style="
                margin-top:5px;
                font-size:14pt;
                font-family:serif;
            ">
                (RA)
            </h3>

        </div>

        <!-- LOGO -->
        <div>

            <img
                src="https://iili.io/CBoYGIV.png"
                style="
                    width:180px;
                    height:auto;
                    display:block;
                    margin:auto;
                "
            >

        </div>

        <!-- IDENTITAS SISWA -->
        <div style="
            width:75%;
            margin:20px auto;
            text-align:left;
            font-size:13pt;
            font-family:serif;
        ">

            <table style="
                width:100%;
                border-collapse:collapse;
            ">

                <tr>
                    <td style="
                        width:30%;
                        padding:8px 0;
                        font-weight:bold;
                    ">
                        NAMA
                    </td>
                    <td style="width:5%;">:</td>
                    <td style="font-weight:bold;">
                        ${nama}
                    </td>
                </tr>

                <tr>
                    <td style="
                        padding:8px 0;
                        font-weight:bold;
                    ">
                        NIK
                    </td>
                    <td>:</td>
                    <td style="font-weight:bold;">
                        ${nik}
                    </td>
                </tr>

                <tr>
                    <td style="
                        padding:8px 0;
                        font-weight:bold;
                    ">
                        NISN
                    </td>
                    <td>:</td>
                    <td style="font-weight:bold;">
                        ${nisn}
                    </td>
                </tr>

            </table>

        </div>

        <!-- FOOTER COVER -->
        <div>

            <h2 style="
                <!-- FOOTER COVER -->
<div>

    <h2 style="
        margin-bottom:15px;
        font-family:serif;
    ">
        RAUDLATUL ATHFAL AMANNA
    </h2>

    <div style="
        line-height:1.8;
        font-family:'Times New Roman', serif;
        font-size:14px;
    ">
        <span style="font-style:italic;">
            Blok Jongor Lapang Desa Jagapura Wetan Kecamatan Gegesik Kabupaten Cirebon
        </span>
        <br>

        <span style="font-weight:bold;">
            PROVINSI JAWA BARAT
        </span>
    </div>

</div>
    </div>

</div>
<!-- ================= HALAMAN 1 ================= -->

<div class="pageKognitif">
        <div class="logoKognitif-containerKognitif">
            
        <div class="headerKognitif">
            <img
src="https://iili.io/CKpliI1.png"
class="logoKognitif"
style="width:70px;height:auto;"
>
            <div class="schoolKognitif">

        <div class="headerKognitif-centerKognitif">
            <h1>HASIL EVALUASI BELAJAR</h1>
            <h2>RAUDLATUL ATHFAL AMANNA</h2>
        </div>

        <table class="biodataKognitif-tableKognitif">
            <tr>
                <td class="biodataKognitif-label" style="font-weight: normal; border:none; text-align:left ">NAMA</td>
                <td class="biodataKognitif-colon" style="border:none ">:</td>
                <td class="biodataKognitif-value" style="width: 25%; font-weight: normal; border:none; text-align:left">${nama}</td>
                <td class="biodataKognitif-label" style="width: 20%; font-weight: normal; border:none; text-align:left">SEMESTER KE</td>
                <td class="biodataKognitif-colon" style="border:none ">:</td>
                <td class="biodataKognitif-value" style="width: 25%; font-weight: normal; border:none; text-align:left">${semester}</td>
            </tr>
            <tr>
                <td class="biodataKognitif-label" style="font-weight: normal; border:none; text-align:left ">KELAS</td>
                <td class="biodataKognitif-colon" style="border:none ">:</td>
                <td class="biodataKognitif-value" style="font-weight: normal; text-align:left ">${kelas}</td>
                <td class="biodataKognitif-label" style="font-weight: normal; border:none; text-align:left">TAHUN AJARAN</td>
                <td class="biodataKognitif-colon" style="border:none ">:</td>
                <td class="biodataKognitif-value" style="font-weight: normal; text-align:left ">${tahun}</td>
            </tr>
        </table>

        <table class="mainKognitif-tableKognitif">
            <thead>
                <tr>
                    <th rowspan="2" style="width: 6%; font-size: 9.5pt;">NO</th>
                    <th rowspan="2" style="width: 32%;font-size: 9.5pt;">PAKET PENGAJARAN</th>
                    <th colspan="2" style="width: 16%;font-size: 9.5pt;">NILAI</th>
                    <th rowspan="2" style="width: 46%;font-size: 9.5pt;">DESKRIPSI</th>
                </tr>
                <tr>
                    <th style="font-size: 9.5pt; width: 8%;">Predikat</th>
                    <th style="font-size: 9.5pt; width: 8%;;">Angka</th>
                </tr>
            </thead>
            <tbody>
                <tr class="subKognitif-heading">
                    <td class="text-center">I.</td>
                    <td colspan="4">MATERI POKOK</td>
                </tr>
                <tr>
                    <td class="text-left">1.</td>
                    <td class="text-left">Bacaan Iqro</td>
                    <td class="text-center">${getPredikat(iqro)}</td>
                    <td class="text-center">${iqro}</td>
                    <td>${nama}, ${getHuruf(iqro)} dalam Bacaan Iqro</td>
                </tr>
                <tr>
                    <td class="text-left">2.</td>
                    <td class="text-left">Hafalan bacaan shalat</td>
                    <td class="text-center">${getPredikat(shalat)}</td>
                    <td class="text-center">${shalat}</td>
                    <td>${nama}, ${getHuruf(shalat)} dalam Hafalan bacaan shalat</td>
                </tr>
                <tr>
                    <td class="text-left">3.</td>
                    <td class="text-left">Hafalan surah pendek</td>
                    <td class="text-center">${getPredikat(surah)}</td>
                    <td class="text-center">${surah}</td>
                    <td>${nama}, ${getHuruf(surah)} dalam Hafalan surah pendek</td>
                </tr>
                <tr>
                    <td class="text-left">4.</td>
                    <td class="text-left">Praktek/amalan shalat</td>
                    <td class="text-center">${getPredikat(praktek)}</td>
                    <td class="text-center">${praktek}</td>
                    <td>${nama}, ${getHuruf(praktek)} dalam Praktek/ amalan shalat</td>
                </tr>
                <tr>
                    <td class="text-left">5.</td>
                    <td class="text-left">Membaca</td>
                    <td class="text-center">${getPredikat(membaca)}</td>
                    <td class="text-center">${membaca}</td>
                    <td>${nama}, ${getHuruf(membaca)} dalam Membaca</td>
                </tr>
                <tr>
                    <td class="text-center">6.</td>
                    <td class="text-left">Ilmu tajwid</td>
                    <td class="text-center">${getPredikat(tajwid)}</td>
                    <td class="text-center">${tajwid}</td>
                    <td>${nama}, ${getHuruf(tajwid)} dalam Ilmu tajwid</td>
                </tr>
                <tr class="subKognitif-heading">
                    <td class="text-center">II.</td>
                    <td colspan="4">MATERI PENUNJANG</td>
                </tr>
                <tr>
                    <td class="text-center">1.</td>
                    <td class="text-left">Do'a dan adab harian</td>
                    <td class="text-center">${getPredikat(doa)}</td>
                    <td class="text-center">${doa}</td>
                    <td>${nama}, ${getHuruf(doa)} dalam Do'a dan adab harian</td>
                </tr>
                <tr>
                    <td class="text-center">2.</td>
                    <td class="text-left">Tahsinul kitabah</td>
                    <td class="text-center">${getPredikat(kitabah)}</td>
                    <td class="text-center">${kitabah}</td>
                    <td>${nama}, ${getHuruf(kitabah)} dalam Tahsinul kitabah</td>
                </tr>
                <tr>
                    <td class="text-center">3.</td>
                    <td class="text-left">Dinul Islam</td>
                    <td class="text-center">${getPredikat(dinul)}</td>
                    <td class="text-center">${dinul}</td>
                    <td>${nama}, ${getHuruf(dinul)} dalam Dinul Islam</td>
                </tr>
                <tr>
                    <td class="text-center">4.</td>
                    <td class="text-left">Bahasa Inggris</td>
                    <td class="text-center">${getPredikat(inggris)}</td>
                    <td class="text-center">${inggris}</td>
                    <td>${nama}, ${getHuruf(inggris)} dalam berbahasa inggris</td>
                </tr>
                <tr>
                    <td class="text-center">5.</td>
                    <td class="text-left">Berhitung</td>
                    <td class="text-center">${getPredikat(berhitung)}</td>
                    <td class="text-center">${berhitung}</td>
                    <td>${nama}, ${getHuruf(berhitung)} dalam Berhitung</td>
                </tr>
                <tr>
                    <td colspan="3" class="bold text-left">JUMLAH NILAI</td>
                    <td class="text-center bold">${jumlah}</td>
                    <td></td>
                </tr>
                <tr>
                    <td colspan="3" class="bold text-left">NILAI RATA RATA</td>
                    <td class="text-center bold">${rata}</td>
                    <td></td>
                </tr>
                <tr>
                    <td colspan="3" class="bold text-left">PERINGKAT KE--</td>
                    <td class="text-center">-</td>
                    <td></td>
                </tr>
            </tbody>
        </table>

        <div class="footerKognitif-section">
            <div class="absensi-box">
                <span class="bold">ABSENSI :</span>
                <table>
                    <tr>
                        <td style="width: 50%;">1. Sakit</td>
                        <td style="width: 10%;">:</td>
                        <td>${kSakit.value || 0}</td>
                    </tr>
                    <tr>
                        <td>2. Izin</td>
                        <td>:</td>
                        <td>${kIzin.value || 0}</td>
                    </tr>
                    <tr>
                        <td>3. Lain-lain</td>
                        <td>:</td>
                        <td>${kLain.value || 0}</td>
                    </tr>
                </table>
            </div>
            <p style="font-size: 9.5pt; font-style: italic; text-align:left; margin: 5px 0 0 0;">
                *)Coret yang tidak perlu &nbsp;&nbsp;&nbsp;&nbsp;
            </p>
        </div>

        <div class="school-footer-tag">Halaman 2</div>
    </div>
    </div>
    </div>
    </div>



    <!-- ================= HALAMAN 2 ================= -->
    <div class="pageKognitif">
        <div class="headerKognitif-centerKognitif" style="margin-top: 15px; text-align:center">
            <h1>PERKEMBANGAN KEPRIBADIAN</h1>
            <h2 style="font-size: 10pt; margin-top: 5px; color: #555555;">${nama}</h2>
        </div>

        <table class="mainKognitif-tableKognitif" style="margin-top: 25px;">
            <thead>
                <tr>
                    <th rowspan="2" style="width: 6%;">NO.</th>
                    <th rowspan="2" style="width: 38%;">BAGAN PERKEMBANGAN</th>
                    <th colspan="4" style="width: 56%;">KUALIFIKASI</th>
                </tr>
                <tr>
                    <th style="font-size: 9.5pt; width: 14%;">Sangat Baik</th>
                    <th style="font-size: 9.5pt; width: 14%;">Baik</th>
                    <th style="font-size: 9.5pt; width: 14%;">Normal</th>
                    <th style="font-size: 9.5pt; width: 14%;">Perlu Pengawasan</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="text-center">1.</td>
                    <td>Kesehatan dan kondisi badan</td>
<td class="text-center">
${cekKolom(sehat,"SB")}
</td>

<td class="text-center">
${cekKolom(sehat,"B")}
</td>

<td class="text-center">
${cekKolom(sehat,"N")}
</td>

<td class="text-center">
${cekKolom(sehat,"PP")}
</td>
                </tr>
                <tr>
                    <td class="text-center">2.</td>
                    <td>Kebersihan dan kerapihan</td>
<td class="text-center">
${cekKolom(bersih,"SB")}
</td>

<td class="text-center">
${cekKolom(bersih,"B")}
</td>

<td class="text-center">
${cekKolom(bersih,"N")}
</td>

<td class="text-center">
${cekKolom(bersih,"PP")}
</td>
                </tr>
                <tr>
                    <td class="text-center">3.</td>
                    <td>Kehadiran dan kedisiplinan</td>
<td class="text-center">
${cekKolom(disiplin,"SB")}
</td>

<td class="text-center">
${cekKolom(disiplin,"B")}
</td>

<td class="text-center">
${cekKolom(disiplin,"N")}
</td>

<td class="text-center">
${cekKolom(disiplin,"PP")}
</td>
                </tr>
                <tr>
                    <td class="text-center">4.</td>
                    <td>Kerjasama</td>
<td class="text-center">
${cekKolom(kerjasama,"SB")}
</td>

<td class="text-center">
${cekKolom(kerjasama,"B")}
</td>

<td class="text-center">
${cekKolom(kerjasama,"N")}
</td>

<td class="text-center">
${cekKolom(kerjasama,"PP")}
</td>
                </tr>
                <tr>
                    <td class="text-center">5.</td>
                    <td>Penyesuaian diri</td>
<td class="text-center">
${cekKolom(adaptasi,"SB")}
</td>

<td class="text-center">
${cekKolom(adaptasi,"B")}
</td>

<td class="text-center">
${cekKolom(adaptasi,"N")}
</td>

<td class="text-center">
${cekKolom(adaptasi,"PP")}
</td>
                </tr>
                <tr>
                    <td class="text-center">6.</td>
                    <td>Vokal/ kemampuan berbahasa</td>
<td class="text-center">
${cekKolom(vokal,"SB")}
</td>

<td class="text-center">
${cekKolom(vokal,"B")}
</td>

<td class="text-center">
${cekKolom(vokal,"N")}
</td>

<td class="text-center">
${cekKolom(vokal,"PP")}
</td>
                </tr>
                <tr>
                    <td class="text-center">7.</td>
                    <td>Kreatifitas belajar</td>
<td class="text-center">
${cekKolom(kreatif,"SB")}
</td>

<td class="text-center">
${cekKolom(kreatif,"B")}
</td>

<td class="text-center">
${cekKolom(kreatif,"N")}
</td>

<td class="text-center">
${cekKolom(kreatif,"PP")}
</td>
                </tr>
            </tbody>
        </table>

        <div class="notes-section">
            Catatan Wali Kelas : <span style="font-weight: normal; font-style: italic;">${saran}</span>
        </div>

        <!-- --- AREA TANDA TANGAN REPOSISI --- -->
        <div class="ttd-container">
            <div style="text-align: right; margin-bottom: 15px; padding-right: 25px;">
                ${tempat}, ${new Date(tanggal).toLocaleDateString(
'id-ID',
{
day:'numeric',
month:'long',
year:'numeric'
}
)}
            </div>
            
            <!-- Baris Atas: Orang Tua & Wali Kelas -->
            <div class="ttd-row-top">
                <div class="ttd-block">
                    <span class="normal">Orang Tua / Wali</span>
                    <div class="ttd-space"></div>
                    <div>( .................................... )</div>
                </div>
                <div class="ttd-block">
                    <span class=>Wali Kelas</span><br>
                    <div class="ttd-space" style="height: 47px;"></div>
                    <div class="normal" style="font-weight: normal; text-decoration: underline;">${kWali.value}</div>
                </div>
            </div>

            <!-- Baris Bawah: Kepala Sekolah Berada di Tengah Bawah -->
            <div class="ttd-row-bottom">
                <div class="ttd-block">
                    <span class=>Kepala Sekolah</span>
                    <div class="ttd-space"></div>
                    <div class="normal" style="text-decoration: underline;">${kKepsek.value}</div>
                    <br><br><br><br><br>
                    <div class="school-footer-tag">Halaman 3</div>
                </div>
            </div>
        </div>
    </div>`;
  }  

async function exportRaportPDF() {
    try {
        const { jsPDF } = window.jspdf;
        const element = document.getElementById("raportContainer");

        // Tunggu load semua aset base64 selesai
        const images = element.querySelectorAll("img");
        const promises = Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
        });
        await Promise.all(promises);

        // Render Canvas beresolusi tinggi (scale 2) dengan proteksi CORS
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297; // Tinggi standar kertas A4 mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Loop halaman apabila tabel raport melebihi 1 halaman A4
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`Raport_${rNama.value || 'Siswa'}.pdf`);
    } catch (err) {
        alert("Gagal export PDF Raport:\n" + err.message);
        console.error(err);
    }
}


    async function exportKognitifPDF(){

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation:"portrait",
        unit:"mm",
        format:"a4",
        compress:true
    });

    await document.fonts.ready;

    const pages = document.querySelectorAll(".pageKognitif");

    for(let i=0;i<pages.length;i++){

        const imgs = pages[i].querySelectorAll("img");

        await Promise.all(
            [...imgs].map(img=>{
                if(img.complete) return Promise.resolve();
                return new Promise(res=>{
                    img.onload=res;
                    img.onerror=res;
                });
            })
        );

        const canvas = await html2canvas(pages[i],{
    scale:2,
    useCORS:true,
    allowTaint:true,
    backgroundColor:"#ffffff",
    scrollX:0,
    scrollY:0
});

        const imgData = canvas.toDataURL(
            "image/jpeg",
            1.0
        );

        if(i>0) pdf.addPage();

        const pageWidth = 210;
const pageHeight = 297;

const imgWidth = pageWidth;
const imgHeight = canvas.height * imgWidth / canvas.width;

const margin = 4;

pdf.addImage(
    imgData,
    "JPEG",
    margin,
    margin,
    210 - (margin * 2),
    297 - (margin * 2),
    undefined,
    "FAST"
);
        }

    pdf.save(
        `Raport_Kognitif_${kNama.value||"Siswa"}.pdf`
    );
}


function toggleBahasaInggris() {

    const kelas = String(kKelas.value).trim().toUpperCase();
    const inputInggris = document.getElementById("kInggris");

    if (kelas === "RA.A") {

        // Kosongkan nilainya
        inputInggris.value = "";

        // Nonaktifkan input
        inputInggris.disabled = true;

        // Ubah placeholder
        inputInggris.placeholder = "Tidak berlaku untuk RA.A";

    } else {

        // Aktifkan kembali
        inputInggris.disabled = false;

        // Kembalikan placeholder semula
        inputInggris.placeholder = "Nilai Bahasa Inggris";
    }
}
