
const express = require("express");
const env = require("../../config/env");
const router = express.Router();
//Avvia il login: redirect verso Google
router.get("/db", (req, res, next) => {
  console.log("Persistence Service attivo");

    res.json({
        service: "persistence",
        status: "ok"
    });
  });
module.exports = router;