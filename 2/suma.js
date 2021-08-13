"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Suma = /** @class */ (function () {
    function Suma(num1, num2) {
        var _this = this;
        this.operacion = function () { return _this.num1 + _this.num2; };
        this.num1 = num1;
        this.num2 = num2;
    }
    return Suma;
}());
exports.default = Suma;
