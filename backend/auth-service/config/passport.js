require("dotenv").config(); // Ensure env vars are loaded if passport is required early

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Guard: fail early with a clear message if credentials are missing
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
        "Missing Google OAuth credentials. " +
        "Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file."
    );
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/auth/google/callback",
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                // Build a minimal user object from the Google profile
                const user = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    email: profile.emails?.[0]?.value,
                };

                return done(null, user);

            } catch (err) {
                return done(err, null);
            }
        }
    )
);

// Serialize the user into the session (store entire user object)
passport.serializeUser((user, done) => {
    done(null, user);
});

// Deserialize the user from the session
passport.deserializeUser((user, done) => {
    done(null, user);
});

module.exports = passport;
