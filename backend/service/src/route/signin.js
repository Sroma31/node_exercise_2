const express = require("express"); // Importa il framework Express.
const router = express.Router(); // Crea un router Express per raggruppare le rotte.

const { signinController } = require("../controllers/signincontroller"); // Importa la funzione getWeather dal controller.

router.post("/signup", signinController); // Associa la route POST /signup alla funzione del controller.

module.exports = router; // Esporta il router per essere usato nel server.
