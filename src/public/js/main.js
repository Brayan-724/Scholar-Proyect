const ONLINE = io();
let ID = null;

const gtx = document.querySelector("canvas").getContext("2d");
(() => {
    const T = () => {
        const width = window.innerWidth;
        const heigth = window.innerHeight;

        gtx.canvas.width = width;
        gtx.canvas.height = width * 0.5;

        gtx.fillStyle = "#FFF";
        gtx.fillRect(0, 0, gtx.canvas.width, gtx.canvas.height);
    };

    window.onresize = T;
    T();
})()

//#region --- Keys
const Keys = [{
    code: 0,
    key: "",
    isShifted: false,
    isCtrled: false,
    codeLower: 0
}];
Keys.pop();

window.onkeydown = e => {
    const K = e.key.length == 1 ? e.key.toUpperCase().charCodeAt(0) : -1;
    let Found = false;

    Keys.find((e, i) => {
        if (e.code == K) {
            Found = true;
        }
    });

    if (!Found) {
        Keys.unshift({
            code: K,
            key: e.key,
            isShifted: e.shiftKey,
            isCtrled: e.ctrlKey,
            codeLower: (K >= 65 && K <= 90 ? e.key.toLowerCase().charCodeAt() : K)
        });
    }
}

window.onkeyup = e => {
    const K = e.key.length == 1 ? e.key.toUpperCase().charCodeAt(0) : -1;
    let Found = false;
    let FoundPos = 0;

    Keys.find((e, i) => {
        if (e.code == K) {
            Found = true;
            FoundPos = i;
        }
    });

    if (Found) {
        Keys.splice(FoundPos, 1);
    }
}
//#endregion

setInterval(() => {
    const K = [0, 0, 0, 0];
    let G = false;
    for (let k of Keys) {
        G = true;
        if (k.code == 87) K[0] = 1;
        if (k.code == 83) K[1] = 1;
        if (k.code == 65) K[2] = 1;
        if (k.code == 68) K[3] = 1;
    }

    if (G && ID !== null) {
        ONLINE.emit("update", ID + K.join(""));
    }
}, 1000 / 24);

const MapIndex = [""]; MapIndex.pop();
const BlockImg = document.querySelector("img#blockImage");

//#region --- Setup
setTimeout(() => {
    console.log(ONLINE.id);
    ONLINE.emit("set", ONLINE.id);
}, 200);

ONLINE.on("set", data => {
    ID = data.id == ONLINE.id ? data.playerId : 0;

    const lines = data.map.split("-");
    for(let y = 0; y < lines.length; y++) {
        for (let x = 0; x < lines[y].length; x++) {
            const letter = lines[y][x];

            if(letter === "X") {
                MapIndex.push("Block|" + x + "/" + y); // Block|0/0 (Type|CordsX/CordsY)
            }
        }
    }
    console.log(MapIndex);
});
//#endregion

ONLINE.on("update", (data) => {
    if(ID === null) return;
    gtx.fillStyle = "#FFF";
    gtx.fillRect(0, 0, gtx.canvas.width, gtx.canvas.height);

    const Aspect = gtx.canvas.width / 20;

    for(let blockString of MapIndex) {
        const separated = blockString.split("|");
        const type = separated[0];
        const pos = separated[1].split("/");
        const X = pos[0];
        const Y = pos[1];

        if(type === "Block") 
            gtx.drawImage(BlockImg, X * Aspect, Y * Aspect, Aspect, Aspect);
    }

    const SP = data.split("|");
    const totalPlayers = SP[0];
    const players = SP[1].split("-");

    for(let player of players) {
        const playerValues = player.split("/");
        const pos = {
            x: parseInt(playerValues[1]),
            y: parseInt(playerValues[2])
        }
        const color = playerValues[3];

        gtx.fillStyle = parseInt(playerValues[0]) === ID ? ("#00F00F") : ("#" + color);
        gtx.fillRect(pos.x, pos.y, Aspect, Aspect);
    }
})