async function loadWelcomeGif() {
    try {
        const response = await fetch("/api/v1/auth/me");
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const user = await response.json();
        if (!user.authenticated) {
            return;
        }

        const welcomeContent = document.getElementById("welcome-content");
        if (!welcomeContent) {
            return;
        }

        const box = document.createElement("div");
        box.className = "welcome-box";

        const img = document.createElement("img");
        img.src = "https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif";
        img.alt = "Welcome Gif";

        // Input e pulsante per inviare un dato a MongoDB (POST /api/v1/data/db)
        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Inserisci un nome da salvare...";

        const saveButton = document.createElement("button");
        saveButton.textContent = "Salva su MongoDB";

        // Pulsante esistente per leggere i dati da MongoDB (GET /api/v1/data/db)
        const button = document.createElement("button");
        button.textContent = "Data";

        const output = document.createElement("div");
        output.className = "output";

        box.append(img, input, saveButton, button, output);
        welcomeContent.appendChild(box);

        // Salvataggio su MongoDB
        saveButton.addEventListener("click", async () => {
            const nome = input.value.trim();
            if (!nome) return;

            const response = await fetch("/api/v1/data/db", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome }),
            });
            const result = await response.json();
            input.value = "";
            output.textContent = JSON.stringify(result, null, 2);
        });

        // Lettura da MongoDB
        button.addEventListener("click", async () => {
            const response = await fetch("/api/v1/data/db");
            const result = await response.json();

            console.log(result);
            output.textContent = JSON.stringify(result, null, 2);
        });

    } catch (err) {
        console.error(err);
    }
}

window.addEventListener("DOMContentLoaded", loadWelcomeGif);