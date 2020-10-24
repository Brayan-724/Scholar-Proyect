const socketio = require("socket.io");

const Game = require("./game");
const levelManager = require("./levels");

let actualLevel = levelManager.getLevel(levelManager.levels[1], Game.Vector, {S: Game.Spawn});

let activeKeys = [{
    Id: 0, 
    W: false, 
    S: false, 
    A: false, 
    D: false
}];
activeKeys.pop();

module.exports = {
    run: function (server) {
        const io = socketio.listen(server);

        let game = Game.InitGame();
        let lastGameStep = game.toString();

        setInterval(() => {
            activeKeys = game.update(activeKeys);

            if(lastGameStep !== game.toString()) {
                io.sockets.emit("update", game.toString());
                lastGameStep = game.toString();
            }
        }, 1000 / 24);


        io.on("connect", SOCKET => {
            SOCKET.on("set", ID => {
                io.emit("set", {playerId: game.addPlayer().Id, id: ID});
            });

            SOCKET.on("update", (keysPressed) => {
                const LetterInit = 1;
                const ID = parseInt(keysPressed[0]);
                const W = keysPressed[LetterInit + 0];
                const S = keysPressed[LetterInit + 1];
                const A = keysPressed[LetterInit + 2];
                const D = keysPressed[LetterInit + 3];

                activeKeys[ID] = {
                    Id: ID,
                    W: (W == "1"),
                    S: (S == "1"),
                    A: (A == "1"),
                    D: (D == "1")
                };
            });
        });
    }
}