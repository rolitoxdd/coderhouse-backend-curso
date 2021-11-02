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
const mongoose = require("mongoose");
const Producto = require("../../models/productos");
const productos = require("express").Router();
mongoose.connect(
  process.env.MONGO_URI ||
    "mongodb://mongoadmin:secret@localhost:27017/ecommerce?authSource=admin",
  {},
  (err) => {
    if (err) {
      throw err;
    } else {
      productos.get("/listar", async (req, res) => {
        let items = await Producto.find({});
        res.json(items);
      });

      productos.get("/listar/:id", async (req, res) => {
        const id = req.params.id;
        const item = await Producto.find({ _id: id });
        if (item) res.json(item);
        else {
          res.statusCode = 404;
          let items = await Producto.find({});
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
        const prod = new Producto({ title, price, thumbnail });
        await prod.save();
        // res.json(producto);
        // res.redirect("/");
        res.sendStatus(201);
      });

      productos.put("/actualizar/:id", async (req, res) => {
        const id = req.params.id;
        const { title, price, thumbnail } = req.body;
        const producto = await Producto.updateOne(
          { title, price, thumbnail },
          { _id: id }
        );
        res.json(producto);
      });

      productos.delete("/borrar/:id", async (req, res) => {
        const id = req.params.id;
        const producto = await Producto.deleteOne({ _id: id });
        res.json(producto);
      });
    }
  }
);

module.exports = productos;
