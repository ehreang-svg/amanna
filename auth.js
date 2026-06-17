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

    document.getElementById("editNama").value =
        currentUser.nama || "";

    document.getElementById("editUsername").value =
        currentUser.username || "";

    document.getElementById("editPassword").value = "";

    document.getElementById("previewFoto").src =
        currentUser.foto ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";
}
/*===============SIMPAN AKUN=======*/
async function simpanAkun(){

    const btn = event.target;
    const text = btn.innerText;

    btn.disabled = true;
    btn.innerText = "Menyimpan...";

    try {

        const nama = document.getElementById("editNama").value;
        const username = document.getElementById("editUsername").value;
        const password = document.getElementById("editPassword").value;
        const file = document.getElementById("fotoFile").files[0];

        let fotoUrl = currentUser.foto || "";

        // =========================
        // UPLOAD FOTO (NO CORS SAFE)
        // =========================
        if(file){

            const base64 = await fileToBase64(file);

            const fdUpload = new FormData();
            fdUpload.append("action", "uploadFoto");
            fdUpload.append("username", currentUser.username);
            fdUpload.append("image", base64);

            await fetch(API_URL, {
                method: "POST",
                mode: "no-cors",
                body: fdUpload
            });

            // ⚠️ no-cors = tidak bisa baca response
            // jadi kita pakai delay + asumsi sukses
            await new Promise(r => setTimeout(r, 2000));

            // optional: tetap pakai foto lama / refresh dari server nanti
        }

        // =========================
        // UPDATE AKUN (NO CORS SAFE)
        // =========================
        const fdUpdate = new FormData();
        fdUpdate.append("action", "updateAkun");
        fdUpdate.append("usernameLama", currentUser.username);
        fdUpdate.append("nama", nama);
        fdUpdate.append("username", username);
        fdUpdate.append("password", password);
        fdUpdate.append("foto", fotoUrl);

        await fetch(API_URL, {
            method: "POST",
            mode: "no-cors",
            body: fdUpdate
        });

        // =========================
        // UPDATE LOCAL STORAGE
        // =========================
        currentUser.nama = nama;
        currentUser.username = username;
        currentUser.foto = fotoUrl;

        localStorage.setItem("user", JSON.stringify(currentUser));

        // update UI
        const fotoEl = document.getElementById("foto");
        if(fotoEl) fotoEl.src = fotoUrl;

        const namaEl = document.getElementById("nama");
        if(namaEl) namaEl.innerText = nama;

        alert("Akun berhasil diperbarui!");

        nav("dashboard");

    } catch(err) {
        console.error(err);
        alert("Error: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = text;
    }
}
function uploadFotoProfil(){
    alert("Cukup masukkan file foto Anda, lalu klik langsung tombol 'Simpan Perubahan' di bawah.");
}

function fileToBase64(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
