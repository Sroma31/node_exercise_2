# Guida completa al progetto `node_exercise_2` — commento riga per riga

Questo documento descrive l'intero progetto e riporta il codice di ogni file con spiegazioni dettagliate riga per riga o blocco per blocco, illustrando cosa accade a livello architetturale ed esecutivo quando il codice viene interpretato ed eseguito.

---

## 1. Cosa è questo progetto

È un'**applicazione web full-stack didattica** sviluppata per comprendere i concetti fondamentali dell'ingegneria del software web moderno:

- **Modello Client-Server e protocollo HTTP**: richiesta e risposta, metodi HTTP (`GET`, `POST`), codici di stato (`200 OK`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`, `502 Bad Gateway`), header e cookie.
- **Architettura a Microservizi**: scomposizione dell'applicazione in servizi indipendenti e specializzati, ciascuno con la propria responsabilità e porta dedicata.
- **API Gateway e Reverse Proxy**: un punto di ingresso unico (`http://localhost:4000/api/v1/`) che riceve tutte le richieste dal browser e le smista internamente verso il microservizio competente.
- **API Versioning & Endpoint Hiding**: mascheramento degli indirizzi reali dei server interni e versionamento degli endpoint pubblici sotto `/api/v1/`.
- **Autenticazione federata con Google OAuth 2.0**: flusso di login con provider esterno, delega dell'identità, gestione di token e profili tramite **Passport.js**.
- **Gestione delle Sessioni e Cookie HTTP**: memorizzazione dello stato di autenticazione lato server (`express-session`) associato a un cookie `connect.sid` crittografato e protetto (`HttpOnly`, `SameSite`).
- **Integrazione con API REST esterne di terze parti**:
  - *OpenWeatherMap API*: recupero previsioni meteo in tempo reale da servizio Node.js;
  - *FBI Wanted Public API*: recupero e normalizzazione giornaliera della lista dei ricercati federali tramite microservizio Python.
- **Frontend Modulare con JavaScript Vanilla**:
  - Pagine HTML5 semantiche e responsive;
  - Componenti condivisi (barra di navigazione e piè di pagina) caricati dinamicamente via `fetch()` da `navbar.js` e `auth.js`;
  - Adattamento automatico dell'interfaccia allo stato di login dell'utente (mostra nome utente e logout, oppure login e signup);
  - Chiamate AJAX/Fetch asincrone senza ricaricamento dell'intera pagina.
- **Automazione su ambiente Windows**: script batch `.bat` per installare le dipendenze npm e orchestrare l'avvio coordinato dei 4 microservizi in terminali distinti.

---

## 2. Tecnologie e librerie usate

### Lato backend (Node.js & Python)

| Tecnologia / Modulo | Servizio | A cosa serve |
|---|---|---|
| **Node.js** | Tutti i servizi JS | Ambiente di esecuzione JavaScript lato server ad alte prestazioni asincrone. |
| **Express** | Gateway, Service, Auth Service | Framework web minimale per gestire routing, middleware e server HTTP. |
| **http-proxy-middleware** | Gateway (`:4000`) | Crea il reverse proxy che inoltra e riscrive le richieste da `/api/v1/...` verso i servizi backend interni. |
| **passport** | Auth Service (`:3001`) | Middleware di autenticazione flessibile e modulare per Node.js. |
| **passport-google-oauth20** | Auth Service (`:3001`) | Strategia di autenticazione Google OAuth 2.0 per Passport. |
| **express-session** | Auth Service (`:3001`) | Gestione delle sessioni utente lato server tramite cookie di sessione crittografati (`connect.sid`). |
| **body-parser** | Main Service (`:3000`) | Middleware per leggere e parsare il corpo delle richieste HTTP in formato JSON e URL-encoded (form). |
| **node-fetch** | Main Service (`:3000`) | Client HTTP per effettuare richieste asincrone all'API meteo OpenWeatherMap. |
| **dotenv** | Tutti i servizi JS | Carica le variabili di configurazione dai file `.env` nelle proprietà `process.env`. |
| **Python 3** | Wanted Service (`:3002`) | Linguaggio per il microservizio FBI (`http.server`, `urllib.request`, `json`, `datetime`). |

### Lato frontend

| Tecnologia | A cosa serve |
|---|---|
| **HTML5** | Struttura semantica delle pagine (`<nav>`, `<main>`, `<section>`, `<footer>`, `<form>`). |
| **CSS3** | Stili moderni, Flexbox per layout a tutta altezza (`min-height: 100vh`), ombre (`box-shadow`), animazioni di entrata (`@keyframes fadeIn`) e media queries per smartphone. |
| **JavaScript Vanilla (ES6+)** | Manipolazione del DOM, gestione eventi submit/click, rendering asincrono. |
| **Fetch API** | Esecuzione di richieste HTTP asincrone (GET e POST) dal browser verso il Gateway. |

---

## 3. Struttura del progetto

```plaintext
node_exercise_2/
├── backend/
│   ├── auth-service/                     # Microservizio Autenticazione (porta 3001)
│   │   ├── config/
│   │   │   ├── env.js                    # Configurazione e fallback variabili d'ambiente
│   │   │   └── passport.js               # Strategia Google OAuth 2.0, serializzazione/deserializzazione sessione
│   │   ├── src/
│   │   │   ├── authserver.js             # Entry point del server Express di autenticazione
│   │   │   └── routes/
│   │   │       └── auth_routes.js        # Route /login, /google, /google/callback (alias /auth/google/callback), /me, /validate, /logout
│   │   ├── .env                          # Variabili locali (PORT=3001, GOOGLE_CLIENT_ID, SECRET)
│   │   └── package.json                  # Dipendenze: express, passport, passport-google-oauth20, express-session
│   ├── gateway/                          # API Gateway & Reverse Proxy (porta 4000)
│   │   ├── config/
│   │   │   └── env.js                    # Porte e URL di routing dei microservizi
│   │   ├── src/
│   │   │   └── gateway.js                # Entry point del Gateway: monta i reverse proxy su /api/v1/
│   │   ├── .env                          # Variabili gateway (GATEWAY_PORT=4000, SERVICE_URL, etc.)
│   │   └── package.json                  # Dipendenze: express, http-proxy-middleware, dotenv
│   ├── service/                          # Main Service: Meteo e Pagine Statiche (porta 3000)
│   │   ├── config/
│   │   │   ├── env.js                    # Validazione variabili obbligatorie (WEATHER_API_KEY, PORT)
│   │   │   └── paths.js                  # Percorsi centralizzati del filesystem verso frontend/public
│   │   ├── src/
│   │   │   ├── server.js                 # Entry point del server principale Express
│   │   │   ├── controllers/
│   │   │   │   ├── weatherController.js  # Coordinatore chiamata API meteo e gestione errori 404
│   │   │   │   ├── authcontroller.js     # Controller mock login con credenziali fisse
│   │   │   │   └── signincontroller.js   # Controller mock registrazione utente
│   │   │   ├── route/
│   │   │   │   ├── pageroutes.js         # Route GET per servire le pagine HTML statiche
│   │   │   │   ├── weather.js            # Route POST /weather
│   │   │   │   ├── auth.js               # Route POST /login
│   │   │   │   └── signin.js             # Route POST /signup
│   │   │   └── utils/
│   │   │       ├── apiclient.js          # Chiamata HTTP con fetch a OpenWeatherMap
│   │   │       ├── validateCity.js       # Validazione regex del nome città
│   │   │       ├── normalizeWeather.js   # Estrazione campi essenziali del payload meteo
│   │   │       ├── logger.js             # Helper centralizzato per console.error
│   │   │       └── constants.js          # Esportazione costanti PORT e WEATHER_API_KEY
│   │   ├── .env                          # Variabili di servizio (PORT=3000, WEATHER_API_KEY)
│   │   └── package.json                  # Dipendenze: express, body-parser, node-fetch, dotenv
│   ├── wanted_service/                   # Microservizio Python FBI (porta 3002)
│   │   ├── server.py                     # Server HTTP Python con SimpleHTTPRequestHandler e fetch FBI
│   │   ├── utils/
│   │   │   └── converter.py              # Normalizzazione payload FBI e validazione link sicuri
│   │   └── .env                          # Porta WANTED_PORT=3002
│   └── readme.md                         # Appunti didattici sulle funzioni dell'API Gateway
├── documentation/
│   ├── changelog.md                      # Storico di tutte le versioni e modifiche apportate
│   ├── progetto-guida.md                 # Questo documento di guida completa commentata
│   └── readme.md                         # Documentazione generale e guida rapida
├── frontend/
│   └── public/                           # Risorse statiche servite al browser
│       ├── components/
│       │   ├── navbar.html               # Barra di navigazione condivisa con voci dinamiche di login/logout
│       │   └── footer.html               # Piè di pagina condiviso con copyright
│       ├── css/
│       │   ├── navbar.css                # Stile barra di navigazione e menu responsive
│       │   ├── footer.css                # Stile piè di pagina con margin-top automatico
│       │   ├── index.css                 # Stile home page
│       │   ├── weather.css               # Stile pagina meteo
│       │   ├── fbi.css                   # Stile scheda ricercati FBI
│       │   ├── login.css                 # Stile pagina login con divisore e pulsante Google
│       │   ├── signup.css                # Stile pagina registrazione
│       │   ├── about.css                 # Stile pagina About con elenco spuntato
│       │   └── contact.css               # Stile pagina Contatti
│       ├── js/
│       │   ├── navbar.js                 # Gestore caricamento componenti e controllo sessione utente
│       │   ├── auth.js                   # Wrapper di compatibilità per la sessione utente
│       │   ├── weather.js                # Intercettazione form meteo e chiamata asincrona
│       │   └── FBI.js                    # Richiesta e rendering sicuro della scheda ricercato FBI
│       ├── index.html                    # Pagina iniziale Home
│       ├── weather.html                  # Pagina consultazione meteo
│       ├── FBI.html                      # Pagina ricercato FBI del giorno
│       ├── login.html                    # Pagina di accesso (credenziali classiche o Google)
│       ├── signup.html                   # Pagina di registrazione account
│       ├── about.html                    # Pagina informativa Chi Siamo
│       └── contact.html                  # Pagina con contatti e recapiti
├── install_module.bat                    # Script batch Windows per eseguire npm install in tutti i servizi Node
├── run.bat                               # Script batch Windows per avviare contemporaneamente i 4 microservizi
├── uninstall_module.bat                  # Script batch Windows per eliminare tutte le cartelle node_modules
└── .gitignore                            # Esclusione dai commit Git per file .env, node_modules e cache
```

---

## 4. Come funziona il backend (Architettura a Microservizi)

L'applicazione non è un monolite, ma una federazione di 4 servizi cooperanti:

```text
               +----------------------------------------+
               |        Client Web / Browser            |
               |     (http://localhost:4000/api/v1/)    |
               +-------------------+--------------------+
                                   |
                                   | Richieste HTTP
                                   v
               +-------------------+--------------------+
               |           API GATEWAY                  |
               |        (Porta 4000 Express)            |
               +---------+---------+---------+----------+
                         |         |         |
      /api/v1/auth/*     |         |         |  /api/v1/*
     (riscritto in /*)   |         |         | (riscritto in /*)
                         v         |         v
     +-------------------+---+     |   +-----+------------------+
     |     AUTH SERVICE      |     |   |      MAIN SERVICE      |
     |   (Porta 3001 Node)   |     |   |   (Porta 3000 Node)    |
     | - Passport Google     |     |   | - Servizio file statici|
     | - express-session     |     |   | - Route meteo POST     |
     | - /me, /validate      |     |   | - OpenWeatherMap API   |
     +-----------------------+     |   +------------------------+
                                   |
                                   | /api/v1/wanted/*
                                   | (riscritto in /*)
                                   v
                     +-------------+------------+
                     |      WANTED SERVICE      |
                     |    (Porta 3002 Python)   |
                     | - SimpleHTTPRequestHandler|
                     | - FBI Wanted Public API  |
                     +--------------------------+
```

### 1. API Gateway (`backend/gateway/`, porta 4000)
- È l'**unico punto di ingresso esposto al client**.
- Utilizza `http-proxy-middleware` per instradare le richieste:
  - Tutte le richieste che iniziano con `/api/v1/auth` vengono spogliate del prefisso e girate a `http://localhost:3001`;
  - Tutte le richieste che iniziano con `/api/v1/wanted` vengono girate a `http://localhost:3002`;
  - Tutte le altre richieste sotto `/api/v1` vengono girate al Main Service a `http://localhost:3000`.
- Implementa l'**Endpoint Hiding**: il browser non conosce gli indirizzi o le porte reali dei microservizi interni.
- Implementa l'**API Versioning**: garantisce che tutte le API siano accessibili sotto una versione stabile (`/v1`).

### 2. Auth Service (`backend/auth-service/`, porta 3001)
- Gestisce l'identità e la persistenza della sessione.
- Utilizza **Passport.js** configurato con `GoogleStrategy`:
  1. Il client clicca "Accedi con Google" (`/api/v1/auth/google`);
  2. Il gateway inoltra la richiesta all'Auth Service;
  3. L'Auth Service reindirizza il browser alla schermata di consenso Google;
  4. Google rimanda l'utente alla callback configurata (`http://localhost:3001/google/callback`) fornendo un authorization code;
  5. L'Auth Service scambia il codice con il profilo utente (Google ID, nome, cognome, email);
  6. Viene creata una sessione in memoria con `express-session` e inviato al browser un cookie `connect.sid`;
  7. L'utente viene reindirizzato alla Home page (`http://localhost:4000/api/v1/`).
- Endpoint `/me`: interrogato dalla navbar per verificare se l'utente è autenticato e ricavarne il nome.

### 3. Main Service (`backend/service/`, porta 3000)
- Fornisce le pagine HTML statiche (`pageroutes.js`).
- Gestisce la consultazione meteo:
  1. Riceve `POST /weather` con payload JSON `{ city: "Roma" }`;
  2. Valida la sintassi del nome della città tramite regex alfabetica (`validateCity.js`);
  3. Effettua una chiamata HTTP GET autenticata verso OpenWeatherMap (`apiclient.js`);
  4. In caso di errore (es. città inesistente 404), restituisce un messaggio appropriato;
  5. Se la città esiste, normalizza il payload JSON (`normalizeWeather.js`) ed estrae temperatura, umidità, velocità del vento e codice icona.

### 4. Wanted Service (`backend/wanted_service/`, porta 3002)
- Microservizio realizzato in Python 3 puro, senza dipendenze esterne.
- Interroga l'API ufficiale dell'FBI (`https://api.fbi.gov/wanted/v1/list`).
- Esegue un algoritmo deterministico giornaliero basato sull'ordinale della data (`date.today().toordinal()`), così che tutti gli utenti visualizzino la stessa scheda nel corso della giornata.
- Filtra preferenzialmente i ricercati con stato `wanted` e valida i link esterni con `safe_fbi_url` (ammettendo esclusivamente domini `https://www.fbi.gov`).

---

## 5. Come funziona il frontend

### Componenti modulari e Gestione della Sessione (`navbar.js`)
Invece di duplicare la barra di navigazione e il piè di pagina in tutti i file HTML, ciascuna pagina contiene:
```html
<div id="navbar"></div>
...
<div id="footer"></div>
<script src="/api/v1/js/navbar.js"></script>
```

Al caricamento del DOM, `navbar.js`:
1. Esegue una richiesta `fetch('/api/v1/components/navbar.html')` e inietta il codice HTML in `#navbar`;
2. Esegue una richiesta `fetch('/api/v1/components/footer.html')` e inietta il codice HTML in `#footer`;
3. Interroga l'endpoint `/api/v1/auth/me` con l'opzione `{ credentials: 'include' }` (necessaria affinché il browser trasmetta il cookie di sessione attraverso il reverse proxy);
4. Se l'utente è autenticato (`authenticated: true`):
   - Nasconde i pulsanti "Login" e "Signup";
   - Mostra il nome dell'utente (`✓ Nome`) e il collegamento per effettuare il "Logout" (`/api/v1/auth/logout`);
5. Se l'utente non è autenticato:
   - Mostra regolarmente "Login" e "Signup", nascondendo i campi profilo.

### Interattività asincrona Meteo (`weather.js`)
- Il form intercetta l'evento `submit`, blocca il reload predefinito (`event.preventDefault()`) e legge il valore dell'input;
- Invia una richiesta `POST /api/v1/weather` con header `Content-Type: application/json`;
- In base alla risposta JSON ricevuta dal server:
  - Se è presente `error: true`, mostra un riquadro rosso col messaggio d'errore;
  - Se il risultato è valido, costruisce dinamicamente la scheda con temperatura, umidità, vento e icona ufficiale OpenWeatherMap.

---

## 6. Dipendenze nei `package.json`

Ciascun microservizio Node.js dispone del proprio file `package.json` isolato.

### `backend/gateway/package.json`
```json
{
  "dependencies": {
    "body-parser": "^1.20.3",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "http-proxy-middleware": "^4.2.0",
    "node-fetch": "^3.3.2"
  }
}
```
- **express**: server web HTTP per il Gateway;
- **http-proxy-middleware**: il cuore del reverse proxy per inoltrare e riscrivere gli URL;
- **dotenv**: lettura sicura delle porte e degli URL dai file `.env`.

### `backend/auth-service/package.json`
```json
{
  "name": "auth-service",
  "version": "1.0.0",
  "description": "Servizio di autenticazione",
  "main": "src/authserver.js",
  "scripts": {
    "start": "node src/authserver.js"
  },
  "dependencies": {
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "express-session": "^1.19.0",
    "passport": "^0.7.0",
    "passport-google-oauth20": "^2.0.0"
  }
}
```
- **express-session**: gestione delle sessioni basate su cookie;
- **passport** e **passport-google-oauth20**: strategia per l'autenticazione tramite Google OAuth 2.0.

### `backend/service/package.json`
```json
{
  "dependencies": {
    "body-parser": "^1.20.3",
    "dotenv": "^16.4.5",
    "express": "^4.21.1",
    "node-fetch": "^2.7.0"
  }
}
```
- **body-parser**: lettura payload JSON e form URL-encoded;
- **node-fetch**: client HTTP per chiamare l'API esterna OpenWeatherMap.

---

## 7. Codice completo commentato riga per riga

Di seguito viene riportato il codice sorgente completo di tutti i file dell'applicazione, suddivisi per componente.


### Script di Automazione Windows

#### `install_module.bat`

```batch
@echo off
title Installazione dipendenze Node.js

cd /d "%~dp0"

echo.
echo ==============================
echo INSTALLAZIONE GATEWAY
echo ==============================
cd backend\gateway
call npm install

echo.
echo ==============================
echo INSTALLAZIONE AUTH-SERVICE
echo ==============================
cd ..\auth-service
call npm install

echo.
echo ==============================
echo INSTALLAZIONE SERVICE
echo ==============================
cd ..\service
call npm install

echo.
echo ==============================
echo INSTALLAZIONE COMPLETATA
echo ==============================
echo.

pause
```

---

#### `run.bat`

```batch
@echo off

cd /d "%~dp0"

start "Auth Service" cmd /k "cd backend\auth-service && node src\authserver.js"

start "Service" cmd /k "cd backend\service && node src\server.js"

start "Gateway" cmd /k "cd backend\gateway && node src\gateway.js"

if exist backend\wanted_service\server.py (
    start "Wanted Service" cmd /k "cd backend\wanted_service && python server.py"
)

pause
```

---

#### `uninstall_module.bat`

```batch
@echo off
title Rimozione node_modules

cd /d "%~dp0"

echo.
echo ==============================
echo RIMOZIONE GATEWAY
echo ==============================
rmdir /s /q backend\gateway\node_modules

echo.
echo ==============================
echo RIMOZIONE AUTH-SERVICE
echo ==============================
rmdir /s /q backend\auth-service\node_modules

echo.
echo ==============================
echo RIMOZIONE SERVICE
echo ==============================
rmdir /s /q backend\service\node_modules

echo.
echo ==============================
echo RIMOZIONE COMPLETATA
echo ==============================

pause
```

---


### Backend — API Gateway (`backend/gateway`)

#### `backend/gateway/config/env.js`

```javascript
const path = require("path");
const fs = require("fs");

const envPaths = [
    path.join(__dirname, "../gateway.env"),
    path.join(__dirname, "../.env"),
    path.join(process.cwd(), "gateway.env"),
    path.join(process.cwd(), ".env"),
];

for (const p of envPaths) {
    if (fs.existsSync(p)) {
        require("dotenv").config({ path: p });
    }
}
require("dotenv").config();

module.exports = {
    SERVICE_URL: process.env.SERVICE_URL || "http://localhost:3000",
    GATEWAY_PORT: parseInt(process.env.GATEWAY_PORT || "4000", 10),
    AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
    WANTED_SERVICE_URL: process.env.WANTED_SERVICE_URL || "http://localhost:3002"
};

// Configurazione centralizzata del gateway (porte e URL dei microservizi)
```

---

#### `backend/gateway/src/gateway.js`

```javascript
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const config = require("../config/env");

const app = express();

/**
 * API GATEWAY & REVERSE PROXY
 *
 * Ruoli e pattern implementati:
 * 1. API Versioning: espone tutte le risorse sotto il prefisso comune /api/v1/.
 * 2. Endpoint Hiding: maschera gli indirizzi e le porte interne dei singoli microservizi.
 *    Il client contatta solo il gateway (es. http://localhost:4000/api/v1/weather)
 *    e il proxy riscrive l'URL inoltrando la richiesta al service (es. http://localhost:3000/weather).
 * 3. Routing verso i microservizi:
 *    - /api/v1/auth   -> Auth Service (porta 3001)
 *    - /api/v1/wanted -> Wanted Service FBI Python (porta 3002)
 *    - /api/v1        -> Main Service Node/Express (porta 3000)
 */

// Proxy verso Auth Service (autenticazione / login Google)
app.use("/api/v1/auth", createProxyMiddleware({
  target: config.AUTH_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/v1/auth": ""
  }
}));

// Proxy verso Wanted Service (scheda giornaliera FBI in Python)
app.use("/api/v1/wanted", createProxyMiddleware({
  target: config.WANTED_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/v1/wanted": ""
  }
}));

// Proxy predefinito verso il Main Service (pagine HTML statiche, meteo, form)
app.use("/api/v1", createProxyMiddleware({
  target: config.SERVICE_URL,
  changeOrigin: true,
  pathRewrite: {
    "^/api/v1": ""
  }
}));

app.listen(config.GATEWAY_PORT, () => {
  console.log(`Gateway attivo su http://localhost:${config.GATEWAY_PORT}/api/v1`);
});
```

---


### Backend — Microservizio Autenticazione (`backend/auth-service`)

#### `backend/auth-service/config/env.js`

```javascript
const path = require("path");
const fs = require("fs");

