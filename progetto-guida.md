# Guida completa al progetto `node_exercise_2` — commento riga per riga

Questo documento descrive l'intero progetto e riporta il codice di ogni file con un commento per ogni riga, che spiega cosa fa quella riga e cosa sta succedendo nel momento in cui viene eseguita o interpretata.

---

## 1. Cosa è questo progetto

È una **piccola applicazione web full-stack** pensata per esercitarsi con:

- pagine HTML semplici;
- stili CSS moderni e responsive;
- un minimo di interazione con JavaScript lato client;
- un backend in Node.js + Express che serve le pagine e riceve dati dai form.

L'app ha diverse pagine: Home, About, Contact, Login, Sign Up e una pagina Meteo. La barra di navigazione e il footer sono componenti HTML condivisi, caricati dinamicamente in ogni pagina con JavaScript.

---

## 2. Tecnologie e librerie usate

### Lato backend (Node.js)

| Tecnologia | A cosa serve |
|------------|--------------|
| **Node.js** | Ambiente di esecuzione per JavaScript sul server. |
| **Express** | Framework minimale per creare server web e gestire route. |
| **body-parser** | Middleware per leggere i dati inviati dai form (JSON e dati codificati). |
| **cors** | Middleware per gestire le richieste provenienti da domini diversi (incluso nel `package.json` ma non usato attivamente nel codice). |
| **axios** | Libreria per fare richieste HTTP (inclusa nel `package.json` ma non usata nel codice attuale). |

### Lato frontend

| Tecnologia | A cosa serve |
|------------|--------------|
| **HTML5** | Struttura delle pagine. |
| **CSS3** | Stili, layout, colori, animazioni e adattamento ai dispositivi mobili. |
| **JavaScript (vanilla)** | Interazione con il DOM, caricamento componenti condivisi, invio richieste al server. |
| **Fetch API** | Interfaccia moderna del browser per fare richieste HTTP. |

---

## 3. Struttura del progetto

```text
node_exercise_2/
├── package.json                  # dipendenze condivise (radice)
├── backend/
│   ├── package.json              # dipendenze del backend
│   └── src/
│       └── server.js             # server Express
└── frontend/
    └── public/                   # file statici serviti al browser
        ├── index.html            # pagina Home
        ├── about.html            # pagina About
        ├── contact.html          # pagina Contact
        ├── login.html            # pagina Login
        ├── signup.html           # pagina Sign Up
        ├── weather.html          # pagina Meteo
        ├── components/
        │   ├── navbar.html       # barra di navigazione condivisa
        │   └── footer.html       # footer condiviso
        ├── css/
        │   ├── index.css         # stili della Home
        │   ├── about.css         # stili di About
        │   ├── contact.css       # stili di Contact
        │   ├── login.css         # stili di Login
        │   ├── signup.css        # stili di Sign Up
        │   ├── weather.css       # stili di Weather
        │   ├── navbar.css        # stili della navbar
        │   └── footer.css        # stili del footer
        └── js/
            └── weather.js        # logica della pagina Meteo
```

---

## 4. Come funziona il backend (`backend/src/server.js`)

Il file `server.js` crea un server con Express che:

1. Abilita `body-parser` per leggere i dati inviati dai form.
2. Serve tutta la cartella `frontend/public` come contenuto statico.
3. Definisce alcune route GET per servire le pagine HTML.
4. Definisce due route POST per gestire login e registrazione.
5. Si mette in ascolto sulla porta `3000`.

### Note importanti

- Le pagine `/login`, `/signup`, `/about` e `/contact` sono servite anche tramite route GET esplicite, anche se i file `.html` sono già accessibili grazie a `express.static`.
- `/weather.html` è accessibile **solo** come file statico, non ha una route Express.
- Il backend **non implementa** la route `POST /weather`, quindi la pagina Meteo al momento non riceverebbe risposta dal server. Per farla funzionare bisognerebbe aggiungere in `server.js` una route che riceve la città e chiama un'API meteo esterna (ad esempio OpenWeatherMap).
- Login e Sign Up sono **senza persistenza**: non salvano dati su database; verificano solo le credenziali fisse `admin` / `1234`.

### Avviare il server

Apri un terminale nella cartella `backend` ed esegui:

```bash
node src/server.js
```

Poi apri il browser all'indirizzo:

```text
http://localhost:3000
```

---

## 5. Come funziona il frontend

Ogni pagina HTML:

1. Carica i propri file CSS e i CSS condivisi di navbar e footer.
2. Ha un `<div id="navbar">` e un `<div id="footer">` vuoti.
3. All'interno di questi `<div>` c'è uno script che usa `fetch()` per scaricare `navbar.html` o `footer.html` e inserisce il contenuto ricevuto al posto del `<div>`.

In questo modo la stessa navbar e lo stesso footer appaiono in tutte le pagine senza dover riscrivere il codice.

La pagina `weather.html` inoltre carica `weather.js`, che:

- intercetta l'invio del form;
- impedisce il ricaricamento della pagina;
- legge il nome della città;
- invia una richiesta POST a `/weather` in formato JSON;
- mostra la risposta nel box sottostante.

---

## 6. Dipendenze nei `package.json`

### `package.json` (radice)

```json
{
  "dependencies": {
    "axios": "^1.20.0",
    "body-parser": "^2.3.0",
    "express": "^5.2.1"
  }
}
```

### `backend/package.json`

```json
{
  "name": "node_exercise_2",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",
  "dependencies": {
    "axios": "^1.20.0",
    "body-parse": "^0.1.0",
    "body-parser": "^2.3.0",
    "cors": "^2.8.6",
    "express": "^5.2.1"
  }
}
```

> **Nota:** `body-parse` (senza la `r` finale) è una dipendenza presente per errore di battitura; non viene importato nel codice. Quella corretta è `body-parser`.

---

## 7. Codice completo commentato riga per riga

Di seguito trovi ogni file del progetto con un commento accanto a ogni riga che descrive cosa sta facendo.

### `backend/src/server.js`

