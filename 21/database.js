const mongoose = require("mongoose");
const Producto = require("./models/productos");
const Mensaje = require("./models/mensajes");
const fs = require("fs/promises");
const uuid = require("uuid");

class MemoryPersistence {
  constructor() {
    this.productos = []
    this.mensajes = []
  }
  async addProduct({ title, price, thumbnail }) {
    const id = uuid();
    return this.productos.push({title, price, thumbnail, id})
  }
  async getProduct(id) {
    return this.productos.find((x) => x.id == id);
  }
  async listProducts() {
    return this.productos
  }
  async updateProduct({ title, price, thumbnail, id }) {
    this.productos.find((x) => x.id == id) = { title, price, thumbnail, id };
  }
  async deleteProduct(id) {
    const index = this.productos.findIndex((x) => x.id == id)
    return this.productos.splice(index, 1)
  }
  async listMensajes() {
    return this.mensajes;
  }
  async addMensaje(msg) {
    return this.mensajes.push(msg);
  }
}

class FsPersistence {
  constructor() {
    this.productos = "./DB/productos.json"
    this.mensajes = "./DB/mensajes.json"
  }
  async addProduct({ title, price, thumbnail }) {
    const id = uuid();
    const text = await fs.readFile(this.productos, "utf-8");
    const data = JSON.parse(text);
    data.push({ title, price, thumbnail, id });
    return fs.writeFile(this.productos, JSON.stringify(data));
  }
  async getProduct(id) {
    const text = await fs.readFile(this.productos, "utf-8");
    const data = JSON.parse(text);
    return data.find((x) => x.id == id);
  }
  async listProducts() {
    const text = await fs.readFile(this.productos, "utf-8");
    return JSON.parse(text);
  }
  async updateProduct({ title, price, thumbnail, id }) {
    const text = await fs.readFile(this.productos, "utf-8");
    const data = JSON.parse(text);
    data.find((x) => x.id == id) = { title, price, thumbnail, id };
    return fs.writeFile(this.productos, JSON.stringify(data));
  }
  async deleteProduct(id) {
    const text = await fs.readFile(this.productos, "utf-8");
    const data = JSON.parse(text);
    const index = data.findIndex((x) => x.id == id)
    data.splice(index, 1)
    return fs.writeFile(this.productos, JSON.stringify(data));
  }
  async listMensajes() {
    const text = await fs.readFile(this.mensajes, "utf-8");
    return JSON.parse(text);
  }
  async addMensaje(msg) {
    const text = await fs.readFile(this.mensajes, "utf-8");
    const data = JSON.parse(text);
    data.push(msg);
    return fs.writeFile(this.mensajes, JSON.stringify(data));
  }
}

