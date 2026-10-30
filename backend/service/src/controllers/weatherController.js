const { getWeather } = require("../utils/apiclient");
const { normalizeWeather } = require("../utils/normalizeWeather");
const { validateCity } = require("../utils/validateCity");
const { WEATHER_API_KEY } = require("../../config/env");
const { logError } = require("../utils/logger");

/**
 * Controller per la gestione delle richieste meteo.
 * 1. Estrae e valida il nome della città dal body JSON
 * 2. Chiama l'API esterna OpenWeatherMap tramite apiClient
 * 3. Normalizza il payload JSON ricevuto estraendo i dati necessari per la vista
 * 4. Gestisce errori di validazione, città non trovata (404) e fallimenti di rete
 */
exports.weatherController = async (req, res) => {
  const city = req.body.city;

  console.log("DEBUG API KEY:", WEATHER_API_KEY);
  console.log("DEBUG CITY:", city);

  if (!validateCity(city)) {
    return res.json({ error: true, message: "Citta' non valida" });
  }

  try {
    const data = await getWeather(city, WEATHER_API_KEY);

    if (String(data.cod) !== "200") {
      return res.json({ error: true, message: "Citta' non trovata" });
    }

    return res.json(normalizeWeather(data));
  } catch (err) {
    logError(err);
    if (err && err.status === 404) {
      return res.json({ error: true, message: "Citta' non trovata" });
    }
    return res.json({ error: true, message: "Errore nel server" });
  }
};
