const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/env");

const app = express();

/**
 * API GATEWAY & REVERSE PROXY
 *
 * Ruoli e pattern implementati:
 * 1. API Versioning: espone tutte le risorse sotto il prefisso comune /api/v1/.
 * 2. Endpoint Hiding: maschera gli indirizzi e le porte interne dei singoli microservizi.
 *    Il client contatta solo il gateway (es. http://localhost:4000/api/v1/weather)
 *    e il proxy riscrive l'URL inoltrando la richiesta al service (es. http://localhost:3000/weather).
 * 3. Routing verso i microservizi:
 *    - /api/v1/auth   -> Auth Service (porta 3001)
 *    - /api/v1/wanted -> Wanted Service FBI Python (porta 3002)
 *    - /api/v1        -> Main Service Node/Express (porta 3000)
 */

// Proxy verso Auth Service (autenticazione / login Google)
app.use("/api/v1/auth", createProxyMiddleware({
  target: config.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/v1/auth": ""
  }
}));

// Proxy verso Wanted Service (scheda giornaliera FBI in Python)
app.use("/api/v1/wanted", createProxyMiddleware({
  target: config.WANTED_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/v1/wanted": ""
  }
}));

// Proxy predefinito verso il Main Service (pagine HTML statiche, meteo, form)
app.use("/api/v1", createProxyMiddleware({
  target: config.SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/v1": ""
  }
}));

app.listen(config.GATEWAY_PORT, () => {
  console.log(`Gateway attivo su http://localhost:${config.GATEWAY_PORT}/api/v1`);
});
