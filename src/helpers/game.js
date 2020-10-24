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

    add(add, apply = false) {
        if(add instanceof Vector) {
            if(apply) {
                this.x += add.x;
                this.y += add.y;
            }
            return new Vector(2, Vec.x + add.x, Vec.y + add.y);
        }
        if(typeof add == "number") {
            if(apply) {
                this.x += add;
                this.y += add;
            }
            return new Vector(2, Vec.x + add, Vec.y + add);
        }
    }

    mult(add, apply = false) {
        if(add instanceof Vector) {
            if(apply) {
                this.x *= add.x;
                this.y *= add.y;
            }
            return new Vector(2, Vec.x * add.x, Vec.y * add.y);
        }
        if(typeof add == "number") {
            if(apply) {
                this.x *= add;
                this.y *= add;
            }
            return new Vector(2, Vec.x * add, Vec.y * add);
        }
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

class VectorX extends Vector{constructor(X = 0) {super(2, X)}}
class VectorY extends Vector{constructor(Y = 0) {super(2, 0, Y)}}
class VectorAll extends Vector {constructor(N = 0) {super(2, N, N)}}

class RayWall {
    constructor(PosA = new Vector(2), PosB = new Vector(2)) {
        this.A = PosA;
        this.B = PosB;
    }
}

class RayHit {
    constructor(hitted = false, Pos = new Vector(2), Object = new hiteableObject()) {
        this.pos = Pos;
        this.hitted = hitted;
        this.objectHit = Object;
    }
}

class hiteableObject {
    constructor(){}
    getWalls(){ return [new RayWall()]}
}

class Block extends hiteableObject{
    constructor(Pos = new Vector(2)) {
        super();
        this.width = 25;
        this.pos = Pos.mult(this.width, true);

        let Up_Left_Point = Pos;
        let Up_Rigth_Point = Pos.add(new VectorX(this.width));
        let Down_Left_Point = Pos.add(new VectorY(this.width));
        let Down_Rigth_Point = Pos.add(new VectorAll(this.width));
        
        this.Walls = [
            new RayWall(Up_Left_Point, Up_Rigth_Point),
            new RayWall(Down_Left_Point, Down_Rigth_Point),
            new RayWall(Up_Left_Point, Down_Left_Point),
            new RayWall(Up_Rigth_Point, Down_Rigth_Point),
        ];
    }

    getWalls() {
        return this.Walls;
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

        this.spawn = new Spawn();

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

function RayCast(pos = new Vector(2), direction = new Vector(2), hiteableObjects = [new hiteableObject()], maxDistance = Infinity) {
    const x3 = pos.x;
    const y3 = pos.y;
    const x4 = direction.x + x3;
    const y4 = direction.y + y3;

    const returnObject = new RayHit(false);
    const record = maxDistance;
    
    hiteableObjects.forEach((object, objectIndex) => {
        object.getWalls().forEach((wall, wallIndex) => {
            const x1 = wall.A.x;
            const y1 = wall.A.y;
            const x2 = wall.B.x;
            const y2 = wall.B.y;

            const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
            if(den == 0) return;

            const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
            const u = ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

            if(t > 0 && t < 1 && u > 0) {
                const x = x1 + t * (x2 - x1);
                const y = y1 + t * (y2 - y1);
                if(distance(pos, new Vector(2, x, y)) < record) {
                    record = distance(pos, new Vector(2, x, y));
                    returnObject = new RayHit(true, new Vector(2, x, y), hiteableObjects[objectIndex]);
                } else return;
            } else return;
        });
    });

    return returnObject;
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

function distance(VecA, VecB) {
    return Math.sqrt((VecA.x - VecB.x) + (VecA.y - VecB.y));
}


module.exports = {
    StringFunctions,
    Player,
    Spawn,
    InitGame: () => new Game(0),
    Game,
    join
};