const envPaths = [
    path.join(__dirname, "../auth-service.env"),
    path.join(__dirname, "../.env"),
    path.join(process.cwd(), "auth-service.env"),
    path.join(process.cwd(), ".env"),
];

for (const p of envPaths) {
    if (fs.existsSync(p)) {
        require("dotenv").config({ path: p });
    }
}
require("dotenv").config();

module.exports = {
    PORT: parseInt(process.env.AUTH_PORT || process.env.PORT || "3001", 10),
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3001/google/callback",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:4000/api/v1/",
    SESSION_SECRET: process.env.SESSION_SECRET || "super-secret-key",
};
```

---

#### `backend/auth-service/config/passport.js`

```javascript
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
```

---

#### `backend/auth-service/src/authserver.js`

```javascript
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
```

---

#### `backend/auth-service/src/routes/auth_routes.js`

```javascript
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

// Redirect /login to Google OAuth
router.get("/login", (req, res) => {
    res.redirect("/google");
});

// Initiate Google OAuth flow (requests profile and email scopes)
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

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
```

---


### Backend — Servizio Principale (`backend/service`)

#### `backend/service/config/env.js`

```javascript
const path = require("path");
const fs = require("fs");

const envPaths = [
    path.join(__dirname, "../service.env"),
    path.join(__dirname, "../.env"),
    path.join(process.cwd(), "service.env"),
    path.join(process.cwd(), ".env"),
];

