const express = require("express");

const router = express.Router();

/**
 * Rotte di gestione autenticazione:
 * - GET /login: avvia il flusso di login (es. redirect OAuth Google)
 * - GET /validate: verifica se la sessione corrente o il token è autenticato
 * - GET /logout: invalida la sessione o elimina i cookie di autenticazione
 */

router.get("/login", (req, res) => {
    res.send("Login Google");
});

router.get("/validate", (req, res) => {
    res.json({
        authenticated: false
    });
});

router.get("/logout", (req, res) => {
    res.send("Logout");
});

module.exports = router;
