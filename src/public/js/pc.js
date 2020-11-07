(() => {
    function initPC(){
        if(window.onkeydown === null)
        window.onkeydown = e => {
            const K = e.key.length == 1 ? e.key.toUpperCase().charCodeAt(0) : -1;
            let Found = false;

            globalThis.Keys.find((e) => {
                if (e.code == K) {
                    Found = true;
                }
            });

            if (!Found) {
                globalThis.Keys.unshift({
                    code: K,
                    key: e.key,
                    isShifted: e.shiftKey,
                    isCtrled: e.ctrlKey,
                    codeLower: (K >= 65 && K <= 90 ? e.key.toLowerCase().charCodeAt() : K)
                });
            }
        }

        if(window.onkeyup === null)
        window.onkeyup = e => {
            const K = e.key.length == 1 ? e.key.toUpperCase().charCodeAt(0) : -1;
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

        document.querySelector("div#mobileControls").style.display = "none";

        const BU = document.querySelector("button#up");
        const BD = document.querySelector("button#down");
        const BL = document.querySelector("button#left");
        const BR = document.querySelector("button#right");

        BU.removeAttribute("ontouchstart");
        BU.removeAttribute("ontouchend");

        BD.removeAttribute("ontouchstart");
        BD.removeAttribute("ontouchend");

        BL.removeAttribute("ontouchstart");
        BL.removeAttribute("ontouchend");

        BR.removeAttribute("ontouchstart");
        BR.removeAttribute("ontouchend");
    }

    globalThis.initPC = initPC;
})();