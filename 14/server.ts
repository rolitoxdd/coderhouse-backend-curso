import express from "express";
import { writeFile, readFileSync } from "fs";
import moment from "moment";
import path from "path";
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const mensajes = JSON.parse(readFileSync(path.join(__dirname,"mensajes.json"), "utf-8"))

const PORT: number = 8080;
const api= express.Router();

let items: any[] = [];

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use("/api", api);

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", console.error);

//api
api.get("/productos/listar", (req: any, res: { json: (arg0: any[]) => void; }) => {
  res.json(items);
});

api.get("/productos/listar/:id", (req: { params: { id: any; }; }, res: { json: (arg0: { error: string; }) => void; statusCode: number; }) => {
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

api.post("/productos/guardar", (req: { body: { title: any; price: any; thumbnail: any; }; }, res: { sendStatus: (arg0: number) => void; }) => {
  const { title, price, thumbnail } = req.body;
  const id = items.length ? Math.max(...items.map((p) => p.id)) + 1 : 0;
  const producto = { id, title, price, thumbnail };
  items.push(producto);
  // res.json(producto);
  // res.redirect("/");
  res.sendStatus(201);
});

api.put("/productos/actualizar/:id", (req: { params: { id: any; }; body: { title: any; price: any; thumbnail: any; }; }, res: { json: (arg0: any) => void; }) => {
  const id = req.params.id;
  const { title, price, thumbnail } = req.body;
  const producto = items.find((item) => item.id == id);
  producto.title = title;
  producto.price = price;
  producto.thumbnail = thumbnail;
  res.json(producto);
});
api.delete("/productos/borrar/:id", (req: { params: { id: any; }; }, res: { json: (arg0: any) => void; }) => {
  const id = req.params.id;
  const producto = items.find((item) => item.id !== id);
  items = items.filter((item) => item.id != id);
  res.json(producto);
});

io.on("connection", (socket: { emit: (arg0: string, arg1: any[]) => void; on: (arg0: string, arg1: { (item: any): void; (msg: any): void; }) => void; }) => {
  socket.emit("items", items);
  socket.emit("all-chat", mensajes);
  socket.on("new-item", (item: any) => {
    const id = items.length ? Math.max(...items.map((p) => p.id)) + 1 : 0;
    const producto = { ...item, id };
    items.push(producto);
    io.sockets.emit("items", items);
  });
  socket.on("mensaje", (msg: { email: any; mensaje: any; }) => {
    if (msg?.email && msg?.mensaje) {
      const fecha: string = moment().format("DD/MM/YYYY HH:mm:ss");
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
