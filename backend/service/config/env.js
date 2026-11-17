// config/env.js
//gestisce e valida le variabili d’ambiente --> sicurezza che env sia corretto, accessibile e funzioni
require("dotenv").config();

// Lista delle variabili obbligatorie
const requiredVars = ["WEATHER_API_KEY", "PORT"];

// Controllo che tutte le variabili siano presenti
//per ogni key della lista sopra controlla che esistano
//per evitare il problema dell'undefined su una key
requiredVars.forEach(key => {
    if (!process.env[key]) {
        console.error(`La variabile ${key} non è definita nel file .env`);
        process.exit(1); // blocca l'avvio del server
    }
});

// Esporto le variabili già validate
module.exports = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    PORT: parseInt(process.env.PORT, 10)
};
