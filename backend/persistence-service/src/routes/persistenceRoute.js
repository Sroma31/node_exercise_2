const express = require("express");
const router = express.Router();
const env = require("../../config/env");
const persistenceController = require("../controllers/persistenceController");

// Middleware: verifica che l'utente sia autenticato tramite auth-service
async function requireAuth(req, res, next) {
  try {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      return res.status(401).json({ error: true, message: "Accesso non autorizzato: effettua il login" });
    }

    const authResponse = await fetch(`${env.AUTH_SERVICE_URL}/me`, {
      headers: { cookie: cookieHeader },
    });

    if (!authResponse.ok) {
      return res.status(401).json({ error: true, message: "Sessione non valida" });
    }

    const sessionData = await authResponse.json();
    if (!sessionData.authenticated) {
      return res.status(401).json({ error: true, message: "Utente non autenticato" });
    }

    req.user = sessionData;
    next();
  } catch (err) {
    console.error("Errore verifica sessione:", err);
    res.status(502).json({ error: true, message: "Servizio di autenticazione non raggiungibile" });
  }
}

router.get("/db", requireAuth, persistenceController.getData);
router.post("/db", requireAuth, persistenceController.saveData);

module.exports = router;