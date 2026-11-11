//lo scopo di persistanceController.js è quello di gestire le richieste HTTP relative al servizio di persistenza, 
//in particolare la rotta principale che verifica l'autenticazione dell'utente tramite il servizio di autenticazione
//e restituisce informazioni sull'utente autenticato.



const http = require("http");
const env = require("../../config/env");

// Definizione del controller per il servizio di persistenza
exports.getHome = (req, res) => {
    // Estrai il dominio e la porta dall'URL del servizio di autenticazione
    const authUrl = new URL(env.AUTH_SERVICE_URL);


    //const options è un oggetto che contiene le opzioni per la richiesta HTTP al servizio di autenticazione.
    const options = {
        hostname: authUrl.hostname,
        port: parseInt(authUrl.port || "3001", 10),
        path: "/me",
        method: "GET",
        //un header coockie è uno strumento utilizzato per inviare informazioni di sessione tra il client e il server. In questo caso, viene utilizzato per propagare il cookie di sessione dell'utente autenticato al servizio di autenticazione, in modo che quest'ultimo possa verificare se l'utente è effettivamente autenticato.
        headers: {
            // Propaga il cookie di sessione per verificare l'autenticazione
            Cookie: req.headers.cookie || ""
        }
    };

    //la richiesta del servizio di autenticazione viene effettuata tramite http.request, che invia una richiesta GET al servizio di autenticazione per verificare se l'utente è autenticato.
    const authReq = http.request(options, (authRes) => {// Gestisce la risposta dal servizio di autenticazione
        let data = "";
        authRes.on("data", (chunk) => { data += chunk; });// Accumula i dati della risposta
        authRes.on("end", () => {
            try {

                const result = JSON.parse(data);

                return res.json({
                    message: "accesso effettuato con successo",
                    authenticated: result.authenticated || false,
                    user: result.authenticated
                        ? {
                            displayName: result.displayName || null,
                            firstName: result.firstName || null,
                            lastName: result.lastName || null,
                            email: result.email || null
                        }
                        : null
                });

            } catch {
                // Se la risposta non è JSON valido, restituiamo comunque una risposta sicura
                return res.json({
                    message: "accesso effettuato con successo",
                    authenticated: false,
                    user: null
                });
            }
        });
    });

    authReq.on("error", () => {
        // Auth service non raggiungibile
        res.status(503).json({
            message: "accesso effettuato con successo",
            authenticated: false,
            user: null,
            error: "Auth service non raggiungibile"
        });
    });

    authReq.end();
};
