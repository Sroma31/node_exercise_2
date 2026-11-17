const persistenceService = require("../services/persistenceService");

// GET /db -> restituisce i dati salvati su MongoDB
exports.getData = async (req, res) => {
  try {
    const items = await persistenceService.getAllItems();
    console.log(`Recuperati ${items.length} documenti da MongoDB`);

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

// POST /db -> salva un nuovo documento su MongoDB
exports.saveData = async (req, res) => {
  const nome = String(req.body.nome || "").trim();

  if (!nome) {
    return res.status(400).json({ error: true, message: "Il campo 'nome' è obbligatorio" });
  }

  try {
    const savedItem = await persistenceService.createItem({
      nome,
      utente: req.user?.firstName || "utente",
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