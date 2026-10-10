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
