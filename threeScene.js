import { setupCoreScene, setupResizeHandler } from './coreScene.js';
import { addLights } from './lighting.js';
import { createTerrain } from './terrainGeneration.js';
import { createWater } from './waterPlane.js';
import { startAnimation } from './animationLoop.js';
import { CAMERA_INITIAL_POSITION_Y, CAMERA_INITIAL_POSITION_Z } from './constants.js';

export function initThreeScene(canvasElement) {
    const { scene, camera, renderer } = setupCoreScene(canvasElement);

    // Set initial camera position after scene setup
    camera.position.set(0, CAMERA_INITIAL_POSITION_Y, CAMERA_INITIAL_POSITION_Z);
    camera.lookAt(0, 0, 0);

    addLights(scene);
    createTerrain(scene);
    createWater(scene);

    // Initial render before fading out splash screen
    renderer.render(scene, camera);

    startAnimation(camera, renderer, scene);
    setupResizeHandler(camera, renderer);
}