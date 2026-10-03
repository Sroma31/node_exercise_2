document.getElementById("weather-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // evita il redirect

    const city = document.getElementById("city-input").value;

    const res = await fetch("/weather", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ city })
    });

    const data = await res.text();

    document.getElementById("weather-result").innerHTML = `
        <div class="weather-response-box subtitle">
            ${data}
        </div>
    `;

    // Mostra il box
    document.getElementById("weather-result").style.display = "block";

});

/*DOM Javascript della pagina lato client ha queste caratteristiche:
- seleziona elementi del DOM (getElementById)
- aggiunge un event listener al form per intercettare l'evento di submit
- previene il comportamento predefinito del form (redirect)
- legge il valore dell'input della città
- invia una richiesta POST al server con la città come payload JSON
- riceve la risposta dal server e la visualizza in un div dedicato
- mostra il div con il risultato della richiesta meteo*/






