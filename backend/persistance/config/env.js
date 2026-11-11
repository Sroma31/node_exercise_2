const path = require("path");
const fs = require("fs");//fs è una libreria di Node.js che fornisce funzionalità per interagire con il file system, come leggere e scrivere file, creare directory, ecc. In questo contesto, viene utilizzata per verificare l'esistenza di file .env in diverse posizioni.

// Cerca il file .env in diverse posizioni (stessa convenzione degli altri servizi)
const envPaths = [
    path.join(__dirname, "../persistance.env"),
    path.join(__dirname, "../.env"),
    path.join(process.cwd(), "persistance.env"),
    path.join(process.cwd(), ".env"),
];

// Carica il file .env se esiste in una delle posizioni specificate
for (const p of envPaths) {
    if (fs.existsSync(p)) {
        require("dotenv").config({ path: p });
    }
}
require("dotenv").config();


//valida e imposta le variabili di ambiente necessarie per il servizio di persistenza
if (!process.env.PORT) {// Se la variabile di ambiente PORT non è impostata, assegna un valore predefinito
    process.env.PORT = "3003";
}

module.exports = {
    PORT: parseInt(process.env.PORT || "3003", 10),// Imposta la porta del servizio di persistenza, con un valore predefinito di 3003
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:3001"
};
