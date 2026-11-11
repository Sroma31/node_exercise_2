const express = require("express");
const router = express.Router();
const { getHome } = require("../controllers/persistanceController");

// Definizione della rotta principale per il servizio di persistenza
router.get(["/", ""], getHome);

module.exports = router;
