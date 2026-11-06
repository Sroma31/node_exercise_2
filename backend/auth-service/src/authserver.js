// Load environment variables from .env file
require("dotenv").config();

// Express framework and middleware imports
const express = require("express"); // Express application framework
const env = require("../config/env"); // Environment variables (e.g., ports) - loaded first
const session = require("express-session"); // Session management middleware
const passport = require("../config/passport"); // Passport authentication configuration
const googleAuthRoutes = require("./routes/auth_routes"); // Routes for Google OAuth flow

// Initialize Express app
const app = express();

app.set("trust proxy", 1); // Trust first proxy (useful if behind a reverse proxy)

// Configure session handling
app.use(
    session({
        secret: env.SESSION_SECRET, // Secret used to sign the session ID cookie
        resave: false, // Do not resave session if unchanged
        saveUninitialized: false, // Do not create session until something stored
        
        cookie: {
            httpOnly: true, // Prevent client-side JS from accessing the cookie
            sameSite: "lax", // CSRF protection
            secure: env.NODE_ENV === "production", // Use secure cookies in production only https
            maxAge: 1000 * 60 * 60 * 8 // 8 hours
        }

        // Note: In production, consider using a persistent session store (e.g., Redis) instead of the default in-memory store
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
