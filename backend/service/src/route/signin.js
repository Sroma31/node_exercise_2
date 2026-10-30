const express = require("express");
const { signinController } = require("../controllers/signincontroller");

const router = express.Router();

/**
 * Route POST per la registrazione utente.
 * Riceve i dati inviati dal form di registrazione in signup.html.
 */
router.post("/signup", signinController);

module.exports = router;
