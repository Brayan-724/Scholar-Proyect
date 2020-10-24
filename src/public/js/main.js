const ONLINE = io();
let ID = null;

const gtx = document.querySelector("canvas").getContext("2d");
gtx.canvas.width = window.innerWidth;
gtx.canvas.height = window.innerHeight - 5;

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


//#region --- Setup
setTimeout(() => {
    console.log(ONLINE.id);
    ONLINE.emit("set", ONLINE.id);
}, 200);

ONLINE.on("set", data => {
    ID = data.id == ONLINE.id ? data.playerId : 0;
    console.log(data.map);
});
//#endregion

ONLINE.on("update", (data) => {
    if(ID === null) return;
    console.log(data);
    gtx.fillStyle = "#FFF";
    gtx.fillRect(0, 0, gtx.canvas.width, gtx.canvas.height);

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
        gtx.fillRect(pos.x, pos.y, 50, 50);
    }
})