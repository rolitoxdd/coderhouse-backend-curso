const mongoose = require("mongoose");

const mensajeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  edad: { type: Number, required: true },
  alias: { type: String, required: true },
  avatar: { type: String, required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, required: true },
});

module.exports = mongoose.model("Mensajes", mensajeSchema);
