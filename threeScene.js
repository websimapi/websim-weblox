import * as THREE from 'three';

let scene, camera, renderer;
let plane, water; // 'plane' is now the terrain, 'water' is the river

export function initThreeScene(canvasElement) {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Light blue sky
    scene.fog = new THREE.Fog(scene.background, 100, 1000); // Add fog for infinite look

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    // Adjust camera position to better view the terrain and river
    camera.position.set(200, 150, 200); // Position to get a good overview of the scene
    camera.lookAt(0, 0, 0); // Look at the center of the scene

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas: canvasElement, antialias: true });
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
    directionalLight.shadow.camera.left = -500; // Expanded to cover a wider area
    directionalLight.shadow.camera.right = 500;
    directionalLight.shadow.camera.top = 500;
    directionalLight.shadow.camera.bottom = -500;
    scene.add(directionalLight);

    // Terrain (Plane) - Modified for river trench
    // Increase segments for smoother trench detail
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000, 200, 200);
    const positions = planeGeometry.attributes.position.array;
    const riverWidthHalf = 100; // Increased half-width for a wider river
    const trenchDepth = 30; // Increased maximum depth for a more prominent trench

    for (let i = 0; i < positions.length; i += 3) {
        const localX = positions[i];      // This is the local X coordinate of the vertex
        const localY = positions[i + 1];  // This is the local Y coordinate of the vertex
        const localZ = positions[i + 2];  // This is the local Z coordinate of the vertex (always 0 for PlaneGeometry initially)

        // After plane.rotation.x = -Math.PI / 2, the local coordinates map to world coordinates as:
        // World X = localX
        // World Z = localY
        // World Y = localZ (which is where we apply the trench depth)

        const worldX = localX;
        const worldZ = localY; // In the world, localY becomes the Z-axis of the plane

        // River path runs diagonally from top-left (-1000, 1000) to bottom-right (1000, -1000) in XZ plane
        // This corresponds to the line x + z = 0
        const distanceFromRiverCenter = Math.abs(worldX + worldZ);

        if (distanceFromRiverCenter < riverWidthHalf) {
            // Normalize distance to 0-1 range for smooth depth calculation
            const normalizedDistance = distanceFromRiverCenter / riverWidthHalf;
            // Use cosine to create a smooth, rounded trench profile (deepest at center, rises to 0 at edges)
            const depthModifier = Math.cos(normalizedDistance * Math.PI / 2);
            // Adjust the local Z coordinate, which becomes world Y (height) after rotation
            positions[i + 2] = -trenchDepth * depthModifier;
        }
    }
    // Inform Three.js that the vertex positions have been updated
    planeGeometry.attributes.position.needsUpdate = true;

    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x7C7C7C, side: THREE.DoubleSide }); // Earthy/greyish material for terrain
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to be flat on the XZ plane
    plane.receiveShadow = true; // Plane receives shadows
    plane.castShadow = true; // Terrain should also cast shadows
    scene.add(plane);

    // River Water Mesh
    // Water plane length spans the diagonal of the 2000x2000 terrain
    const waterGeometry = new THREE.PlaneGeometry(
        2000 * Math.SQRT2,
        riverWidthHalf * 2 * 0.9, // Slightly less than full trench width to show the trench banks
        10, 10 // Segments for water plane (less critical than terrain, but good for potential effects)
    );
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x4d85e2, // Blue color for water
        transparent: true,
        opacity: 0.8, // Make it semi-transparent
        roughness: 0.1, // Less rough for a smoother, more reflective surface
        metalness: 0.9, // High metalness to simulate reflections (like water)
    });
    water = new THREE.Mesh(waterGeometry, waterMaterial);
    water.rotation.x = -Math.PI / 2; // Lie flat on XZ plane
    water.rotation.y = Math.PI / 4; // Rotate to align with the diagonal trench (45 degrees from X axis in XZ plane)
    water.position.y = -trenchDepth + 1; // Position slightly above the deepest part of the trench
    water.receiveShadow = true; // Water can receive shadows
    scene.add(water);

    // Initial render before fading out splash screen
    renderer.render(scene, camera);

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