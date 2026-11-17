window.addEventListener("DOMContentLoaded", async () => {

    try {

        const response = await fetch("/api/v1/auth/welcome");//nuova route per gestire il response

        const user = await response.json();

        const authArea =
            document.getElementById("auth-area");

        if (user.authenticated) {

            authArea.innerHTML = `
                <span>Ciao ${user.firstName}</span>
                <a href="/api/v1/auth/logout">
                    Logout
                </a>
            `;
        }

    } catch (err) {
        console.error(err);
    }

});