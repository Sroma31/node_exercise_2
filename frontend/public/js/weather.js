document.getElementById("weather-form").addEventListener("submit", async function(e) { // Seleziona il form e ascolta l'evento di invio.
    e.preventDefault(); // evita il redirect                             // Blocca il comportamento predefinito del form.

    const city = document.getElementById("city-input").value;            // Legge il valore inserito nel campo città.

    const res = await fetch("/weather", {                                // Invia una richiesta POST al server.
        method: "POST",                                                  // Specifica il metodo POST.
        headers: {"Content-Type": "application/json" },                  // Indica che il corpo è JSON.
        body: JSON.stringify({ city })                                   // Converte l'oggetto città in stringa JSON.
    });

    const data = await res.text();                                       // Attende e legge la risposta come testo.


    // Inserisce HTML nel div del risultato.
    // Apre un div per formattare la risposta.
    // Inserisce il testo ricevuto dal server.
    // Chiude il div di formattazione.
    document.getElementById("weather-result").innerHTML = `              
        <div class="weather-response-box subtitle">                     
            ${data}                                                      
        </div>                                                           
    `;

    // Mostra il box                                                       // Commento che spiega l'azione successiva.
    document.getElementById("weather-result").style.display = "block";   // Rende visibile il box del risultato.

});

/*DOM Javascript della pagina lato client ha queste caratteristiche:
- seleziona elementi del DOM (getElementById)
- aggiunge un event listener al form per intercettare l'evento di submit
- previene il comportamento predefinito del form (redirect)
- legge il valore dell'input della città
- invia una richiesta POST al server con la città come payload JSON
- riceve la risposta dal server e la visualizza in un div dedicato
- mostra il div con il risultato della richiesta meteo*/






