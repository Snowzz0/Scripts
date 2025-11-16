// ==UserScript==
// @name         HinataSoul File4Go Auto-Open (Corrigido)
// @namespace    https://hinatasoul.com/
// @version      1.1
// @description  Abre links file4go em ordem FULL HD > HD > SD na página de vídeos do HinataSoul
// @author       Você
// @match        https://www.hinatasoul.com/videos/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ordem de prioridade
    const prioridade = ["FULL HD", "HD", "SD"];

    function detectarQualidade(texto) {
        texto = texto.toUpperCase();
        if (texto.includes("FULL HD")) return "FULL HD";
        if (texto.includes("HD")) return "HD";
        if (texto.includes("SD")) return "SD";
        return null;
    }

    function abrirLink() {
        const botoes = [...document.querySelectorAll("a, button")];

        // pega apenas links file4go
        const links = botoes
            .filter(el => el.href && el.href.includes("file4go"))
            .map(el => ({
                qualidade: detectarQualidade(el.innerText),
                url: el.href
            }))
            .filter(l => l.qualidade !== null);

        if (links.length === 0) {
            console.log("Nenhum link file4go encontrado.");
            return;
        }

        // ordena pela prioridade definida
        links.sort((a, b) => prioridade.indexOf(a.qualidade) - prioridade.indexOf(b.qualidade));

        // abre o melhor
        const melhor = links[0];
        if (melhor) {
            console.log("Abrindo:", melhor.qualidade, melhor.url);
            window.open(melhor.url, "_blank");
        }
    }

    // roda quando a página carregar
    window.addEventListener("load", () => {
        setTimeout(abrirLink, 2000); // espera 2s pros botões carregarem
    });
})();