for (const p of envPaths) {
    if (fs.existsSync(p)) {
        require("dotenv").config({ path: p });
    }
}
require("dotenv").config();

/**
 * Validazione delle variabili d'ambiente obbligatorie all'avvio.
 * Se una variabile manca, il processo termina immediatamente con codice di errore 1.
 */
const requiredEnvVars = [
    "WEATHER_API_KEY",
    "PORT"
];

requiredEnvVars.forEach(key => {
    if (!process.env[key]) {
        console.error(`Errore critico: la variabile d'ambiente ${key} non è definita.`);
        process.exit(1);
    }
});

module.exports = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    PORT: process.env.PORT
};
```

---

#### `backend/service/config/paths.js`

```javascript
const path = require("path");

/**
 * Mappatura centralizzata dei percorsi del filesystem per il service.
 * Consente di importare percorsi assoluti affidabili in qualsiasi modulo.
 */
const ROOT = path.join(__dirname, "..");
const FRONTEND_PUBLIC = path.join(ROOT, "..", "..", "frontend", "public");

module.exports = {
    ROOT: ROOT,
    SRC: path.join(ROOT, "src"),
    PUBLIC: FRONTEND_PUBLIC,
    CONTROLLERS: path.join(ROOT, "src", "controllers"),
    ROUTES: path.join(ROOT, "src", "route"),
    UTILS: path.join(ROOT, "src", "utils")
};
```

---

#### `backend/service/src/server.js`

```javascript
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

// Caricamento variabili d'ambiente (.env o service.env nel backend/service)
const env = require("../config/env");

const port = env.PORT || 3000;

const app = express();

