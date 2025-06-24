import * as THREE from 'three';
import { PLANE_WIDTH, PLANE_DEPTH, PLANE_SEGMENTS, RIVER_WIDTH, RIVER_DEPTH, BANK_SLOPE_WIDTH } from './constants.js';

export function createTerrain(scene) {
    const planeGeometry = new THREE.PlaneGeometry(PLANE_WIDTH, PLANE_DEPTH, PLANE_SEGMENTS, PLANE_SEGMENTS);
    const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x567d46, side: THREE.DoubleSide }); // Greenish material
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Rotate to be flat on the XZ plane
    plane.receiveShadow = true; // Plane receives shadows
    scene.add(plane);

    // Manipulate terrain vertices to create a riverbed
    const positionAttribute = planeGeometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        // The Y coordinate in the geometry is the Z coordinate in the scene (after rotation)
        // The Z coordinate in the geometry (initially 0) is the Y coordinate (height) in the scene
        
        // Calculate distance from the river's center line (x=0)
        const absX = Math.abs(x);

        if (absX < RIVER_WIDTH / 2 + BANK_SLOPE_WIDTH) {
            let depthAdjustment = 0;
            if (absX <= RIVER_WIDTH / 2) {
                // Inside the main river channel
                depthAdjustment = RIVER_DEPTH;
            } else {
                // On the sloping bank
                const slopeFactor = (absX - RIVER_WIDTH / 2) / BANK_SLOPE_WIDTH;
                depthAdjustment = RIVER_DEPTH * (1 - slopeFactor); // Linear slope
            }
            // Set the Z (height) in the geometry (which becomes Y in scene)
            positionAttribute.setZ(i, -depthAdjustment);
        }
    }
    positionAttribute.needsUpdate = true;
    planeGeometry.computeVertexNormals(); // Recalculate normals for correct lighting

    return plane;
}