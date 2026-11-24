const Item = require("../models/Item");

// Recupera solo i documenti dell'utente autenticato, dal più recente
async function getItemsByUser(googleId) {
  return await Item.find({ googleId }).sort({ dataInserimento: -1 });
}

// Crea e salva un documento associato all'account dell'utente
async function createItem({ userId, googleId, nome, utente, presente = true }) {
  const newItem = new Item({
    userId,
    googleId,
    nome,
    utente,
    presente,
  });
  return await newItem.save();
}

module.exports = {
  getItemsByUser,
  createItem,
};