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
"previewKognitifPage"
];


function show(id){
    pages.forEach(p=>{ document.getElementById(p).classList.add("hidden"); });
    document.getElementById(id).classList.remove("hidden");
}

function nav(id){
    const active = pages.find(
        p=>!document
        .getElementById(p)
        .classList.contains("hidden")
    );
    if(active && active!==id){
        history.push(active);
    }
    show(id);
    if(id === "kognitifPage"){
        loadKognitifSiswa();
    }
    if(id === "raportPage"){
        loadKelasRaport();
    }
}

function goBack(){
    if(history.length===0)return;
    show(history.pop());
}