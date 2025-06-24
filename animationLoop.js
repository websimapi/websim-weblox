import { CAMERA_SPEED, PLANE_DEPTH } from './constants.js';

export function startAnimation(camera, renderer, scene) {
    function animate() {
        requestAnimationFrame(animate);

        // Move the camera forward to create an "infinite" terrain effect
        // By moving the camera along its negative Z-axis, it appears to move into the scene
        camera.position.z -= CAMERA_SPEED; // Adjust speed as desired

        // A simple way to loop the camera's Z position to create a repeating illusion for infinite terrain
        // The plane spans from -PLANE_DEPTH/2 to +PLANE_DEPTH/2 along the Z-axis.
        if (camera.position.z < -(PLANE_DEPTH / 2)) { 
            camera.position.z = (PLANE_DEPTH / 2); // Reset to the "start" of the plane's positive Z
            // If there were other objects (trees, etc.), their positions might also need to be reset
        }

        renderer.render(scene, camera);
    }
    animate();
}