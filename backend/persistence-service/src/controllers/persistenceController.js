const persistenceService = require("../services/persistenceService");

// GET /db -> restituisce solo i dati dell'utente loggato
exports.getData = async (req, res) => {
  try {
    const items = await persistenceService.getItemsByUser(req.user.googleId);
    console.log(`Recuperati ${items.length} documenti per ${req.user.email}`);

    res.json({
      service: "persistence",
      status: "ok",
      count: items.length,
      items,
    });
  } catch (err) {
    console.error("Errore lettura da MongoDB:", err);
    res.status(500).json({ error: true, message: "Errore nel recupero dei dati" });
  }
};

// POST /db -> salva un nuovo documento collegato all'utente loggato
exports.saveData = async (req, res) => {
  const nome = String(req.body.nome || "").trim();

  if (!nome) {
    return res.status(400).json({ error: true, message: "Il campo 'nome' è obbligatorio" });
  }

  try {
    const savedItem = await persistenceService.createItem({
      userId: req.user.userId,
      googleId: req.user.googleId,
      nome,
      utente: req.user.displayName || req.user.firstName || "utente",
      presente: true,
    });

    console.log("Documento salvato su MongoDB:", savedItem);

    res.status(201).json({
      service: "persistence",
      status: "saved",
      item: savedItem,
    });
  } catch (err) {
    console.error("Errore salvataggio su MongoDB:", err);
    res.status(500).json({ error: true, message: "Errore nel salvataggio del dato" });
  }
};