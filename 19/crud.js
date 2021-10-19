// 5

//a
db.productos.insertOne({
  title: "Zapatillas",
  price: 1313,
  thumbnail:
    "https://e7.pngegg.com/pngimages/628/511/png-clipart-sneakers-computer-icons-clothing-others-miscellaneous-white.png",
});

//b
//// i
db.productos.find({ price: { $lt: 1000 } });
//// ii
db.productos.find({ price: { $lte: 3000, $gte: 1000 } });
//// iii
db.productos.find({ price: { $gt: 3000 } });
//// iv
db.productos.find({}, { title: 1 }).sort({ price: -1 }).skip(2).limit(1);

//c
db.productos.updateMany({}, { $set: { stock: 100 } });

//d
db.productos.updateMany({ price: { $gte: 4000 } }, { $set: { stock: 0 } });

//e
db.productos.deleteMany({ price: { $lt: 1000 } });

// 6
db.createUser({
  user: "pepe",
  pwd: "asd456",
  roles: [{ role: "read", db: "ecommerce" }],
});
