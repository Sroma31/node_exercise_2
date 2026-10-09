var express = require("express");              // Importa il framework Express.
var path = require("path");                    // Importa il modulo per gestire i percorsi dei file.
var app = express();                           // Crea l'applicazione Express.
var port = 3000;                               // Definisce la porta del server.
var bodyParser = require("body-parser");       // Importa il middleware per leggere il corpo delle richieste.

// il body parser serve per leggere i dati inviati dal form
app.use(bodyParser.json());                    // Abilita la lettura del corpo in formato JSON.
app.use(bodyParser.urlencoded({ extended: true })); // Abilita la lettura dei dati inviati dai form HTML.

var pageRoutes = require("./route/pageroutes"); // Importa le routes delle pagine statiche.
app.use("/", pageRoutes);    // Usa le routes definite in pageroutes.js per gestire le richieste alle pagine statiche.

var weatherRoutes = require("./route/weather"); // Importa le routes per le richieste meteo.
app.use("/", weatherRoutes); // Usa le routes definite in weather.js per gestire le richieste meteo.

var authRoutes = require("./route/auth"); // Importa le routes per le richieste di autenticazione.
app.use("/", authRoutes); // Usa le routes definite in auth.js per gestire le richieste di autenticazione.

var signinRoutes = require("./route/signin"); // Importa le routes per le richieste di registrazione.
app.use("/", signinRoutes); // Usa le routes definite in signin.js per gestire le richieste di registrazione.

app.use(express.static(path.join(__dirname, "../../../frontend/public"))); // Serve i file statici della cartella public.




//definizione dello stato visualizzabile da prompt
app.listen(port, ()=> {                        // Avvia il server sulla porta definita.
console.log("Server in ascolto alla porta " + port); // Scrive in console la porta di ascolto.
console.log('accedi all indirizzo http://localhost:'+port) // Scrive in console l'indirizzo da aprire nel browser.
}); // Chiude il metodo listen.






