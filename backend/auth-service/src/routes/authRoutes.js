const express = require("express");
const passport = require("passport");
const env = require("../../config/env");
const router = express.Router();

// Se l'utente è già loggato, torna direttamente alla home
function skipIfAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect(env.FRONTEND_URL);
  }
  next();
}

// Avvia il login: redirect verso Google solo se non già autenticato
router.get(
  "/google",
  skipIfAuthenticated,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google rimanda qui dopo l'autenticazione
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${env.FRONTEND_URL}`,
  }),
  (req, res) => {
    res.redirect(env.FRONTEND_URL);
  }
);

// Usata dalla navbar e dai microservizi per verificare chi è loggato
router.get("/me", (req, res) => {
  res.set("Cache-Control", "no-store");

  if (!req.isAuthenticated()) {
    return res.json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    userId: req.user._id,
    googleId: req.user.googleId,
    email: req.user.email,
    displayName: req.user.displayName,
    firstName: req.user.firstName,
  });
});

// Chiude la sessione e cancella il cookie
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.redirect(env.FRONTEND_URL);
    });
  });
});

module.exports = router;