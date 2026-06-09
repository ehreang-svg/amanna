/* ================= LOGIN ================= */
async function login(){
    try{
        if(!u.value || !p.value){
            alert("Username dan Password harus diisi!");
            return;
        }

        let res=await fetch(API_URL+`?action=login&username=${encodeURIComponent(u.value)}&password=${encodeURIComponent(p.value)}`);
        let data=await res.json();
        if(!data.status){ alert("Login gagal"); return; }
        
        let user = data.user;

        // Bersihkan format link Google Drive sesaat setelah login berhasil
        if (user.foto && user.foto.includes("drive.google.com/file/d/")) {
            user.foto = user.foto.replace("/view?usp=sharing", "")
                                 .replace("/view", "")
                                 .replace("file/d/", "uc?export=view&id=");
        }

        localStorage.setItem("user", JSON.stringify(user));
        loadDashboard(user);
    }catch(err){ alert(err); }
}

function cekLogin(){
    const savedUser = localStorage.getItem("user");
    if(savedUser){
        let user = JSON.parse(savedUser);

        if (user.foto && user.foto.includes("drive.google.com/file/d/")) {
            user.foto = user.foto.replace("/view?usp=sharing", "")
                                 .replace("/view", "")
                                 .replace("file/d/", "uc?export=view&id=");
            localStorage.setItem("user", JSON.stringify(user));
        }

        loadDashboard(user);
    } else {
        nav("loginPage");
    }
}

function logout(){ localStorage.clear(); location.reload(); }

function canShowMenu(menuName, status){
    menuName = menuName.toLowerCase(); status = status.toLowerCase();
    if(status === "admin") return true;
    if(status === "wali kelas") return ["absensi","raport","materi","latihan"].includes(menuName);
    if(status === "guru") return ["absensi","materi","latihan"].includes(menuName);
    if(status === "siswa") return ["tabungan","materi","latihan","absensi"].includes(menuName);
    return false;
}




/*=========EDIT AKUN=============*/
function openEditAkun(){
    nav("editAkun");
    document.getElementById("fotoFile").onchange = function(e){
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = function(ev){
            document.getElementById("previewFoto").src = ev.target.result;
        };
        reader.readAsDataURL(file);
    };

    document.getElementById("editNama").value = currentUser.nama || "";
    document.getElementById("editUsername").value = currentUser.username || "";
    
    if(currentUser.foto){
        let fotoPreviewUrl = currentUser.foto;
        if (fotoPreviewUrl.includes("drive.google.com/file/d/")) {
            fotoPreviewUrl = fotoPreviewUrl.replace("/view?usp=sharing", "")
                                           .replace("/view", "")
                                           .replace("file/d/", "uc?export=view&id=");
        }
        document.getElementById("previewFoto").src = fotoPreviewUrl;
    } else {
        document.getElementById("previewFoto").src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
}

/*===============SIMPAN AKUN=======*/
async function simpanAkun(){
    const tombolSimpan = event.target;
    const teksAwal = tombolSimpan.innerText;
    tombolSimpan.innerText = "Menyimpan...";
    tombolSimpan.disabled = true;

    try {
        const file = document.getElementById("fotoFile").files[0];
        let fotoUrl = currentUser.foto || "";

        if(file){
            try {
                const base64Clean = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result.split(",")[1]);
                    };
                    reader.readAsDataURL(file);
                });

                let fd = new FormData();
                fd.append("action", "uploadFoto");
                fd.append("username", currentUser.username);
                fd.append("image", "data:image/jpeg;base64," + base64Clean);

                let up = await fetch(API_URL, {
                    method: "POST",
                    body: fd
                });

                let hasilUpload = await up.json();
                if(hasilUpload && hasilUpload.status && hasilUpload.url){
                    fotoUrl = hasilUpload.url;
                }
            } catch (errFoto) {
                console.error("Gagal upload file foto:", errFoto);
            }
        }

        const namaBaru = document.getElementById("editNama").value;
        const usernameBaru = document.getElementById("editUsername").value;

        let formData = new FormData();
        formData.append("action", "updateAkun");
        formData.append("usernameLama", currentUser.username);
        formData.append("nama", namaBaru);
        formData.append("username", usernameBaru);
        formData.append("foto", fotoUrl);

        await fetch(API_URL, {
            method: "POST",
            body: formData
        });

        // Update data objek lokal aplikasi
        currentUser.nama = namaBaru;
        currentUser.username = usernameBaru;
        currentUser.foto = fotoUrl;

        localStorage.setItem("user", JSON.stringify(currentUser));

        // Bersihkan URL jika server sempat mengembalikan format /view
        let fotoDashboardUrl = fotoUrl;
        if (fotoDashboardUrl.includes("drive.google.com/file/d/")) {
            fotoDashboardUrl = fotoDashboardUrl.replace("/view?usp=sharing", "")
                                               .replace("/view", "")
                                               .replace("file/d/", "uc?export=view&id=");
        }

        // Terapkan ke target elemen foto dashboard huruf kecil sesuai baris 266 HTML Anda
        const elemenFoto = document.getElementById("foto");
        if(elemenFoto) {
            elemenFoto.src = fotoDashboardUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }

        if(window.nama) nama.innerText = namaBaru;

        alert("Akun dan Foto Profil berhasil diperbarui!");
        nav('dashboard');

    } catch (err) {
        console.error(err);
        alert("Gagal menyimpan data: " + err.message);
    } finally {
        tombolSimpan.innerText = teksAwal;
        tombolSimpan.disabled = false;
    }
}

function uploadFotoProfil(){
    alert("Cukup masukkan file foto Anda, lalu klik langsung tombol 'Simpan Perubahan' di bawah.");
}
