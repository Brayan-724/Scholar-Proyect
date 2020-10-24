const socketio = require("socket.io");

const Game = require("./game");
const levelManager = require("./levels");

let actualLevel = levelManager.getLevel(levelManager.levels[1], Game.Vector, {S: Game.Spawn});

console.log(actualLevel);

module.exports = {
    run: function (server) {
        const io = socketio.listen(server);

        let game = Game.InitGame();
        let lastGameStep = game.toString();

        setInterval(() => {
            if(lastGameStep !== game.toString()) {
                io.sockets.emit("update", game.toString());
                lastGameStep = game.toString();
            }
        }, 1000 / 20);


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

                if(W == "1") {
                    game.movePlayer(ID, 1, 0);
                }
                if(S == "1") {
                    game.movePlayer(ID, 1, 2);
                }
                if(A == "1") {
                    game.movePlayer(ID, 0, 1);
                }
                if(D == "1") {
                    game.movePlayer(ID, 2, 1);
                }
            });
        });
    }
}