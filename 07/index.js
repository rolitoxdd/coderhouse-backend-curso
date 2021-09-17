import express from "express";
import { readFileSync } from "fs";

const app = express();
const PORT = 8080;
const productos = JSON.parse(readFileSync("productos.txt", "utf-8"));

let visitasItems = 0;
let visitasItemRandom = 0;

app.get("/items", (req, res) => {
  visitasItems++;
  res.json({ items: productos, cantidad: productos.length });
});
app.get("/item-random", (req, res) => {
  visitasItemRandom++;
  const random = Math.floor(Math.random() * productos.length);
  res.json({ item: productos[random] });
});
app.get("/visitas", (req, res) => {
  res.json({ visitas: { items: visitasItems, item: visitasItemRandom } });
});

const server = app.listen(PORT, () => {
  console.log(`Server listening on port ${server.address().port}`);
});
server.on("error", (error) => console.error("[ERROR]", error.message));
