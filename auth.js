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



let usernameLama = "";
/*=========EDIT AKUN=============*/
function openEditAkun(){

    document.getElementById("editNama").value =
        currentUser.nama || "";

    document.getElementById("editUsername").value =
        currentUser.username || "";

    document.getElementById("editPassword").value = "";

    document.getElementById("previewFoto").src =
        currentUser.foto ||
        "https://cdn-icons-png.flaticon.com/512/149/149071.png";

    usernameLama = currentUser.username || "";

    nav("editAkun");
}
/*===============SIMPAN AKUN=======*/
async function simpanAkun() {

    try {

        const fotoFile =
            document.getElementById("fotoFile").files[0];

        let fotoBase64 = "";

        if (fotoFile) {

            fotoBase64 = await new Promise((resolve) => {

                const reader = new FileReader();

                reader.onload = e =>
                    resolve(e.target.result);

                reader.readAsDataURL(fotoFile);

            });

        }

        const data = {

            nama:
                document.getElementById("editNama").value.trim(),

            username:
                document.getElementById("editUsername").value.trim(),

            usernameLama:
                usernameLama,

            password:
                document.getElementById("editPassword").value.trim(),

            foto:
                fotoBase64

        };

        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type":
                    "text/plain;charset=utf-8"
            },
            body: JSON.stringify({
                action: "updateAkun",
                data: data
            })
        });

        const hasil = await res.json();

        if (hasil.status) {

            alert("Akun berhasil diperbarui");

            if (hasil.foto) {
                currentUser.foto = hasil.foto;
            }

            currentUser.nama = data.nama;
            currentUser.username = data.username;

            localStorage.setItem(
                "user",
                JSON.stringify(currentUser)
            );

        } else {

            alert(
                hasil.message ||
                "Gagal memperbarui akun"
            );

        }

    } catch (err) {

        console.error(err);

        alert(
            "Terjadi kesalahan : " +
            err.message
        );

    }

}

document.getElementById("fotoFile").addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        document.getElementById("previewFoto").src =
            e.target.result;
    };

    reader.readAsDataURL(file);

});
