(() => {
    globalThis.drawMap = () => {};
    globalThis.drawPlayers = () => {};

    let lastData;

    const gtx = document.querySelector("canvas").getContext("2d");
    const T = () => {
        const width = window.innerWidth;
        const heigth = window.innerHeight;

        gtx.canvas.width = width;
        gtx.canvas.height = width * 0.5;

        globalThis.screenAspect = gtx.canvas.width / 20;

        globalThis.drawMap(globalThis.MapIndexes)
        globalThis.drawPlayers(lastData);
    };

    window.onresize = T;
    T();

    globalThis.drawMap = ((Map) => {
        gtx.fillStyle = "#FFF";
        gtx.fillRect(0, 0, gtx.canvas.width, gtx.canvas.height);
        const Aspect = globalThis.screenAspect;

        for(let blockString of Map) {
            const separated = blockString.split("|");
            //console.log(separated);
            const type = separated[0];
            const pos = separated[1].split("/");
            const X = pos[0];
            const Y = pos[1];

            if(type === "Block") 
                gtx.drawImage(tex.Block, X * Aspect, Y * Aspect, Aspect, Aspect);
        }
    });

    globalThis.drawPlayers = ((GameData) => {
        lastData = GameData;
        GameData = JSON.parse(GameData);

        const Aspect = globalThis.screenAspect;

        for(let player of GameData.players) {
            player = JSON.parse(player);
            const pos = {
                x: player.x,
                y: player.y
            }
            const color = player.color;

            gtx.fillStyle = player.Id === init.ID ? ("#00F00F") : ("#" + color);
            gtx.fillRect(pos.x * Aspect, pos.y * Aspect, Aspect, Aspect);
        }
    });
})()