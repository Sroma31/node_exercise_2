//raccolgo qui tutte le routes delle pages, ossia i percorsi utili per gestire l'invio delle pagine statiche
//in altri termini tutti i get saranno raccolti qui

const express = require("express");
const router = express.Router();
const paths = require("../../config/paths");
const path = require("path");

// HOME
router.get("/", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "index.html"));
});

// LOGIN
router.get("/login", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "login.html"));
});

// ABOUT
router.get("/about", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "about.html"));
});

// SIGNIN
router.get("/signin", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "signin.html"));
});

// WEATHER
router.get("/weather", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "weather.html"));
});

module.exports = router;
