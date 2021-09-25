"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var fs_1 = require("fs");
var moment_1 = __importDefault(require("moment"));
var path_1 = __importDefault(require("path"));
var app = (0, express_1.default)();
var server = require("http").createServer(app);
var io = require("socket.io")(server);
var mensajes = JSON.parse((0, fs_1.readFileSync)(path_1.default.join(__dirname, "mensajes.json"), "utf-8"));
var PORT = 8080;
var api = express_1.default.Router();
var items = [];
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static("public"));
app.use("/api", api);
server.listen(PORT, function () {
    console.log("Server listening on port " + PORT);
});
server.on("error", console.error);
//api
api.get("/productos/listar", function (req, res) {
    res.json(items);
});
api.get("/productos/listar/:id", function (req, res) {
    var id = req.params.id;
    var item = items.find(function (prod) { return prod.id == id; });
    if (item)
        res.json(item);
    else {
        res.statusCode = 404;
        res.json({
            error: items.length
                ? "producto no encontrado"
                : "no hay productos cargados",
        });
    }
});
api.post("/productos/guardar", function (req, res) {
    var _a = req.body, title = _a.title, price = _a.price, thumbnail = _a.thumbnail;
    var id = items.length ? Math.max.apply(Math, items.map(function (p) { return p.id; })) + 1 : 0;
    var producto = { id: id, title: title, price: price, thumbnail: thumbnail };
    items.push(producto);
    // res.json(producto);
    // res.redirect("/");
    res.sendStatus(201);
});
api.put("/productos/actualizar/:id", function (req, res) {
    var id = req.params.id;
    var _a = req.body, title = _a.title, price = _a.price, thumbnail = _a.thumbnail;
    var producto = items.find(function (item) { return item.id == id; });
    producto.title = title;
    producto.price = price;
    producto.thumbnail = thumbnail;
    res.json(producto);
});
api.delete("/productos/borrar/:id", function (req, res) {
    var id = req.params.id;
    var producto = items.find(function (item) { return item.id !== id; });
    items = items.filter(function (item) { return item.id != id; });
    res.json(producto);
});
io.on("connection", function (socket) {
    socket.emit("items", items);
    socket.emit("all-chat", mensajes);
    socket.on("new-item", function (item) {
        var id = items.length ? Math.max.apply(Math, items.map(function (p) { return p.id; })) + 1 : 0;
        var producto = __assign(__assign({}, item), { id: id });
        items.push(producto);
        io.sockets.emit("items", items);
    });
    socket.on("mensaje", function (msg) {
        if ((msg === null || msg === void 0 ? void 0 : msg.email) && (msg === null || msg === void 0 ? void 0 : msg.mensaje)) {
            var fecha = (0, moment_1.default)().format("DD/MM/YYYY HH:mm:ss");
            var data = __assign(__assign({}, msg), { fecha: fecha });
            io.sockets.emit("mensaje", data);
            mensajes.push(data);
            (0, fs_1.writeFile)(path_1.default.join(__dirname, "mensajes.json"), JSON.stringify(mensajes, null, 2), function () { });
        }
    });
});
