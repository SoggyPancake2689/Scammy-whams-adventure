// Game constants and configuration
const CONSTANTS = {
    // Canvas settings - will be set dynamically
    CANVAS_WIDTH: 800, // Default fallback
    CANVAS_HEIGHT: 600, // Default fallback
    
    // Game states
    STATES: {
        MENU: 'menu',
        LOADING: 'loading',
        COUNTDOWN: 'countdown',
        PLAYING: 'playing',
        GAME_OVER: 'gameOver'
    },
    
    // Difficulty settings
    DIFFICULTY: {
        EASY: {
            name: 'easy',
            gravity: 1200,
            flapVelocity: -400,
            obstacleSpeed: 200,
            gapSize: 200,
            spawnInterval: 2500
        },
        NORMAL: {
            name: 'normal',
            gravity: 1500,
            flapVelocity: -450,
            obstacleSpeed: 250,
            gapSize: 150,
            spawnInterval: 2000
        },
        HARD: {
            name: 'hard',
            gravity: 1800,
            flapVelocity: -500,
            obstacleSpeed: 300,
            gapSize: 120,
            spawnInterval: 1500
        }
    },
    
    // Diamond settings
    DIAMOND: {
        SIZE: 30,
        ROTATION_SPEED: 2.0, // Much faster rotation (was 0.6)
        GLOW_INTENSITY: 0.8
    },
    
    // Obstacle settings
    OBSTACLE: {
        WIDTH: 80,
        MIN_HEIGHT: 50,
        MAX_HEIGHT: 300,
        THEMES: ['pipes', 'rocks', 'crystals', 'lasers', 'thorns', 'buildings', 'grass', 'rainbow', 'rgb']
    },
    
    // Particle settings
    PARTICLES: {
        TRAIL_COUNT: 8,
        IMPACT_COUNT: 15,
        TRAIL_LIFE: 0.5,
        IMPACT_LIFE: 0.8,
        TRAIL_SPEED: 0.3,
        IMPACT_SPEED: 0.5
    },
    
    // Background settings
    BACKGROUND: {
        CLOUD_COUNT: 5,
        STAR_COUNT: 20,
        CLOUD_SPEED: 0.5,
        STAR_SPEED: 1.0,
        PARALLAX_FACTOR: 0.3
    },
    
    // UI settings
    UI: {
        COUNTDOWN_DURATION: 3000,
        LOADING_DURATION: 1000,
        FADE_DURATION: 500
    },
    
    // Storage
    STORAGE_KEY: 'diamondFlappyHighScores',
    
    // Colors
    COLORS: {
        DIAMOND_GRADIENT: ['#FFD700', '#FFA500', '#FF6347'],
        BACKGROUND_GRADIENT: ['#87CEEB', '#98FB98'],
        OBSTACLE_COLORS: {
            pipes: ['#32CD32', '#00FF7F'],
            rocks: ['#B0B0B0', '#D3D3D3'],
            crystals: ['#BA55D3', '#DA70D6'],
            lasers: ['#FF4500', '#FF6347'],
            thorns: ['#CD853F', '#DEB887'],
            buildings: ['#708090', '#A9A9A9'],
            grass: ['#7CB342', '#8BC34A'],
            rainbow: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
            rgb: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3']
        },
        PARTICLE_COLORS: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4']
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONSTANTS;
}

// Make CONSTANTS globally available
window.CONSTANTS = CONSTANTS;
