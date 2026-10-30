const path = require("path");

/**
 * Mappatura centralizzata dei percorsi del filesystem per il service.
 * Consente di importare percorsi assoluti affidabili in qualsiasi modulo.
 */
const ROOT = path.join(__dirname, "..");
const FRONTEND_PUBLIC = path.join(ROOT, "..", "..", "frontend", "public");

module.exports = {
    ROOT: ROOT,
    SRC: path.join(ROOT, "src"),
    PUBLIC: FRONTEND_PUBLIC,
    CONTROLLERS: path.join(ROOT, "src", "controllers"),
    ROUTES: path.join(ROOT, "src", "route"),
    UTILS: path.join(ROOT, "src", "utils")
};
