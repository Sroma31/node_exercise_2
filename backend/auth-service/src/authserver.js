/*const express = require("express");

const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3001;

app.use(express.json());

app.use("/", authRoutes);

app.listen(PORT, () => {
    console.log(`Auth Service avviato sulla porta ${PORT}`);
});*/
require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("../config/passport");
const env = require("../config/env");
const googleAuthRoutes = require("./routes/authRoutes");

const app = express();

// app.use(
//   session({
//     secret: "super-secret-key",
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app non esposta, ma protetta da proxy
app.set("trust proxy", 1);

app.use(
  session({
    //valore letto non dal codice, ma da file esterno
    secret: env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: false,
    cookie: {
      //dal browser non è possibile eseguire javascript per leggere cookie
      httpOnly: true, 
      //redirect nel browser 
      sameSite: "lax",
      //il cookie di sessione sarà trasmesso dal browser solo quando il progetto sarà in produzione
      secure: env.NODE_ENV === "production", 
      maxAge: 1000 * 60 * 60 * 8, // 8 ore
    },
    // lo MemoryStore non va bene per produzione, solo per la fase di sviluppo
    // (perchè si svuota a ogni riavvio)
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", googleAuthRoutes);

app.listen(env.AUTH_PORT, () => {
  console.log(`Auth Server avviato sulla porta ${env.AUTH_PORT}`);
});
