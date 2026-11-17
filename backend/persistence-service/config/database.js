// Gestisce la connessione verso il cluster remoto MongoDB Atlas
const mongoose = require("mongoose");
const env = require("./env");

async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("Connected to the database (MongoDB Atlas)");
  } catch (err) {
    console.error("Error connecting to the database:", err);
    process.exit(1);
  }
}

module.exports = connectDB;