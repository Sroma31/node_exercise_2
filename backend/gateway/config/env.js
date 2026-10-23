require("dotenv").config();

module.exports = {
    SERVICE_URL: process.env.SERVICE_URL || "http://localhost:3000",
    API_SERVER_URL: process.env.API_SERVER_URL || "http://localhost:5000",
    GATEWAY_PORT: parseInt(process.env.GATEWAY_PORT || "4000", 10)
};
