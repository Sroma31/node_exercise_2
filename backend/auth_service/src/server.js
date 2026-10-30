require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require(" .. /config/passport");
const env = require(" .. /config/env");
const googleAuthRoutes = require("./routes/authRoutes");

const app = express();

app.use(
    session({
        secret: "super-secret-key",
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/", googleAuthRoutes);

app.listen(env.AUTH_PORT, ()=>{
    console.log('Auth Server avviato sulla porta $(env.AUTH_PORT}');
});