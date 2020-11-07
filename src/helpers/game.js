"use strict"
const levelManager = require('./levels');
// const Maths = require("./Maths");
const Vector = require("./Vector");



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

class VectorX extends Vector { constructor(X = 0) { super(2, X) } }
class VectorY extends Vector { constructor(Y = 0) { super(2, 0, Y) } }
class VectorAll extends Vector { constructor(N = 0) { super(2, N, N) } }


class Block{
	constructor(Pos = new Vector(2)) {
		this.width = 1;
		this.pos = Pos.mult(this.width, true);

		let Up_Left_Point = Pos;
		let Up_Rigth_Point = Pos.add(new VectorX(this.width));
		let Down_Left_Point = Pos.add(new VectorY(this.width));
		let Down_Rigth_Point = Pos.add(new VectorAll(this.width));

		this.points = [
			Up_Left_Point,
			Up_Rigth_Point,
			Down_Left_Point,
			Down_Rigth_Point
		]
	}
}

class BlockXY extends Block {
	constructor(x = 0, y = 0) {
		super(new Vector(2, x, y));
	}
}

// Player class
class Player {

	constructor(Id = 0, Pos = new Vector(2), color = "FF0000") {

		this.pos = Pos;
		this.width = 1;
		this.color = color;

		this.Vel = new Vector(2);

		this.aceleration = .01;
		this.maxVel = 1;

		this.Id = Id;
		this.MoveAve = true;
	}

	checkCollision(B = new Block()) {
		const L = 0.009;
		return (
			(this.pos.x + L < B.pos.x + B.width &&
				this.pos.x - L + this.width > B.pos.x)
			&&
			(this.pos.y + L < B.pos.y + B.width &&
				this.pos.y - L + this.width > B.pos.y)
		)
	}

	checkCollisions(BS = [new Block()]) {
		for (let B of BS)
			if (this.checkCollision(B))
				return true;

		return false;
	}

	interClass_DTM(pos = new Vector(), posible = false, MX = 0, MY = 0) {
		return new (class detectAndMoveReturn {
			constructor(pos = new Vector(), posible = false, MX = 0, MY = 0) {
				this.pos = pos;
				this.posible = posible;
				this.MoveX = MX;
				this.MoveY = MY;
			}

			run() {
				return this.pos.add(new Vector(2, this.MoveX, this.MoveY));
			}
		})(pos, posible, MX, MY)
	}

	detectY(YMove = 0, walls = [new Block()]) {
		this.pos.add(new VectorY(YMove), true);
		const P = this.checkCollisions(walls);
		this.pos.sub(new VectorY(YMove), true);

		return !P;
	}

	detectX(XMove = 0, walls = [new Block()]) {
		this.pos.add(new VectorX(XMove), true);
		const P = this.checkCollisions(walls);
		this.pos.sub(new VectorX(XMove), true);

		return !P;
	}

	detectAndMove(dir = new Vector(2), walls = [new Block()]) {
		let DX = this.detectX(dir.x / 2, walls);
		let DY = this.detectY(dir.y / 2, walls);

		if(DX && DY) {
			DX = this.detectX(dir.x, walls);
			DY = this.detectY(dir.y, walls);

			if(DX && DY)
				this.pos.add(dir, true);
			else {
				this.detectAndMove(dir.clone().mult(.75, true), walls);
			}
		} else {
			if(dir.getMag() > 0.001)
				this.detectAndMove(dir.clone().div(2, true), walls);
			else {
				this.pos.add(new Vector(2, 
					DX ? this.Vel.x : 0,
					DY ? this.Vel.y : 0), true);

				this.Vel = new Vector(2);
			}
		}

		return {X: true, Y: true}
	}

	moveTo(Direction = new Vector(2, 1, 1), walls = [new Block()]) {
		//if(!this.MoveAve) return 0;
		const Vel = this.Vel.clone();
		const maxVel = this.maxVel + 0;
		const aceleration = this.aceleration + 0;

		if (Direction.x == 2) Vel.x += Vel.x + aceleration > maxVel ? 0 : aceleration;
		else
			if (Direction.x == 1) {
				if (Vel.x >= aceleration) Vel.x -= aceleration;
				if (Vel.x <= -aceleration) Vel.x += aceleration;
			} else
				if (Direction.x == 0) Vel.x -= Vel.x - aceleration < -maxVel ? 0 : aceleration;


		if (Direction.y == 2) Vel.y += Vel.y + aceleration > maxVel ? 0 : aceleration;
		else
			if (Direction.y == 1) {
				if (Vel.y >= aceleration) Vel.y -= aceleration;
				if (Vel.y <= -aceleration) Vel.y += aceleration;
			} else
				if (Direction.y == 0) Vel.y -= Vel.y - aceleration < -maxVel ? 0 : aceleration;

		this.Vel = Vel;

		this.detectAndMove(Vel, walls);

		//return 1;
	}

