# Persistance Service

Microservizio Node.js/Express dedicato alla fornitura di dati di persistenza e informazioni sulla sessione utente in formato JSON.

---

##  Descrizione

Il **Persistance Service** è uno dei microservizi del backend di `node_exercise_2`. Il suo compito principale è:
1. Ricevere richieste HTTP (tipicamente intermediate dall'API Gateway).
2. Verificare lo stato di autenticazione dell'utente inoltrando il cookie di sessione all'**Auth Service** (`GET /me`).
3. Restituire una risposta strutturata in **JSON** contenente lo stato della sessione (`authenticated: true/false`) e il profilo dell'utente loggato.

---

##  Architettura e Flusso

```text
[ Browser / Frontend ]
         │  GET /api/v1/persistance (con cookie di sessione)
         ▼
[ API Gateway (porta 4000) ]
         │  Proxy rewrite: /api/v1/persistance -> /
         ▼
[ Persistance Service (porta 3003) ]
         │  GET /me (inoltro Cookie)
         ▼
[ Auth Service (porta 3001) ]
         │  Verifica sessione Express / Passport
         ▼
[ Persistance Service ] ──► Restituisce JSON al Client
```

---

## Struttura della Cartella

```plaintext
persistance/
├── config/
│   └── env.js                      # Caricamento e validazione delle variabili d'ambiente
├── src/
│   ├── controllers/
│   │   └── persistanceController.js # Logica di business e chiamata inter-servizio verso Auth Service
│   ├── routes/
│   │   └── persistance_route.js     # Definizione rotte Express (GET /)
│   └── persistanceservice.js        # Entry point del server Express
├── .env                             # File di configurazione locale
├── package.json                     # Dipendenze e script di avvio
└── README.md                        # Questa documentazione
```

---

##  Configurazione Variabili d'Ambiente

Il file `.env` deve trovarsi nella root del servizio (`backend/persistance/.env`):

| Variabile | Valore Predefinito | Descrizione |
|---|---|---|
| `PORT` | `3003` | Porta TCP di ascolto del microservizio |
| `AUTH_SERVICE_URL` | `http://localhost:3001` | URL base dell'Auth Service per la verifica delle sessioni |

Esempio di `.env`:
```ini
PORT=3003
AUTH_SERVICE_URL=http://localhost:3001
```

---

##  Endpoint API

### `GET /`

Restituisce lo stato della sessione e le informazioni dell'utente autenticato.

- **URL Gateway**: `http://localhost:4000/api/v1/persistance`
- **URL Diretto**: `http://localhost:3003/`
- **Metodo**: `GET`
- **Headers Richiesti**: `Cookie` (per sessioni autenticate)

#### Risposta Utente Autenticato (HTTP 200)

```json
{
  "message": "Benvenuto nel Servizio di Persistenza",
  "authenticated": true,
  "user": {
    "displayName": "Mario Rossi",
    "firstName": "Mario",
    "lastName": "Rossi",
    "email": "mario.rossi@example.com"
  }
}
```

#### Risposta Utente Non Autenticato (HTTP 200)

```json
{
  "message": "Benvenuto nel Servizio di Persistenza",
  "authenticated": false,
  "user": null
}
```

#### Risposta Errore Connessione Auth Service (HTTP 503)

```json
{
  "message": "Benvenuto nel Servizio di Persistenza",
  "authenticated": false,
  "user": null,
  "error": "Auth service non raggiungibile"
}
```


## 🖥️ Integrazione con il Frontend

Nella Home Page (`frontend/public/index.html`):
- È presente il pulsante **"Richiedi Dati Persistenza (JSON)"** (`#btn-persistance`).
- Il pulsante viene mostrato **esclusivamente se l'utente è autenticato** (gestito via `applyAuthState()` in `navbar.js`).
- Al click, viene eseguita una richiesta asincrona `fetch('/api/v1/persistance', { credentials: 'include' })` e il JSON restituito viene visualizzato formattato a video.
