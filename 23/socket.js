const moment = require("moment");
const normalizr = require("normalizr");

const mongoose = require("mongoose");
const Mensaje = require("./models/mensajes");

const axios = require("axios").default;
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "http://localhost";
let items = [];

let schemaAuthor = new normalizr.schema.Entity(
  "author",
  {},
  { idAttribute: "id" }
);
let schemaMsg = new normalizr.schema.Entity(
  "mensaje",
  {
    author: schemaAuthor,
  },
  { idAttribute: "_id" }
);
let schemaMsgList = new normalizr.schema.Entity(
  "mensajes",
  {
    mensajes: [schemaMsg],
  },
  { idAttribute: "id" }
);

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
  mongoose.connect(
    process.env.MONGO_URI ||
      "mongodb://mongoadmin:secret@localhost:27017/ecommerce?authSource=admin",
    {},
    (err) => {
      if (err) {
        throw err;
      } else {
        io.on("connection", async (socket) => {
          const data = await Mensaje.find();
          const totalMessages = {
            id: "mensajes",
            mensajes: data.map(
              ({
                mensaje,
                id,
                nombre,
                apellido,
                edad,
                alias,
                avatar,
                _id,
                fecha,
              }) => ({
                mensaje,
                fecha,
                _id,
                author: { id, nombre, apellido, edad, alias, avatar },
              })
            ),
          };
          items = await axios.get(`${HOST}:${PORT}/api/productos/listar`);
          items = items.data;
          socket.emit("items", items);
          socket.emit(
            "all-chat",
            normalizr.normalize(totalMessages, schemaMsgList)
          );

          socket.on("new-item", (item) => {
            items.push(item);
            io.sockets.emit("items", items);
            axios.post(`${HOST}:${PORT}/api/productos/guardar`, item);
          });

          socket.on("mensaje", async (msg) => {
            console.log(msg);
            if (msg?.id && msg?.mensaje) {
              // const fecha = moment().format("DD/MM/YYYY HH:mm:ss");
              const fecha = new Date();
              io.sockets.emit("mensaje", { ...msg, fecha });
              const mensaje = new Mensaje({ ...msg, fecha });
              await mensaje.save();
            }
          });
        });
      }
    }
  );
};
