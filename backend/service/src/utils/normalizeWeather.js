// utils/normalizeWeather.js è l'elemento che ripulisce il json api dai dati inutili

function normalizeWeather(data) {
    return {
        city: data.name,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        wind: data.wind.speed
    };
}

module.exports = { normalizeWeather };