// Middleware di parsing: elabora richieste JSON e form URL-encoded (POST da form HTML)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registrazione router applicativi
const pageRoutes = require("./route/pageroutes");
const weatherRoutes = require("./route/weather");
const authRoutes = require("./route/auth");
const signinRoutes = require("./route/signin");

app.use("/", pageRoutes);    // Pagine HTML statiche (GET /, /about, /weather, etc.)
app.use("/", weatherRoutes); // Endpoint meteo (POST /weather)
app.use("/", authRoutes);    // Autenticazione (POST /login)
app.use("/", signinRoutes);  // Registrazione utente (POST /signup)

// Servizio file statici (HTML, CSS, JS, immagini da frontend/public)
app.use(express.static(path.join(__dirname, "../../../frontend/public")));

// Avvio del server HTTP
app.listen(port, () => {
    console.log("Server in ascolto alla porta " + port);
    console.log("Accedi all'indirizzo http://localhost:" + port);
});
```

---

#### `backend/service/src/route/pageroutes.js`

```javascript
const express = require("express");
const path = require("path");
const paths = require("../../config/paths");

const router = express.Router();

/**
 * Route GET per servire le pagine HTML statiche del frontend.
 * I file inviati si trovano nella cartella frontend/public.
 */
router.get("/", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "index.html"));
});

router.get("/login", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "login.html"));
});

router.get("/signup", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "signup.html"));
});

router.get("/about", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "about.html"));
});

router.get("/contact", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "contact.html"));
});

router.get("/weather", (req, res) => {
    res.sendFile(path.join(paths.PUBLIC, "weather.html"));
});

module.exports = router;
```

---

#### `backend/service/src/route/weather.js`

```javascript
const express = require("express");
const { weatherController } = require("../controllers/weatherController");

const router = express.Router();

/**
 * Route POST per le richieste meteo.
 * Riceve dal client il nome della città e delega la logica a weatherController.
 */
router.post("/weather", weatherController);

module.exports = router;
```

---

#### `backend/service/src/route/auth.js`

```javascript
const express = require("express");
const { login } = require("../controllers/authcontroller");

const router = express.Router();

/**
 * Route POST per l'autenticazione utente.
 * Riceve username e password inviati dal form di login.
 */
router.post("/login", login);

module.exports = router;
```

---

#### `backend/service/src/route/signin.js`

```javascript
const express = require("express");
const { signinController } = require("../controllers/signincontroller");

const router = express.Router();

/**
 * Route POST per la registrazione utente.
 * Riceve i dati inviati dal form di registrazione in signup.html.
 */
router.post("/signup", signinController);

module.exports = router;
```

---

#### `backend/service/src/controllers/weatherController.js`

```javascript
const { getWeather } = require("../utils/apiclient");
const { normalizeWeather } = require("../utils/normalizeWeather");
const { validateCity } = require("../utils/validateCity");
const { WEATHER_API_KEY } = require("../../config/env");
const { logError } = require("../utils/logger");

/**
 * Controller per la gestione delle richieste meteo.
 * 1. Estrae e valida il nome della città dal body JSON
 * 2. Chiama l'API esterna OpenWeatherMap tramite apiClient
 * 3. Normalizza il payload JSON ricevuto estraendo i dati necessari per la vista
 * 4. Gestisce errori di validazione, città non trovata (404) e fallimenti di rete
 */
exports.weatherController = async (req, res) => {
  const city = req.body.city;

  console.log("DEBUG API KEY:", WEATHER_API_KEY);
  console.log("DEBUG CITY:", city);

  if (!validateCity(city)) {
    return res.json({ error: true, message: "Citta' non valida" });
  }

  try {
    const data = await getWeather(city, WEATHER_API_KEY);

    if (String(data.cod) !== "200") {
      return res.json({ error: true, message: "Citta' non trovata" });
    }

    return res.json(normalizeWeather(data));
  } catch (err) {
    logError(err);
    if (err && err.status === 404) {
      return res.json({ error: true, message: "Citta' non trovata" });
    }
    return res.json({ error: true, message: "Errore nel server" });
  }
};
```

---

#### `backend/service/src/controllers/authcontroller.js`

```javascript
/**
 * Controller di login (versione mock/didattica).
 * Verifica le credenziali cablate ('admin' / '1234') senza persistenza su DB.
 * Invia una risposta HTML con l'esito della verifica.
 */
exports.login = (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        res.send("Login è avvenuto con successo!");
    } else {
        res.send(
            "Login fallito. <br> Username inserito: " +
            username +
            " <br> Password inserita: " +
            password +
            "."
        );
    }
};
```

---

#### `backend/service/src/controllers/signincontroller.js`

```javascript
/**
 * Controller di registrazione (versione mock/didattica).
 * Valida la presenza e il tipo dei campi obbligatori (username, password)
 * e restituisce la conferma di avvenuta registrazione senza salvataggio persistente.
 */
exports.signinController = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        return res.status(400).send("Username e password sono obbligatori.");
    }

    res.send("Registrazione completata per: " + username);
};
```

---

#### `backend/service/src/utils/apiclient.js`

```javascript
const fetch = require("node-fetch");

/**
 * Effettua la richiesta HTTP asincrona all'API OpenWeatherMap.
 * Gestisce la codifica della query URL e il controllo dello status HTTP.
 * @param {string} city - Nome della città richiesta
 * @param {string} apiKey - Chiave API per l'accesso a OpenWeatherMap
 * @returns {Promise<object>} - Risposta JSON dell'API meteo
 */
