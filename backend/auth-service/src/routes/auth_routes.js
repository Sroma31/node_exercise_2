const express = require("express");

const router = express.Router();

router.get("/login", (req, res) => {
    res.send("Login Google");
});

router.get("/validate", (req, res) => {
    res.json({
        authenticated: false
    });
});

router.get("/logout", (req, res) => {
    res.send("Logout");
});

module.exports = router;

