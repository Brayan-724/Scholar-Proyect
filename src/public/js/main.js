const ONLINE = io();

setInterval(() => {
    if(detectMob())
        initMobile()
    else
        initPC()
}, 1000)

Init(ONLINE);

ONLINE.on("update", (data) => {
    if(init.ID === null) return;
    
    globalThis.drawMap(MapIndexes)

    globalThis.drawPlayers(data);
})