async function getWeather(city, apiKey) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
        const error = new Error(`OpenWeatherMap error: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    return response.json();
}

module.exports = { getWeather };
```

---

#### `backend/service/src/utils/validateCity.js`

```javascript
/**
 * Valida la stringa del nome della città inserita dall'utente.
 * Accetta solo stringhe non vuote contenenti lettere e spazi.
 * @param {string} city - Nome della città da validare
 * @returns {boolean} - true se valida, altrimenti false
 */
function validateCity(city) {
    const regex = /^[a-zA-Z\s]+$/;
    return (
        typeof city === "string" &&
        city.trim().length >= 1 &&
        regex.test(city)
    );
}

module.exports = { validateCity };
```

---

#### `backend/service/src/utils/normalizeWeather.js`

```javascript
/**
 * Estrae e normalizza i campi essenziali dalla risposta grezza di OpenWeatherMap.
 * Filtra dati complessi o superflui, restituendo un oggetto snello per il frontend.
 * @param {object} data - Payload JSON grezzo restituito dall'API OpenWeatherMap
 * @returns {object} - Oggetto con dati meteo pronti per il rendering
 */
function normalizeWeather(data) {
    return {
        city: data.name,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        description: data.weather[0].description,
        icon: data.weather[0].icon
    };
}

module.exports = { normalizeWeather };
```

---

#### `backend/service/src/utils/logger.js`

```javascript
/**
 * Funzione helper per la registrazione centralizzata degli errori a console.
 * @param {Error|any} err - Oggetto errore o messaggio da loggare
 */
function logError(err) {
    console.error(err);
}

module.exports = { logError };
```

---

#### `backend/service/src/utils/constants.js`

```javascript
/**
 * Costanti globali di configurazione caricate dalle variabili d'ambiente.
 */
module.exports = {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    PORT: process.env.PORT || 3000
};
```

---


### Backend — Microservizio Ricercati FBI (`backend/wanted_service`)

#### `backend/wanted_service/server.py`

```python
from datetime import date
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os
from pathlib import Path
from urllib.error import URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen
from utils.converter import item_to_json

FBI_API_URL = "https://api.fbi.gov/wanted/v1/list"

# Caricamento variabili d'ambiente da .env o wanted_service.env locale (se presente)
for env_name in [".env", "wanted_service.env", "wanted.env"]:
    env_file = Path(__file__).resolve().parent / env_name
    if env_file.exists():
        with open(env_file, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    os.environ.setdefault(key.strip(), val.strip())
        break

PORT = int(os.environ.get("WANTED_PORT", "3002"))
PUBLIC_DIR = Path(__file__).resolve().parents[2] / "frontend" / "public"


def get_daily_item():
    """
    Interroga l'API pubblica dell'FBI per estrarre la lista dei ricercati.
    Seleziona deterministicamente la scheda del giorno in base alla data odierna,
    privilegiando i soggetti contrassegnati con poster_classification 'wanted'.
    """
    request = Request(
        FBI_API_URL,
        headers={
            "Accept": "application/json",
            "User-Agent": "FBI-Wanted-Daily-Service/1.0",
        },
    )

    try:
        with urlopen(request, timeout=10) as response:
            payload = json.load(response)
    except Exception as error:
        raise RuntimeError("Impossibile contattare l'API FBI.") from error

    items = payload.get("items") if isinstance(payload, dict) else None
    if not isinstance(items, list):
        raise RuntimeError("La risposta dell'API FBI non contiene una lista valida.")

    valid_items = [item for item in items if isinstance(item, dict)]

    # Filtra solo i soggetti ricercati attivi
    wanted_items = [
        item
        for item in valid_items
        if str(item.get("poster_classification", "")).lower() == "wanted"
    ]

    candidates = wanted_items or valid_items
    if not candidates:
        raise RuntimeError("L'API FBI non ha restituito schede disponibili.")

    # Algoritmo deterministico giornaliero: stesso soggetto per tutti gli utenti nella stessa data
    return candidates[(date.today().toordinal() - 1) % len(candidates)]


class WantedHandler(SimpleHTTPRequestHandler):
    """
    Gestore HTTP per il servizio Wanted:
    - Serve i file statici della cartella frontend/public
    - GET / o vuoto: serve FBI.html
    - GET /api/wanted/today: restituisce la scheda del ricercato del giorno in JSON
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PUBLIC_DIR), **kwargs)

    def send_content(self, content, content_type, status=200):
        encoded = content.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)

    def do_GET(self):
        path = urlparse(self.path).path

        if path in ("/", ""):
            self.path = "/FBI.html"

        if path == "/api/wanted/today":
            try:
                person = item_to_json(get_daily_item())
            except RuntimeError as error:
                print(f"Errore API FBI: {error}", flush=True)
                body = json.dumps({"error": str(error)}, ensure_ascii=False)
                self.send_content(body, "application/json; charset=utf-8", 502)
                return

            body = json.dumps(person, ensure_ascii=False)
            self.send_content(body, "application/json; charset=utf-8")
            return

        super().do_GET()


if __name__ == "__main__":
    print(f"Wanted service avviato su http://localhost:{PORT}", flush=True)
    HTTPServer(("0.0.0.0", PORT), WantedHandler).serve_forever()
```

---

#### `backend/wanted_service/utils/converter.py`

```python
from urllib.parse import urlparse

"""
Modulo di utilità per la normalizzazione dei dati restituiti dall'API FBI.
Estrae i soli campi visualizzati nella scheda frontend e valida gli URL.
"""


def item_to_json(item):
    """
    Riconverte l'oggetto grezzo dell'FBI in un dizionario con campi essenziali:
    titolo, descrizione, categorie (subjects), eventuale ricompensa, immagine e link ufficiale.
    """
    images = item.get("images") or []
    image_url = ""
    if images and isinstance(images[0], dict):
        image_url = safe_fbi_url(images[0].get("large") or images[0].get("thumb"))

    subjects = item.get("subjects")
    if not isinstance(subjects, list):
        subjects = []

    return {
        "title": item.get("title") or "Scheda FBI",
        "description": item.get("description") or "",
        "subjects": subjects,
        "reward": item.get("reward_text") or "",
        "image": image_url,
        "url": safe_fbi_url(item.get("url")),
    }


def safe_fbi_url(value):
    """
    Validatore di sicurezza per gli URL: ammette unicamente link HTTPS
    appartenenti al dominio ufficiale 'www.fbi.gov'.
    """
    if not isinstance(value, str):
        return ""
    parsed = urlparse(value)
    if parsed.scheme == "https" and parsed.hostname == "www.fbi.gov":
        return value
    return ""
```

---


### Frontend — Componenti e Pagine HTML (`frontend/public`)

#### `frontend/public/components/navbar.html`

```html
<!--
  Componente di navigazione condiviso.
  Viene caricato asincronamente tramite fetch() all'interno del contenitore #navbar di ciascuna pagina.
  Tutti i link utilizzano il prefisso del Gateway /api/v1/ per garantire il corretto instradamento.
  Gli elementi #nav-login-link e #nav-logout-link vengono mostrati/nascosti da auth.js in base alla sessione.
-->
<nav class="navbar">
    <div class="nav-logo">My App</div>

    <ul class="nav-links">
        <li><a href="/api/v1/">Home</a></li>
        <li><a href="/api/v1/about">About</a></li>
        <li><a href="/api/v1/contact">Contact</a></li>
        <li><a href="/api/v1/wanted/">FBI wanted</a></li>
        <li><a href="/api/v1/weather">Weather</a></li>
        <li id="nav-signup-item"><a href="/api/v1/signup">Signup</a></li>
        <li id="nav-login-item"><a href="/api/v1/login">Login</a></li>
        <li id="nav-user-item" style="display:none;">
            <span id="nav-user" style="color:#4caf50;font-weight:bold;"></span>
        </li>
        <li id="nav-logout-item" style="display:none;">
            <a href="/api/v1/auth/logout" style="color:#e53935;">Logout</a>
        </li>
    </ul>
</nav>
```

---

#### `frontend/public/components/footer.html`

```html
<!--
  Componente piè di pagina condiviso.
  Viene caricato asincronamente tramite fetch() all'interno del contenitore #footer di ciascuna pagina.
-->
<footer class="footer">
    <p>&copy; 2026 My App. All rights reserved.</p>
</footer>
```

---

#### `frontend/public/index.html`

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home</title>
    <link rel="stylesheet" href="/api/v1/css/index.css">
    <link rel="stylesheet" href="/api/v1/css/navbar.css">
    <link rel="stylesheet" href="/api/v1/css/footer.css">
</head>

<body>

    <!-- Contenitore Navbar: popolato da auth.js -->
    <div id="navbar"></div>

    <!-- Contenitore principale della Home page -->
    <div class="container">
        <h1>Welcome to My App</h1>
        <p>This is the home page of your application.</p>
    </div>

    <!-- Contenitore Footer: popolato da auth.js -->
    <div id="footer"></div>

    <script src="/api/v1/js/navbar.js"></script>
</body>

</html>
```

---

#### `frontend/public/weather.html`

```html
<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather API</title>
    <link rel="stylesheet" href="/api/v1/css/navbar.css">
    <link rel="stylesheet" href="/api/v1/css/footer.css">
    <link rel="stylesheet" href="/api/v1/css/weather.css">
</head>

<body>

    <!-- Contenitore Navbar condivisa -->
    <div id="navbar"></div>

    <!-- Sezione Meteo: form di ricerca città e box per visualizzare i risultati dinamici -->
    <div class="weather-wrapper">
        <div class="weather-box">
            <h2>Weather API</h2>
            <p class="subtitle">Inserisci il nome della città per sapere le condizioni meteo</p>

            <form id="weather-form">
                <input type="text" id="city-input" name="city" placeholder="Nome della città" required>
                <button type="submit">Invia</button>
            </form>
        </div>

        <div class="weather-box" id="weather-result"></div>
    </div>

    <!-- Contenitore Footer condiviso -->
    <div id="footer"></div>

    <script src="/api/v1/js/navbar.js"></script>
    <script src="/api/v1/js/weather.js"></script>
</body>

</html>
```

---

#### `frontend/public/FBI.html`

```html
<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Scheda FBI del giorno</title>

    <link rel="stylesheet" href="/api/v1/css/navbar.css">
    <link rel="stylesheet" href="/api/v1/css/footer.css">
    <link rel="stylesheet" href="/api/v1/css/weather.css">
    <link rel="stylesheet" href="/api/v1/css/fbi.css">
</head>

<body>
    <!-- La barra di navigazione è condivisa con le altre pagine. -->
    <div id="navbar"></div>

    <main class="weather-wrapper fbi-wrapper">
        <section class="weather-box fbi-box">
            <h1>Scheda FBI del giorno</h1>
            <p class="subtitle">Una persona ricercata o una segnalazione dall'elenco pubblico FBI.</p>
            <div id="fbi-result" aria-live="polite">Caricamento ...</div>
        </section>
    </main>

    <!-- Anche il piè di pagina è condiviso con le altre pagine. -->
    <div id="footer"></div>

    <script src="/api/v1/js/navbar.js"></script>
    <script src="/api/v1/js/FBI.js"></script>
</body>
</html>
```

---

#### `frontend/public/login.html`

```html
<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="/api/v1/css/login.css">
    <link rel="stylesheet" href="/api/v1/css/navbar.css">
    <link rel="stylesheet" href="/api/v1/css/footer.css">
</head>

<body>

    <!-- Contenitore Navbar: popolato da auth.js -->
    <div id="navbar"></div>

    <!-- Login con username/password o Google OAuth -->
    <div class="login-wrapper">
        <div class="login-box">
            <h2>Login</h2>

            <!-- Login classico con username e password -->
            <form action="/api/v1/login" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Accedi</button>
            </form>

            <!-- Divisore OR -->
            <div class="or-divider">
                <span>oppure</span>
            </div>

            <!-- Login con Google (OAuth) -->
            <a href="/api/v1/auth/google" class="btn-google">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo">
                Accedi con Google
            </a>

        </div>
    </div>

    <!-- Contenitore Footer: popolato da auth.js -->
    <div id="footer"></div>

    <script src="/api/v1/js/navbar.js"></script>
</body>

</html>
```

---

#### `frontend/public/signup.html`

```html
<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign Up</title>
    <link rel="stylesheet" href="/api/v1/css/signup.css">
    <link rel="stylesheet" href="/api/v1/css/navbar.css">
    <link rel="stylesheet" href="/api/v1/css/footer.css">
</head>

<body>

    <!-- Contenitore Navbar: popolato da auth.js -->
    <div id="navbar"></div>

    <!-- Modulo di registrazione utente -->
    <div class="signup-wrapper">
        <div class="signup-box">
            <h2>Sign Up</h2>

            <!-- Registrazione classica con username e password -->
            <form action="/api/v1/signup" method="POST">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Registrati</button>
            </form>

            <!-- Divisore OR -->
            <div class="or-divider">
                <span>oppure</span>
            </div>

            <!-- Registrazione con Google (stesso flusso OAuth del login) -->
            <a href="/api/v1/auth/google" class="btn-google">
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google logo">
                Registrati con Google
            </a>

        </div>
    </div>

    <!-- Contenitore Footer: popolato da auth.js -->
    <div id="footer"></div>

    <script src="/api/v1/js/navbar.js"></script>
</body>

</html>
```

---

#### `frontend/public/about.html`

```html
<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>About</title>
    <link rel="stylesheet" href="/api/v1/css/about.css">
    <link rel="stylesheet" href="/api/v1/css/navbar.css">
    <link rel="stylesheet" href="/api/v1/css/footer.css">
</head>

<body>

    <!-- Contenitore Navbar: popolato da navbar.js -->
    <div id="navbar"></div>

    <!-- Pagina descrittiva dell'applicazione -->
    <main class="about-wrapper">
        <div class="about-box">
            <h2>About My App</h2>
            <p>My App è una semplice applicazione web che dimostra l'uso di HTML, CSS e JavaScript per creare pagine moderne e responsive.</p>

            <h3>Cosa offriamo</h3>
            <ul class="feature-list">
                <li>Interfaccia pulita e responsive</li>
                <li>Navigazione semplice tra le pagine</li>
                <li>Form di login e registrazione</li>
                <li>Integrazione con API meteo</li>
            </ul>
        </div>
    </main>

    <!-- Contenitore Footer: popolato da navbar.js -->
    <div id="footer"></div>

    <script src="/api/v1/js/navbar.js"></script>

</body>

</html>
```

---

#### `frontend/public/contact.html`

```html
<!DOCTYPE html>
<html lang="it">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact</title>
    <link rel="stylesheet" href="/api/v1/css/contact.css">
    <link rel="stylesheet" href="/api/v1/css/navbar.css">
    <link rel="stylesheet" href="/api/v1/css/footer.css">
</head>

<body>

    <!-- Contenitore Navbar: popolato da navbar.js -->
    <div id="navbar"></div>

    <!-- Pagina contatti e recapiti -->
    <main class="contact-wrapper">
        <div class="contact-box">
            <h2>Contact</h2>
            <p>Hai domande o suggerimenti? Ecco come puoi contattarci.</p>

            <ul class="contact-list">
                <li>
                    <strong>Email</strong>
                    <span>info@myapp.example</span>
                </li>
                <li>
                    <strong>Telefono</strong>
                    <span>+39 123 456 7890</span>
                </li>
                <li>
                    <strong>Indirizzo</strong>
                    <span>Via Roma 1, 00100 Roma, Italia</span>
                </li>
            </ul>
        </div>
    </main>

    <!-- Contenitore Footer: popolato da navbar.js -->
    <div id="footer"></div>

    <script src="/api/v1/js/navbar.js"></script>

</body>

</html>
```

---


### Frontend — Script Client-side (`frontend/public/js`)

#### `frontend/public/js/navbar.js`

```javascript
/**
 * navbar.js — Gestore unificato per la barra di navigazione e l'autenticazione.
 *
 * Funzionalità:
 *  1. Carica asincronamente i componenti condivisi (navbar e footer).
 *  2. Interroga l'endpoint protetto /api/v1/auth/me (router.get /me di auth-service).
 *  3. Aggiorna lo stato visivo della navbar in base alla sessione:
 *     - Autenticato: mostra il nome dell'utente (firstName / displayName) e il pulsante Logout;
 *     - Non autenticato: mostra i link di Login e Signup.
 */

/**
 * Carica un componente HTML all'interno del contenitore indicato via ID.
 * @param {string} containerId ID dell'elemento DOM contenitore
 * @param {string} url Percorso del componente HTML da recuperare
 * @returns {Promise<void>}
 */
function loadComponent(containerId, url) {
    const el = document.getElementById(containerId);
    if (!el) return Promise.resolve();

    return fetch(url)
        .then(res => {
            if (!res.ok) throw new Error(`Impossibile caricare il componente: ${url}`);
            return res.text();
        })
        .then(html => {
            el.innerHTML = html;
        })
        .catch(err => {
            console.warn(`Errore nel caricamento del componente ${containerId}:`, err);
        });
}

/**
 * Interroga l'endpoint /api/v1/auth/me e aggiorna gli elementi della navbar.
 * @returns {Promise<void>}
 */
function applyAuthState() {
    return fetch('/api/v1/auth/me', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            const loginItem  = document.getElementById('nav-login-item');
            const signupItem = document.getElementById('nav-signup-item');
            const userItem   = document.getElementById('nav-user-item');
            const logoutItem = document.getElementById('nav-logout-item');
            const navUser    = document.getElementById('nav-user');

            if (data && data.authenticated) {
                const user = data.user || {};
                const displayName = data.firstName || user.firstName || user.displayName || data.displayName || 'Utente';
                const email = data.email || user.email || '';

                if (navUser) {
                    navUser.textContent = '✓ ' + displayName;
                    navUser.title = email ? `${displayName} (${email})` : displayName;
                }
                if (loginItem)  loginItem.style.display  = 'none';
                if (signupItem) signupItem.style.display = 'none';
                if (userItem)   userItem.style.display   = '';
                if (logoutItem) logoutItem.style.display = '';
            } else {
                if (loginItem)  loginItem.style.display  = '';
                if (signupItem) signupItem.style.display = '';
                if (userItem)   userItem.style.display   = 'none';
                if (logoutItem) logoutItem.style.display = 'none';
            }
        })
        .catch(() => {
            // Se auth-service non risponde o la sessione non è valida, mostra i pulsanti di default
            const loginItem  = document.getElementById('nav-login-item');
            const signupItem = document.getElementById('nav-signup-item');
            const userItem   = document.getElementById('nav-user-item');
            const logoutItem = document.getElementById('nav-logout-item');

            if (loginItem)  loginItem.style.display  = '';
            if (signupItem) signupItem.style.display = '';
            if (userItem)   userItem.style.display   = 'none';
            if (logoutItem) logoutItem.style.display = 'none';
        });
}

