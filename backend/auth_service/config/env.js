require("dotenv").config();

module.exports = {
    PORT: parseInt(process.env.AUTH_SERVICE_PORT || process.env.AUTH_SERVER_PORT || process.env.API_SERVER_PORT || "3001", 10),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI || "http://localhost:3001/google/callback",
    GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID
};
