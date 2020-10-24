"use strict";
var Velocity = 3;
// Vector3D or Vector2D
var Vector = /** @class */ (function () {
    function Vector(_Dim, _x, _y, _z) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_z === void 0) { _z = 0; }
        this.Dim = _Dim;
        this.x = _x || 0;
        this.y = _y || 0;
        this.z = _z || 0;
    }
    Vector.prototype.getMag = function () {
        return Math.sqrt((Math.pow(this.x, 2)) + (Math.pow(this.y, 2)) + (Math.pow(this.z, 2)));
    };
    Vector.prototype.toString = function () {
        if (this.Dim == 2) {
            return this.x + "/" + this.y;
        }
        if (this.Dim == 3) {
            return this.x + "/" + this.y + "/" + this.z;
        }
        return this.x.toString();
    };
    return Vector;
}());
// Helper with string converts
var StringFunctions = /** @class */ (function () {
    function StringFunctions() {
    }
    StringFunctions.prototype.encode = function (value, expectedLength) {
        if (expectedLength === void 0) { expectedLength = 0; }
        var encodeValue = stringToArray(value.toString());
        if (expectedLength != 0 && encodeValue.length < expectedLength)
            while (encodeValue.length < expectedLength)
                encodeValue.unshift("0");
        if (encodeValue.length > expectedLength)
            throw new RangeError("'encodeValue.length' is greater than 'expectedLength'");
        return encodeValue.join("");
    };
    StringFunctions.prototype.decode = function (value) {
        return parseInt(value);
    };
    return StringFunctions;
}());
// Player class
var Player = /** @class */ (function () {
    function Player(Id, Pos, color) {
        if (Pos === void 0) { Pos = new Vector(2); }
        if (color === void 0) { color = "FF0000"; }
        this.pos = Pos;
        this.color = color;
        this.Vel = new Vector(2);
        this.Id = Id;
    }
    Player.prototype.moveTo = function (Direction) {
        this.pos.x += Direction.x * Velocity - Velocity;
        this.pos.y += Direction.y * Velocity - Velocity;
    };
    Player.prototype.toString = function () {
        return this.Id + "/" + this.pos.toString + "/" + this.color;
    };
    return Player;
}());
// Game Controller
var Game = /** @class */ (function () {
    function Game(Players) {
        this.totalPlayers = Players;
        this.playersInfo = [new Player(0)];
        this.playersInfo.pop();
    }
    Game.prototype.addPlayer = function (_Pos, color) {
        if (color === void 0) { color = "FF0000"; }
        this.playersInfo.push(new Player(this.playersInfo.length, _Pos, color));
        this.totalPlayers += 1;
        return this;
    };
    Game.prototype.movePlayer = function (Id, DirectionX, DirectionY) {
        this.playersInfo[Id]
            .moveTo(new Vector(2, DirectionX, DirectionY));
        return this;
    };
    Game.prototype.toString = function () {
        var playersInString = "";
        for (var _i = 0, _a = this.playersInfo; _i < _a.length; _i++) {
            var player = _a[_i];
            if (playersInString.length != 0)
                playersInString += "-";
            playersInString += player.toString();
        }
        return join(this.totalPlayers, playersInString);
    };
    return Game;
}());
function stringToArray(str) {
    var out = [];
    for (var i = 0; i < str.length; i++) {
        out.push(str[i]);
    }
    return out;
}
function join() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var resultString = "";
    for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
        var Num = args_1[_a];
        if (resultString.length != 0)
            resultString += "|";
        resultString += Num;
    }
    return resultString;
}
module.exports = {
    StringFunctions: StringFunctions,
    Player: Player,
    InitGame: function () { return new Game(0); },
    Game: Game,
    join: join
};
