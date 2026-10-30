/**
 * Controller di registrazione (versione mock/didattica).
 * Valida la presenza e il tipo dei campi obbligatori (username, password)
 * e restituisce la conferma di avvenuta registrazione senza salvataggio persistente.
 */
exports.signinController = (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        return res.status(400).send("Username e password sono obbligatori.");
    }

    res.send("Registrazione completata per: " + username);
};
