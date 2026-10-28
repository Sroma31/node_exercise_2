const express = require("express");
const { PORT } = require("../config/env");
const authRoutes = require("./routes/auth_routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);

app.get("/hello", (req, res) => {
    res.json({ message: "hello world" });
});

app.listen(PORT, () => {
    console.log("Auth service in ascolto sulla porta " + PORT);
    console.log("Endpoint di prova: http://localhost:" + PORT + "/hello");
});

