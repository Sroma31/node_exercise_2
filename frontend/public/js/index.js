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

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Inserisci un elemento da salvare...";

        const saveButton = document.createElement("button");
        saveButton.textContent = "Salva su DB";

        const loadButton = document.createElement("button");
        loadButton.textContent = "Data";

        const output = document.createElement("div");
        output.className = "output";

        box.append(img, input, saveButton, loadButton, output);
        welcomeContent.appendChild(box);

        // Funzione per mostrare i record salvati in modo leggibile
        function renderItems(items) {
            if (!Array.isArray(items) || items.length === 0) {
                output.textContent = "Nessun dato salvato su MongoDB.";
                return;
            }

            const list = document.createElement("ul");
            items.forEach((item) => {
                const li = document.createElement("li");
                const dateStr = new Date(item.dataInserimento).toLocaleString("it-IT");
                li.textContent = `${item.nome} — salvato da ${item.utente} (${dateStr})`;
                list.appendChild(li);
            });
            output.replaceChildren(list);
        }

        // Salvataggio su MongoDB (POST)
        saveButton.addEventListener("click", async () => {
            const nome = input.value.trim();
            if (!nome) return;

            const res = await fetch("/api/v1/data/db", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome }),
            });
            const result = await res.json();

            if (!res.ok || result.error) {
                output.textContent = result.message || "Errore durante il salvataggio";
                return;
            }

            input.value = "";
            loadButton.click(); // Ricarica subito la lista aggiornata
        });

        // Lettura da MongoDB (GET)
        loadButton.addEventListener("click", async () => {
            const res = await fetch("/api/v1/data/db");
            const result = await res.json();

            console.log(result);

            if (!res.ok || result.error) {
                output.textContent = result.message || "Errore durante il recupero dei dati";
                return;
            }

            renderItems(result.items);
        });

    } catch (err) {
        console.error(err);
    }
}

window.addEventListener("DOMContentLoaded", loadWelcomeGif);