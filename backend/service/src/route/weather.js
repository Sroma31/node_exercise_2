// la route authweather è quella che gestisce il post per ottenere i dati meteo, richiama l servizio api


const express = require("express"); // Importa il framework Express.
const router = express.Router(); // Crea un router Express per gestire le rotte.

const {weathercontroller} = require("../controller/weatherController"); // Importa il controller per gestire le richieste meteo.    

router.post("/weather", weathercontroller.getWeather); // Definisce la route POST per ottenere i dati meteo.

module.exports = router; // Esporta il router per essere utilizzato nel server.