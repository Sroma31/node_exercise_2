const express = require("express");
const passport = require("passport");
const env = require("../../config/env");

const router = express.Router();

/**
 * Authentication routes:
 * - GET /login:                  Redirects to Google OAuth flow
 * - GET /google:                 Initiates Google OAuth authentication
 * - GET /google/callback:        Handles the Google OAuth callback (matches Google Console URI)
 * - GET /auth/google/callback:   Alias for backward compatibility
 * - GET /validate:               Checks if the current session is authenticated
 * - GET /logout:                 Destroys the session and logs the user out
 */

// Avvia direttamente il flusso Google OAuth sia da /login che da /google
router.get(["/login", "/google"], passport.authenticate("google", { scope: ["profile", "email"] }));

// Handle Google OAuth callback (supports both /google/callback and /auth/google/callback)
router.get(
    ["/google/callback", "/auth/google/callback"],
    passport.authenticate("google", { 
        failureRedirect: "/login", 
        session: true 
    }),

    (req, res) => {
        // Successful authentication – redirect to frontend (session carries the user)
        res.redirect(env.FRONTEND_URL);
    }
);

// Return the authenticated user's information if logged in
router.get("/me", (req, res) => {
    res.set("Cache-Control", "no-store"); // Prevent caching of sensitive user data
    if (req.isAuthenticated && req.isAuthenticated() && req.user) {
        return res.json({ 
            authenticated: true, 
            user: req.user,
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            displayName: req.user.displayName,
            email: req.user.email
        });
    }
    return res.json({ 
        authenticated: false, 
        user: null,
        firstName: null,
        lastName: null
    });
});



// Validate whether the current session is authenticated
router.get("/validate", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

// Logout: destroy the session and redirect to the frontend login page
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.redirect(env.FRONTEND_URL + "login");
    });
});

module.exports = router;
