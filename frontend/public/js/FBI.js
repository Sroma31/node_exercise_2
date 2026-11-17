// Chiede al servizio la scheda del giorno e la mostra nella pagina.
async function loadWantedPerson() {
    const result = document.getElementById("fbi-result");

    try {
        // Il backend chiama l'API FBI e restituisce solo i dati usati qui.
        const response = await fetch("/api/v1/wanted/api/wanted/today");
        const person = await response.json();

        if (!response.ok) {
            throw new Error(person.error || "Servizio non disponibile");
        }

        // Usiamo textContent per mostrare i dati come testo, senza eseguire HTML.
        const title = document.createElement("h2");
        title.textContent = person.title;
        result.replaceChildren(title);

        if (person.image) {
            const image = document.createElement("img");
            image.src = person.image;
            image.alt = person.title;
            image.className = "fbi-image";
            result.append(image);
        }

        if (person.description) {
            const description = document.createElement("p");
            description.textContent = person.description;
            description.className = "fbi-description";
            result.append(description);
        }

        if (Array.isArray(person.subjects) && person.subjects.length > 0) {
            const subjects = document.createElement("p");
            subjects.textContent = `Categoria: ${person.subjects.join(", ")}`;
            result.append(subjects);
        }

        if (person.reward) {
            const reward = document.createElement("p");
            reward.textContent = person.reward;
            result.append(reward);
        }

        if (person.url) {
            const link = document.createElement("a");
            link.href = person.url;
            link.textContent = "Apri la scheda ufficiale FBI";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            result.append(link);
        }
    } catch (error) {
        // Se la rete o il servizio non funzionano, spieghiamo il problema nella pagina.
        result.textContent = error.message || "Non è stato possibile caricare la scheda FBI.";
    }
}

loadWantedPerson();