class Sqlite {
  constructor() {
    this.knex = require("knex")({
      client: "sqlite3",
      connection: {
        filename: "./DB/mydb.sqlite",
      },
      useNullAsDefault: true,
    });
    (async () => {
      const hasTableProducts = await this.knex.schema.hasTable("products");
      if (!hasTableProducts) {
        await this.knex.schema.createTable("products", (table) => {
          table.increments("id");
          table.string("title");
          table.string("price");
          table.string("thumbnail");
        });
      }
      console.log(hasTableProducts);
    })();
    (async () => {
      const hasTableMessages = await this.knex.schema.hasTable("messages");
      if (!hasTableMessages) {
        await this.knex.schema.createTable("messages", (table) => {
          table.increments("id");
          table.string("email");
          table.string("mensaje");
          table.string("fecha");
        });
      }
    })();
  }
  async addProduct({ title, price, thumbnail }) {
    return this.knex("products").insert({
      title,
      price,
      thumbnail,
    });
  }
  async getProduct(id) {
    return this.knex.select("*").from("products").where("id", id);
  }
  async listProducts() {
    return this.knex.select("*").from("products");
  }
  async updateProduct({ title, price, thumbnail, id }) {
    return this.knex("products")
      .where("id", id)
      .update({ title, price, thumbnail });
  }
  async deleteProduct(id) {
    return this.knex("products").where("id", id).del();
  }
  async listMensajes() {
    return this.knex.select("*").from("messages");
  }
  async addMensaje(msg) {
    return this.knex("messages").insert({
      email: msg.email,
      mensaje: msg.mensaje,
      fecha,
    });
  }
}
class MySql {
  constructor() {
    this.knex = require("knex")({
      client: "mysql",
      connection: {
        host: "127.0.0.1",
        user: "root",
        password: "password",
        database: "ecommerce",
      },
    });
    (async () => {
      const hasTableProducts = await this.knex.schema.hasTable("products");
      if (!hasTableProducts) {
        await this.knex.schema.createTable("products", (table) => {
          table.increments("id");
          table.string("title");
          table.string("price");
          table.string("thumbnail");
        });
      }
      console.log(hasTableProducts);
    })();
    (async () => {
      const hasTableMessages = await this.knex.schema.hasTable("messages");
      if (!hasTableMessages) {
        await this.knex.schema.createTable("messages", (table) => {
          table.increments("id");
          table.string("email");
          table.string("mensaje");
          table.string("fecha");
        });
      }
    })();
  }
  async addProduct({ title, price, thumbnail }) {
    return this.knex("products").insert({
      title,
      price,
      thumbnail,
    });
  }
  async getProduct(id) {
    return this.knex.select("*").from("products").where("id", id);
  }
  async listProducts() {
    return this.knex.select("*").from("products");
  }
  async updateProduct({ title, price, thumbnail, id }) {
    return this.knex("products")
      .where("id", id)
      .update({ title, price, thumbnail });
  }
  async deleteProduct(id) {
    return this.knex("products").where("id", id).del();
  }
  async listMensajes() {
    return this.knex.select("*").from("messages");
  }
  async addMensaje(msg) {
    return this.knex("messages").insert({
      email: msg.email,
      mensaje: msg.mensaje,
      fecha,
    });
  }
}

class MongoLocal {
  constructor(
    uri = "mongodb://mongoadmin:secret@localhost:27017/ecommerce?authSource=admin"
  ) {
    this.uri = uri;
    this.connect(uri);
  }
  async connect(uri) {
    return await mongoose.connect(uri);
  }
  async addProduct({ title, price, thumbnail }) {
    const prod = new Producto({ title, price, thumbnail });
    return await prod.save();
  }
  async getProduct(id) {
    return Producto.find({ _id: id });
  }
  async listProducts() {
    return Producto.find({});
  }
  async updateProduct({ title, price, thumbnail, id }) {
    return Producto.updateOne({ title, price, thumbnail }, { _id: id });
  }
  async deleteProduct(id) {
    return Producto.deleteOne({ _id: id });
  }

  async listMensajes() {
    return Mensaje.find({});
  }
  async addMensaje(msg) {
    const mensaje = new Mensaje({
      email: msg.email,
      mensaje: msg.mensaje,
      fecha: msg.fecha,
    });
    return mensaje.save();
  }
}
class MongoAtlas {
  constructor(
    uri = "mongodb+srv://test-user:GFuDExLyueF7ujaV@cluster0.2jfpa.mongodb.net/ecommerce"
  ) {
    this.uri = uri;
    this.connect(uri);
  }
  async connect(uri) {
    return await mongoose.connect(uri);
  }
  async addProduct({ title, price, thumbnail }) {
    const prod = new Producto({ title, price, thumbnail });
    return await prod.save();
  }
  async getProduct(id) {
    return Producto.find({ _id: id });
  }
  async listProducts() {
    return Producto.find({});
  }
  async updateProduct({ title, price, thumbnail, id }) {
    return Producto.updateOne({ title, price, thumbnail }, { _id: id });
  }
  async deleteProduct(id) {
    return Producto.deleteOne({ _id: id });
  }

  async listMensajes() {
    return Mensaje.find({});
  }
  async addMensaje(msg) {
    const mensaje = new Mensaje({
      email: msg.email,
      mensaje: msg.mensaje,
      fecha: msg.fecha,
    });
    return mensaje.save();
  }
}

module.exports = {
  MemoryPersistence,
  FsPersistence,
  Sqlite,
  MySql,
  MongoLocal,
  MongoAtlas,
};
