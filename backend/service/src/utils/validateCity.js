/**
 * Valida la stringa del nome della città inserita dall'utente.
 * Accetta solo stringhe non vuote contenenti lettere e spazi.
 * @param {string} city - Nome della città da validare
 * @returns {boolean} - true se valida, altrimenti false
 */
function validateCity(city) {
    const regex = /^[a-zA-Z\s]+$/;
    return (
        typeof city === "string" &&
        city.trim().length >= 1 &&
        regex.test(city)
    );
}

module.exports = { validateCity };