```javascript
var express = require("express");              // Importa il modulo Express e lo assegna a una variabile.
var path = require("path");                    // Importa il modulo 'path' per gestire i percorsi dei file.
var app = express();                           // Crea una nuova applicazione Express.
var port = 3000;                               // Definisce il numero di porta su cui il server ascolterà.
var bodyParser = require("body-parser");       // Importa body-parser per leggere il corpo delle richieste HTTP.

// il body parser serve per leggere i dati inviati dal form
app.use(bodyParser.json());                    // Registra il middleware JSON: converte il corpo JSON in req.body.
app.use(bodyParser.urlencoded({ extended: true })); // Registra il middleware per i dati inviati dai form HTML.


app.use(express.static(path.join(__dirname, "../../frontend/public"))); // Serve la cartella public come contenuto statico.

//pagina di login
app.get("/login", (req, res) =>{               // Definisce una route GET per l'indirizzo /login.
    res.sendFile(path.join(__dirname, "../../frontend/public/login.html")); // Invia il file login.html al browser.
});


//post per il login, se username e password sono corretti, invia un messaggio di successo, altrimenti invia un messaggio di errore
app.post('/login', (req, res) =>{              // Definisce una route POST per ricevere i dati del form di login.
    const{username, password} = req.body;      // Estrae username e password dall'oggetto req.body.

    if(username === 'admin' && password === '1234'){ // Controlla se le credenziali corrispondono ai valori fissi.
        res.send('Login è avvenuto con successo!');  // Risponde con un messaggio di successo.
    } else {                                     // Altrimenti, le credenziali sono errate.
        res.send('Login fallito. <br> Username inserito: ' + username + ' <br> Password inserita: ' + password + '.'); // Risponde mostrando i dati inseriti.
    }
});


//pagina di signup
app.get("/signup", (req, res) =>{              // Definisce una route GET per l'indirizzo /signup.
    res.sendFile(path.join(__dirname, "../../frontend/public/signup.html")); // Invia il file signup.html al browser.
});

//post per la registrazione, senza persistenza
app.post('/signup', (req, res) =>{             // Definisce una route POST per ricevere i dati del form di registrazione.
    const{username, password} = req.body;      // Estrae username e password dal corpo della richiesta.
    res.send('Registrazione completata per: ' + username); // Risponde confermando la registrazione dell'utente.
});


//pagina about
app.get("/about", (req, res) =>{               // Definisce una route GET per l'indirizzo /about.
    res.sendFile(path.join(__dirname, "../../frontend/public/about.html")); // Invia il file about.html al browser.
});


//pagina contact
app.get("/contact", (req, res) =>{             // Definisce una route GET per l'indirizzo /contact.
    res.sendFile(path.join(__dirname, "../../frontend/public/contact.html")); // Invia il file contact.html al browser.
});


//definizione dello stato visualizzabile da prompt
app.listen(port, ()=> {                        // Avvia il server e lo mette in ascolto sulla porta definita.
console.log("Server in ascolto alla porta " + port); // Scrive in console che il server è attivo sulla porta.
console.log('accedi all indirizzo http://localhost:'+port) // Scrive in console l'indirizzo da aprire nel browser.
});
```

---

### `frontend/public/components/navbar.html`

```html
<nav class="navbar">                           <!-- Apre l'elemento semantico di navigazione con classe navbar. -->
    <div class="nav-logo">My App</div>         <!-- Crea un div per il logo/testo del brand. -->

    <ul class="nav-links">                     <!-- Apre un elenco non ordinato per i link di navigazione. -->
        <li><a href="/">Home</a></li>          <!-- Elemento lista con link alla pagina Home. -->
        <li><a href="/about">About</a></li>    <!-- Elemento lista con link alla pagina About. -->
        <li><a href="/contact">Contact</a></li> <!-- Elemento lista con link alla pagina Contact. -->
        <li><a href="/weather.html">Weather</a></li> <!-- Elemento lista con link al file statico weather.html. -->
        <li><a href="/signup">Signup</a></li>  <!-- Elemento lista con link alla pagina Sign Up. -->
        <li><a href="/login">Login</a></li>    <!-- Elemento lista con link alla pagina Login. -->
    </ul>                                      <!-- Chiude l'elenco dei link. -->
</nav>                                         <!-- Chiude la barra di navigazione. -->
```

### `frontend/public/components/footer.html`

```html
<footer class="footer">                        <!-- Apre l'elemento semantico footer con classe footer. -->
    <p>&copy; 2023 My App. All rights reserved.</p> <!-- Paragrafo con il testo del copyright. -->
</footer>                                      <!-- Chiude il footer. -->
```

---

### `frontend/public/index.html`

```html
<!DOCTYPE html>                                <!-- Dichiara che il documento è in HTML5. -->
<html lang="en">                               <!-- Apre il documento HTML impostando la lingua inglese. -->

<head>                                         <!-- Inizia la sezione head con metadati e risorse. -->
    <meta charset="UTF-8">                     <!-- Imposta la codifica dei caratteri a UTF-8. -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Rende la pagina responsive sui dispositivi mobili. -->
    <title>Home</title>                        <!-- Definisce il titolo visualizzato nella scheda del browser. -->
    <link rel="stylesheet" href="/css/index.css"> <!-- Collega il foglio di stile specifico della Home. -->
    <link rel="stylesheet" href="/css/navbar.css"> <!-- Collega il foglio di stile condiviso della navbar. -->
    <link rel="stylesheet" href="/css/footer.css"> <!-- Collega il foglio di stile condiviso del footer. -->
</head>                                        <!-- Chiude la sezione head. -->

<body>                                         <!-- Inizia il corpo visibile della pagina. -->

    <div id="navbar">                          <!-- Crea un div vuoto dove verrà inserita la navbar. -->
        <script>                               <!-- Inizia uno script JavaScript inline. -->
            fetch('/components/navbar.html')   <!-- Fa una richiesta HTTP per scaricare navbar.html. -->
                .then(response => response.text()) // Converte la risposta in testo puro.
                .then(html => document.getElementById('navbar').innerHTML = html); // Inserisce il testo nel div navbar.
        </script>                              <!-- Chiude lo script. -->
    </div>                                     <!-- Chiude il div della navbar. -->

    <div class="container">                    <!-- Crea il contenitore principale della Home. -->
        <h1>Welcome to My App</h1>             <!-- Titolo principale di benvenuto. -->
        <p>This is the home page of your application.</p> <!-- Paragrafo descrittivo. -->
    </div>                                     <!-- Chiude il contenitore principale. -->

    <div id="footer">                          <!-- Crea un div vuoto dove verrà inserito il footer. -->
        <script>                               <!-- Inizia uno script JavaScript inline. -->
            fetch('/components/footer.html')   <!-- Fa una richiesta HTTP per scaricare footer.html. -->
                .then(response => response.text()) // Converte la risposta in testo.
                .then(html => document.getElementById('footer').innerHTML = html); // Inserisce il testo nel div footer.
        </script>                              <!-- Chiude lo script. -->
    </div>                                     <!-- Chiude il div del footer. -->

</body>                                        <!-- Chiude il body. -->

</html>                                        <!-- Chiude il documento HTML. -->
```

---

### `frontend/public/login.html`

```html
<!DOCTYPE html>                                <!-- Dichiara il documento HTML5. -->
<html lang="it">                               <!-- Apre il documento HTML impostando la lingua italiana. -->

<head>                                         <!-- Inizia la sezione head. -->
    <meta charset="UTF-8">                     <!-- Imposta la codifica UTF-8. -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Rende la pagina responsive. -->
    <title>Login</title>                       <!-- Titolo della scheda del browser. -->
    <link rel="stylesheet" href="/css/login.css"> <!-- Collega il CSS della pagina di login. -->
    <link rel="stylesheet" href="/css/navbar.css"> <!-- Collega il CSS condiviso della navbar. -->
    <link rel="stylesheet" href="/css/footer.css"> <!-- Collega il CSS condiviso del footer. -->
</head>                                        <!-- Chiude la sezione head. -->

<body>                                         <!-- Inizia il body. -->

    <div id="navbar">                          <!-- Div vuoto per la navbar. -->
        <script>                               <!-- Script per caricare la navbar. -->
            fetch('/components/navbar.html')   <!-- Scarica il file della navbar. -->
                .then(response => response.text()) // Converte la risposta in testo.
                .then(html => document.getElementById('navbar').innerHTML = html); // Inserisce la navbar nel div.
        </script>                              <!-- Chiude lo script. -->
    </div>                                     <!-- Chiude il div della navbar. -->

    <div class="login-wrapper">                <!-- Crea un wrapper per centrare il form. -->
        <div class="login-box">                <!-- Crea il box bianco del form di login. -->
            <h2>Login</h2>                     <!-- Titolo del form. -->
            <form action="/login" method="POST"> <!-- Crea un form che invia i dati a /login con metodo POST. -->
                <input type="text" name="username" placeholder="Username" required> <!-- Campo username obbligatorio. -->
                <input type="password" name="password" placeholder="Password" required> <!-- Campo password obbligatorio. -->
                <button type="submit">Accedi</button> <!-- Pulsante per inviare il form. -->
            </form>                            <!-- Chiude il form. -->
        </div>                                 <!-- Chiude il box di login. -->
    </div>                                     <!-- Chiude il wrapper. -->

    <div id="footer">                          <!-- Div vuoto per il footer. -->
        <script>                               <!-- Script per caricare il footer. -->
            fetch('/components/footer.html')   <!-- Scarica il file del footer. -->
                .then(response => response.text()) // Converte la risposta in testo.
                .then(html => document.getElementById('footer').innerHTML = html); // Inserisce il footer nel div.
        </script>                              <!-- Chiude lo script. -->
    </div>                                     <!-- Chiude il div del footer. -->

</body>                                        <!-- Chiude il body. -->

</html>                                        <!-- Chiude il documento HTML. -->
```

