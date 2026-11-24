require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  AUTH_PORT: parseInt(process.env.AUTH_PORT || "3001", 10),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:4000/api/v1/auth/google/callback",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4000/api/v1/",
  SESSION_SECRET: process.env.SESSION_SECRET || "dev-session-secret",
  PERSISTENCE_SERVICE_URL: process.env.PERSISTENCE_SERVICE_URL || "http://localhost:3003",
  INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET || "dev-internal-secret",
};