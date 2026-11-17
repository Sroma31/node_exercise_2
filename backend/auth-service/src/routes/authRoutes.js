
const express = require("express");
const passport = require("passport");
const env = require("../../config/env");
const router = express.Router();
//Avvia il login: redirect verso Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",//rendirizzo alla utenticazione google ogni volta che clicco su login
    //http://localhost:4000/api/v1/auth/me infatti mi diceva false sulla autenticazione ma
    //google lascia la sessione aperta
  })
);
// Google rimanda qui. Se il login riesce NON restituiamo il JSON di Google:
// la sessione contiene già l'utente, quindi riportiamo il browser sul sito.
// Sarà la navbar a chiedere /me per sapere chi è loggato.
router.get("/google/callback",
  passport.authenticate("google", {
    //failureRedirect: "/login",
    failureRedirect: `${env.FRONTEND_URL}`,
  }),
  (req, res) => {
    //console.log(req.user);
    //res.json(req.user);
    res.redirect(env.FRONTEND_URL);
  }
);
//lo scope è: login fallisce --> restituzione alla home con navbar non modificata
//login va a buon fine restituzione alla home con navbar aggiornata

// Usata dalla navbar: restituisce solo ciò che serve all'interfaccia
router.get("/me", (req, res) => {
    
    /*if (!req.user) {
        return res.json({
            authenticated: false
        });
    }*/
   // risposta dipendente dalla sessione: mai in cache
    res.set("Cache-Control", "no-store");

    if (!req.isAuthenticated()) {//json non autenticato
      return res.json({ authenticated: false });
    }
    res.json({//json autenticato
        authenticated: true,
        //firstName: req.user.displayName.split(" ")[0] //restituzione di bool e nome
        firstName: req.user.firstName,
    });

});

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