exports.loginController = (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {
        res.send("Login effettuato!");
    } else {
        res.send(`Credenziali non valide.<br>Username: ${username}<br>Password: ${password}`);
    }
};