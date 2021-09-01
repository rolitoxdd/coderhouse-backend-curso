const express = require("express");

const app = express();
const PORT = 8080;

const items = [];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", console.error);

app.get("/api/productos/listar", (req, res) => {
  res.json(items);
});

app.get("/api/productos/listar/:id", (req, res) => {
  const id = req.params.id;
  const item = items.find((prod) => prod.id == id);
  if (item) res.json(item);
  else {
    res.statusCode = 404;
    res.json({
      error: items.length
        ? "producto no encontrado"
        : "no hay productos cargados",
    });
  }
});

app.post("/api/productos/guardar", (req, res) => {
  const { title, price, thumbnail } = req.body;
  const id = items.length ? Math.max(...items.map((p) => p.id)) + 1 : 0;
  const producto = { id, title, price, thumbnail };
  items.push(producto);
  res.json(producto);
});
