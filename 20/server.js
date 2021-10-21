const express = require("express");
const app = express();
const server = require("http").createServer(app);
const router = require("./api/index");
const sockets = require("./socket");
app.use(express.json());

sockets(server);
router(app);

const PORT = process.env.PORT || 8080;
app.set("PORT", PORT);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", console.error);
