const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Definizione dello schema del documento da salvare su MongoDB Atlas
const ItemSchema = new Schema({
  nome: {
    type: String,
    required: true,
    trim: true,
  },
  utente: {
    type: String,
    default: "anonimo",
  },
  presente: {
    type: Boolean,
    default: true,
  },
  dataInserimento: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Item", ItemSchema);