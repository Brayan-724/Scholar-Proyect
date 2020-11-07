if (!globalThis.io) alert("Unexpected error\n Refresh the page");
globalThis.ONLINE = globalThis.io();


setInterval(() => {
    if (globalThis.detectMob())
        globalThis.initMobile();
    else
        globalThis.initPC();
}, 1000)

globalThis.Init(globalThis.ONLINE);

globalThis.ONLINE.on("update", (data) => {
    if (globalThis.init.ID === null) return;

    globalThis.drawMap(globalThis.MapIndexes)

    globalThis.drawPlayers(data);
})