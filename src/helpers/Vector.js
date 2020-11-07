// Helper with string converts
class StringFunctions {
	encode(value = "", expectedLength = 0) {
		let encodeValue = [...value.toString()];
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

module.exports = class Vector {

	constructor(
		_Dim = 2,
		_x = 0,
		_y = 0,
		_z = 0) {

		this.Dim = _Dim;

		this.x = (_x || 0);
		this.y = (_y || 0);
		this.z = (_z || 0);
	}

	invertX(apply = false) {
		const X = -this.x;
		if (apply) this.x = X;
		return new Vector(2, X, this.y);
	}

	invertY(apply = false) {
		const Y = -this.y;
		if (apply) this.y = Y;
		return new Vector(2, this.x, Y);
	}

	invert(apply = false) {
		const V = this.invertX();
		V.invertY(true);

		if (apply) {
			this.x = V.x;
			this.y = V.y;
		}

		return V
	}

	add(add, apply = false) {
		if (add instanceof Vector) {
			if (apply) {
				this.x += add.x;
				this.y += add.y;
			}
			return new Vector(2, this.x + add.x, this.y + add.y);
		}
		if (typeof add == "number") {
			if (apply) {
				this.x += add;
				this.y += add;
			}
			return new Vector(2, this.x + add, this.y + add);
		}
	}

	sub(add, apply = false) {
		if (add instanceof Vector) {
			if (apply) {
				this.x -= add.x;
				this.y -= add.y;
			}
			return new Vector(2, this.x - add.x, this.y - add.y);
		}
		if (typeof add == "number") {
			if (apply) {
				this.x -= add;
				this.y -= add;
			}
			return new Vector(2, this.x - add, this.y - add);
		}
	}

	mult(add, apply = false) {
		if (add instanceof Vector) {
			if (apply) {
				this.x *= add.x;
				this.y *= add.y;
			}
			return new Vector(2, this.x * add.x, this.y * add.y);
		}
		if (typeof add == "number") {
			if (apply) {
				this.x *= add;
				this.y *= add;
			}
			return new Vector(2, this.x * add, this.y * add);
		}
	}

	div(add, apply = false) {
		if (add instanceof Vector) {
			if (apply) {
				this.x /= add.x;
				this.y /= add.y;
			}
			return new Vector(2, this.x / add.x, this.y / add.y);
		}
		if (typeof add == "number") {
			if (apply) {
				this.x /= add;
				this.y /= add;
			}
			return new Vector(2, this.x / add, this.y / add);
		}
	}

	normalize() {
		let l = this.getMag();

		if (l === 0) return this;

		if (this.x === 0) return this;
		if (this.y === 0) return this;

		this.x /= l;
		this.y /= l;

		return this;
	}

	getMag() {
		return Math.sqrt((this.x ** 2) + (this.y ** 2) + (this.z ** 2));
	}

	Enum(n = 0) {
		return new StringFunctions().encode(parseInt(n), 3);
	}

	clone() {
		return new Vector(this.Dim, this.x, this.y, this.z);
	}

	distance(Other = new Vector()) {
		return Math.sqrt(
			Math.pow(this.x - Other.x, 2) +
			Math.pow(this.y - Other.y, 2) +
			Math.pow(this.z - Other.z, 2))
	}

	toString() {
		return JSON.stringify({
			Dim: this.Dim,
			X: this.x,
			Y: this.y,
			Z: this.z
		});
	}
}