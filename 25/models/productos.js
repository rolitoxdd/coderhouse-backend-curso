const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  thumbnail: { type: String, required: true },
});

module.exports = mongoose.model("Productos", productoSchema);