---

### `frontend/public/signup.html`

```html
<!DOCTYPE html>                                <!-- Dichiara il documento HTML5. -->
<html lang="it">                               <!-- Apre il documento in italiano. -->

<head>                                         <!-- Inizia la sezione head. -->
    <meta charset="UTF-8">                     <!-- Imposta la codifica UTF-8. -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Responsive. -->
    <title>Sign Up</title>                     <!-- Titolo della pagina. -->
    <link rel="stylesheet" href="/css/signup.css"> <!-- CSS della pagina Sign Up. -->
    <link rel="stylesheet" href="/css/navbar.css"> <!-- CSS condiviso navbar. -->
    <link rel="stylesheet" href="/css/footer.css"> <!-- CSS condiviso footer. -->
</head>                                        <!-- Chiude head. -->

<body>                                         <!-- Inizia il body. -->

    <div id="navbar">                          <!-- Div per la navbar. -->
        <script>                               <!-- Script di caricamento navbar. -->
            fetch('/components/navbar.html')   <!-- Scarica navbar.html. -->
                .then(response => response.text()) // Converte in testo.
                .then(html => document.getElementById('navbar').innerHTML = html); // Inserisce nel div.
        </script>                              <!-- Chiude script. -->
    </div>                                     <!-- Chiude div navbar. -->

    <div class="signup-wrapper">               <!-- Wrapper per centrare il box. -->
        <div class="signup-box">               <!-- Box del form di registrazione. -->
            <h2>Sign Up</h2>                   <!-- Titolo del form. -->
            <form action="/signup" method="POST"> <!-- Form che invia i dati a /signup con POST. -->
                <input type="text" name="username" placeholder="Username" required> <!-- Campo username obbligatorio. -->
                <input type="password" name="password" placeholder="Password" required> <!-- Campo password obbligatorio. -->
                <button type="submit">Registrati</button> <!-- Pulsante di invio. -->
            </form>                            <!-- Chiude il form. -->
        </div>                                 <!-- Chiude il box. -->
    </div>                                     <!-- Chiude il wrapper. -->

    <div id="footer">                          <!-- Div per il footer. -->
        <script>                               <!-- Script di caricamento footer. -->
            fetch('/components/footer.html')   <!-- Scarica footer.html. -->
                .then(response => response.text()) // Converte in testo.
                .then(html => document.getElementById('footer').innerHTML = html); // Inserisce nel div.
        </script>                              <!-- Chiude script. -->
    </div>                                     <!-- Chiude div footer. -->

</body>                                        <!-- Chiude body. -->

</html>                                        <!-- Chiude HTML. -->
```

---

### `frontend/public/weather.html`

```html
<!DOCTYPE html>                                <!-- Dichiara il documento HTML5. -->
<html lang="it">                               <!-- Apre il documento in italiano. -->

<head>                                         <!-- Inizia head. -->
    <meta charset="UTF-8">                     <!-- Codifica UTF-8. -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Responsive. -->
    <title>Weather API</title>                 <!-- Titolo della pagina. -->
    <link rel="stylesheet" href="/css/navbar.css"> <!-- CSS navbar. -->
    <link rel="stylesheet" href="/css/footer.css"> <!-- CSS footer. -->
    <link rel="stylesheet" href="/css/weather.css"> <!-- CSS pagina meteo. -->
</head>                                        <!-- Chiude head. -->

<body>                                         <!-- Inizia body. -->

    <!-- NAVBAR -->                            <!-- Commento che indica l'inizio della navbar. -->
    <div id="navbar"></div>                    <!-- Div vuoto per la navbar. -->
    <script>                                   <!-- Script per caricare la navbar. -->
        fetch("/components/navbar.html")       <!-- Scarica navbar.html. -->
            .then(res => res.text())           // Converte la risposta in testo.
            .then(html => document.getElementById("navbar").innerHTML = html); // Inserisce nel div.
    </script>                                  <!-- Chiude script. -->

    <!-- WEATHER CONTENT -->                   <!-- Commento che indica l'inizio del contenuto meteo. -->
    <div class="weather-wrapper">              <!-- Wrapper per centrare i box meteo. -->
        <div class="weather-box">              <!-- Box con il form. -->
            <h2>Weather API</h2>               <!-- Titolo della pagina meteo. -->
            <p class="subtitle">Inserisci il nome della città per sapere le condizioni meteo</p> <!-- Istruzioni per l'utente. -->

            <form id="weather-form" action="/weather" method="POST"> <!-- Form con id e action sul server. -->
                <input type="text" id="city-input" name="city" placeholder="Nome della città" required> <!-- Input per la città. -->
                <button type="submit">Invia</button> <!-- Pulsante per inviare la richiesta. -->
            </form>                            <!-- Chiude il form. -->
        </div>                                 <!-- Chiude il primo box. -->

        <div class="weather-box" id="weather-result"></div> <!-- Box vuoto dove verrà mostrato il risultato. -->
    </div>                                     <!-- Chiude il wrapper. -->

    <!-- FOOTER -->                            <!-- Commento che indica l'inizio del footer. -->
    <div id="footer"></div>                    <!-- Div vuoto per il footer. -->
    <script>                                   <!-- Script per caricare il footer. -->
        fetch("/components/footer.html")       <!-- Scarica footer.html. -->
            .then(res => res.text())           // Converte in testo.
            .then(html => document.getElementById("footer").innerHTML = html); // Inserisce nel div.
    </script>                                  <!-- Chiude script. -->
    <script src="/js/weather.js"></script>     <!-- Carica il file JavaScript che gestisce il form. -->
</body>                                        <!-- Chiude body. -->

</html>                                        <!-- Chiude HTML. -->
```

---

### `frontend/public/about.html`

