import { initThreeScene } from './threeScene.js';

document.addEventListener('DOMContentLoaded', () => {
    const splashBackgroundOverlay = document.getElementById('splash-background-overlay');
    const canvas = document.getElementById('three-canvas');

    // Initialize the Three.js scene
    initThreeScene(canvas);

    // Fade out only the background image after a short delay
    setTimeout(() => {
        splashBackgroundOverlay.classList.add('fade-out');
    }, 500); // 500ms delay after init to allow initial render
});