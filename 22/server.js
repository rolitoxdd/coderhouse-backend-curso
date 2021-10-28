const express = require("express");
const faker = require("faker");
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

app.get("/productos/vista-test", (req, res) => {
  const cant = req.query.cant;
  const productos = [];
  if (cant == 0) {
    return res.send("<h1>No hay productos</h1>");
  } else if (cant == undefined) {
    for (let i = 0; i < 10; i++) {
      productos.push({
        title: faker.commerce.productName(),
        thumbnail: faker.image.image(),
        price: faker.commerce.price(),
      });
    }
  } else {
    for (let i = 0; i < cant; i++) {
      productos.push({
        title: faker.commerce.productName(),
        thumbnail: faker.image.image(),
        price: faker.commerce.price(),
      });
    }
  }
  res.send(`
<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TEST</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    </head>
    <body>
      <table class="table">
        <thead>
            <tr>
                <th scope="col">Title</th>
                <th scope="col">Price</th>
                <th scope="col">thumbnail</th>
            </tr>
        </thead>
        <tbody>
        ${productos.reduce(
          (prev, item) =>
            prev +
            `
          <tr>
            <td>${item.title}</td>
            <td>$${item.price}</td>
            <td><img width=50 src="${item.thumbnail}" alt=""></td>
          </tr>
      `,
          ""
        )}
        </tbody>
      </table>
    </body>
    </html>`);
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

server.on("error", console.error);
