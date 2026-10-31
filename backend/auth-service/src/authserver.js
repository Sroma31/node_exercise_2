// Load environment variables from .env file
require("dotenv").config();

// Express framework and middleware imports
const express = require("express"); // Express application framework
const session = require("express-session"); // Session management middleware
const passport = require("../config/passport"); // Passport authentication configuration
const env = require("../config/env"); // Environment variables (e.g., ports)
const googleAuthRoutes = require("./routes/auth_routes"); // Routes for Google OAuth flow

// Initialize Express app
const app = express();

// Configure session handling
app.use(
    session({
        secret: "super-secret-key", // Secret used to sign the session ID cookie
        resave: false, // Do not resave session if unchanged
        saveUninitialized: false, // Do not create session until something stored
    })
);

// Initialize Passport authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// Mount authentication routes at the root path
app.use("/", googleAuthRoutes);

// Start the authentication server listening on configured port
app.listen(env.PORT, () => {
    console.log(`Auth Server avviato sulla porta ${env.PORT}`);
});