// Inizializzazione automatica al caricamento del DOM
document.addEventListener('DOMContentLoaded', () => {
    const navbarContainer = document.getElementById('navbar');
    const footerContainer = document.getElementById('footer');

    const navbarPromise = (navbarContainer && !navbarContainer.children.length)
        ? loadComponent('navbar', '/api/v1/components/navbar.html')
        : Promise.resolve();

    navbarPromise.then(applyAuthState);

    if (footerContainer && !footerContainer.children.length) {
        loadComponent('footer', '/api/v1/components/footer.html');
    }
});

// Esposizione globale per consentire chiamate programmatiche
window.loadComponent = loadComponent;
window.applyAuthState = applyAuthState;
```

---

#### `frontend/public/js/auth.js`

```javascript
/**
 * auth.js — backward compatibility wrapper pointing to /api/v1/auth/me.
 *
 * Responsibilities:
 *  1. Load the shared navbar and footer components.
 *  2. Call /api/v1/auth/me to check the current session and retrieve user details.
 *  3. Update the navbar to show the user's name + Logout (authenticated)
 *     or the Login link (unauthenticated).
 */

/** Load an HTML component into a container element by id. */
function loadComponent(containerId, url) {
    return fetch(url)
        .then(res => res.text())
        .then(html => {
            const el = document.getElementById(containerId);
            if (el) el.innerHTML = html;
        });
}

