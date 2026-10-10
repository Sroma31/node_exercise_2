const fetch = require("node-fetch").default;

async function getWeather(city, apiKey) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );
    return response.json();
}

module.exports = { getWeather };
