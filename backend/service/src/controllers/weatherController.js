
const fetch = require('node-fetch').default;
// const fetch = require("node-fetch"); // da installare npm install node-fetch@2 -- >
// fetch una funzione che permette di fare richieste HTTP (GET, POST, PUT, DELETE) verso un server o una API. nel caso non nativo
const { getWeather } = require("../utils/apiclient");
const { normalizeWeather } = require("../utils/normalizeWeather");
const { validateCity } = require("../utils/validateCity");
const { WEATHER_API_KEY } = require("../config/env");
const { logError } = require("../utils/logger");

exports.weatherController = async (req, res) => {
  const city = req.body.city;

  console.log("DEBUG API KEY:", WEATHER_API_KEY); // Stampa la chiave API per il debug
  console.log("DEBUG CITY:", city); // Stampa la città per il debug

  if (!validateCity(city)) {
    return res.json({ error: true, message: "Citta' non valida" });
  }

  try {
    const data = await getWeather(city, WEATHER_API_KEY);

    if (data.cod !== 200) {
      return res.json({ error: true, message: "Citta' non trovata" });
    }

    return res.json(normalizeWeather(data));
  } catch (err) {
    logError(err);
    return res.json({ error: true, message: "Errore nel server" });
  }
};