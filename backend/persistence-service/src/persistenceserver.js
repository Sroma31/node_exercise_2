require("dotenv").config();

const express = require("express");
const env = require("../config/env");
const connectDB = require("../config/database");
const mongopersistenceRoutes = require("./routes/persistenceRoute");

const app = express();

app.set("trust proxy", 1);

// Middleware per leggere req.body nelle richieste JSON e da form HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", mongopersistenceRoutes);

// Connette prima a MongoDB Atlas e poi mette in ascolto il server HTTP
connectDB().then(() => {
  app.listen(env.PERSISTENCE_PORT, () => {
    console.log(`Persistence Server avviato sulla porta ${env.PERSISTENCE_PORT}`);
  });
});