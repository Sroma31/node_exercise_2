const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();

//Lista delle variabili obbligatorie
const requiredEnvVars = [
    "WEATHER_API_KEY", // Chiave API per il servizio meteo
    "PORT", // Porta su cui il server ascolta
];

requiredEnvVars.forEach(key => {
    if (!process.env[key]) {
        console.error(`Errore: la variabile d'ambiente ${key} non è definita.`); // Stampa un messaggio di errore se la variabile non è definita
        process.exit(1); // Termina il processo con un codice di errore
    }   
});

module.exports = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY, // Esporta la chiave API per il servizio meteo
    PORT: process.env.PORT, // Esporta la porta su cui il server ascolta
};
