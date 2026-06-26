async function loadKelasIjazah(){

    try{

        const res = await fetch(API_URL + "?action=getDataSiswa");

        const json = await res.json();

        if(!json.status){

            alert("Data siswa gagal dimuat");

            return;

        }

        dataIjazah = json.data;

        const kelas = [...new Set(
            dataIjazah.map(x=>x.kelas)
        )].sort();

        const select = document.getElementById("kelasIjazah");

        select.innerHTML="<option value=''>Pilih Kelas</option>";

        kelas.forEach(k=>{

            select.innerHTML+=`<option>${k}</option>`;

        });

    }catch(err){

        alert(err);

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

async function cetakIjazah(){

    const nik=document.getElementById("namaIjazah").value;

    if(!nik){

        alert("Pilih siswa.");

        return;

    }

    const res=await fetch(

        API_URL+

        "?action=cetakIjazah&nik="+

        encodeURIComponent(nik)

    );

    const json=await res.json();

    if(json.status){

        window.open(json.url,"_blank");

    }else{

        alert(json.message);

    }

}