```html
<!DOCTYPE html>                                <!-- HTML5. -->
<html lang="it">                               <!-- Documento in italiano. -->

<head>                                         <!-- Head. -->
    <meta charset="UTF-8">                     <!-- UTF-8. -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Responsive. -->
    <title>About</title>                        <!-- Titolo pagina. -->
    <link rel="stylesheet" href="/css/about.css"> <!-- CSS pagina About. -->
    <link rel="stylesheet" href="/css/navbar.css"> <!-- CSS navbar. -->
    <link rel="stylesheet" href="/css/footer.css"> <!-- CSS footer. -->
</head>                                        <!-- Chiude head. -->

<body>                                         <!-- Body. -->

    <div id="navbar">                          <!-- Div navbar. -->
        <script>                               <!-- Caricamento navbar. -->
            fetch('/components/navbar.html')   <!-- Scarica navbar.html. -->
                .then(response => response.text()) // Testo.
                .then(html => document.getElementById('navbar').innerHTML = html); // Inserisce.
        </script>                              <!-- Chiude script. -->
    </div>                                     <!-- Chiude div navbar. -->

    <main class="about-wrapper">               <!-- Tag semantico per il contenuto principale. -->
        <div class="about-box">                <!-- Box bianco del contenuto About. -->
            <h2>About My App</h2>              <!-- Titolo. -->
            <p>My App è una semplice applicazione web che dimostra l'uso di HTML, CSS e JavaScript per creare pagine moderne e responsive.</p> <!-- Descrizione. -->

            <h3>Cosa offriamo</h3>             <!-- Sottotitolo. -->
            <ul class="feature-list">          <!-- Elenco delle funzionalità. -->
                <li>Interfaccia pulita e responsive</li> <!-- Elemento lista. -->
                <li>Navigazione semplice tra le pagine</li> <!-- Elemento lista. -->
                <li>Form di login e registrazione</li> <!-- Elemento lista. -->
                <li>Integrazione con API meteo</li> <!-- Elemento lista. -->
            </ul>                              <!-- Chiude elenco. -->
        </div>                                 <!-- Chiude box. -->
    </main>                                    <!-- Chiude contenuto principale. -->

    <div id="footer">                          <!-- Div footer. -->
        <script>                               <!-- Caricamento footer. -->
            fetch('/components/footer.html')   <!-- Scarica footer.html. -->
                .then(response => response.text()) // Testo.
                .then(html => document.getElementById('footer').innerHTML = html); // Inserisce.
        </script>                              <!-- Chiude script. -->
    </div>                                     <!-- Chiude div footer. -->

</body>                                        <!-- Chiude body. -->

</html>                                        <!-- Chiude HTML. -->
```

---

### `frontend/public/contact.html`

```html
<!DOCTYPE html>                                <!-- HTML5. -->
<html lang="it">                               <!-- Italiano. -->

<head>                                         <!-- Head. -->
    <meta charset="UTF-8">                     <!-- UTF-8. -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!-- Responsive. -->
    <title>Contact</title>                      <!-- Titolo. -->
    <link rel="stylesheet" href="/css/contact.css"> <!-- CSS Contact. -->
    <link rel="stylesheet" href="/css/navbar.css"> <!-- CSS navbar. -->
    <link rel="stylesheet" href="/css/footer.css"> <!-- CSS footer. -->
</head>                                        <!-- Chiude head. -->

<body>                                         <!-- Body. -->

    <div id="navbar">                          <!-- Div navbar. -->
        <script>                               <!-- Caricamento navbar. -->
            fetch('/components/navbar.html')   <!-- Scarica navbar.html. -->
                .then(response => response.text()) // Testo.
                .then(html => document.getElementById('navbar').innerHTML = html); // Inserisce.
        </script>                              <!-- Chiude script. -->
    </div>                                     <!-- Chiude div navbar. -->

    <main class="contact-wrapper">             <!-- Contenuto principale. -->
        <div class="contact-box">              <!-- Box contatti. -->
            <h2>Contact</h2>                   <!-- Titolo. -->
            <p>Hai domande o suggerimenti? Ecco come puoi contattarci.</p> <!-- Introduzione. -->

            <ul class="contact-list">          <!-- Elenco contatti. -->
                <li>                           <!-- Primo contatto. -->
                    <strong>Email</strong>     <!-- Etichetta Email. -->
                    <span>info@myapp.example</span> <!-- Indirizzo email. -->
                </li>                          <!-- Chiude primo contatto. -->
                <li>                           <!-- Secondo contatto. -->
                    <strong>Telefono</strong>  <!-- Etichetta Telefono. -->
                    <span>+39 123 456 7890</span> <!-- Numero di telefono. -->
                </li>                          <!-- Chiude secondo contatto. -->
                <li>                           <!-- Terzo contatto. -->
                    <strong>Indirizzo</strong> <!-- Etichetta Indirizzo. -->
                    <span>Via Roma 1, 00100 Roma, Italia</span> <!-- Indirizzo fisico. -->
                </li>                          <!-- Chiude terzo contatto. -->
            </ul>                              <!-- Chiude elenco. -->
        </div>                                 <!-- Chiude box. -->
    </main>                                    <!-- Chiude contenuto principale. -->

    <div id="footer">                          <!-- Div footer. -->
        <script>                               <!-- Caricamento footer. -->
            fetch('/components/footer.html')   <!-- Scarica footer.html. -->
                .then(response => response.text()) // Testo.
                .then(html => document.getElementById('footer').innerHTML = html); // Inserisce.
        </script>                              <!-- Chiude script. -->
    </div>                                     <!-- Chiude div footer. -->

</body>                                        <!-- Chiude body. -->

</html>                                        <!-- Chiude HTML. -->
```

---

### `frontend/public/css/index.css`

```css
/*  RESET  */                                  /* Commento di sezione per il reset CSS. */
* {                                            /* Selettore universale: applica a tutti gli elementi. */
    margin: 0;                                /* Azzera il margine esterno predefinito. */
    padding: 0;                               /* Azzera il padding interno predefinito. */
    box-sizing: border-box;                   /* Include bordi e padding nelle dimensioni totali. */
}                                              /* Chiude il selettore universale. */

/*  BODY  */                                   /* Commento di sezione per il body. */
body {                                         /* Selettore per l'elemento body. */
    font-family: Arial, sans-serif;            /* Imposta il font e un font di fallback. */
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8); /* Applica uno sfondo a gradiente. */
    min-height: 100vh;                         /* Imposta l'altezza minima uguale all'altezza della finestra. */

    display: flex;                             /* Attiva il layout flessivo. */
    flex-direction: column; /* IMPORTANTE */    /* Dispone gli elementi figli in colonna. */
}                                              /* Chiude il selettore body. */

/*  CONTAINER  */                              /* Commento di sezione per il contenitore. */
.container {                                   /* Selettore per il contenitore principale. */
    flex: 1; /* OCCUPA LO SPAZIO DISPONIBILE */ /* Fa espandere il contenitore per occupare lo spazio rimanente. */
    display: flex;                             /* Attiva il layout flessivo. */
    flex-direction: column;                    /* Dispone i figli in colonna. */
    justify-content: center;                   /* Centra i figli verticalmente. */
    align-items: center;                       /* Centra i figli orizzontalmente. */
    padding: 20px;                             /* Aggiunge spazio interno di 20 pixel. */
}                                              /* Chiude .container. */

.container h1 {                                /* Selettore per il titolo dentro .container. */
    font-size: 40px;                           /* Imposta la dimensione del carattere a 40 pixel. */
    color: #333;                               /* Imposta il colore del testo a grigio scuro. */
    margin-bottom: 20px;                       /* Aggiunge margine inferiore di 20 pixel. */
}                                              /* Chiude .container h1. */

.container p {                                 /* Selettore per il paragrafo dentro .container. */
    font-size: 18px;                           /* Imposta la dimensione del carattere a 18 pixel. */
    color: #555;                               /* Imposta il colore del testo a grigio medio. */
}                                              /* Chiude .container p. */
```

