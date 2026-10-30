require("dotenv").config();

module.exports = {
    SERVICE_URL: process.env.SERVICE_URL || "http://localhost:3000",
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || process.env.AUTH_SERVER_URL || process.env.API_SERVER_URL || "http://localhost:3001",
    GATEWAY_PORT: parseInt(process.env.GATEWAY_PORT || "4000", 10)
};
