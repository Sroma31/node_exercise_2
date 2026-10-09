const express = require("express"); // Importa il framework Express.
const router = express.Router(); // Crea un router Express per raggruppare le rotte.

const { login } = require("../controllers/authcontroller"); // Importa la funzione getWeather dal controller.

router.post("/login", login); // Associa la route POST /login alla funzione del controller.

module.exports = router; // Esporta il router per essere usato nel server.
