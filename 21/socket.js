const {
  FsPersistence,
  MySql,
  Sqlite,
  MongoLocal,
  MongoAtlas,
} = require("./database");
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
    break;
}

const axios = require("axios").default;
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "http://localhost";
let items = [];

// (async () => {
//   const hasTableMessages = await knex.schema.hasTable("messages");
//   if (!hasTableMessages) {
//     await knex.schema.createTable("messages", (table) => {
//       table.increments("id");
//       table.string("email");
//       table.string("mensaje");
//       table.string("fecha");
//     });
//   }
//   mensajes = await knex.select("*").from("messages");
// })();
// (async () => {
//   const { data } = await axios.get(`${HOST}:${PORT}/api/productos/listar`);
//   items = data;
// })();

module.exports = function initializeSockets(server) {
  const io = require("socket.io")(server);
  io.on("connection", async (socket) => {
    const mensajes = await db.listMensajes();
    items = await axios.get(`${HOST}:${PORT}/api/productos/listar`);
    items = items.data;
    socket.emit("items", items);
    socket.emit("all-chat", mensajes);

    socket.on("new-item", (item) => {
      items.push(item);
      io.sockets.emit("items", items);
      axios.post(`${HOST}:${PORT}/api/productos/guardar`, item);
    });

    socket.on("mensaje", async (msg) => {
      if (msg?.email && msg?.mensaje) {
        // const fecha = moment().format("DD/MM/YYYY HH:mm:ss");
        const fecha = new Date();
        io.sockets.emit("mensaje", {
          email: msg.email,
          mensaje: msg.mensaje,
          fecha,
        });
        db.addMensaje({ email: msg.email, mensaje: msg.mensaje, fecha });
      }
    });
  });
};
