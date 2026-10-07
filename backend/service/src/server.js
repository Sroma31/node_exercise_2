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



app.use(express.static(path.join(__dirname, "../../../frontend/public"))); // Serve i file statici della cartella public.

//post per il login, se username e password sono corretti, invia un messaggio di successo, altrimenti invia un messaggio di errore
app.post('/login', (req, res) =>{              // Definisce la route POST per elaborare il login.
    const{username, password} = req.body;      // Estrae username e password dal corpo della richiesta.

    if(username === 'admin' && password === '1234'){ // Controlla se le credenziali sono corrette.
        res.send('Login è avvenuto con successo!');  // Risponde con un messaggio di successo.
    } else {                                     // Altrimenti le credenziali sono errate.
        res.send('Login fallito. <br> Username inserito: ' + username + ' <br> Password inserita: ' + password + '.'); // Risponde con un messaggio di errore.
    } // Chiude l'if-else.
}); // Chiude la route POST /login.

//post per la registrazione, senza persistenza
app.post('/signup', (req, res) =>{             // Definisce la route POST per elaborare la registrazione.
    const{username, password} = req.body;      // Estrae username e password dal corpo della richiesta.
    res.send('Registrazione completata per: ' + username); // Risponde confermando la registrazione.
}); // Chiude la route POST /signup.


//definizione dello stato visualizzabile da prompt
app.listen(port, ()=> {                        // Avvia il server sulla porta definita.
console.log("Server in ascolto alla porta " + port); // Scrive in console la porta di ascolto.
console.log('accedi all indirizzo http://localhost:'+port) // Scrive in console l'indirizzo da aprire nel browser.
}); // Chiude il metodo listen.






