require("dotenv").config();

if (!process.env.MONGO_URI) {
  console.error("Errore: la variabile MONGO_URI non è definita nel file .env");
  process.exit(1);
}

module.exports = {
  PERSISTENCE_PORT: parseInt(process.env.PERSISTENCE_PORT || "3003", 10),
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  MONGO_URI: process.env.MONGO_URI,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4000/api/v1/",
  INTERNAL_API_SECRET: process.env.INTERNAL_API_SECRET || "dev-internal-secret",
};