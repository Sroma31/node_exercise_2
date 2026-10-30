/**
 * Costanti globali di configurazione caricate dalle variabili d'ambiente.
 */
module.exports = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    PORT: process.env.PORT || 3000
};
