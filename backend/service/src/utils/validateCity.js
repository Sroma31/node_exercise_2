function validateCity(city) {
    const regex = /^[a-zA-Z\s]+$/;
    return typeof city === "string" &&
    city.trim().length >= 1 &&
    regex.test(city);
}

module.exports = { validateCity };

