exports.signinController = (req, res) => {             // Definisce la route POST per elaborare la registrazione.
    const { username, password } = req.body;      // Estrae username e password dal corpo della richiesta.

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        return res.status(400).send("Username e password sono obbligatori.");
    }

    res.send('Registrazione completata per: ' + username); // Risponde confermando la registrazione.
}; // Chiude la route POST /signup.
