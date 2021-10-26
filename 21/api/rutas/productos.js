// const { mysql: mysqlOptions } = require("../../dbOptions");
// const knex = require("knex")(mysqlOptions);

// (async () => {
//   const hasTableProducts = await knex.schema.hasTable("products");
//   if (!hasTableProducts) {
//     await knex.schema.createTable("products", (table) => {
//       table.increments("id");
//       table.string("title");
//       table.string("price");
//       table.string("thumbnail");
//     });
//   }

//   console.log(hasTableProducts);
// })();

const {
  MemoryPersistence,
  FsPersistence,
  MySql,
  Sqlite,
  MongoLocal,
  MongoAtlas,
} = require("../../database");
const persistencia = +process.env.PERSISTENCIA;
let db;
switch (persistencia) {
  case 0:
    db = new MemoryPersistence();
    break;
  case 1:
    db = new FsPersistence();
    break;
  case 2:
    db = new MySql();
    break;
  case 4:
    db = new Sqlite();
    break;
  case 5:
    db = new MongoLocal();
    break;
  case 6:
    db = new MongoAtlas();
    console.log(db);
    break;
}

const productos = require("express").Router();

productos.get("/listar", async (req, res) => {
  let items = await db.listProducts();
  res.json(items);
});

productos.get("/listar/:id", async (req, res) => {
  const id = req.params.id;
  const item = await db.getProduct(id);
  if (item) res.json(item);
  else {
    res.statusCode = 404;
    let items = await db.listProducts();
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
  await db.addProduct({ title, price, thumbnail });
  res.sendStatus(201);
});

productos.put("/actualizar/:id", async (req, res) => {
  const id = req.params.id;
  const { title, price, thumbnail } = req.body;
  const producto = await db.updateProduct({ title, price, thumbnail, id });
  res.json(producto);
});

productos.delete("/borrar/:id", async (req, res) => {
  const id = req.params.id;
  const producto = await db.deleteProduct(id);
  res.json(producto);
});

module.exports = productos;
