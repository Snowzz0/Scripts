// ==UserScript==
// @name         Mini Player aanicdn
// @namespace    https://example.org/
// @version      1.2
// @description  Cria player flutuante para vídeos cdn*.aanicdn.online sem botão de download.
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    const HOST_PATTERN = /cdn\d+\.aanicdn\.online/;
    const seen = new Set();

    function createMiniPlayer(videoUrl) {
        if (!videoUrl || seen.has(videoUrl)) return;
        seen.add(videoUrl);

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.bottom = '10px';
        container.style.right = '10px';
        container.style.width = '360px';
        container.style.background = 'rgba(0,0,0,0.9)';
        container.style.border = '2px solid #fff';
        container.style.borderRadius = '8px';
        container.style.zIndex = 999999;
        container.style.padding = '8px';
        container.style.color = '#fff';
        container.style.fontFamily = 'Arial,sans-serif';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '4px';
        container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';

        const video = document.createElement('video');
        video.src = videoUrl;
        video.controls = true;
        video.autoplay = false;
        video.style.width = '100%';
        video.style.borderRadius = '4px';
        container.appendChild(video);

        // Botão fechar
        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Fechar';
        closeBtn.style.padding = '4px';
        closeBtn.style.border = 'none';
        closeBtn.style.borderRadius = '4px';
        closeBtn.style.background = '#dc3545';
        closeBtn.style.color = '#fff';
        closeBtn.style.cursor = 'pointer';
        closeBtn.addEventListener('click', () => container.remove());
        container.appendChild(closeBtn);

        // Permitir arrastar
        let isDragging = false, offsetX = 0, offsetY = 0;
        container.addEventListener('mousedown', e => {
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
        });
        document.addEventListener('mousemove', e => {
            if (!isDragging) return;
            container.style.left = (e.clientX - offsetX) + 'px';
            container.style.top = (e.clientY - offsetY) + 'px';
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        });
        document.addEventListener('mouseup', () => { isDragging = false; });

        document.body.appendChild(container);
    }

    function scanVideos() {
        document.querySelectorAll('video, source').forEach(el => {
            const url = el.src || el.currentSrc;
            if (url && HOST_PATTERN.test(url)) {
                createMiniPlayer(url);
            }
        });
    }

    // Scan inicial
    scanVideos();

    // Observa vídeos carregados dinamicamente
    new MutationObserver(scanVideos).observe(document.body, { childList: true, subtree: true });
})();
