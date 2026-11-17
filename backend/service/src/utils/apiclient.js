// gestione dell'apikey

async function getWeather(city, apiKey) {
    const encodedCity = encodeURIComponent(city.trim());
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodedCity}&appid=${apiKey}&units=metric&lang=it`;

    const response = await fetch(url); // fetch nativo di Node 24
    return response.json();
}

module.exports = { getWeather };