---

### `frontend/public/css/login.css`

```css
 /*  RESET MINIMO  */                          /* Commento di sezione per il reset minimo. */
* {                                            /* Selettore universale. */
    box-sizing: border-box;                    /* Include bordi e padding nelle dimensioni. */
    margin: 0;                                 /* Azzera i margini. */
    padding: 0;                                /* Azzera i padding. */
}                                              /* Chiude il reset. */

/*  BODY  */                                   /* Sezione body. */
body {                                         /* Selettore body. */
    font-family: Arial, sans-serif;            /* Font principale e fallback. */
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8); /* Sfondo gradiente. */
    display: flex;                             /* Layout flessivo. */
    flex-direction: column;                    /* Disposizione verticale. */
    min-height: 100vh;                         /* Altezza minima finestra. */
}                                              /* Chiude body. */

/*  LOGIN WRAPPER  */                          /* Sezione wrapper login. */
.login-wrapper {                               /* Selettore del wrapper. */
    flex: 1;                                   /* Occupa lo spazio verticale disponibile. */
    display: flex;                             /* Layout flessivo. */
    justify-content: center;                   /* Centra orizzontalmente. */
    align-items: center;                       /* Centra verticalmente. */
}                                              /* Chiude wrapper. */

/*  LOGIN BOX  */                              /* Sezione box login. */
.login-box {                                   /* Selettore del box bianco. */
    background: #ffffff;                       /* Sfondo bianco. */
    padding: 30px 35px;                        /* Spazio interno verticale e orizzontale. */
    border-radius: 12px;                       /* Angoli arrotondati. */
    width: 320px;                              /* Larghezza fissa del box. */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); /* Ombra sotto il box. */
    animation: fadeIn 0.4s ease;               /* Applica l'animazione fadeIn. */
}                                              /* Chiude box. */

/* Titolo */                                   /* Commento per il titolo. */
.login-box h2 {                                /* Selettore del titolo h2 dentro il box. */
    text-align: center;                        /* Centra il testo. */
    margin-bottom: 25px;                       /* Margine inferiore. */
    color: #333;                               /* Colore grigio scuro. */
    font-weight: 600;                          /* Spessore del font semi-bold. */
}                                              /* Chiude h2. */

/* Input */                                    /* Commento per gli input. */
.login-box input {                             /* Selettore degli input nel form. */
    width: 100%;                               /* Larghezza piena del box. */
    padding: 12px;                             /* Spazio interno. */
    margin: 10px 0 18px 0;                     /* Margine sopra, destra, sotto, sinistra. */
    border: 2px solid #d0d0d0;                 /* Bordo grigio chiaro. */
    border-radius: 6px;                        /* Angoli arrotondati. */
    font-size: 15px;                           /* Dimensione del testo. */
    transition: border-color 0.2s;             /* Transizione morbida del colore del bordo. */
}                                              /* Chiude input. */

.login-box input:focus {                       /* Stile degli input quando sono selezionati. */
    border-color: #0078ff;                     /* Bordo azzurro. */
    outline: none;                             /* Rimuove il contorno predefinito del browser. */
}                                              /* Chiude focus. */

/* Bottone */                                  /* Commento per il bottone. */
.login-box button {                            /* Selettore del pulsante nel box. */
    width: 100%;                               /* Larghezza piena. */
    padding: 12px;                             /* Spazio interno. */
    background: #0078ff;                       /* Sfondo azzurro. */
    color: white;                              /* Testo bianco. */
    border: none;                              /* Nessun bordo. */
    border-radius: 6px;                        /* Angoli arrotondati. */
    font-size: 16px;                           /* Dimensione testo. */
    cursor: pointer;                           /* Cursore a mano al passaggio. */
    transition: background 0.25s, transform 0.1s; /* Transizioni per colore e scala. */
}                                              /* Chiude button. */

.login-box button:hover {                      /* Stile del pulsante al passaggio del mouse. */
    background: #005fcc;                       /* Sfondo azzurro più scuro. */
}                                              /* Chiude hover. */

.login-box button:active {                     /* Stile del pulsante nel momento del click. */
    transform: scale(0.98);                    /* Riduce leggermente la dimensione. */
}                                              /* Chiude active. */

/* Animazione */                               /* Commento per l'animazione. */
@keyframes fadeIn {                            /* Definisce l'animazione chiamata fadeIn. */
    from { opacity: 0; transform: translateY(10px); } /* Stato iniziale: invisibile e spostato verso il basso. */
    to   { opacity: 1; transform: translateY(0); } /* Stato finale: visibile e nella posizione normale. */
}                                              /* Chiude keyframes. */
```

---

### `frontend/public/css/signup.css`

```css
 /*  RESET MINIMO  */                          /* Sezione reset. */
* {                                            /* Selettore universale. */
    box-sizing: border-box;                    /* Include bordi e padding nelle dimensioni. */
    margin: 0;                                 /* Azzera margini. */
    padding: 0;                                /* Azzera padding. */
}                                              /* Chiude reset. */

/*  BODY  */                                   /* Sezione body. */
body {                                         /* Selettore body. */
    font-family: Arial, sans-serif;            /* Font. */
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8); /* Sfondo gradiente. */
    display: flex;                             /* Layout flessivo. */
    flex-direction: column;                    /* Colonna. */
    min-height: 100vh;                         /* Altezza minima. */
}                                              /* Chiude body. */

/*  SIGNUP WRAPPER  */                         /* Sezione wrapper registrazione. */
.signup-wrapper {                              /* Selettore wrapper. */
    flex: 1;                                   /* Espande per riempire lo spazio. */
    display: flex;                             /* Layout flessivo. */
    justify-content: center;                   /* Centra orizzontalmente. */
    align-items: center;                       /* Centra verticalmente. */
}                                              /* Chiude wrapper. */

/*  SIGNUP BOX  */                             /* Sezione box registrazione. */
.signup-box {                                  /* Selettore box. */
    background: #ffffff;                       /* Sfondo bianco. */
    padding: 30px 35px;                        /* Spazio interno. */
    border-radius: 12px;                       /* Angoli arrotondati. */
    width: 320px;                              /* Larghezza fissa. */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); /* Ombra. */
    animation: fadeIn 0.4s ease;               /* Animazione di comparsa. */
}                                              /* Chiude box. */

/* Titolo */                                   /* Titolo. */
.signup-box h2 {                               /* Selettore h2. */
    text-align: center;                        /* Centrato. */
    margin-bottom: 25px;                       /* Margine inferiore. */
    color: #333;                               /* Colore. */
    font-weight: 600;                          /* Spessore. */
}                                              /* Chiude h2. */

/* Input */                                    /* Input. */
.signup-box input {                            /* Selettore input. */
    width: 100%;                               /* Larghezza piena. */
    padding: 12px;                             /* Spazio interno. */
    margin: 10px 0 18px 0;                     /* Margini. */
    border: 2px solid #d0d0d0;                 /* Bordo. */
    border-radius: 6px;                        /* Angoli. */
    font-size: 15px;                           /* Dimensione testo. */
    transition: border-color 0.2s;             /* Transizione bordo. */
}                                              /* Chiude input. */

.signup-box input:focus {                      /* Focus input. */
    border-color: #0078ff;                     /* Bordo azzurro. */
    outline: none;                             /* Rimuove outline. */
}                                              /* Chiude focus. */

/* Bottone */                                  /* Bottone. */
.signup-box button {                           /* Selettore bottone. */
    width: 100%;                               /* Larghezza piena. */
    padding: 12px;                             /* Spazio interno. */
    background: #0078ff;                       /* Sfondo. */
    color: white;                              /* Testo. */
    border: none;                              /* Nessun bordo. */
    border-radius: 6px;                        /* Angoli. */
    font-size: 16px;                           /* Dimensione. */
    cursor: pointer;                           /* Cursore pointer. */
    transition: background 0.25s, transform 0.1s; /* Transizioni. */
}                                              /* Chiude bottone. */

.signup-box button:hover {                     /* Hover bottone. */
    background: #005fcc;                       /* Sfondo più scuro. */
}                                              /* Chiude hover. */

.signup-box button:active {                    /* Active bottone. */
    transform: scale(0.98);                    /* Scala ridotta. */
}                                              /* Chiude active. */

/* Animazione */                               /* Animazione. */
@keyframes fadeIn {                            /* Definizione animazione. */
    from { opacity: 0; transform: translateY(10px); } /* Inizio. */
    to   { opacity: 1; transform: translateY(0); } /* Fine. */
}                                              /* Chiude keyframes. */
```

