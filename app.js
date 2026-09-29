var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require("body-parser");

// il body parser serve per leggere i dati inviati dal form
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//spedizione del messaggio alla porta local host
app.get("/", (req, res) =>{
res.sendFile(__dirname + "/index.html");
});

//definizione dello stato visualizzabile da prompt
app.listen(port, ()=> {
console.log("Server in ascolto alla porta " + port);
console.log('accedi all indirizzo http://localhost:'+port)
})


app.post('/submit', (req, res) =>{
console.log(req.body); // Visualizza il JSON nel terminale
})

