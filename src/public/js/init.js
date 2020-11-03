(() => {

    const MapIndexes = [""]; MapIndexes.pop();
    const BlockImg = document.querySelector("img#blockImage", HTMLImageElement);
    let ID = -1;

    globalThis.Init = (SocketIO) => {
        setTimeout(() => {
            SocketIO.emit("set", SocketIO.id);
        }, 200);
        
        SocketIO.on("set", data => {
            ID = data.id == SocketIO.id ? data.playerId : ID;
        
            const lines = data.map.split("-");
            for(let y = 0; y < lines.length; y++) {
                for (let x = 0; x < lines[y].length; x++) {
                    const letter = lines[y][x];
        
                    if(letter === "X") {
                        globalThis.MapIndexes.push("Block|" + x + "/" + y); // Block|0/0 (Type|CordsX/CordsY)
                    }
                }
            }

            globalThis.init.ID = ID;
        });
    }

    globalThis.MapIndexes = MapIndexes;
    globalThis.tex = {
        Block: BlockImg
    }

    globalThis.init = {
        ID
    };
})()