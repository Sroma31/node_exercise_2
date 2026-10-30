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
