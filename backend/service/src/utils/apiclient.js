const fetch = require("node-fetch");

/**
 * Effettua la richiesta HTTP asincrona all'API OpenWeatherMap.
 * Gestisce la codifica della query URL e il controllo dello status HTTP.
 * @param {string} city - Nome della città richiesta
 * @param {string} apiKey - Chiave API per l'accesso a OpenWeatherMap
 * @returns {Promise<object>} - Risposta JSON dell'API meteo
 */
async function getWeather(city, apiKey) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
        const error = new Error(`OpenWeatherMap error: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    return response.json();
}

module.exports = { getWeather };
