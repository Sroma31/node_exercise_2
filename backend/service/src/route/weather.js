// Questo file definisce la route che gestisce le richieste meteo.
// Il controller si occupa di chiamare l'API esterna e restituire i dati al client.

const express = require("express"); // Importa il framework Express.
const router = express.Router(); // Crea un router Express per raggruppare le rotte.

const { weatherController } = require("../controllers/weatherController"); // Importa la funzione getWeather dal controller.

router.post("/weather", weatherController); // Associa la route POST /weather alla funzione del controller.

module.exports = router; // Esporta il router per essere usato nel server.






































