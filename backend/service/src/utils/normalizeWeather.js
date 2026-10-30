/**
 * Estrae e normalizza i campi essenziali dalla risposta grezza di OpenWeatherMap.
 * Filtra dati complessi o superflui, restituendo un oggetto snello per il frontend.
 * @param {object} data - Payload JSON grezzo restituito dall'API OpenWeatherMap
 * @returns {object} - Oggetto con dati meteo pronti per il rendering
 */
function normalizeWeather(data) {
    return {
        city: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon
    };
}

module.exports = { normalizeWeather };