/** Apply auth state to the navbar after it has been injected. */
function applyAuthState() {
    return fetch('/api/v1/auth/me', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
            const loginItem  = document.getElementById('nav-login-item');
            const signupItem = document.getElementById('nav-signup-item');
            const userItem   = document.getElementById('nav-user-item');
            const logoutItem = document.getElementById('nav-logout-item');
            const navUser    = document.getElementById('nav-user');

            if (data && data.authenticated) {
                const user = data.user || {};
                const name = data.firstName || user.firstName || user.displayName || data.displayName || 'Utente';
                const email = data.email || user.email || '';

                if (navUser) {
                    navUser.textContent = '✓ ' + name;
                    navUser.title       = email ? `${name} (${email})` : name;
                }
                if (loginItem)  loginItem.style.display  = 'none';
                if (signupItem) signupItem.style.display = 'none';
                if (userItem)   userItem.style.display   = '';
                if (logoutItem) logoutItem.style.display = '';
            } else {
                if (loginItem)  loginItem.style.display  = '';
                if (signupItem) signupItem.style.display = '';
                if (userItem)   userItem.style.display   = 'none';
                if (logoutItem) logoutItem.style.display = 'none';
            }
        })
        .catch(() => {}); // silently ignore if auth-service is unreachable
}

// Load navbar first, then apply auth state; load footer in parallel.
document.addEventListener('DOMContentLoaded', () => {
    loadComponent('navbar', '/api/v1/components/navbar.html')
        .then(applyAuthState);

    loadComponent('footer', '/api/v1/components/footer.html');
});
```

---

#### `frontend/public/js/weather.js`

```javascript
/**
 * Logica client-side per la pagina Meteo (weather.html).
 * - Intercetta l'evento di invio del form evitando il reload della pagina (e.preventDefault).
 * - Invia una richiesta POST asincrona in formato JSON all'endpoint Gateway /api/v1/weather.
 * - Renderizza nel DOM l'esito della chiamata (scheda meteo completa oppure messaggio di errore).
 */
document.getElementById("weather-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const city = document.getElementById("city-input").value.trim();

    const res = await fetch("/api/v1/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city })
    });

    const data = await res.json();
    const resultBox = document.getElementById("weather-result");

    if (data.error) {
        resultBox.innerHTML = `
            <div class="weather-response-box subtitle" style="color: #c0392b;">
                ${data.message}
            </div>
        `;
    } else {
        resultBox.innerHTML = `
            <div class="weather-response-box">
                <h3>${data.city}</h3>
                <img src="https://openweathermap.org/img/wn/${data.icon}@2x.png" alt="${data.description}">
                <p class="subtitle" style="text-transform: capitalize;">${data.description}</p>
                <p>Temperatura: <strong>${data.temperature}°C</strong></p>
                <p>Umidità: <strong>${data.humidity}%</strong></p>
                <p>Vento: <strong>${data.windSpeed} m/s</strong></p>
            </div>
        `;
    }

    resultBox.style.display = "block";
});
```

---

#### `frontend/public/js/FBI.js`

```javascript
/**
 * Logica client-side per la pagina FBI (FBI.html).
 * - Richiede la scheda del ricercato del giorno al Gateway (/api/v1/wanted/api/wanted/today).
 * - Costruisce dinamicamente gli elementi HTML (titolo, foto, descrizione, categoria, link)
 *   utilizzando textContent per prevenire vulnerabilità XSS.
 */
async function loadWantedPerson() {
    const result = document.getElementById("fbi-result");

    try {
        const response = await fetch("/api/v1/wanted/api/wanted/today");
        const person = await response.json();

        if (!response.ok) {
            throw new Error(person.error || "Servizio non disponibile");
        }

        const title = document.createElement("h2");
        title.textContent = person.title;
        result.replaceChildren(title);

        if (person.image) {
            const image = document.createElement("img");
            image.src = person.image;
            image.alt = person.title;
            image.className = "fbi-image";
            result.append(image);
        }

        if (person.description) {
            const description = document.createElement("p");
            description.textContent = person.description;
            description.className = "fbi-description";
            result.append(description);
        }

        if (Array.isArray(person.subjects) && person.subjects.length > 0) {
            const subjects = document.createElement("p");
            subjects.textContent = `Categoria: ${person.subjects.join(", ")}`;
            result.append(subjects);
        }

        if (person.reward) {
            const reward = document.createElement("p");
            reward.textContent = person.reward;
            result.append(reward);
        }

        if (person.url) {
            const link = document.createElement("a");
            link.href = person.url;
            link.textContent = "Apri la scheda ufficiale FBI";
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            result.append(link);
        }
    } catch (error) {
        result.textContent = error.message || "Non è stato possibile caricare la scheda FBI.";
    }
}

loadWantedPerson();
```

---


### Frontend — Fogli di Stile CSS (`frontend/public/css`)

#### `frontend/public/css/navbar.css`

```css
/* ===== Barra di navigazione principale (sticky in alto) ===== */
.navbar {
    width: 100%;
    background: #ffffff;
    padding: 15px 30px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 100;
}

.nav-logo {
    font-size: 22px;
    font-weight: bold;
    color: #333;
    letter-spacing: 0.5px;
}

/* ===== Collegamenti di navigazione ===== */
.nav-links {
    list-style: none;
    display: flex;
    gap: 25px;
}

.nav-links a {
    text-decoration: none;
    color: #0078ff;
    font-size: 16px;
    padding: 6px 10px;
    border-radius: 6px;
    transition: 0.25s ease;
}

.nav-links a:hover {
    background: #e8f1ff;
    color: #005fcc;
}

/* ===== Responsive: disposizione verticale su schermi < 600px ===== */
@media (max-width: 600px) {
    .navbar {
        flex-direction: column;
        gap: 10px;
        padding: 20px;
    }

    .nav-links {
        flex-direction: column;
        gap: 12px;
        text-align: center;
    }
}
```

---

#### `frontend/public/css/footer.css`

```css
/* ===== Piè di pagina (fissato in basso tramite margin-top: auto del flex container) ===== */
.footer {
    margin-top: auto;
    background: #ffffff;
    padding: 15px;
    text-align: center;
    color: #666;
    font-size: 14px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
}
```

---

#### `frontend/public/css/index.css`

```css
/* ===== Reset CSS globale e box-sizing ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* ===== Layout base con Flexbox a colonna a tutta altezza ===== */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ===== Contenitore centrale Home ===== */
.container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container h1 {
    font-size: 40px;
    color: #333;
    margin-bottom: 20px;
}

.container p {
    font-size: 18px;
    color: #555;
}
```

---

#### `frontend/public/css/weather.css`

```css
/* ===== Reset e box model ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* ===== Layout a tutta altezza ===== */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ===== Contenitore centrale con disposizione verticale delle card ===== */
.weather-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

/* ===== Card con modulo o risultati meteo ===== */
.weather-box {
    background: #ffffff;
    padding: 30px 35px;
    border-radius: 12px;
    width: 380px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    animation: fadeIn 0.4s ease;
    text-align: center;
}

.weather-box h2 {
    margin-bottom: 15px;
    color: #333;
    font-weight: 600;
}

.subtitle {
    margin-bottom: 25px;
    color: #555;
    font-size: 16px;
}

/* ===== Campo di testo input città ===== */
.weather-box input {
    width: 100%;
    padding: 12px;
    margin-bottom: 18px;
    border: 2px solid #d0d0d0;
    border-radius: 6px;
    font-size: 15px;
    transition: border-color 0.2s;
}

.weather-box input:focus {
    border-color: #0078ff;
    outline: none;
}

/* ===== Bottone di invio ricerca ===== */
.weather-box button {
    width: 100%;
    padding: 12px;
    background: #0078ff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.25s, transform 0.1s;
}

.weather-box button:hover {
    background: #005fcc;
}

.weather-box button:active {
    transform: scale(0.98);
}

/* Box risultato: nascosto fino alla ricezione dei dati dal server */
#weather-result {
    display: none;
}

/* ===== Animazione di entrata dal basso ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

#### `frontend/public/css/fbi.css`

```css
/* Stili specifici per la scheda FBI; gli stili di base sono in weather.css. */
.fbi-wrapper {
    padding: 24px 16px;
}

.fbi-box {
    width: min(760px, 100%);
}

.fbi-box h1 {
    margin-bottom: 12px;
    color: #333;
}

.fbi-image {
    display: block;
    max-width: 100%;
    max-height: 480px;
    margin: 20px auto;
    object-fit: contain;
}

.fbi-description {
    margin: 16px 0;
    white-space: pre-line;
    text-align: left;
}

#fbi-result a {
    display: inline-block;
    margin-top: 12px;
    color: #154f91;
}
```

---

#### `frontend/public/css/login.css`

```css
/* ===== Reset e box model ===== */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* ===== Struttura principale della pagina ===== */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* ===== Contenitore per centrare il box a schermo ===== */
.login-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* ===== Card bianca con ombra ed animazione di comparsa ===== */
.login-box {
    background: #ffffff;
    padding: 30px 35px;
    border-radius: 12px;
    width: 320px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    animation: fadeIn 0.4s ease;
}

