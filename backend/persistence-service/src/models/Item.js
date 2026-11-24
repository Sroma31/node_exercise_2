const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  googleId: {
    type: String,
    required: true,
    index: true,
  },
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