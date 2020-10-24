const Lvl0 = 
[   "XXXXXXXXXXXXXXXXXXXXXXXX",
    "X                      X",
    "X                      X",
    "X                      X",
    "X                      X",
    "X                      X",
    "X   S                  X",
    "XXXXXXXX               X",
    "X                      X",
    "X                      X",
    "XXXXXXXXXXXXXXXXXXXXXXXX"].join("-");

function getLevel(
    Level = "", 
    VectorTemplate = class Vector{constructor(d,x,y){this.d = d;this.x = x;this.y = y}},
    options = {
        X: class Block{}, 
        S: class Player{}, 
        Blank: null}) {
    
    if(options.X == undefined) options.X = class Block{}
    if(options.S == undefined) options.S = class Player{}

    const elements = [];
    const lines = Level.split("-");
    for(let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const letter = lines[y][x];

            if(letter === "X" && options.X != null) {
                elements.push(new options.X(new VectorTemplate(2, x, y)));
            }
            if(letter === "S" && options.S != null) {
                elements.push(new options.S(new VectorTemplate(2, x, y)));
            }
            if(letter === " " && options.Blank != null) {
                elements.push(new options.Blank());
            }
        }
    }

    return elements;
}

module.exports = {
    getLevel,
    levels: {
        1: Lvl0
    }
}