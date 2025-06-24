import * as THREE from 'three';

let scene, camera, renderer;
let plane;
let splashScreen;

function init() {
    splashScreen = document.getElementById('splash-screen');
    const canvas = document.getElementById('three-canvas');

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Light blue sky

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 50); // Position camera above the plane looking slightly down
    camera.lookAt(0, 0, 0); // Look at the origin (center of the plane)

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Enable shadow maps

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50); // Position the light
    directionalLight.castShadow = true;
    // Set up shadow properties for the light
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = -200;
    directionalLight.shadow.camera.right = 200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;
    scene.add(directionalLight);

    // Flat Terrain (Plane)
    const planeGeometry = new THREE.PlaneGeometry(200, 200, 32, 32); // Large plane
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x567d46, side: THREE.DoubleSide }); // Greenish material
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to be flat on the XZ plane
    plane.receiveShadow = true; // Plane receives shadows
    scene.add(plane);

    // Initial render before fading out splash screen
    renderer.render(scene, camera);

    // Fade out splash screen after a short delay to ensure everything is rendered
    // This simulates the "loading in" of the 3D scene.
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
    }, 500); // 500ms delay after init to allow initial render

    // Animation loop
    animate();

    // Handle window resizing
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    // Add any future animations or updates here if needed

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Initialize the scene when the DOM is ready
document.addEventListener('DOMContentLoaded', init);