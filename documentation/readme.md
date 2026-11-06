# Node Exercise 2

Applicazione web full-stack basata su un'architettura a **microservizi** con **API Gateway**, frontend modulare in HTML5/CSS3/JavaScript vanilla e servizi backend in Node.js e Python.

---

## 🏛️ Architettura di Sistema

Il flusso di comunicazione delle richieste segue lo schema:

```text
[Client / Browser]
        │
        ▼
[API Gateway (Porta 4000)]
   ├── /api/v1/auth   ──► [Auth Service (Node.js: Porta 3001)] (Google OAuth 2.0 / Passport / Sessioni)
   ├── /api/v1/wanted ──► [Wanted Service (Python: Porta 3002)] (FBI Wanted API)
   └── /api/v1        ──► [Main Service (Node.js: Porta 3000)] (Meteo & Pagine statiche)
```

### Componenti Principali

| Componente | Directory | Tecnologia | Porta | Descrizione |
|---|---|---|---|---|
| **API Gateway** | `backend/gateway` | Node.js, Express, `http-proxy-middleware` | `4000` | Reverse proxy unificato, versioning API (`/api/v1/`), mascheramento delle porte interne e routing verso i microservizi. |
| **Auth Service** | `backend/auth-service` | Node.js, Express, Passport.js, `express-session` | `3001` | Gestione delle sessioni e autenticazione social con Google OAuth 2.0. Endpoint `/google`, `/google/callback` (alias `/auth/google/callback`), `/me`, `/validate`, `/logout`. |
| **Main Service** | `backend/service` | Node.js, Express | `3000` | Logica applicativa meteo (integrazione OpenWeather API), form HTML e servizio file statici. |
| **Wanted Service** | `backend/wanted_service` | Python 3 (`http.server`, `urllib`) | `3002` | Microservizio per il recupero, la sanitizzazione e la formattazione giornaliera dei dati dell'API FBI Wanted. |
| **Frontend** | `frontend/public` | HTML5, CSS3, JS Vanilla | - | Pagine interattive (Home, Meteo, FBI, Login, Signup, About, Contact) con navbar/footer dinamici e gestione sessione utente. |

---

## 📁 Struttura del Progetto

```plaintext
node_exercise_2/
├── backend/
│   ├── auth-service/         # Microservizio di autenticazione (Google OAuth 2.0, Passport, sessioni)
│   ├── gateway/              # API Gateway & Reverse Proxy (porta 4000)
│   ├── service/              # Servizio principale (Meteo, routing pagine statiche, porta 3000)
│   ├── wanted_service/       # Microservizio Python per dati FBI (porta 3002)
│   └── readme.md             # Appunti sintetici sul pattern Gateway
├── documentation/
│   ├── changelog.md          # Storico delle versioni e modifiche
│   ├── progetto-guida.md     # Guida completa con spiegazione e codice commentato riga per riga
│   └── readme.md             # Documentazione e panoramica generale del progetto
├── frontend/
│   └── public/
│       ├── components/       # Componenti riutilizzabili (navbar.html, footer.html)
│       ├── css/              # Fogli di stile per ciascuna pagina
│       ├── js/               # Logica client-side (navbar.js, auth.js, weather.js, FBI.js)
│       ├── index.html        # Home page
│       ├── weather.html      # Pagina consultazione meteo
│       ├── FBI.html          # Schede ricercati FBI
│       ├── login.html        # Login con credenziali o Google
│       ├── signup.html       # Registrazione utente
│       ├── about.html        # Pagina Chi Siamo
│       └── contact.html      # Pagina Contatti
├── install_module.bat        # Script batch per installare tutte le dipendenze npm nei 3 servizi Node
├── run.bat                   # Script batch per avviare tutti i microservizi in terminali separati
├── uninstall_module.bat      # Script batch per rimozione pulita delle cartelle node_modules
└── .gitignore                # Regole di esclusione git (ignora .env, node_modules, cache)
```

---

## ⚙️ Prerequisiti

- **Node.js** (versione 18 o superiore consigliata) e **npm**
- **Python** (versione 3.8 o superiore per `wanted_service`, usa solo librerie standard)

---

## 🚀 Installazione

Puoi installare automaticamente le dipendenze di tutti i microservizi Node.js eseguendo lo script batch:

```cmd
install_module.bat
```

Oppure manualmente accedendo a ciascuna cartella:

```bash
cd backend/gateway && npm install
cd ../auth-service && npm install
cd ../service && npm install
```

Il microservizio Python `backend/wanted_service` utilizza esclusivamente moduli della libreria standard (`http.server`, `urllib`, `json`, `datetime`, `pathlib`) e non richiede dipendenze esterne.

---

## 🔑 Configurazione Variabili d'Ambiente

Crea i file `.env` nelle rispettive cartelle dei servizi (i file `.env` sono esclusi dal tracciamento Git):

### 1. `backend/service/.env`
```env
PORT=3000
WEATHER_API_KEY=la_tua_api_key_openweather
```

### 2. `backend/auth-service/.env`
```env
PORT=3001
AUTH_PORT=3001
GOOGLE_CLIENT_ID=il_tuo_google_client_id
GOOGLE_CLIENT_SECRET=il_tuo_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/google/callback
SESSION_SECRET=stringa_segreta_sessione
FRONTEND_URL=http://localhost:4000/api/v1/
```

### 3. `backend/gateway/.env`
```env
GATEWAY_PORT=4000
SERVICE_URL=http://localhost:3000
AUTH_SERVICE_URL=http://localhost:3001
WANTED_SERVICE_URL=http://localhost:3002
```

### 4. `backend/wanted_service/.env`
```env
WANTED_PORT=3002
```

---

## ▶️ Avvio dell'Applicazione

### Metodo rapido (Windows)
Esegui con un doppio clic o da terminale:

```cmd
run.bat
```

Questo avvierà ciascun microservizio in una finestra di comando dedicata:
- **Gateway**: `http://localhost:4000/api/v1/`
- **Main Service**: `http://localhost:3000`
- **Auth Service**: `http://localhost:3001`
- **Wanted Service**: `http://localhost:3002`

### Metodo manuale
Avvia ciascun servizio in un terminale dedicato:

```bash
# Terminale 1 - Main Service
cd backend/service && node src/server.js

# Terminale 2 - Auth Service
cd backend/auth-service && node src/authserver.js

# Terminale 3 - Wanted Service
cd backend/wanted_service && python server.py

# Terminale 4 - Gateway
cd backend/gateway && node src/gateway.js
```

---

## 🌐 Endpoint Principali

Tutte le richieste transitano attraverso l'**API Gateway** all'indirizzo `http://localhost:4000/api/v1/`:

- **GET /api/v1/** : Homepage dell'applicazione
- **GET /api/v1/weather** : Interfaccia meteo
- **POST /api/v1/weather** : Ricerca informazioni meteo per città (OpenWeatherMap)
- **GET /api/v1/wanted/** : Scheda giornaliera ricercati FBI
- **GET /api/v1/login** : Pagina di login
- **GET /api/v1/auth/google** : Avvio del flusso di login con Google OAuth 2.0
- **GET /api/v1/auth/me** : Verifica sessione utente e restituzione dati anagrafici
- **GET /api/v1/auth/logout** : Logout e distruzione sessione

---

## 📖 Documentazione Dettagliata

- [Guida Completa con Codice Commentato](progetto-guida.md)
- [Registro delle Modifiche (Changelog)](changelog.md)
