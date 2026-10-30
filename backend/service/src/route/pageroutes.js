const express = require("express");
const path = require("path");
const paths = require("../../config/paths");

const router = express.Router();

/**
 * Route GET per servire le pagine HTML statiche del frontend.
 * I file inviati si trovano nella cartella frontend/public.
 */
router.get("/", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "index.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "login.html"));
});

router.get("/signup", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "signup.html"));
});

router.get("/about", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "about.html"));
});

router.get("/contact", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "contact.html"));
});

router.get("/weather", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "weather.html"));
});

module.exports = router;