	update(Walls = [new Block()]) {
		if (Math.abs(this.Vel.clone().x) >= 0.01 ||
			Math.abs(this.Vel.clone().y) >= 0.01)
			this.moveTo(new Vector(2, 1, 1), Walls);
		else
			if (Math.abs(this.Vel.clone().x) <= 0.01)
				this.Vel.x = 0;
			else
				this.Vel.y = 0;
	}

	toString() {
		return JSON.stringify({
			Id: this.Id,
			x: this.pos.x,
			y: this.pos.y,
			color: this.color
		});
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

		this.level = [new Block()]; this.level.pop();
		this.levelId = 0;
	}

	addPlayer(_Pos = new Vector(2), color = "FF0000") {
		const player = new Player(this.playersInfo.length, _Pos, color);
		this.playersInfo.push(player);
		this.totalPlayers += 1;

		return player;
	}

	movePlayer(Id = 0, DirectionX = 1, DirectionY = 1) {
		this.playersInfo[Id]
			.moveTo(new Vector(2, DirectionX, DirectionY), this.level);

		return this;
	}

	setLevel(levelId = 0) {
		this.levelId = levelId;
		this.level = levelManager.getLevel(levelManager.levels[levelId + 1], Vector, {
			S: null,
			X: Block
		});
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

		Keys.forEach((value) => {
			let anyKey = value.W || value.S || value.A | value.D;

			let XMove = 1;
			let YMove = 1;

			if (value.W) YMove -= 1;
			if (value.S) YMove += 1;
			if (value.A) XMove -= 1;
			if (value.D) XMove += 1;

			if (anyKey) this.movePlayer(value.Id, XMove, YMove);

			outKeys[value.Id] = {
				Id: value.Id,
				W: false,
				S: false,
				A: false,
				D: false
			};

			if (!anyKey) this.playersInfo[value.Id].update(this.level);
		});

		return outKeys;
	}

	toString() {
		let playersInString = [""]; playersInString.pop();
		for (let player of this.playersInfo) {
			playersInString.push(player.toString())
		}
		return JSON.stringify({ players: playersInString });
	}
}

// Calculate Raycast
// function RayCast(pos = new Vector(2), direction = new Vector(2), hiteableObjects = [new hiteableObject()], maxDistance = Infinity) {
// 	const x3 = pos.x;
// 	const y3 = pos.y;
// 	const x4 = direction.x + x3;
// 	const y4 = direction.y + y3;

// 	let returnObject = new RayHit(false);
// 	let record = maxDistance;

// 	hiteableObjects.forEach((object, objectIndex) => {
// 		object.getWalls().forEach((wall) => {
// 			const x1 = wall.A.x;
// 			const y1 = wall.A.y;
// 			const x2 = wall.B.x;
// 			const y2 = wall.B.y;

// 			const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
// 			if (den == 0) return;

// 			const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
// 			const u = ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den;

// 			if (t > 0 && t < 1 && u > 0) {
// 				const x = x1 + t * (x2 - x1);
// 				const y = y1 + t * (y2 - y1);
// 				const pt = new Vector(2, x, y);

// 				if (pos.distance(pt) < record) {
// 					record = pos.distance(pt);
// 					returnObject = new RayHit(true, pt, hiteableObjects[objectIndex], pos);
// 				} else return;
// 			} else return;
// 		});
// 	});

// 	return returnObject;
// }

function stringToArray(str = "") {
	return [...str];
}

function join(...args) {
	return args.join(" | ");
}

// function distance(VecA = new Vector(), VecB = new Vector()) {
// 	return Math.sqrt((VecA.x - VecB.x) + (VecA.y - VecB.y));
// }


module.exports = {
	StringFunctions,
	Player,
	Spawn,
	InitGame: () => new Game(0),
	Game,
	join,
	Block,
	BlockXY,
	Vector
};