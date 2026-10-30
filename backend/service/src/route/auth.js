const express = require("express");
const { login } = require("../controllers/authcontroller");

const router = express.Router();

/**
 * Route POST per l'autenticazione utente.
 * Riceve username e password inviati dal form di login.
 */
router.post("/login", login);

module.exports = router;
