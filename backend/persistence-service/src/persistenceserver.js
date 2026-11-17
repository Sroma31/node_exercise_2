/*const express = require("express");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3001;

app.use(express.json());

app.use("/", authRoutes);

app.listen(PORT, () => {
    console.log(`Auth Service avviato sulla porta ${PORT}`);
});*/
require("dotenv").config();

const express = require("express");
const env = require("../config/env");
const mongopersistenceRoutes = require("./routes/persistenceRoute");

const app = express();

// app non esposta, ma protetta da proxy
app.set("trust proxy", 1);

app.use("/", mongopersistenceRoutes);

app.listen(env.PERSISTENCE_PORT, () => {
  console.log(`Auth Server avviato sulla porta ${env.PERSISTENCE_PORT}`);
});
