let Velocity = 3;

// Vector3D or Vector2D
class Vector {
    public x: number;
    public y: number;
    public z: number;

    private Dim: number;

    constructor(
        _Dim: number,
        _x: number = 0,
        _y: number = 0,
        _z: number = 0) {
        
        this.Dim = _Dim;

        this.x = _x || 0;
        this.y = _y || 0;
        this.z = _z || 0;
    }

    getMag(): number {
        return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2));
    }

    toString(): string {
        if(this.Dim == 2) {
            return this.x + "/" + this.y;
        } 
        if(this.Dim == 3) {
            return this.x + "/" + this.y + "/" + this.z;
        }

        return this.x.toString();
    }
}

// Helper with string converts
class StringFunctions {
    encode(value: number, expectedLength = 0): string {
        let encodeValue: Array<string> = stringToArray(value.toString());
        if (expectedLength != 0 && encodeValue.length < expectedLength)
            while (encodeValue.length < expectedLength)
                encodeValue.unshift("0");

        if (encodeValue.length > expectedLength)
            throw new RangeError("'encodeValue.length' is greater than 'expectedLength'");

        return encodeValue.join("");
    }

    decode(value: string): number {
        return parseInt(value);
    }
}

// Player class
class Player {
    private pos: Vector;
    private color: string;
    private Vel: Vector;
    private Id: number;

    constructor(Id: number, Pos: Vector = new Vector(2), color = "FF0000") {

        this.pos = Pos;
        this.color = color;

        this.Vel = new Vector(2);

        this.Id = Id;
    }

    moveTo(Direction: Vector): void {

        this.pos.x += Direction.x * Velocity - Velocity;
        this.pos.y += Direction.y * Velocity - Velocity;
    }

    toString(): string {
        return this.Id + "/" + this.pos.toString + "/" + this.color;
    }
}

// Game Controller
class Game {
    public totalPlayers: number;
    private playersInfo: Array<Player>;

    constructor(Players: number) {
        this.totalPlayers = Players;

        this.playersInfo = [new Player(0)]; this.playersInfo.pop();
    }

    addPlayer(_Pos: Vector, color = "FF0000"): this {
        this.playersInfo.push(new Player(this.playersInfo.length, _Pos, color));
        this.totalPlayers += 1;

        return this;
    }

    movePlayer(Id: number, DirectionX: number, DirectionY: number): this {
        this.playersInfo[Id]
            .moveTo(new Vector(2, DirectionX, DirectionY));
        
            return this;
    }

    toString(): string {
        let playersInString = "";
        for (let player of this.playersInfo) {
            if (playersInString.length != 0) playersInString += "-";
            playersInString += player.toString();
        }
        return join(this.totalPlayers, playersInString);
    }
}

function stringToArray(str: string): Array<string> {
    let out: Array<string> = [];
    for(let i = 0; i < str.length; i++) {
        out.push(str[i]);
    }

    return out;
}

function join(...args: any[]): string {
    let resultString: string = "";
    for (let Num of args) {
        if (resultString.length != 0) resultString += "|";
        resultString += Num;
    }

    return resultString;
}


module.exports = {
    StringFunctions,
    Player,
    InitGame: () => new Game(0),
    Game,
    join
};