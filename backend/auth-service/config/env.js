const path = require("path");
const fs = require("fs");

const envPaths = [
    path.join(__dirname, "../auth-service.env"),
    path.join(__dirname, "../.env"),
    path.join(process.cwd(), "auth-service.env"),
    path.join(process.cwd(), ".env"),
];

for (const p of envPaths) {
    if (fs.existsSync(p)) {
        require("dotenv").config({ path: p });
    }
}
require("dotenv").config();

module.exports = {
    PORT: parseInt(process.env.AUTH_PORT || process.env.PORT || "3001", 10),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/google/callback",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4000/api/v1/",
    SESSION_SECRET: process.env.SESSION_SECRET || "super-secret-key",
};
