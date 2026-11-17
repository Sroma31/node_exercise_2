# Identity Service

## Scopo

L'Auth Service evolve nel ruolo di **Identity Service**.

Le sue responsabilità sono:

- Login tramite Google OAuth
- Logout
- Gestione della sessione utente
- Validazione dell'identità
- Esposizione delle informazioni necessarie al frontend
- Generazione e gestione della sessione (o, in futuro, dei JWT)

Dal punto di vista pratico deve:

1. Autenticare l'utente
2. Comunicare se l'utente è autenticato
3. Generare e mantenere una sessione

---

## Architettura

```text
Browser
   ↓
Gateway (:4000)
   ↓
Auth Service (:3001)
   ↓
Google
   ↓
Auth Service
   ↓
Gateway
   ↓
Service (:3000)
   ↓
Pagine Web