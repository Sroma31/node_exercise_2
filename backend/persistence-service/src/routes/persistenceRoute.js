const express = require("express");
const router = express.Router();
const persistenceController = require("../controllers/persistenceController");

// Recupera i dati dal database remoto
router.get("/db", persistenceController.getData);

// Salva un nuovo dato nel database remoto
router.post("/db", persistenceController.saveData);

module.exports = router;