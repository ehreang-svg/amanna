async function loadPages() {

    const app = document.getElementById("app");

    const res = await fetch("page.html");

    app.innerHTML = await res.text();

    show("splash");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    if(user){
        setTimeout(()=>{
            loadDashboard(user);
        },1200);
    }

    cekLogin();
}

window.onload = loadPages;
