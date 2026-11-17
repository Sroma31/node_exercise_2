require("dotenv").config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  AUTH_PORT: parseInt(process.env.AUTH_PORT || "3001"),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4000/api/v1/",
  SESSION_SECRET: process.env.SESSION_SECRET || "dev-session-secret",
};