.login-box h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #333;
    font-weight: 600;
}

/* ===== Campi di input del modulo ===== */
.login-box input {
    width: 100%;
    padding: 12px;
    margin: 10px 0 18px 0;
    border: 2px solid #d0d0d0;
    border-radius: 6px;
    font-size: 15px;
    transition: border-color 0.2s;
}

.login-box input:focus {
    border-color: #0078ff;
    outline: none;
}

/* ===== Pulsante di invio ===== */
.login-box button {
    width: 100%;
    padding: 12px;
    background: #0078ff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.25s, transform 0.1s;
}

.login-box button:hover {
    background: #005fcc;
}

.login-box button:active {
    transform: scale(0.98);
}

/* ===== Animazione di entrata dal basso verso l'alto ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== Divisore OR ===== */
.or-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    color: #aaa;
    font-size: 13px;
}

.or-divider::before,
.or-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
}

.or-divider span {
    padding: 0 10px;
}

/* ===== Pulsante Login con Google ===== */
.btn-google {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 12px;
    background: #ffffff;
    color: #444;
    border: 2px solid #d0d0d0;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.25s, box-shadow 0.25s, transform 0.1s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.btn-google img {
    width: 22px;
    height: 22px;
}

.btn-google:hover {
    background: #f5f5f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-google:active {
    transform: scale(0.98);
}
```

---

#### `frontend/public/css/signup.css`

```css
/* ===== Reset e box model ===== */
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

/* ===== Struttura principale della pagina ===== */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8);
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

/* ===== Contenitore per centrare il box a schermo ===== */
.signup-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

/* ===== Card bianca con ombra ed animazione di comparsa ===== */
.signup-box {
    background: #ffffff;
    padding: 30px 35px;
    border-radius: 12px;
    width: 320px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    animation: fadeIn 0.4s ease;
}

.signup-box h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #333;
    font-weight: 600;
}

/* ===== Campi di input del modulo ===== */
.signup-box input {
    width: 100%;
    padding: 12px;
    margin: 10px 0 18px 0;
    border: 2px solid #d0d0d0;
    border-radius: 6px;
    font-size: 15px;
    transition: border-color 0.2s;
}

.signup-box input:focus {
    border-color: #0078ff;
    outline: none;
}

/* ===== Pulsante di invio con stati hover e active ===== */
.signup-box button {
    width: 100%;
    padding: 12px;
    background: #0078ff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.25s, transform 0.1s;
}

.signup-box button:hover {
    background: #005fcc;
}

.signup-box button:active {
    transform: scale(0.98);
}

/* ===== Animazione di entrata dal basso verso l'alto ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== Divisore OR ===== */
.or-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 20px 0;
    color: #aaa;
    font-size: 13px;
}

.or-divider::before,
.or-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #ddd;
}

.or-divider span {
    padding: 0 10px;
}

/* ===== Pulsante Registrati con Google ===== */
.btn-google {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 12px;
    background: #ffffff;
    color: #444;
    border: 2px solid #d0d0d0;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: background 0.25s, box-shadow 0.25s, transform 0.1s;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.btn-google img {
    width: 22px;
    height: 22px;
}

.btn-google:hover {
    background: #f5f5f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-google:active {
    transform: scale(0.98);
}
```

---

#### `frontend/public/css/about.css`

```css
/* ===== Reset e box model ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* ===== Layout a tutta altezza ===== */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ===== Contenitore centrale della sezione About ===== */
.about-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

/* ===== Card informativa ===== */
.about-box {
    background: #ffffff;
    padding: 40px;
    border-radius: 12px;
    width: 100%;
    max-width: 600px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    animation: fadeIn 0.4s ease;
}

.about-box h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
    font-weight: 600;
}

.about-box h3 {
    margin-top: 25px;
    margin-bottom: 15px;
    color: #333;
    font-weight: 600;
}

.about-box p {
    color: #555;
    font-size: 16px;
    line-height: 1.6;
}

/* ===== Lista caratteristiche con spunte personalizzate ===== */
.feature-list {
    list-style: none;
    padding: 0;
}

.feature-list li {
    padding: 10px 0 10px 28px;
    color: #555;
    position: relative;
}

.feature-list li::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: #0078ff;
    font-weight: bold;
}

/* ===== Animazione di comparsa ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== Adattamento per dispositivi mobili ===== */
@media (max-width: 600px) {
    .about-box {
        padding: 25px;
    }
}
```

---

#### `frontend/public/css/contact.css`

```css
/* ===== Reset e box model ===== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

/* ===== Layout a tutta altezza ===== */
body {
    font-family: Arial, sans-serif;
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* ===== Contenitore centrale della sezione Contact ===== */
.contact-wrapper {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

/* ===== Card contatti ===== */
.contact-box {
    background: #ffffff;
    padding: 40px;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    animation: fadeIn 0.4s ease;
}

.contact-box h2 {
    text-align: center;
    margin-bottom: 15px;
    color: #333;
    font-weight: 600;
}

.contact-box > p {
    text-align: center;
    color: #555;
    margin-bottom: 25px;
}

/* ===== Lista contatti con etichette evidenziate ===== */
.contact-list {
    list-style: none;
    padding: 0;
}

.contact-list li {
    display: flex;
    flex-direction: column;
    padding: 15px 0;
    border-bottom: 1px solid #eee;
}

.contact-list li:last-child {
    border-bottom: none;
}

.contact-list strong {
    color: #0078ff;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
}

.contact-list span {
    color: #555;
    font-size: 16px;
}

/* ===== Animazione di comparsa ===== */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* ===== Adattamento per dispositivi mobili ===== */
@media (max-width: 600px) {
    .contact-box {
        padding: 25px;
    }
}
```

---

## 8. Cose da sapere e possibili miglioramenti

- **Session Store in produzione**: attualmente `express-session` utilizza lo store in memoria predefinito (`MemoryStore`). In un ambiente di produzione con più istanze scalate orizzontalmente è consigliato passare a uno store distribuito come Redis (`connect-redis`).
- **Persistenza su Database**: i controller di login classico (`authcontroller.js`) e signup (`signincontroller.js`) utilizzano verifiche didattiche senza database. Il passo successivo consiste nell'integrazione di un database relazionale (PostgreSQL, SQLite con Prisma o Sequelize) o NoSQL (MongoDB).
- **Terminazione TLS / HTTPS**: in un'architettura reale, l'API Gateway si occupa anche della terminazione TLS (HTTPS), esponendo certificati SSL validi verso il client esterno e comunicando in HTTP semplice sulla rete interna sicura dei microservizi.
- **Protezione CSRF e sicurezza Cookie**: l'attributo `sameSite: "lax"` e `httpOnly: true` nel cookie di sessione proteggono da furti di token tramite attacchi XSS. In produzione va aggiunto `secure: true` con protocollo HTTPS.
- **Gestione delle quote API**: il Gateway può implementare middleware di Rate Limiting (es. `express-rate-limit`) per proteggere i servizi interni e le quote esterne di OpenWeatherMap e FBI da chiamate abusive.

---

## 9. Glossario rapido

| Termine | Significato |
|---|---|
| **Microservizio** | Approccio architetturale in cui un'applicazione è composta da piccoli servizi indipendenti che comunicano tramite HTTP/REST. |
| **API Gateway** | Singolo punto di ingresso che smista le richieste dei client ai microservizi appropriati. |
| **Reverse Proxy** | Server intermedio che riceve richieste dai client e le inoltra a server backend interni, mascherandoli. |
| **Endpoint Hiding** | Tecnica che nasconde al client le porte e i percorsi reali dei servizi interni, migliorando sicurezza e manutenibilità. |
| **API Versioning** | Inserimento della versione nell'URL (es. `/api/v1/`) per evolvere le API senza rompere la retrocompatibilità con i vecchi client. |
| **OAuth 2.0** | Protocollo standard aperto per l'autorizzazione federata (es. "Accedi con Google") senza condividere le credenziali utente con l'applicazione. |
| **Passport.js** | Middleware di autenticazione per Node.js che supporta oltre 500 strategie (Google, GitHub, locale, JWT). |
| **Session Cookie** | Cookie crittografato scambiato tra browser e server che identifica in modo univoco la sessione dell'utente autenticato. |
| **DOM (Document Object Model)** | Rappresentazione ad albero degli elementi HTML caricati in memoria nel browser, manipolabile tramite JavaScript. |
| **Fetch API** | Interfaccia moderna del browser basata su Promise per inviare ed elaborare richieste HTTP asincrone. |
| **XSS (Cross-Site Scripting)** | Vulnerabilità di sicurezza in cui codice JavaScript malevolo viene iniettato nel browser; prevenuta usando `textContent` invece di `innerHTML` per dati non attendibili. |

---

Fine della guida completa.
