const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { GATEWAY_PORT, SERVICE_URL, API_SERVER_URL } = require("../config/env");

const app = express();

const serviceProxy = createProxyMiddleware({
    target: SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        "^/api/v1": ""
    },
    logger: console
});

const apiProxy = createProxyMiddleware({
    target: API_SERVER_URL,
    changeOrigin: true,
    pathRewrite: {
        "^/api": ""
    },
    logger: console
});

app.use("/api/v1", serviceProxy);
app.use("/api", apiProxy);

app.get("/", (req, res) => {
    res.redirect("/api/v1/");
});

app.listen(GATEWAY_PORT, () => {
    console.log("Gateway in ascolto sulla porta " + GATEWAY_PORT);
    console.log("Service: " + SERVICE_URL + " (prefisso /api/v1)");
    console.log("API server: " + API_SERVER_URL + " (prefisso /api)");
    console.log("Accedi all'indirizzo http://localhost:" + GATEWAY_PORT + "/api/v1/");
});
