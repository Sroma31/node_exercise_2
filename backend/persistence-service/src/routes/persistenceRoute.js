const express = require("express");
const router = express.Router();
const env = require("../../config/env");
const persistenceController = require("../controllers/persistenceController");
const userController = require("../controllers/userController");

// Middleware per chiamate interne tra microservizi
function requireInternalSecret(req, res, next) {
  const secret = req.headers["x-internal-secret"];
  if (!secret || secret !== env.INTERNAL_API_SECRET) {
    return res.status(403).json({ error: true, message: "Accesso interno negato" });
  }
  next();
}

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

// Rotta interna chiamata da auth-service dopo il login Google
router.post("/users/sync", requireInternalSecret, userController.syncGoogleUser);

// Rotte dati utente
router.get("/db", requireAuth, persistenceController.getData);
router.post("/db", requireAuth, persistenceController.saveData);

module.exports = router;