const http = require("http");

const PORT = process.env.port || 8000;

const aleatorio = (minimo, maximo) =>
  Math.floor(Math.random() * (maximo - minimo + 1)) + minimo;

const server = http.createServer((req, res) => {
  const objeto = {
    id: aleatorio(1, 10),
    title: `Producto ${aleatorio(1, 10)}`,
    price: aleatorio(0, 999999) / 100,
    thumbnail: `Foto ${aleatorio(1, 10)}`,
  };
  res.end(JSON.stringify(objeto));
});

server.listen(PORT, () => {
  console.log(`Server escuchando en el puerto ${PORT}`);
});
