const pages=[
"splash",
"loginPage",
"dashboard",
"submenuPage",
"contentPage",
"absenGuruPage",
"rekapPage",
"absenSiswaPage",
"rekapSiswaPage",
"tabunganPage",
"rekapTabunganPage",
"raportPage",
"previewRaportPage",
"kognitifPage",
"previewKognitifPage",
"loginQuiz",
"cabutanPage",
"identitasPage",
""exportIdentitasPage"
];


function show(id){

    pages.forEach(p=>{

        const el = document.getElementById(p);

        if(el){
            el.classList.add("hidden");
        }else{
            console.error("ID tidak ditemukan:", p);
        }

    });

    const target = document.getElementById(id);

    if(target){
        target.classList.remove("hidden");
    }else{
        console.error("Target tidak ditemukan:", id);
    }

}


function nav(id){

    const active = pages.find(p=>{

        const el = document.getElementById(p);

        return el && !el.classList.contains("hidden");

    });

    if(active && active !== id){
        history.push(active);
    }

    show(id);

    if(id==="kognitifPage"){
        loadKognitifSiswa();
    }

    if(id==="raportPage"){
        loadKelasRaport();
    }

    if(id==="loginQuiz"){
        mulai();
    }

     if (id === "cabutanPage") {
        loadKelasCabutan();
    }


}


function goBack(){
    if(history.length===0)return;
    show(history.pop());
}
