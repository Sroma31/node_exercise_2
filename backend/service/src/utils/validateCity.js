// utils/validateCity.js
//faccio solo un controllo sul non inserimento di numeri e con piu di un carattere (anche se era meglio regex)
function validateCity(city) {
    const regex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
    return typeof city === "string" &&
           city.trim().length > 1 &&
           regex.test(city.trim());
}


module.exports = { validateCity };