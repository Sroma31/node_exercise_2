const Item = require("../models/Item");

// Recupera tutti i documenti ordinati dal più recente (PDF § 1.7)
async function getAllItems() {
  return await Item.find().sort({ dataInserimento: -1 });
}

// Crea e salva un nuovo documento su MongoDB Atlas (PDF § 1.5)
async function createItem(nome, presente = true) {
  const newItem = new Item({
    nome,
    presente,
  });
  return await newItem.save();
}

module.exports = {
  getAllItems,
  createItem,
};