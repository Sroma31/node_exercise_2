const env = require("./env");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// Guard: fail early with a clear message if credentials are missing
if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    throw new Error(
        "Missing Google OAuth credentials. " +
        "Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env or auth-service.env file."
    );
}

passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL || "http://localhost:3001/google/callback",
        },

        async (accessToken, refreshToken, profile, done) => {
            try {
                // Build a minimal user object from the Google profile
                const user = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name?.givenName || profile.displayName?.split(" ")[0] || "user",
                    lastName: profile.name?.familyName || profile.displayName?.split(" ").slice(1).join(" ") || "",
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
