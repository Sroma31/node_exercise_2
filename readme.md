# Node Exercise 2

Applicazione web full-stack basata su un'architettura a **microservizi** con **API Gateway**, frontend modulare in HTML/CSS/JavaScript vanilla e servizi backend in Node.js e Python.

---

## 🏛️ Architettura di Sistema

Il flusso di comunicazione delle richieste segue lo schema:

```text
[Client / Browser]
        │
        ▼
[API Gateway (Porta 4000)]
   ├── /api/v1/auth   ──► [Auth Service (Node.js: Porta 3001)] (Google OAuth 2.0 / Passport)
   ├── /api/v1/wanted ──► [Wanted Service (Python: Porta 3002)] (FBI Wanted API)
   └── /api/v1        ──► [Main Service (Node.js: Porta 3000)] (Meteo & Pagine statiche)
```

### Componenti Principali

| Componente | Directory | Tecnologia | Porta | Descrizione |
|---|---|---|---|---|
| **API Gateway** | `backend/gateway` | Node.js, Express, `http-proxy-middleware` | `4000` | Reverse proxy unificato, versioning API (`/api/v1/`), rate limiting, caching e mascheramento delle porte interne. |
| **Auth Service** | `backend/auth-service` | Node.js, Express, Passport.js | `3001` | Gestione delle sessioni e autenticazione social con Google OAuth 2.0. |
| **Main Service** | `backend/service` | Node.js, Express | `3000` | Logica applicativa meteo (integrazione OpenWeather API), form e routing pagine. |
| **Wanted Service** | `backend/wanted_service` | Python | `3002` | Microservizio per il recupero e la formattazione dei dati dell'API FBI Wanted. |
| **Frontend** | `frontend/public` | HTML5, CSS3, JS Vanilla | - | Pagine interattive (Home, Meteo, FBI, Login, Signup, About, Contact) con componenti modulari. |

---

## 📁 Struttura del Progetto

```plaintext
node_exercise_2/
├── backend/
│   ├── auth-service/        # Microservizio di autenticazione (OAuth / Sessioni)
│   ├── gateway/             # API Gateway & Reverse Proxy
│   ├── service/             # Servizio principale (Meteo, logica core)
│   ├── wanted_service/      # Microservizio Python per dati FBI
│   └── readme.md            # Appunti specifici sul pattern Gateway
├── frontend/
│   └── public/
│       ├── components/      # Componenti riutilizzabili (navbar, footer)
│       ├── css/             # Fogli di stile per ciascuna pagina
│       ├── js/              # Logica client-side e gestione auth (`auth.js`)
│       ├── index.html       # Home page
│       ├── weather.html     # Pagina consultazione meteo
│       ├── FBI.html         # Schede ricercati FBI
│       ├── login.html       # Login con credenziali o Google
│       ├── signup.html      # Registrazione utente
│       ├── about.html       # Pagina Chi Siamo
│       └── contact.html     # Pagina Contatti
├── changelog.md             # Storico delle versioni e modifiche
├── install_module.bat       # Script batch per installare tutte le dipendenze npm
├── run.bat                  # Script batch per avviare tutti i microservizi
├── uninstall_module.bat     # Script batch per rimozione dipendenze
└── readme.md                # Documentazione generale di progetto
```

---

## ⚙️ Prerequisiti

- **Node.js** (versione 18 o superiore consigliata) e **npm**
- **Python** (versione 3.8 o superiore per `wanted_service`)

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

Per il microservizio Python:
```bash
cd backend/wanted_service
pip install -r requirements.txt   # o moduli richiesti da server.py
```

---

## 🔑 Configurazione Variabili d'Ambiente

Crea i file `.env` nelle rispettive cartelle dei servizi:

### 1. `backend/service/.env`
```env
PORT=3000
WEATHER_API_KEY=tuo_api_key_openweather
```

### 2. `backend/auth-service/.env`
```env
PORT=3001
GOOGLE_CLIENT_ID=tuo_google_client_id
GOOGLE_CLIENT_SECRET=tuo_google_client_secret
SESSION_SECRET=stringa_segreta_sessione
CALLBACK_URL=http://localhost:3001/auth/google/callback
```

### 3. `backend/gateway/.env` (opzionale se si usano le porte predefinite)
```env
GATEWAY_PORT=4000
SERVICE_URL=http://localhost:3000
AUTH_SERVICE_URL=http://localhost:3001
WANTED_SERVICE_URL=http://localhost:3002
```

---

## ▶️ Avvio dell'Applicazione

### Metodo rapido (Windows)
Esegui con un doppio clic o da terminale:

```cmd
run.bat
```

Questo avvierà ciascun microservizio in una finestra di comando separata:
- **Gateway**: `http://localhost:4000`
- **Main Service & Frontend**: `http://localhost:3000`
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

Tutte le richieste possono essere inoltrate direttamente attraverso l'**API Gateway** (`http://localhost:4000`):

- **GET /** : Homepage dell'applicazione
- **GET /weather.html** : Interfaccia meteo
- **POST /api/v1/weather** : Ricerca informazioni meteo per città
- **GET /api/v1/auth/google** : Avvio del flusso di login con Google OAuth 2.0
- **GET /api/v1/wanted** : Recupero dati ricercati FBI

---

## 📝 Changelog

Per consultare l'evoluzione del progetto e le novità introdotte in ciascun aggiornamento, consulta il file [changelog.md](changelog.md).

