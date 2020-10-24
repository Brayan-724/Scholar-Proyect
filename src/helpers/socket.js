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
            game.addPlayer();
            SOCKET.on("update", (keysPressed) => {
                const W = keysPressed[0];
                const S = keysPressed[1];
                const A = keysPressed[2];
                const D = keysPressed[3];

                if(W == "1") {
                    game.movePlayer(0, 1, 0);
                }
                if(S == "1") {
                    game.movePlayer(0, 1, 2);
                }
                if(A == "1") {
                    game.movePlayer(0, 0, 1);
                }
                if(D == "1") {
                    game.movePlayer(0, 2, 1);
                }
            });
        });
    }
}