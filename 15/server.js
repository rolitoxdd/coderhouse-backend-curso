const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const productos = express.Router();
const carrito = express.Router();

let listaProductos = require("./listaProductos.json") || [];
let carritox = require("./carritox.json") || {
  timestamp: Date.now(),
  productos: [],
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/productos", productos);
app.use("/carrito", carrito);

let admin = true;

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", console.error);

carrito.get("/listar", (req, res) => {
  res.json(carritox.productos);
});

carrito.post("/agregar/:id_producto", (req, res) => {
  const idProducto = req.params.id_producto;
  const producto = listaProductos.find((p) => p.id == idProducto);
  carritox.productos.push(producto);
  fs.writeFile("./carritox.json", JSON.stringify(carritox, null, 2), () => {});

  res.status(201).json(producto);
});

carrito.delete("/borrar/:id", (req, res) => {
  const { id } = req.params;
  carrito.productos = carrito.productos.filter((p) => p.id != id);
  res.json({ deleted: true });
});

productos.get("/listar/:id?", (req, res) => {
  const { id } = req.params;
  if (id) {
    const producto = listaProductos.find((p) => p.id == id);
    if (producto) {
      res.json(producto);
    } else {
      res
        .status(404)
        .json({ error: -1, descripcion: `Product with id ${id} not found` });
    }
  } else res.json(listaProductos);
});

productos.post("/agregar", (req, res) => {
  if (admin) {
    const { id, nombre, descripcion, codigo, foto, precio, stock } = req.body;
    const timestamp = Date.now();
    const producto = {
      id,
      nombre,
      descripcion,
      codigo,
      foto,
      precio,
      stock,
      timestamp,
    };
    listaProductos.push(producto);
    fs.writeFile(
      "./listaProductos.json",
      JSON.stringify(listaProductos, null, 2),
      () => {}
    );
    res.status(201).json(producto);
  } else {
    res.status(403).json({
      error: -1,
      descripcion: "This endpoint is only for administrators",
    });
  }
});

productos.post("/actualizar/:id", (req, res) => {
  if (admin) {
    const { id } = req.params;
    const producto = listaProductos.find((p) => p.id == id);
    const { nombre, descripcion, codigo, foto, precio, stock } = req.body;
    if (producto) {
      producto.nombre = nombre || producto?.nombre;
      producto.descripcion = descripcion || producto?.descripcion;
      producto.codigo = codigo || producto?.codigo;
      producto.foto = foto || producto?.foto;
      producto.precio = precio || producto?.precio;
      producto.stock = stock || producto?.stock;
      producto.timestamp = Date.now();
      fs.writeFile(
        "./listaProductos.json",
        JSON.stringify(listaProductos, null, 2),
        () => {}
      );
      res.status(201).json(producto);
    } else {
      res
        .status(404)
        .json({ error: -1, descripcion: `Product with id ${id} not found` });
    }
  } else {
    res.status(403).json({
      error: -1,
      descripcion: "This endpoint is only for administrators",
    });
  }
});

productos.delete("/borrar/:id", (req, res) => {
  if (admin) {
    const { id } = req.params;
    listaProductos = listaProductos.filter((p) => p.id != id);
    fs.writeFile(
      "./listaProductos.json",
      JSON.stringify(listaProductos, null, 2),
      () => {}
    );
    res.json({ deleted: true });
  } else {
    res.status(403).json({
      error: -1,
      descripcion: "This endpoint is only for administrators",
    });
  }
});
