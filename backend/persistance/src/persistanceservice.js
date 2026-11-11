const express = require("express");
const env = require("../config/env");
const persistanceRoute = require("./routes/persistance_route");

const app = express();

// Middleware per il parsing del body JSON
app.use(express.json());

//utilizzo le rotte del servizio di persistenza
app.use("/", persistanceRoute);

// Avvio del server sulla porta configurata
app.listen(env.PORT, () => {
    console.log(`Persistance Service avviato sulla porta ${env.PORT}`);
});

module.exports = app; // Esportazione dell'app per i test o per l'integrazione con altri moduli
