/**
 * Funzione helper per la registrazione centralizzata degli errori a console.
 * @param {Error|any} err - Oggetto errore o messaggio da loggare
 */
function logError(err) {
    console.error(err);
}

module.exports = { logError };
