// Terrain parameters
export const PLANE_WIDTH = 2000;
export const PLANE_DEPTH = 2000;
export const PLANE_SEGMENTS = 200;

// River parameters
export const RIVER_WIDTH = 60;
export const RIVER_DEPTH = 5;
export const BANK_SLOPE_WIDTH = 30;

// River curve parameters
export const RIVER_CURVE_AMPLITUDE = 400; // Max deviation from center in X
export const RIVER_CURVE_FREQUENCY = Math.PI / 300; // How many waves along the Z-axis

// Helper function to calculate river's X offset at a given Z position
export const getRiverOffset = (zPos) => {
    // zPos in geometry ranges from -PLANE_DEPTH / 2 to +PLANE_DEPTH / 2
    return RIVER_CURVE_AMPLITUDE * Math.sin(zPos * RIVER_CURVE_FREQUENCY);
};

// Camera parameters
export const CAMERA_INITIAL_POSITION_Y = 20;
export const CAMERA_INITIAL_POSITION_Z = 100;
export const CAMERA_SPEED = 0.2;