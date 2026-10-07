//raccolgo qui tutte le routes delle pages, i percorsi utili per inserire l'invio delle pagine statiche
//in altre parole, tutti i get saranno gestiti qui

const express = require("express"); // Importa il framework Express.
const router = express.Router(); // Crea un router Express per gestire le rotte.
const path = require("path"); // Importa il modulo per gestire i percorsi dei file.


router.get("/", (req, res) => { // Definisce la route GET per la home page.
    res.sendFile(path.join(__dirname, "../../../../frontend/public/index.html")); // Invia il file index.html al browser.
}); // Chiude la route GET /.

router.get("/login", (req, res) => { // Definisce la route GET per la pagina di login.
    res.sendFile(path.join(__dirname, "../../../../frontend/public/login.html")); // Invia il file login.html al browser.
}); // Chiude la route GET /login.

router.get("/signup", (req, res) => { // Definisce la route GET per la pagina di registrazione.
    res.sendFile(path.join(__dirname, "../../../../frontend/public/signup.html")); // Invia il file signup.html al browser.
});

router.get("/about", (req, res) => { // Definisce la route GET per la pagina About.
    res.sendFile(path.join(__dirname, "../../../../frontend/public/about.html")); // Invia il file about.html al browser.
}); // Chiude la route GET /about.

router.get("/contact", (req, res) => { // Definisce la route GET per la pagina Contact.
    res.sendFile(path.join(__dirname, "../../../../frontend/public/contact.html")); // Invia il file contact.html al browser.
}); // Chiude la route GET /contact.

module.exports = router; // Esporta il router per essere utilizzato in altri file.  