---

### `frontend/public/css/weather.css`

```css

/* ===== RESET ===== */                        /* Sezione reset. */
* {                                            /* Universale. */
    margin: 0;                                 /* Azzera margini. */
    padding: 0;                                /* Azzera padding. */
    box-sizing: border-box;                    /* Include bordi e padding. */
}                                              /* Chiude reset. */

/* ===== BODY ===== */                         /* Sezione body. */
body {                                         /* Body. */
    font-family: Arial, sans-serif;            /* Font. */
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8); /* Sfondo gradiente. */
    min-height: 100vh;                         /* Altezza minima. */
    display: flex;                             /* Flex. */
    flex-direction: column;                    /* Colonna. */
}                                              /* Chiude body. */

/* ===== WRAPPER ===== */                      /* Sezione wrapper. */
.weather-wrapper {                             /* Wrapper meteo. */
    flex: 1;                                   /* Occupa spazio disponibile. */
    display: flex;                             /* Flex. */
    flex-direction: column; /* <<< QUESTA È LA CHIAVE */ /* Dispone i box in colonna. */
    justify-content: center;                   /* Centra verticalmente. */
    align-items: center;                       /* Centra orizzontalmente. */
    gap: 20px; /* distanza tra i due box */    /* Spazio tra i due box. */
}                                              /* Chiude wrapper. */
/* ===== BOX ===== */                          /* Sezione box. */
.weather-box {                                 /* Box meteo. */
    background: #ffffff;                       /* Sfondo bianco. */
    padding: 30px 35px;                        /* Spazio interno. */
    border-radius: 12px;                       /* Angoli arrotondati. */
    width: 380px;                              /* Larghezza fissa. */
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);   /* Ombra. */
    animation: fadeIn 0.4s ease;               /* Animazione. */
    text-align: center;                        /* Testo centrato. */
}                                              /* Chiude box. */

.weather-box h2 {                              /* Titolo h2. */
    margin-bottom: 15px;                       /* Margine inferiore. */
    color: #333;                               /* Colore. */
    font-weight: 600;                          /* Spessore. */
}                                              /* Chiude h2. */

.subtitle {                                    /* Classe subtitle. */
    margin-bottom: 25px;                       /* Margine. */
    color: #555;                               /* Colore. */
    font-size: 16px;                           /* Dimensione. */
}                                              /* Chiude subtitle. */

/* Input */                                    /* Input. */
.weather-box input {                           /* Selettore input. */
    width: 100%;                               /* Larghezza piena. */
    padding: 12px;                             /* Spazio interno. */
    margin-bottom: 18px;                       /* Margine inferiore. */
    border: 2px solid #d0d0d0;                 /* Bordo. */
    border-radius: 6px;                        /* Angoli. */
    font-size: 15px;                           /* Dimensione. */
    transition: border-color 0.2s;             /* Transizione. */
}                                              /* Chiude input. */

.weather-box input:focus {                     /* Focus. */
    border-color: #0078ff;                     /* Bordo azzurro. */
    outline: none;                             /* Rimuove outline. */
}                                              /* Chiude focus. */

/* Button */                                   /* Bottone. */
.weather-box button {                          /* Selettore bottone. */
    width: 100%;                               /* Larghezza piena. */
    padding: 12px;                             /* Spazio interno. */
    background: #0078ff;                       /* Sfondo. */
    color: white;                              /* Testo. */
    border: none;                              /* Nessun bordo. */
    border-radius: 6px;                        /* Angoli. */
    font-size: 16px;                           /* Dimensione. */
    cursor: pointer;                           /* Pointer. */
    transition: background 0.25s, transform 0.1s; /* Transizioni. */
}                                              /* Chiude bottone. */

.weather-box button:hover {                    /* Hover. */
    background: #005fcc;                       /* Sfondo scuro. */
}                                              /* Chiude hover. */

.weather-box button:active {                   /* Active. */
    transform: scale(0.98);                    /* Riduce scala. */
}                                              /* Chiude active. */
#weather-result {                              /* Selettore del box risultato. */
    display: none; /* nascosto all'inizio */   /* Nasconde il box all'avvio. */
}                                              /* Chiude selettore. */

/* Animation */                                /* Animazione. */
@keyframes fadeIn {                            /* Definizione. */
    from { opacity: 0; transform: translateY(10px); } /* Inizio. */
    to   { opacity: 1; transform: translateY(0); } /* Fine. */
}                                              /* Chiude keyframes. */
```

---

### `frontend/public/css/about.css`

