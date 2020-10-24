// Helper with string converts
class StringFunctions {
    encode(value = "", expectedLength = 0) {
        let encodeValue = stringToArray(value.toString());
        if (expectedLength != 0 && encodeValue.length < expectedLength)
            while (encodeValue.length < expectedLength)
                encodeValue.unshift("0");

        if (encodeValue.length > expectedLength)
            throw new RangeError("'encodeValue.length' is greater than 'expectedLength'");

        return encodeValue.join("");
    }

    decode(value) {
        return parseInt(value);
    }
}

// Vector3D or Vector2D
class Vector {

    constructor(
        _Dim = 2,
        _x = 0,
        _y = 0,
        _z = 0) {
        
        this.Dim = _Dim;

        this.x = _x || 0;
        this.y = _y || 0;
        this.z = _z || 0;
    }

    getMag() {
        return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2));
    }

    Enum(n = 0) {
        return new StringFunctions().encode(parseInt(n), 3);
    }

    toString() {
        if(this.Dim == 2) {
            return this.Enum(this.x) + "/" + this.Enum(this.y);
        } 
        if(this.Dim == 3) {
            return this.Enum(this.x) + "/" + this.Enum(this.y) + "/" + this.Enum(this.z);
        }

        return this.x.toString();
    }
}

// Player class
class Player {

    constructor(Id = 0, Pos = new Vector(2), color = "FF0000") {

        this.pos = Pos;
        this.color = color;

        this.Vel = new Vector(2);

        this.aceleration = .5;
        this.maxVel = 10;

        this.Id = Id;
    }

    moveTo(Direction = new Vector(2, 1, 1)) {
        const Vel = this.Vel;
        const maxVel = this.maxVel;
        const aceleration = this.aceleration;

        if(Direction.x == 2) Vel.x += Vel.x + aceleration > maxVel ? 0 : aceleration;
        else
        if(Direction.x == 1){
            if(Vel.x > 0) Vel.x -= aceleration;
            if(Vel.x < 0) Vel.x += aceleration;
        } else
        if(Direction.x == 0) Vel.x -= Vel.x - aceleration < -maxVel ? 0 : aceleration;
        

        if(Direction.y == 2) Vel.y += Vel.y + aceleration > maxVel ? 0 : aceleration;
        else
        if(Direction.y == 1) {
            if(Vel.y > 0) Vel.y -= aceleration;
            if(Vel.y < 0) Vel.y += aceleration;
        } else
        if(Direction.y == 0) Vel.y -= Vel.y - aceleration < -maxVel ? 0 : aceleration;
        
        this.pos.x += this.Vel.x;
        this.pos.y += this.Vel.y;
    }

    update() {
        this.moveTo(new Vector(2, 1, 1));
    }

    toString() {
        return this.Id + "/" + this.pos.toString() + "/" + this.color;
    }
}

// Spawn
class Spawn {
    constructor(Pos = new Vector(2)) {
        this.pos = Pos;
    }

    getPlayer(Id = 0, color = "FF0000") {
        return new Player(Id, this.Pos, color);
    }
}

// Game Controller
class Game {

    constructor(Players = 0) {
        this.totalPlayers = Players;

        this.playersInfo = [new Player(0)]; this.playersInfo.pop();
    }

    addPlayer(_Pos = new Vector(2), color = "FF0000") {
        const player = new Player(this.playersInfo.length, _Pos, color);
        this.playersInfo.push(player);
        this.totalPlayers += 1;

        return player;
    }

    movePlayer(Id = 0, DirectionX = 1, DirectionY = 1) {
        this.playersInfo[Id]
            .moveTo(new Vector(2, DirectionX, DirectionY));
        
            return this;
    }

    update(
        Keys = [{
            Id: 0, 
            W: false, 
            S: false, 
            A: false, 
            D: false
        }]) {

        let outKeys = Keys;
        
        Keys.forEach((value, index) => {
            let anyKey = value.W || value.S || value.A || value.D;

            let XMove = 1;
            let YMove = 1;

            if(value.W) YMove -= 1;
            if(value.S) YMove += 1;
            if(value.A) XMove -= 1;
            if(value.D) XMove += 1;

            this.movePlayer(value.Id, XMove, YMove);

            outKeys[value.Id] = {
                Id: value.Id, 
                W: false, 
                S: false, 
                A: false, 
                D: false
            };

            if(!anyKey) this.playersInfo[value.Id].update();
        });

        return outKeys;
    }

    toString() {
        let playersInString = "";
        for (let player of this.playersInfo) {
            if (playersInString.length != 0) playersInString += "-";
            playersInString += player.toString();
        }
        return join(this.totalPlayers, playersInString);
    }
}

function stringToArray(str = "") {
    let out = [];
    for(let i = 0; i < str.length; i++) {
        out.push(str[i]);
    }

    return out;
}

function join(...args) {
    let resultString = "";
    for (let Num of args) {
        if (resultString.length != 0) resultString += "|";
        resultString += Num;
    }

    return resultString;
}


module.exports = {
    StringFunctions,
    Player,
    Spawn,
    InitGame: () => new Game(0),
    Game,
    join
};