// Va incluso in ogni pagina al posto dello script inline che faceva fetch 
// della navbar:
//novo DOM della navbar
async function loadNavbar() {
    const container = document.getElementById("navbar");
    //se la nav non c'è chiudi -->guard clause
  

    if (!container) return;

    // 1. Inserisce l'HTML della navbar -->caricamento dom
    const html = await (await fetch("/api/v1/components/navbar.html")).text();
    container.innerHTML = html;
    const welcomeUser = document.getElementById("welcome-user");
    // 2. Chiede al backend chi è loggato
    const authArea = document.getElementById("auth-area");
    try {
        const response = await fetch("/api/v1/auth/me");//endpoint standard google

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const user = await response.json();

        if (user.authenticated) {
            //console.log(welcomeUser);
            if (welcomeUser) {welcomeUser.textContent = `Benvenuto ${user.firstName}`;}
            authArea.replaceChildren();

            const logout = document.createElement("a");
            logout.href ="/api/v1/auth/logout";
            logout.textContent ="Logout";

            authArea.append(logout);
    }
        /*____________________________________________*/
        // se non autenticato resta il link "Login With Google" già presente
    } catch (err) {
        // auth-service giù: la navbar resta in stato "non loggato"
        console.error("Impossibile verificare l'autenticazione:", err);
    }
}

window.addEventListener("DOMContentLoaded", loadNavbar);
