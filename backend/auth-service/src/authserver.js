const express = require("express");
const { PORT } = require("../config/env");
const authRoutes = require("./routes/auth_routes");

const app = express();

/**
 * Microservizio dedicato all'autenticazione.
 * Gestisce i flussi di login, validazione token/sessioni e logout.
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Monta le rotte di autenticazione
app.use("/", authRoutes);

// Endpoint di test dello stato del servizio
app.get("/hello", (req, res) => {
    res.json({ message: "hello world" });
});

app.listen(PORT, () => {
    console.log("Auth service in ascolto sulla porta " + PORT);
    console.log("Endpoint di prova: http://localhost:" + PORT + "/hello");
});
