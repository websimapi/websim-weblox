import * as THREE from 'three';
import { RIVER_WIDTH, RIVER_DEPTH, PLANE_DEPTH, PLANE_SEGMENTS, getRiverOffset } from './constants.js';

export function createWater(scene) {
    // River Water Surface
    // Increase width and depth segments to allow for horizontal deformation and smoother curves
    const waterGeometry = new THREE.PlaneGeometry(RIVER_WIDTH, PLANE_DEPTH, PLANE_SEGMENTS, PLANE_SEGMENTS);
    const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x0077ff, // Blue water color
        transparent: true,
        opacity: 0.7, // Slightly transparent
        side: THREE.DoubleSide,
        roughness: 0.2, // Make it a bit reflective
        metalness: 0.8 // Make it a bit metallic for reflections
    });
    const waterPlane = new THREE.Mesh(waterGeometry, waterMaterial);
    waterPlane.rotation.x = -Math.PI / 2; // Rotate to be flat on the XZ plane
    waterPlane.position.y = -RIVER_DEPTH + 0.1; // Position slightly above the riverbed to avoid Z-fighting
    waterPlane.receiveShadow = true;
    waterPlane.castShadow = true; // Water can cast shadows
    scene.add(waterPlane);

    // Deform water plane vertices to follow the river's curved path
    const positionAttribute = waterGeometry.attributes.position;
    for (let i = 0; i < positionAttribute.count; i++) {
        const x_original = positionAttribute.getX(i);
        // The Y coordinate in the geometry is the Z coordinate in the scene (after rotation)
        const z_in_geometry = positionAttribute.getY(i);

        // Get the river's center X offset at this Z position
        const riverCenterX = getRiverOffset(z_in_geometry);

        // Adjust the vertex's X position to follow the curve
        // The original x_original is relative to the water plane's local center.
        // We add the riverCenterX to effectively shift the entire water plane horizontally.
        positionAttribute.setX(i, x_original + riverCenterX);
    }
    positionAttribute.needsUpdate = true; // Important: Tell Three.js that the buffer has changed
    waterGeometry.computeVertexNormals(); // Recalculate normals for correct lighting/reflections

    return waterPlane;
}