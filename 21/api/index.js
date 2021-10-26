const productos = require("./rutas/productos");
const router = (app) => {
  app.use("/api/productos", productos);
};

module.exports = router;
