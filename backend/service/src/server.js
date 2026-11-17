//il suo unico compito quando il sistema è strutturato bene è: importare le librerie, registrare le routes e avviare il server

const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");//non richiede installazione perche presente di default
//require("dotenv").config(); //da aggiungere per il .nev
//gestisco env da config e non direttamente dal file envù
const config = require("../config/env"); // importa PORT
//importazione dei percorsi
const paths = require("../config/paths");
// importazione delle routes
const pagesRoutes = require("./routes/pageroutes");//gestita come libreria per le routes dei get
const authRoutes = require("./routes/auth"); ////gestita come libreria per le routes dei post del login
const weatherRoutes = require("./routes/weather");

const app = express();
const port = 3000;

// config body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//usando il file path.js evitiamo i percorsi relativi che non servono piu
//app.use(express.static(path.join(__dirname, "../../../frontend/public")));//devo dichiarare dove stanno i file statici
app.use(express.static(paths.PUBLIC));
//gestione delle routes
app.use("/", pagesRoutes);
//app.use("/", authRoutes);
app.use("/", weatherRoutes);

/*app.listen(port, () => {
    console.log(`Server avviato su http://localhost:${port}`);
});*/
//prendo la porta da config/env.js
//modifiche qui, nel controller meteo e in env.js
app.listen(config.PORT, () => {
    console.log(`Server avviato su http://localhost:${config.PORT}`);
});