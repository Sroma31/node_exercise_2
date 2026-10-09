
const fetch = require('node-fetch');

exports.weatherController = async (req, res) => {
    const city = req.body.city;
    const apiKey = process.env.OPENWEATHERMAP_API_KEY;

    // c28acc12768cc42c658f08d6c9839b40 chiave api per meteo
   
    try {

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        
        );

        const data = await response.json();

        if (data.cod !== 200) {
            return res.json({ 
                error: true, 
                message: data.message 
            });
        }

        res.json({
            city: data.name,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            description: data.weather[0].description,
            icon: data.weather[0].icon
        });



    } catch (error) {
        console.error(error);
        res.json({ 
            error: true, 
            message: "Errore durante il recupero dei dati meteo." 
        });
    }

};