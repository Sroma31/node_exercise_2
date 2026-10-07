







weatherController.post('/weather', async (req, res) =>{             // Definisce la route POST per elaborare la richiesta meteo.
    const city = req.body.city;                       // Estrae la città dal corpo della richiesta.
    const apiKey = "c28acc12768cc42c658f08d6c9839b40"; // Chiave per l'API di OpenWeatherMap.

    try {                                             // Inizia un blocco try per gestire eventuali errori.
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
        ); // Chiama l'API meteo di OpenWeatherMap.

        const data = response.data;

        if (data.cod !== 200) {                       // Controlla se la risposta è valida.
            return res.json({
                error: true,
                message: "Città non trovata"
            });
        }

        res.json({
            city: data.name,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed
        }); // Invia la risposta JSON al client con i dati meteo.

    } catch (error) {
        console.error("Errore durante la richiesta meteo:", error.message);
        res.json({
            error: true,
            message: "Errore nel recupero dei dati meteo"
        });
    }
}); // Chiude la route POST /weather. 