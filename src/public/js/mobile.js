(() => {
    function detectMob(){
        return navigator.userAgent.toLowerCase().indexOf("mobile") !== -1;
    }

    globalThis.Keys = [{
        code: 0,
        key: "",
        isShifted: false,
        isCtrled: false,
        codeLower: 0
    }];
    globalThis.Keys.pop();

    setInterval(() => {
        const K = {ID: 0, W: false, S: false, A: false, D: false};

        for (let k of globalThis.Keys) {
            if (k.code == 87) K.W = true;
            if (k.code == 83) K.S = true;
            if (k.code == 65) K.A = true;
            if (k.code == 68) K.D = true;
        }

        let G = K.W || K.S || K.A || K.D;

        if (G && globalThis.init.ID !== null) {
            K.ID = globalThis.init.ID;
            globalThis.ONLINE.emit("update", JSON.stringify(K));
        }
    }, 1000 / 24);

    function initMobile() {
        if(!detectMob()) return;
        //window.ontouchmove = (e) => {e.preventDefault()}

        document.querySelector("div#mobileControls").style.display = "block";

        function ADD(Key, shifted = false, ctrled = false) {
            const K = Key.length == 1 ? Key.toUpperCase().charCodeAt(0) : -1;
            let Found = false;

            globalThis.Keys.find((e) => {
                if (e.code == K) {
                    Found = true;
                }
            });

            if (!Found) {
                globalThis.Keys.unshift({
                    code: K,
                    key: Key,
                    isShifted: shifted,
                    isCtrled: ctrled,
                    codeLower: (K >= 65 && K <= 90 ? Key.toLowerCase().charCodeAt() : K)
                });
            }
        }

        function SUB(Key) {
            const K = Key.length == 1 ? Key.toUpperCase().charCodeAt(0) : -1;
            let Found = false;
            let FoundPos = 0;

            globalThis.Keys.find((e, i) => {
                if (e.code == K) {
                    Found = true;
                    FoundPos = i;
                }
            });

            if (Found) {
                globalThis.Keys.splice(FoundPos, 1);
            }
        }

        document.querySelector("button#up").setAttribute("ontouchstart", "(" + ADD + ")('w');");
        document.querySelector("button#up").setAttribute("ontouchend", "(" + SUB + ")('w');");

        document.querySelector("button#down").setAttribute("ontouchstart", "(" + ADD + ")('s');");
        document.querySelector("button#down").setAttribute("ontouchend", "(" + SUB + ")('s');");

        document.querySelector("button#left").setAttribute("ontouchstart", "(" + ADD + ")('a');");
        document.querySelector("button#left").setAttribute("ontouchend", "(" + SUB + ")('a');");

        document.querySelector("button#right").setAttribute("ontouchstart", "(" + ADD + ")('d');");
        document.querySelector("button#right").setAttribute("ontouchend", "(" + SUB + ")('d');");
    }

    globalThis.detectMob = detectMob;
    globalThis.initMobile = initMobile;
})();