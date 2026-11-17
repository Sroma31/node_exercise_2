require("dotenv").config();

module.exports = {
    GATEWAY_PORT: parseInt(process.env.GATEWAY_PORT || "4000",10),

    SERVICE_URL: process.env.SERVICE_URL ||"http://localhost:3000",

    AUTH_SERVICE_URL:process.env.AUTH_SERVICE_URL ||"http://localhost:3001",

    WANTED_SERVICE_URL: process.env.WANTED_SERVICE_URL || "http://localhost:3002",

    PERSISTENCE_SERVICE_URL: process.env.PERSISTENCE_SERVICE_URL || "http://localhost:3003"
};