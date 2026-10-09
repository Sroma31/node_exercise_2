


exports.login = (req, res) => {              // Definisce la route POST per elaborare il login.
    const{username, password} = req.body;      // Estrae username e password dal corpo della richiesta.

    if(username === 'admin' && password === '1234'){ // Controlla se le credenziali sono corrette.
        res.send('Login è avvenuto con successo!');  // Risponde con un messaggio di successo.
    } else {                                     // Altrimenti le credenziali sono errate.
        res.send('Login fallito. <br> Username inserito: ' + username + ' <br> Password inserita: ' + password + '.'); // Risponde con un messaggio di errore.
    } // Chiude l'if-else. 
}; // Chiude la funzione login.

