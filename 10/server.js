const express = require("express");
const handlebars = require("express-handlebars");

const app = express();
const PORT = 8080;
const api = express.Router();

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");

let items = [];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/api", api);

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", console.error);

//vista

app.get("/productos/vista", (req, res) => {
  res.render("main", { emptyList: !items.length, items });
});

//api
api.get("/productos/listar", (req, res) => {
  res.json(items);
});

api.get("/productos/listar/:id", (req, res) => {
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

api.post("/productos/guardar", (req, res) => {
  const { title, price, thumbnail } = req.body;
  const id = items.length ? Math.max(...items.map((p) => p.id)) + 1 : 0;
  const producto = { id, title, price, thumbnail };
  items.push(producto);
  res.json(producto);
});

api.put("/productos/actualizar/:id", (req, res) => {
  const id = req.params.id;
  const { title, price, thumbnail } = req.body;
  const producto = items.find((item) => item.id == id);
  producto.title = title;
  producto.price = price;
  producto.thumbnail = thumbnail;
  res.json(producto);
});
api.delete("/productos/borrar/:id", (req, res) => {
  const id = req.params.id;
  const producto = items.find((item) => item.id !== id);
  items = items.filter((item) => item.id != id);
  res.json(producto);
});
