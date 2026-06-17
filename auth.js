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

    const foto =
        document.getElementById("previewFoto");

    if(currentUser.foto){
        foto.src = currentUser.foto;
    }else{
        foto.src =
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }

    document.getElementById("fotoFile").onchange = function(e){

        const file = e.target.files[0];

        if(!file) return;

        const reader = new FileReader();

        reader.onload = function(ev){
            foto.src = ev.target.result;
        };

        reader.readAsDataURL(file);
    };
}

/*===============SIMPAN AKUN=======*/
async function simpanAkun(){

    const btn =
        document.getElementById("btnSimpanAkun");

    btn.disabled = true;
    btn.innerText = "Menyimpan...";

    try{

        const nama =
            document.getElementById("editNama").value.trim();

        const username =
            document.getElementById("editUsername").value.trim();

        const password =
            document.getElementById("editPassword").value.trim();

        let fotoUrl = currentUser.foto || "";

        const file =
            document.getElementById("fotoFile").files[0];

        // Upload foto jika ada file baru
        if(file){

            const base64 =
                await new Promise((resolve,reject)=>{

                    const reader = new FileReader();

                    reader.onload = () =>
                        resolve(reader.result);

                    reader.onerror = reject;

                    reader.readAsDataURL(file);
                });

            const fd = new FormData();

            fd.append("action","uploadFoto");
            fd.append("username",currentUser.username);
            fd.append("image",base64);

            const up = await fetch(API_URL,{
                method:"POST",
                body:fd
            });

            const hasil = await up.json();

            if(!hasil.status){
                throw new Error(
                    hasil.message || "Upload foto gagal"
                );
            }

            fotoUrl = hasil.url;
        }

        const fd2 = new FormData();

        fd2.append("action","updateAkun");
        fd2.append("usernameLama",currentUser.username);
        fd2.append("nama",nama);
        fd2.append("username",username);
        fd2.append("password",password);
        fd2.append("foto",fotoUrl);

        const res = await fetch(API_URL,{
            method:"POST",
            body:fd2
        });

        const hasilUpdate = await res.json();

        if(!hasilUpdate.status){
            throw new Error(
                hasilUpdate.message || "Gagal update akun"
            );
        }

        currentUser.nama = nama;
        currentUser.username = username;
        currentUser.foto = fotoUrl;

        localStorage.setItem(
            "user",
            JSON.stringify(currentUser)
        );

        document.getElementById("nama").innerText = nama;

        const fotoDashboard =
            document.getElementById("foto");

        if(fotoDashboard){
            fotoDashboard.src = fotoUrl ||
            "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        }

        alert("Akun berhasil diperbarui");

        nav("dashboard");

    }catch(err){

        console.error(err);

        alert(err.message);

    }finally{

        btn.disabled = false;
        btn.innerText = "Simpan Perubahan";

    }
}

function uploadFotoProfil(){
    alert("Cukup masukkan file foto Anda, lalu klik langsung tombol 'Simpan Perubahan' di bawah.");
}
