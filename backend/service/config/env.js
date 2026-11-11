const path = require("path");
const fs = require("fs");

const envPaths = [
    path.join(__dirname, "../service.env"),
    path.join(__dirname, "../.env"),
    path.join(process.cwd(), "service.env"),
    path.join(process.cwd(), ".env"),
];

for (const p of envPaths) {
    if (fs.existsSync(p)) {
        require("dotenv").config({ path: p });
    }
}
require("dotenv").config();

/**
 * Validazione delle variabili d'ambiente obbligatorie all'avvio.
 * Se PORT manca, viene impostata di default a 3000.
 */
if (!process.env.PORT) {
    process.env.PORT = "3000";
}

if (!process.env.WEATHER_API_KEY || process.env.WEATHER_API_KEY === "your_openweathermap_api_key_here") {
    console.warn("Attenzione: WEATHER_API_KEY non è configurata o contiene il valore di default. Le richieste meteo non funzioneranno finché non si inserisce una chiave valida.");
}

module.exports = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    PORT: process.env.PORT
};
