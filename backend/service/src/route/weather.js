const express = require("express");
const { weatherController } = require("../controllers/weatherController");

const router = express.Router();

/**
 * Route POST per le richieste meteo.
 * Riceve dal client il nome della città e delega la logica a weatherController.
 */
router.post("/weather", weatherController);

module.exports = router;
