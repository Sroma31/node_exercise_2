var express = require("express");
var path = require("path");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");

// il body parser serve per leggere i dati inviati dal form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(path.join(__dirname, "../../frontend/public")));

//pagina di login
app.get("/", (req, res) =>{
    res.sendFile(path.join(__dirname, "../../frontend/public/login.html"));
});




//post per il login, se username e password sono corretti, invia un messaggio di successo, altrimenti invia un messaggio di errore
app.post('/login', (req, res) =>{
    const{username, password} = req.body;

    if(username === 'admin' && password === '1234'){
        res.send('Login è avvenuto con successo!');
    } else {
        res.send('Login fallito. Username o password errati.');
    }
});


//definizione dello stato visualizzabile da prompt
app.listen(port, ()=> {
console.log("Server in ascolto alla porta " + port);
console.log('accedi all indirizzo http://localhost:'+port)
});



