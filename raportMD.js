async function simpanRaportMD(){

    const data = {

        action:"simpanRaportMD",

        nama:nama.value,
        kelas:kelas.value,

        semester:semester.value,

        tahunAjaran:
        tahunAjaran.value,

        kitab1:kitab1.value,
        kitab2:kitab2.value,
        kitab3:kitab3.value,
        kitab4:kitab4.value,
        kitab5:kitab5.value,
        kitab6:kitab6.value,

        nilai1:nilai1.value,
        nilai2:nilai2.value,
        nilai3:nilai3.value,
        nilai4:nilai4.value,
        nilai5:nilai5.value,
        nilai6:nilai6.value,

        kehadiran:
        kehadiran.value,

        hafalan:
        hafalan.value,

        akhlaq:
        akhlaq.value,

        sakit:
        sakit.value,

        izin:
        izin.value,

        alpa:
        alpa.value,

        catatan:
        catatan.value,

        jumlah:
        jumlah.innerText,

        rata:
        rata.innerText,

        mustahiq:
        mustahiq.value

    };

    const res = await fetch(
        API_URL,
        {
            method:"POST",
            body:JSON.stringify(data)
        }
    );

    const json = await res.json();

    alert(
        json.message ||
        "Data berhasil disimpan"
    );

}

async function cetakRaportMD(){

    const nama =
    document.getElementById("nama")
    .value;

    if(!nama){

        alert(
        "Pilih siswa terlebih dahulu"
        );

        return;
    }

    const res = await fetch(
    API_URL +
    "?action=cetakRaportMD&nama="
    + encodeURIComponent(nama)
    );

    const data = await res.json();

    if(data.status){

        window.open(
        data.pdfUrl,
        "_blank"
        );

    }else{

        alert(data.message);

    }

}

loadKelas();
