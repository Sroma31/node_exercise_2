const express = require("express");
const passport = require("passport");

const router = express.Router();

/**
 * Authentication routes:
 * - GET /login:                  Redirects to Google OAuth flow
 * - GET /auth/google:            Initiates Google OAuth authentication
 * - GET /auth/google/callback:   Handles the Google OAuth callback
 * - GET /validate:               Checks if the current session is authenticated
 * - GET /logout:                 Destroys the session and logs the user out
 */

// Redirect /login to Google OAuth
router.get("/login", (req, res) => {
    res.redirect("/google");
});

// Initiate Google OAuth flow (requests profile and email scopes)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle Google OAuth callback
router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Successful authentication – redirect to home or dashboard
        res.redirect("/");
    }
);

// Validate whether the current session is authenticated
router.get("/validate", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Logout: destroy the session and redirect to login
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.redirect("/login");
    });
});

module.exports = router;
