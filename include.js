async function loadPages() {

    const app = document.getElementById("app");

    const res = await fetch("page.html");

    app.innerHTML = await res.text();

    cekLogin();
}

window.onload = loadPages;