// ==UserScript==
// @name         File4Go Auto Detect Down8
// @namespace    https://file4go.com/
// @version      1.1
// @description  Clica no botão Criar Download e detecta automaticamente link down8.file4go.com
// @author       Você
// @match        *://*file4go.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const MAX_WAIT = 3 * 60 * 1000; // 3 minutos
    const START = Date.now();

    function log(...args) {
        console.log('[File4Go]', ...args);
    }

    function getCriarButton() {
        return [...document.querySelectorAll("a,button,input")]
            .find(el => /CRIAR\s*DOWNLOAD/i.test(el.innerText || el.value || ""));
    }

    function tryClickCriar() {
        const btn = getCriarButton();
        if (!btn) return false;
        if (btn.disabled || btn.getAttribute("disabled")) return false;
        log("Clicando no botão Criar Download...");
        btn.click();
        return true;
    }

    // procura qualquer link que contenha down8.file4go.com
    function findDown8() {
        // 1. <a href=...>
        const a = [...document.querySelectorAll("a[href]")].find(el =>
            /down8\.file4go\.com/i.test(el.href)
        );
        if (a) return a.href;

        // 2. inputs ou textareas
        const inputs = [...document.querySelectorAll("input,textarea")];
        for (const inp of inputs) {
            const val = inp.value || inp.getAttribute("data-href") || "";
            if (/down8\.file4go\.com/i.test(val)) return val;
        }

        // 3. varre texto puro da página
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            if (node.nodeValue && /https?:\/\/[^\s'"]*down8\.file4go\.com[^\s'"]*/i.test(node.nodeValue)) {
                return node.nodeValue.match(/https?:\/\/[^\s'"]*down8\.file4go\.com[^\s'"]*/i)[0];
            }
        }

        return null;
    }

    function startWatcher() {
        const obs = new MutationObserver(() => {
            if (Date.now() - START > MAX_WAIT) obs.disconnect();

            if (tryClickCriar()) {
                log("Botão clicado, aguardando link...");
            }

            const link = findDown8();
            if (link) {
                log("Link encontrado:", link);
                window.open(link, "_blank");
                obs.disconnect();
            }
        });

        obs.observe(document.body, { childList: true, subtree: true, attributes: true, characterData: true });
    }

    window.addEventListener("load", () => {
        setTimeout(() => {
            tryClickCriar();
            const link = findDown8();
            if (link) {
                log("Link encontrado imediato:", link);
                window.open(link, "_blank");
            } else {
                startWatcher();
            }
        }, 2000); // espera 2s pra começar
    });
})();

