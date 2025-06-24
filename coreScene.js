import * as THREE from 'three';
import { CAMERA_INITIAL_POSITION_Y, CAMERA_INITIAL_POSITION_Z } from './constants.js';

export function setupCoreScene(canvasElement) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Light blue sky
    scene.fog = new THREE.Fog(scene.background, 100, 1000); // Add fog for infinite look

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Camera position will be set by initThreeScene after setupCoreScene returns

    const renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Enable shadow maps

    return { scene, camera, renderer };
}

export function setupResizeHandler(camera, renderer) {
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}