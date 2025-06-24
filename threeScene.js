import * as THREE from 'three';

let scene, camera, renderer;
let plane, waterPlane;

export function initThreeScene(canvasElement) {
    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Light blue sky
    scene.fog = new THREE.Fog(scene.background, 100, 1000); // Add fog for infinite look

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 100); // Increased Y for higher view, Z for further back
    camera.lookAt(0, 0, 0); // Look at the origin (center of the plane)

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

    // Terrain (Plane) - Much larger and with more segments for detailed manipulation
    const planeWidth = 2000;
    const planeDepth = 2000;
    const planeSegments = 200; // Higher segments for river detail
    const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeDepth, planeSegments, planeSegments);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x567d46, side: THREE.DoubleSide }); // Greenish material
    plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to be flat on the XZ plane
    plane.receiveShadow = true; // Plane receives shadows
    scene.add(plane);

    // River parameters
    const riverWidth = 60; // Width of the river
    const riverDepth = 5; // Depth of the riverbed
    const bankSlopeWidth = 30; // Width of the sloping banks on each side

    // Manipulate terrain vertices to create a riverbed
    const positionAttribute = planeGeometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        // The Y coordinate in the geometry is the Z coordinate in the scene (after rotation)
        // The Z coordinate in the geometry (initially 0) is the Y coordinate (height) in the scene
        
        // Calculate distance from the river's center line (x=0)
        const absX = Math.abs(x);

        if (absX < riverWidth / 2 + bankSlopeWidth) {
            let depthAdjustment = 0;
            if (absX <= riverWidth / 2) {
                // Inside the main river channel
                depthAdjustment = riverDepth;
            } else {
                // On the sloping bank
                const slopeFactor = (absX - riverWidth / 2) / bankSlopeWidth;
                depthAdjustment = riverDepth * (1 - slopeFactor); // Linear slope
            }
            // Set the Z (height) in the geometry (which becomes Y in scene)
            positionAttribute.setZ(i, -depthAdjustment);
        }
    }
    positionAttribute.needsUpdate = true;
    planeGeometry.computeVertexNormals(); // Recalculate normals for correct lighting

    // River Water Surface
    const waterGeometry = new THREE.PlaneGeometry(riverWidth, planeDepth, 1, 100); // Width of river, length of terrain, subdivisions for potential future wave animation
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x0077ff, // Blue water color
        transparent: true,
        opacity: 0.7, // Slightly transparent
        side: THREE.DoubleSide,
        roughness: 0.2, // Make it a bit reflective
        metalness: 0.8 // Make it a bit metallic for reflections
    });
    waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
    waterPlane.rotation.x = -Math.PI / 2; // Rotate to be flat on the XZ plane
    waterPlane.position.y = -riverDepth + 0.1; // Position slightly above the riverbed to avoid Z-fighting
    waterPlane.receiveShadow = true;
    waterPlane.castShadow = true; // Water can cast shadows
    scene.add(waterPlane);

    // Initial render before fading out splash screen
    renderer.render(scene, camera);

    // Animation loop
    animate();

    // Handle window resizing
    window.addEventListener('resize', onWindowResize);
}

function animate() {
    requestAnimationFrame(animate);

    // Move the camera forward to create an "infinite" terrain effect
    // By moving the camera along its negative Z-axis, it appears to move into the scene
    camera.position.z -= 0.2; // Adjust speed as desired

    // A simple way to loop the camera's Z position to create a repeating illusion for infinite terrain
    // The plane spans from -1000 to 1000 along the Z-axis.
    if (camera.position.z < -1000) { 
        camera.position.z = 1000; // Reset to the "start" of the plane
        // If there were other objects (trees, etc.), their positions might also need to be reset
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}