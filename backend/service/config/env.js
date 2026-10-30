const path = require("path");

// Carica le variabili dal file .env nella radice del service
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();

/**
 * Validazione delle variabili d'ambiente obbligatorie all'avvio.
 * Se una variabile manca, il processo termina immediatamente con codice di errore 1.
 */
const requiredEnvVars = [
    "WEATHER_API_KEY",
    "PORT"
];

requiredEnvVars.forEach(key => {
    if (!process.env[key]) {
        console.error(`Errore critico: la variabile d'ambiente ${key} non è definita.`);
        process.exit(1);
    }
});

module.exports = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    PORT: process.env.PORT
};
