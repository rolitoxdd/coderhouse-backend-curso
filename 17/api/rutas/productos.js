const { mysql: mysqlOptions } = require("../../dbOptions");
const knex = require("knex")(mysqlOptions);

(async () => {
  const hasTableProducts = await knex.schema.hasTable("products");
  if (!hasTableProducts) {
    await knex.schema.createTable("products", (table) => {
      table.increments("id");
      table.string("title");
      table.string("price");
      table.string("thumbnail");
    });
  }

  console.log(hasTableProducts);
})();

const productos = require("express").Router();
productos.get("/listar", async (req, res) => {
  let items = await knex.select("*").from("products");
  res.json(items);
});

productos.get("/listar/:id", async (req, res) => {
  const id = req.params.id;
  const item = await knex.select("*").from("products").where("id", id);
  if (item) res.json(item);
  else {
    res.statusCode = 404;
    let items = await knex.select("*").from("products");
    res.json({
      error: items.length
        ? "producto no encontrado"
        : "no hay productos cargados",
    });
  }
});

productos.post("/guardar", async (req, res) => {
  console.log(req.body);
  const { title, price, thumbnail } = req.body;
  await knex("products").insert({ title, price, thumbnail });
  // res.json(producto);
  // res.redirect("/");
  res.sendStatus(201);
});

productos.put("/actualizar/:id", async (req, res) => {
  const id = req.params.id;
  const { title, price, thumbnail } = req.body;
  const producto = await knex("products")
    .where("id", id)
    .update({ title, price, thumbnail });
  res.json(producto);
});

productos.delete("/borrar/:id", async (req, res) => {
  const id = req.params.id;
  const producto = await knex("products").where("id", id).del();
  res.json(producto);
});

module.exports = productos;
