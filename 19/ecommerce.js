db = db.getSiblingDB("ecommerce");
// 1 y 2
db.mensajes.insertMany([
  {
    email: "test@example.com",
    mensaje: "hola",
    fecha: new Date(2021, 9, 15),
  },
  {
    email: "hola@example.com",
    mensaje: "q tal",
    fecha: new Date(2021, 9, 15),
  },
  {
    email: "test@example.com",
    mensaje: "bien aca",
    fecha: new Date(2021, 9, 16),
  },
  {
    email: "test@example.com",
    mensaje: "probando",
    fecha: new Date(2021, 9, 16),
  },
  {
    email: "test@example.com",
    mensaje: "test",
    fecha: new Date(2021, 9, 17),
  },
  {
    email: "hola@example.com",
    mensaje: "holasss",
    fecha: new Date(2021, 9, 17),
  },
  {
    email: "hola@example.com",
    mensaje: "xd",
    fecha: new Date(2021, 9, 18),
  },
  {
    email: "chao@example.com",
    mensaje: "chao",
    fecha: new Date(2021, 9, 18),
  },
  {
    email: "test@example.com",
    mensaje: "fin",
    fecha: new Date(2021, 9, 19),
  },
  {
    email: "chao@example.com",
    mensaje: "adios",
    fecha: new Date(2021, 9, 19),
  },
]);
db.productos.insertMany([
  {
    title: "Calculadora",
    price: 666,
    thumbnail:
      "https://microsofters.com/wp-content/uploads/2019/10/EG5rvszW4AEvgt0.jpg",
  },
  {
    title: "Lapiz",
    price: 123,
    thumbnail:
      "https://png.pngtree.com/png-vector/20190114/ourlarge/pngtree-vector-pencil-icon-png-image_313118.jpg",
  },
  {
    title: "Silla",
    price: 555,
    thumbnail:
      "https://images.vexels.com/media/users/3/148231/isolated/preview/c32b4868a501e2c1bb27c745b3b49e08-icono-de-silla-de-respaldo-negro.png",
  },
  {
    title: "Taza",
    price: 321,
    thumbnail:
      "https://e7.pngegg.com/pngimages/998/704/png-clipart-computer-icons-encapsulated-postscript-mug-food-logo.png",
  },
  {
    title: "Cama",
    price: 1111,
    thumbnail:
      "https://i.pinimg.com/originals/37/fe/a0/37fea08149edadf534ddc1e6a67c8fc2.png",
  },
  {
    title: "Televisor",
    price: 3500,
    thumbnail: "https://image.flaticon.com/icons/png/512/49/49672.png",
  },
  {
    title: "Lampara",
    price: 801,
    thumbnail:
      "https://www.nicepng.com/png/full/407-4073029_lmpara-de-escritorio-icon.png",
  },
  {
    title: "Horno",
    price: 2200,
    thumbnail: "https://cdn-icons-png.flaticon.com/512/1609/1609966.png",
  },
  {
    title: "Computadora",
    price: 4567,
    thumbnail:
      "https://us.123rf.com/450wm/creator76/creator761602/creator76160200005/52338417-icono-plana-del-ordenador-en-negro-sobre-blanco-ilustraci%C3%B3n-vectorial.jpg?ver=6",
  },
  {
    title: "Camara",
    price: 2345,
    thumbnail: "https://image.flaticon.com/icons/png/512/56/56887.png",
  },
]);

// 3
const cursorMensajes = db.mensajes.find();
const cursorProductos = db.productos.find();
while (cursorMensajes.hasNext()) {
  printjson(cursorMensajes.next());
}
while (cursorProductos.hasNext()) {
  printjson(cursorProductos.next());
}

// 4
db.mensajes.countDocuments();
db.productos.countDocuments();
