function initPC(){
    window.onkeydown = e => {
        const K = e.key.length == 1 ? e.key.toUpperCase().charCodeAt(0) : -1;
        let Found = false;

        globalThis.Keys.find((e, i) => {
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
};