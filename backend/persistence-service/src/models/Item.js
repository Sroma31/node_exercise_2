const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definizione dello schema del documento da salvare su MongoDB
const ItemSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  presente: {
    type: Boolean,
    default: true,
  },
  dataInserimento: {
    type: Date,
    default: Date.now, // senza parentesi: calcola la data al momento di ogni salvataggio
  },
});

// Esporta il modello collegato alla collection "items" su Atlas
module.exports = mongoose.model("Item", ItemSchema);