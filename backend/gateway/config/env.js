require("dotenv").config();

module.exports = {
    SERVICE_URL: process.env.SERVICE_URL || "http://localhost:3000",
    GATEWAY_PORT: parseInt(process.env.GATEWAY_PORT || "4000", 10),
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:5000",
    WANTED_SERVICE_URL: process.env.WANTED_SERVICE_URL || "http://localhost:3002"
};

//in questo caso il file serve solo per gestire comodamente il numero di porta del gateway, fuori dal codice del server
//qui env non g necessario, si puo mettere come non farlo
