const moment = require("moment");
const { sqlite } = require("./dbOptions");
const knex = require("knex")(sqlite);
const axios = require("axios").default;
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "http://localhost";
let mensajes;
let items = [];

(async () => {
  const hasTableMessages = await knex.schema.hasTable("messages");
  if (!hasTableMessages) {
    await knex.schema.createTable("messages", (table) => {
      table.increments("id");
      table.string("email");
      table.string("mensaje");
      table.string("fecha");
    });
  }
  mensajes = await knex.select("*").from("messages");
})();
(async () => {
  const { data } = await axios.get(`${HOST}:${PORT}/api/productos/listar`);
  items = data;
})();

module.exports = function initializeSockets(server) {
  const io = require("socket.io")(server);
  io.on("connection", (socket) => {
    socket.emit("items", items);
    socket.emit("all-chat", mensajes);

    socket.on("new-item", (item) => {
      const id = items.length ? Math.max(...items.map((p) => p.id)) + 1 : 0;
      const producto = { ...item, id };
      items.push(producto);
      io.sockets.emit("items", items);
      axios.post(`${HOST}:${PORT}/api/productos/guardar`, producto);
    });

    socket.on("mensaje", async (msg) => {
      if (msg?.email && msg?.mensaje) {
        const fecha = moment().format("DD/MM/YYYY HH:mm:ss");
        io.sockets.emit("mensaje", {
          email: msg.email,
          mensaje: msg.mensaje,
          fecha,
        });
        mensajes.push({ email: msg.email, mensaje: msg.mensaje, fecha });
        const res = await knex("messages").insert({
          email: msg.email,
          mensaje: msg.mensaje,
          fecha,
        });
        console.log(res);
      }
    });
  });
};
