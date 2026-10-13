const path = require("path"); // Importa il modulo path per gestire i percorsi dei file.

// Definisce i percorsi dei file statici per le pagine HTML.

const ROOT = path.join(__dirname, "..");
const FRONTEND_PUBLIC = path.join(ROOT, "..", "..", "frontend", "public");

//PERCORSI PRINCIPALI:

module.exports ={ 

    ROOT: ROOT,
    SRC: path.join(ROOT, "src"),
    // PUBLIC: path.join(ROOT, "public"),
    PUBLIC: FRONTEND_PUBLIC,
    CONTROLLERS: path.join(ROOT, "src", "controllers"),
    ROUTES: path.join(ROOT, "src", "route"),
    UTILS: path.join(ROOT, "src", "utils"),

}