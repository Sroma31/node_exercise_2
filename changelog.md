# Changelog

Tutte le modifiche rilevanti apportate a questo progetto saranno documentate in questo file.

Il formato è basato su [Keep a Changelog](https://keepachangelog.com/it/1.1.0/).

---

## [Non rilasciato]

---

## [2026-11-03]

### Aggiunto
- Flusso completo di autenticazione con **Google OAuth 2.0**.
- Pulsante di accesso rapido con Google nella pagina di login.
- Nuovi campi di input per la pagina di login con stili dedicati.
- Modulo `auth.js` nel frontend per la gestione centralizzata delle sessioni utente.

### Modificato
- Aggiornati i componenti `navbar` e `footer` per riflettere lo stato dell'autenticazione.
- Migliorati gli stili CSS della pagina di login per una maggiore usabilità.

### Sicurezza
- Escluso il file `.env` di configurazione da Git (`backend/service/.env`).

---

## [2026-10-30]

### Aggiunto
- Supporto a `express-session` e `passport` per la gestione delle sessioni e delle strategie di autenticazione.

### Modificato
- Refactoring generale degli stili CSS per navbar, pagina di signup e pagina meteo.
- Migliorata la semantica e la struttura HTML delle pagine.
- Aggiunti e ottimizzati i commenti esplicativi nel codice JavaScript.
- Centralizzazione e miglioramento della gestione delle variabili d'ambiente nei servizi.

---

## [2026-10-29]

### Aggiunto
- Nuovo microservizio dedicato `auth-service` in backend.
- Script di automazione batch (`run.bat`, `install_module.bat`, `uninstall_module.bat`) per facilitare avvio e gestione dipendenze dei microservizi.

### Risolto
- Risolti bug ed errori di compatibilità tra i diversi servizi backend.

---

## [2026-10-27]

### Aggiunto
- Nuovo microservizio `wanted_service` per l'integrazione con le API FBI Wanted.
- Visualizzazione dei dati dei ricercati FBI sul frontend.

---

## [2026-10-20]

### Aggiunto
- Architettura a microservizi con **API Gateway** (`backend/gateway`):
  - Routing centralizzato delle richieste verso i servizi interni.
  - Rate limiting e conteggio richieste.
  - Caching per ridurre il carico sui servizi.
  - Logging unificato.

### Modificato
- Introdotti endpoint API con versionamento (es. `/v1/...`) sia nel gateway che nelle chiamate frontend.

---

## [2026-10-09 - 2026-10-13]

### Aggiunto
- Endpoint e controller per autenticazione (login e signup) di base.
- Separazione delle responsabilità nel backend con cartella `utils`.
- Integrazione completa delle API meteo nel servizio backend.

### Modificato
- Aggiornato `weatherController` con costanti e validazione migliorata del nome città.

### Sicurezza
- Sostituita la chiave API meteo hardcoded con l'uso di variabili d'ambiente (`.env`).

---

## [2026-10-02 - 2026-10-07]

### Aggiunto
- Pagine frontend: Registrazione (`signup`), Informazioni (`about`), Contatti (`contact`) e Meteo (`weather`).
- File CSS dedicati per ciascuna pagina.
- Routing dinamico per le pagine statiche e per l'integrazione con l'API meteo.

### Modificato
- Riorganizzazione della struttura delle cartelle frontend e backend per maggiore modularità e leggibilità.
- Refactoring di controller e route del meteo.

---

## [2026-09-29 - 2026-09-30]

### Aggiunto
- Inizializzazione del repository e configurazione del server Node.js / Express di base.
- Configurazione iniziale della suddivisione in cartelle (`backend` e `frontend`).

