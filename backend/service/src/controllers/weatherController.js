const axios = require("axios"); // Importa axios per fare richieste HTTP all'API meteo.

// Definisce la funzione che gestisce la richiesta POST /weather.
const getWeather = async (req, res) => {
    const city = req.body.city; // Estrae il nome della città dal corpo della richiesta JSON.
    const apiKey = "c28acc12768cc42c658f08d6c9839b40"; // Chiave API per OpenWeatherMap.

    try { // Inizia un blocco per catturare eventuali errori.
        // Chiama l'API di OpenWeatherMap passando città, chiave e unità metriche.
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        );

        const data = response.data; // Estrae i dati JSON dalla risposta.

        // Se la risposta HTTP non è 200, la città non è stata trovata.
        if (response.status !== 200) {
            return res.json({
                error: true,
                message: "Città non trovata"
            });
        }

        // Risponde al client con i dati meteo più rilevanti.
        res.json({
            city: data.name,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        });

    } catch (error) { // Se la chiamata all'API fallisce.
        console.error("Errore durante la richiesta meteo:", error.message); // Scrive l'errore in console.
        res.json({
            error: true,
            message: "Errore nel recupero dei dati meteo"
        });
    }
};

module.exports = { getWeather }; // Esporta la funzione per usarla nelle route.