```css
/* ===== RESET ===== */                        /* Sezione reset. */
* {                                            /* Universale. */
    margin: 0;                                 /* Azzera margini. */
    padding: 0;                                /* Azzera padding. */
    box-sizing: border-box;                    /* Include bordi e padding. */
}                                              /* Chiude reset. */

/* ===== BODY ===== */                         /* Sezione body. */
body {                                         /* Body. */
    font-family: Arial, sans-serif;            /* Font. */
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8); /* Sfondo gradiente. */
    min-height: 100vh;                         /* Altezza minima. */
    display: flex;                             /* Flex. */
    flex-direction: column;                    /* Colonna. */
}                                              /* Chiude body. */

/* ===== ABOUT WRAPPER ===== */                /* Sezione wrapper About. */
.about-wrapper {                               /* Wrapper. */
    flex: 1;                                   /* Occupa spazio. */
    display: flex;                             /* Flex. */
    justify-content: center;                   /* Centra orizzontalmente. */
    align-items: center;                       /* Centra verticalmente. */
    padding: 20px;                             /* Spazio interno. */
}                                              /* Chiude wrapper. */

/* ===== ABOUT BOX ===== */                    /* Sezione box About. */
.about-box {                                   /* Box. */
    background: #ffffff;                       /* Sfondo bianco. */
    padding: 40px;                             /* Spazio interno. */
    border-radius: 12px;                       /* Angoli. */
    width: 100%;                               /* Larghezza piena del contenitore. */
    max-width: 600px;                          /* Larghezza massima. */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); /* Ombra. */
    animation: fadeIn 0.4s ease;               /* Animazione. */
}                                              /* Chiude box. */

.about-box h2 {                                /* Titolo h2. */
    text-align: center;                        /* Centrato. */
    margin-bottom: 20px;                       /* Margine. */
    color: #333;                               /* Colore. */
    font-weight: 600;                          /* Spessore. */
}                                              /* Chiude h2. */

.about-box h3 {                                /* Sottotitolo h3. */
    margin-top: 25px;                          /* Margine superiore. */
    margin-bottom: 15px;                       /* Margine inferiore. */
    color: #333;                               /* Colore. */
    font-weight: 600;                          /* Spessore. */
}                                              /* Chiude h3. */

.about-box p {                                 /* Paragrafo. */
    color: #555;                               /* Colore. */
    font-size: 16px;                           /* Dimensione. */
    line-height: 1.6;                          /* Altezza riga. */
}                                              /* Chiude p. */

/* ===== FEATURE LIST ===== */                 /* Sezione lista funzionalità. */
.feature-list {                                /* Selettore lista. */
    list-style: none;                          /* Rimuove i pallini predefiniti. */
    padding: 0;                                /* Azzera padding. */
}                                              /* Chiude lista. */

.feature-list li {                             /* Elemento della lista. */
    padding: 10px 0 10px 28px;                 /* Spazio interno con spazio a sinistra per il segno. */
    color: #555;                               /* Colore. */
    position: relative;                        /* Posizione relativa per il pseudo-elemento. */
}                                              /* Chiude li. */

.feature-list li::before {                     /* Pseudo-elemento prima di ogni elemento lista. */
    content: "✓";                              /* Inserisce il segno di spunta. */
    position: absolute;                        /* Posizionamento assoluto rispetto al li. */
    left: 0;                                   /* Allinea a sinistra. */
    color: #0078ff;                            /* Colore azzurro. */
    font-weight: bold;                         /* Grassetto. */
}                                              /* Chiude pseudo-elemento. */

/* ===== ANIMATION ===== */                    /* Sezione animazione. */
@keyframes fadeIn {                            /* Definizione. */
    from { opacity: 0; transform: translateY(10px); } /* Inizio. */
    to { opacity: 1; transform: translateY(0); } /* Fine. */
}                                              /* Chiude keyframes. */

/* ===== MOBILE ===== */                       /* Sezione adattamento mobile. */
@media (max-width: 600px) {                    /* Regola attiva solo se lo schermo è più stretto di 600px. */
    .about-box {                               /* Box About su mobile. */
        padding: 25px;                         /* Riduce il padding. */
    }                                          /* Chiude box mobile. */
}                                              /* Chiude media query. */
```

---

### `frontend/public/css/contact.css`

```css
/* ===== RESET ===== */                        /* Sezione reset. */
* {                                            /* Universale. */
    margin: 0;                                 /* Azzera margini. */
    padding: 0;                                /* Azzera padding. */
    box-sizing: border-box;                    /* Include bordi e padding. */
}                                              /* Chiude reset. */

/* ===== BODY ===== */                         /* Sezione body. */
body {                                         /* Body. */
    font-family: Arial, sans-serif;            /* Font. */
    background: linear-gradient(135deg, #e3e9f0, #cfd9e8); /* Sfondo gradiente. */
    min-height: 100vh;                         /* Altezza minima. */
    display: flex;                             /* Flex. */
    flex-direction: column;                    /* Colonna. */
}                                              /* Chiude body. */

/* ===== CONTACT WRAPPER ===== */              /* Sezione wrapper contatti. */
.contact-wrapper {                             /* Wrapper. */
    flex: 1;                                   /* Occupa spazio. */
    display: flex;                             /* Flex. */
    justify-content: center;                   /* Centra orizzontalmente. */
    align-items: center;                       /* Centra verticalmente. */
    padding: 20px;                             /* Spazio interno. */
}                                              /* Chiude wrapper. */

/* ===== CONTACT BOX ===== */                  /* Sezione box contatti. */
.contact-box {                                 /* Box. */
    background: #ffffff;                       /* Sfondo bianco. */
    padding: 40px;                             /* Spazio interno. */
    border-radius: 12px;                       /* Angoli. */
    width: 100%;                               /* Larghezza piena. */
    max-width: 500px;                          /* Larghezza massima. */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12); /* Ombra. */
    animation: fadeIn 0.4s ease;               /* Animazione. */
}                                              /* Chiude box. */

.contact-box h2 {                              /* Titolo h2. */
    text-align: center;                        /* Centrato. */
    margin-bottom: 15px;                       /* Margine. */
    color: #333;                               /* Colore. */
    font-weight: 600;                          /* Spessore. */
}                                              /* Chiude h2. */

.contact-box > p {                             /* Paragrafo figlio diretto. */
    text-align: center;                        /* Centrato. */
    color: #555;                               /* Colore. */
    margin-bottom: 25px;                       /* Margine inferiore. */
}                                              /* Chiude p. */

/* ===== CONTACT LIST ===== */                 /* Sezione lista contatti. */
.contact-list {                                /* Lista. */
    list-style: none;                          /* Rimuove pallini. */
    padding: 0;                                /* Azzera padding. */
}                                              /* Chiude lista. */

.contact-list li {                             /* Elemento lista. */
    display: flex;                             /* Flex. */
    flex-direction: column;                    /* Etichetta sopra valore. */
    padding: 15px 0;                           /* Spazio verticale. */
    border-bottom: 1px solid #eee;             /* Bordo inferiore grigio chiaro. */
}                                              /* Chiude li. */

.contact-list li:last-child {                  /* Ultimo elemento della lista. */
    border-bottom: none;                       /* Rimuove il bordo inferiore. */
}                                              /* Chiude last-child. */

.contact-list strong {                         /* Etichette in grassetto. */
    color: #0078ff;                            /* Colore azzurro. */
    font-size: 14px;                           /* Dimensione. */
    text-transform: uppercase;                 /* Testo maiuscolo. */
    letter-spacing: 0.5px;                     /* Spaziatura tra lettere. */
    margin-bottom: 5px;                        /* Margine inferiore. */
}                                              /* Chiude strong. */

.contact-list span {                           /* Valori dei contatti. */
    color: #555;                               /* Colore grigio. */
    font-size: 16px;                           /* Dimensione. */
}                                              /* Chiude span. */

/* ===== ANIMATION ===== */                    /* Sezione animazione. */
@keyframes fadeIn {                            /* Definizione. */
    from { opacity: 0; transform: translateY(10px); } /* Inizio. */
    to { opacity: 1; transform: translateY(0); } /* Fine. */
}                                              /* Chiude keyframes. */

/* ===== MOBILE ===== */                       /* Mobile. */
@media (max-width: 600px) {                    /* Schermi stretti. */
    .contact-box {                             /* Box su mobile. */
        padding: 25px;                         /* Riduce padding. */
    }                                          /* Chiude box. */
}                                              /* Chiude media query. */
```

