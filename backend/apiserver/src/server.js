const express = require("express");
const { PORT } = require("../config/env");

const app = express();

app.get("/hello", (req, res) => {
    res.json({ message: "hello world" });
});

app.listen(PORT, () => {
    console.log("API server in ascolto sulla porta " + PORT);
    console.log("Endpoint di prova: http://localhost:" + PORT + "/hello");
});
