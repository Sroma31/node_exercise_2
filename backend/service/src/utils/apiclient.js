const fetch = require("node-fetch");

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
