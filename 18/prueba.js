db = db.getSiblingDB("prueba");
db.items.insertOne({ nombre: "fideos", categoria: "harina", stock: 20 });
db.items.insertOne({ nombre: "leche", categoria: "lacteos", stock: 30 });
db.items.insertOne({ nombre: "crema", categoria: "lacteos", stock: 15 });

cursor = db.items.find();
while (cursor.hasNext()) {
  printjson(cursor.next());
}
