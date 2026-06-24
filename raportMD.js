/* ================= RAPORT MD ================= */

const nilaiInputsMD = [
  "nilai1MD",
  "nilai2MD",
  "nilai3MD",
  "nilai4MD",
  "nilai5MD",
  "nilai6MD"
];

/* ================= AUTO HITUNG ================= */

document.addEventListener("DOMContentLoaded", () => {

  nilaiInputsMD.forEach(id => {

    const el = document.getElementById(id);

    if(el){
      el.addEventListener("input", hitungNilaiMD);
    }

  });

  loadKelasMD();

});

/* ================= LOAD KELAS ================= */

async function loadKelasMD(){

  try{

    const res = await fetch(
      API_URL + "?action=getKelasMD"
    );

    const json = await res.json();

    const select =
    document.getElementById("kelasMD");

    if(!select) return;

    select.innerHTML =
    '<option value="">Pilih Kelas</option>';

    json.data.forEach(kelas=>{

      select.innerHTML += `
        <option value="${kelas}">
          ${kelas}
        </option>
      `;

    });

  }catch(err){

    console.error(err);

  }

}

/* ================= LOAD SISWA ================= */

async function loadSiswaMD(){

  try{

    const kelas =
    document.getElementById("kelasMD").value;

    if(!kelas) return;

    const res = await fetch(
      API_URL +
      "?action=getSiswaByKelas&kelas=" +
      encodeURIComponent(kelas)
    );

    const json = await res.json();

    const select =
    document.getElementById("namaMD");

    select.innerHTML =
    '<option value="">Pilih Siswa</option>';

    json.data.forEach(s=>{

      select.innerHTML += `
      <option value="${s.nama}">
        ${s.nama}
      </option>
      `;

    });

  }catch(err){

    console.error(err);

  }

}

/* ================= HITUNG NILAI ================= */

function hitungNilaiMD(){

  let jumlah = 0;

  for(let i=1;i<=6;i++){

    jumlah += Number(
      document.getElementById(
        "nilai"+i+"MD"
      )?.value || 0
    );

  }

  const rata =
  (jumlah / 6).toFixed(2);

  document.getElementById(
    "jumlahMD"
  ).innerText = jumlah;

  document.getElementById(
    "rataMD"
  ).innerText = rata;

}

/* ================= SIMPAN ================= */

async function simpanRaportMD(){

  try{

    const data = {

      action:"simpanRaportMD",

      nama:
      document.getElementById("namaMD").value,

      kelas:
      document.getElementById("kelasMD").value,

      semester:
      document.getElementById("semesterMD").value,

      tahunAjaran:
      document.getElementById("tahunAjaranMD").value,

      kitab1:
      document.getElementById("kitab1MD").value,

      kitab2:
      document.getElementById("kitab2MD").value,

      kitab3:
      document.getElementById("kitab3MD").value,

      kitab4:
      document.getElementById("kitab4MD").value,

      kitab5:
      document.getElementById("kitab5MD").value,

      kitab6:
      document.getElementById("kitab6MD").value,

      nilai1:
      document.getElementById("nilai1MD").value,

      nilai2:
      document.getElementById("nilai2MD").value,

      nilai3:
      document.getElementById("nilai3MD").value,

      nilai4:
      document.getElementById("nilai4MD").value,

      nilai5:
      document.getElementById("nilai5MD").value,

      nilai6:
      document.getElementById("nilai6MD").value,

      kehadiran:
      document.getElementById("kehadiranMD").value,

      hafalan:
      document.getElementById("hafalanMD").value,

      akhlaq:
      document.getElementById("akhlaqMD").value,

      sakit:
      document.getElementById("sakitMD").value,

      izin:
      document.getElementById("izinMD").value,

      alpa:
      document.getElementById("alpaMD").value,

      catatan:
      document.getElementById("catatanMD").value,

      jumlah:
      document.getElementById("jumlahMD").innerText,

      rata:
      document.getElementById("rataMD").innerText,

      mustahiq:
      document.getElementById("mustahiqMD").value

    };

const formData = new URLSearchParams();

for(const key in data){
  formData.append(key,data[key] ?? "");
}

const res = await fetch(API_URL,{
  method:"POST",
  body:formData
});

const json = await res.json();


    alert(
      json.message ||
      "Data berhasil disimpan"
    );

  }catch(err){

    console.error(err);

    alert(err);

  }

}

/* ================= CETAK ================= */

async function cetakRaportMD(){

  try{

    const nama =
    document.getElementById("namaMD").value;

    if(!nama){

      alert(
      "Pilih siswa terlebih dahulu"
      );

      return;

    }

    const res = await fetch(

      API_URL +
      "?action=cetakRaportMD&nama=" +
      encodeURIComponent(nama)

    );

    const json =
    await res.json();

    if(json.status){

      window.open(
        json.pdfUrl,
        "_blank"
      );

    }else{

      alert(
        json.message ||
        "Gagal cetak raport"
      );

    }

  }catch(err){

    console.error(err);

    alert(err);

  }

}

/* ================= GLOBAL ================= */

window.loadSiswaMD = loadSiswaMD;
window.simpanRaportMD = simpanRaportMD;
window.cetakRaportMD = cetakRaportMD;

async function loadRataKitabMD(){

  const kelas =
  document.getElementById("kelasMD").value;

  if(!kelas) return;

  try{

    const res = await fetch(
      API_URL +
      "?action=getRataKitabMD&kelas=" +
      encodeURIComponent(kelas)
    );

    const json = await res.json();

    if(!json.status) return;

    for(let i=1;i<=6;i++){

      const el =
      document.getElementById(
        "rataKitab"+i+"MD"
      );

      if(el){
        el.innerText =
        json.data[i-1];
      }

    }

  }catch(err){

    console.error(err);

  }

}
