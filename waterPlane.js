import * as THREE from 'three';
import { RIVER_WIDTH, RIVER_DEPTH, PLANE_DEPTH } from './constants.js';

export function createWater(scene) {
    // River Water Surface
    const waterGeometry = new THREE.PlaneGeometry(RIVER_WIDTH, PLANE_DEPTH, 1, 100); // Width of river, length of terrain, subdivisions for potential future wave animation
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

    return waterPlane;
}