---

### `frontend/public/css/navbar.css`

```css
/*  NAVBAR  */                                 /* Sezione navbar. */
.navbar {                                      /* Selettore navbar. */
    width: 100%;                               /* Larghezza piena. */
    background: #ffffff;                       /* Sfondo bianco. */
    padding: 15px 30px;                        /* Spazio interno verticale e orizzontale. */
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);    /* Ombra sotto la navbar. */
    display: flex;                             /* Layout flessivo. */
    justify-content: space-between;            /* Spazia logo e link ai lati opposti. */
    align-items: center;                       /* Allinea verticalmente al centro. */
    position: sticky;   /* rimane in alto */   /* Fa restare la navbar in alto durante lo scroll. */
    top: 0;                                    /* Attacca la navbar al bordo superiore. */
    z-index: 100;                              /* Mantiene la navbar sopra gli altri elementi. */
}                                              /* Chiude navbar. */

.nav-logo {                                    /* Selettore del logo. */
    font-size: 22px;                           /* Dimensione testo. */
    font-weight: bold;                         /* Grassetto. */
    color: #333;                               /* Colore. */
    letter-spacing: 0.5px;                     /* Spaziatura tra lettere. */
}                                              /* Chiude logo. */

/* LINKS */                                    /* Sezione link. */
.nav-links {                                   /* Selettore lista link. */
    list-style: none;                          /* Rimuove pallini. */
    display: flex;                             /* Layout orizzontale. */
    gap: 25px;                                 /* Spazio tra i link. */
}                                              /* Chiude lista. */

.nav-links a {                                 /* Selettore dei link. */
    text-decoration: none;                     /* Rimuove la sottolineatura. */
    color: #0078ff;                            /* Colore azzurro. */
    font-size: 16px;                           /* Dimensione. */
    padding: 6px 10px;                         /* Spazio interno. */
    border-radius: 6px;                        /* Angoli. */
    transition: 0.25s ease;                    /* Transizione morbida. */
}                                              /* Chiude link. */

.nav-links a:hover {                           /* Stile al passaggio del mouse. */
    background: #e8f1ff;                       /* Sfondo azzurro chiarissimo. */
    color: #005fcc;                            /* Colore azzurro scuro. */
}                                              /* Chiude hover. */

/*  MOBILE  */                                 /* Sezione mobile. */
@media (max-width: 600px) {                    /* Schermi piccoli. */
    .navbar {                                  /* Navbar su mobile. */
        flex-direction: column;                /* Dispone logo e link in colonna. */
        gap: 10px;                             /* Spazio verticale. */
        padding: 20px;                         /* Padding uniforme. */
    }                                          /* Chiude navbar mobile. */

    .nav-links {                               /* Lista link su mobile. */
        flex-direction: column;                /* Link in colonna. */
        gap: 12px;                             /* Spazio tra link. */
        text-align: center;                    /* Centra i link. */
    }                                          /* Chiude lista mobile. */
}                                              /* Chiude media query. */
```

---

### `frontend/public/css/footer.css`

```css
/*  FOOTER  */                                 /* Sezione footer. */
.footer {                                      /* Selettore footer. */
    margin-top: auto;/* margin-top: auto; fa sì che il footer si posizioni in basso */ /* Spinge il footer verso il basso. */
    background: #ffffff;/* background: #ffffff;  fa sì che il footer abbia uno sfondo bianco */ /* Sfondo bianco. */
    padding: 15px; /* padding: 15px; fa sì che il footer abbia un po' di spazio interno */ /* Spazio interno. */
    text-align: center;/* text-align: center; fa sì che il testo del footer sia centrato */ /* Testo centrato. */
    color: #666;                               /* Colore grigio. */
    font-size: 14px;                           /* Dimensione testo. */
    box-shadow: 0 -4px 12px rgba(0,0,0,0.1);/* box-shadow: 0 -4px 12px rgba(0,0,0,0.1); fa sì che il footer abbia un'ombra sopra di esso */ /* Ombra sopra. */
}                                              /* Chiude footer. */
```

---

### `frontend/public/js/weather.js`

```javascript
// Seleziona il form con id weather-form e aggiunge un ascoltatore per l'evento submit.
document.getElementById("weather-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // evita il redirect                       // Blocca l'invio normale del form per evitare il ricaricamento della pagina.

    const city = document.getElementById("city-input").value;    // Legge il testo inserito dall'utente nel campo città.

    const res = await fetch("/weather", {                        // Invia una richiesta POST asincrona alla route /weather del server.
        method: "POST",                                          // Specifica che il metodo HTTP è POST.
        headers: {"Content-Type": "application/json" },          // Dice al server che il corpo della richiesta è in formato JSON.
        body: JSON.stringify({ city })                           // Converte l'oggetto { city: city } in una stringa JSON.
    });

    const data = await res.text();                               // Aspetta la risposta del server e la legge come testo semplice.

    document.getElementById("weather-result").innerHTML = `      // Inserisce HTML dentro il div del risultato.
        <div class="weather-response-box subtitle">              // Apre un div per formattare la risposta.
            ${data}                                              // Inserisce il testo ricevuto dal server.
        </div>                                                   // Chiude il div di formattazione.
    `;

    // Mostra il box
    document.getElementById("weather-result").style.display = "block"; // Rende visibile il box del risultato.

});

/*DOM Javascript della pagina lato client ha queste caratteristiche:
- seleziona elementi del DOM (getElementById)
- aggiunge un event listener al form per intercettare l'evento di submit
- previene il comportamento predefinito del form (redirect)
- legge il valore dell'input della città
- invia una richiesta POST al server con la città come payload JSON
- riceve la risposta dal server e la visualizza in un div dedicato
- mostra il div con il risultato della richiesta meteo*/
```

---

## 8. Cose da sapere e possibili miglioramenti

- **Componenti condivisi**: la navbar e il footer sono caricati via `fetch` in ogni pagina. Questo è un modo semplice per evitare duplicazione, ma ha il limite che se JavaScript è disabilitato i componenti non compaiono.
- **Weather API non completata**: il frontend invia la richiesta a `/weather`, ma il backend non ha questa route. Per completarla serve aggiungere in `server.js` una route `POST /weather` che usi `axios` per chiamare un servizio meteo reale.
- **Persistenza dati**: login e signup non salvano nulla. In un'applicazione reale servirebbe un database (SQLite, MongoDB, PostgreSQL, ecc.).
- **Sicurezza**: le password non vengono mai inviate in chiaro in produzione; qui sono in chiaro solo per scopo didattico.
- **Typo nel `package.json`**: `body-parse` è una dipendenza errata; può essere rimossa con `npm uninstall body-parse`.

---

## 9. Glossario rapido

| Termine | Significato |
|---------|-------------|
| **Route** | Un "percorso" web che il server riconosce, ad esempio `/login`. |
| **Middleware** | Funzione che Express esegue per ogni richiesta, come `body-parser`. |
| **DOM** | Rappresentazione in memoria della pagina HTML, manipolabile con JavaScript. |
| **Fetch API** | Interfaccia del browser per fare richieste HTTP. |
| **Flexbox** | Sistema CSS per disporre gli elementi in righe o colonne. |
| **Media query** | Regola CSS che si applica solo in base alla larghezza dello schermo. |

---

Fine della guida.
