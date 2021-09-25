const express = require("express");
const { writeFile } = require("fs");
const moment = require("moment");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mensajes = require("./mensajes.json");

const PORT = 8080;
const api = express.Router();

let items = [];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/api", api);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", console.error);

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
  // res.json(producto);
  // res.redirect("/");
  res.sendStatus(201);
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

io.on("connection", (socket) => {
  socket.emit("items", items);
  socket.emit("all-chat", mensajes);
  socket.on("new-item", (item) => {
    const id = items.length ? Math.max(...items.map((p) => p.id)) + 1 : 0;
    const producto = { ...item, id };
    items.push(producto);
    io.sockets.emit("items", items);
  });
  socket.on("mensaje", (msg) => {
    if (msg?.email && msg?.mensaje) {
      const fecha = moment().format("DD/MM/YYYY HH:mm:ss");
      const data = { ...msg, fecha };
      io.sockets.emit("mensaje", data);
      mensajes.push(data);
      writeFile(
        path.join(__dirname, "mensajes.json"),
        JSON.stringify(mensajes, null, 2),
        () => {}
      );
    }
  });
});
