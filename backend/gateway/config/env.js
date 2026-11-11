const path = require("path");
const fs = require("fs");

const envPaths = [
    path.join(__dirname, "../gateway.env"),
    path.join(__dirname, "../.env"),
    path.join(process.cwd(), "gateway.env"),
    path.join(process.cwd(), ".env"),
];

for (const p of envPaths) {
    if (fs.existsSync(p)) {
        require("dotenv").config({ path: p });
    }
}
require("dotenv").config();

module.exports = {
    SERVICE_URL: process.env.SERVICE_URL || "http://localhost:3000",
    GATEWAY_PORT: parseInt(process.env.GATEWAY_PORT || "4000", 10),
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    WANTED_SERVICE_URL: process.env.WANTED_SERVICE_URL || "http://localhost:3002",
    PERSISTANCE_SERVICE_URL: process.env.PERSISTANCE_SERVICE_URL || "http://localhost:3003"
};

// Configurazione centralizzata del gateway (porte e URL dei microservizi)
