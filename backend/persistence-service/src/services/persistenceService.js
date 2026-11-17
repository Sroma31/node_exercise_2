const Item = require("../models/Item");

// Recupera tutti i documenti ordinati dal più recente
async function getAllItems() {
  return await Item.find().sort({ dataInserimento: -1 });
}

// Crea e salva un nuovo documento su MongoDB Atlas
async function createItem({ nome, utente, presente = true }) {
  const newItem = new Item({
    nome,
    utente,
    presente,
  });
  return await newItem.save();
}

module.exports = {
  getAllItems,
  createItem,
};