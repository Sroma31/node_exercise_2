const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// Caricamento variabili d'ambiente (.env nel backend/service)
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();

const { PORT } = require("./utils/constants");
const port = PORT || 3000;

const app = express();

// Middleware di parsing: elabora richieste JSON e form URL-encoded (POST da form HTML)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registrazione router applicativi
const pageRoutes = require("./route/pageroutes");
const weatherRoutes = require("./route/weather");
const authRoutes = require("./route/auth");
const signinRoutes = require("./route/signin");

app.use("/", pageRoutes);    // Pagine HTML statiche (GET /, /about, /weather, etc.)
app.use("/", weatherRoutes); // Endpoint meteo (POST /weather)
app.use("/", authRoutes);    // Autenticazione (POST /login)
app.use("/", signinRoutes);  // Registrazione utente (POST /signup)

// Servizio file statici (HTML, CSS, JS, immagini da frontend/public)
app.use(express.static(path.join(__dirname, "../../../frontend/public")));

// Avvio del server HTTP
app.listen(port, () => {
    console.log("Server in ascolto alla porta " + port);
    console.log("Accedi all'indirizzo http://localhost:" + port);
});
