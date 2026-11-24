const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const env = require("./env");

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName:
            profile.name?.givenName ||
            profile.displayName?.split(" ")[0] ||
            "utente",
          email: profile.emails?.[0]?.value,
          avatar: profile.photos?.[0]?.value || "",
        };

        // Salva o aggiorna l'utente su MongoDB tramite persistence-service
        const response = await fetch(`${env.PERSISTENCE_SERVICE_URL}/users/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": env.INTERNAL_API_SECRET,
          },
          body: JSON.stringify(googleUser),
        });

        if (!response.ok) {
          throw new Error(`Persistence service ha risposto con HTTP ${response.status}`);
        }

        const data = await response.json();

        // Passiamo a Passport l'utente persistito su MongoDB (incluso _id)
        return done(null, data.user);
      } catch (err) {
        console.error("Errore durante la sincronizzazione utente Google:", err);
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;