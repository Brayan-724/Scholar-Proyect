const socketio = require("socket.io");

const Game = require("./game");
const levelManager = require("./levels");

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
        game.setLevel(0);
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
                io.emit("set", {
                    playerId: game.addPlayer(new Game.Vector(2, 1, 1)).Id, 
                    id: ID, 
                    map: levelManager.levels[1]});
            });

            SOCKET.on("update", (keysPressed) => {
                const Keys = JSON.parse(keysPressed);

                activeKeys[Keys.ID] = {
                    Id: Keys.ID,
                    W: Keys.W,
                    S: Keys.S,
                    A: Keys.A,
                    D: Keys.D
                };
            });
        });
    }
}