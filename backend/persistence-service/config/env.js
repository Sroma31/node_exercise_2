require("dotenv").config();

module.exports = {
  PERSISTENCE_PORT: parseInt(process.env.PERSISTENCE_PORT || "3003"),
  MONGO_CLIENT_ID: process.env.MONGO_CLIENT_ID,
  MONGO_CLIENT_SECRET: process.env.MONGO_CLIENT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4000/api/v1/",
};