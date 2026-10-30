const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config();

module.exports = {
    SERVICE_URL: process.env.SERVICE_URL || "http://localhost:3000",
    GATEWAY_PORT: parseInt(process.env.GATEWAY_PORT || "4000", 10),
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    WANTED_SERVICE_URL: process.env.WANTED_SERVICE_URL || "http://localhost:3002"
};

// Configurazione centralizzata del gateway (porte e URL dei microservizi)
