// Main game class
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) {
            console.error('Canvas element not found!');
            return;
        }
        
        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Could not get 2D context from canvas!');
            return;
        }
        
        // Set canvas size to match constants
        this.canvas.width = CONSTANTS.CANVAS_WIDTH;
        this.canvas.height = CONSTANTS.CANVAS_HEIGHT;
        
        this.ui = new UIManager();
        this.particleSystem = new ParticleSystem();
        this.backgroundSystem = new BackgroundSystem();
        this.obstacleManager = new ObstacleManager();
        
        // Game state
        this.state = CONSTANTS.STATES.MENU;
        this.diamond = null;
        this.score = 0;
        this.currentDifficulty = CONSTANTS.DIFFICULTY.NORMAL;
        this.gameStarted = false;
        
        // Timing
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Initialize
        this.initialize();
    }

    initialize() {
        // Setup UI event listeners
        this.ui.setupEventListeners(this);
        
        // Initialize UI
        this.ui.initialize();
        
        // Start game loop
        this.gameLoop();
    }

    // Start the game with selected difficulty
    startGame(difficultyName) {
        console.log(`Starting game with difficulty: ${difficultyName}`);
        this.currentDifficulty = CONSTANTS.DIFFICULTY[difficultyName.toUpperCase()];
        this.obstacleManager.setDifficulty(this.currentDifficulty);
        
        // Reset game state
        this.score = 0;
        this.gameStarted = false;
        
        // Create diamond in center of screen
        this.diamond = new Diamond(150, CONSTANTS.CANVAS_HEIGHT / 2);
        console.log(`Diamond created at position: (${this.diamond.x}, ${this.diamond.y})`);
        
        // Clear systems
        this.particleSystem.clear();
        this.obstacleManager.clear();
        this.backgroundSystem.reset();
        console.log('All systems cleared, no obstacles present');
        
        // Set state to countdown and start countdown
        this.state = CONSTANTS.STATES.COUNTDOWN;
        this.ui.startCountdown();
        console.log('Game state set to COUNTDOWN, countdown started');
    }

    // Restart the game
    restart() {
        this.startGame(this.currentDifficulty.name);
    }

    // Show main menu
    showMenu() {
        this.state = CONSTANTS.STATES.MENU;
        this.gameStarted = false;
        this.ui.showScreen('mainMenu');
        scoreStorage.updateHighScoreDisplay();
    }

    // Make diamond flap
    flapDiamond() {
        console.log('flapDiamond called', {
            diamond: !!this.diamond,
            state: this.state,
            countdownState: CONSTANTS.STATES.COUNTDOWN,
            playingState: CONSTANTS.STATES.PLAYING,
            gameStarted: this.gameStarted,
            currentScreen: this.ui.currentScreen
        });
        
        if (this.diamond && (this.state === CONSTANTS.STATES.COUNTDOWN || this.state === CONSTANTS.STATES.PLAYING)) {
            console.log('Diamond flapping!', {
                beforeVy: this.diamond.vy,
                flapVelocity: this.currentDifficulty.flapVelocity
            });
            this.diamond.flap(this.currentDifficulty);
            console.log('After flap vy:', this.diamond.vy);
            
            // Create enhanced trail particles on flap
            const center = this.diamond.getCenter();
            this.particleSystem.createTrail(center.x, center.y, 0, this.diamond.vy);
            
            // Add extra sparkle effect on flap
            this.particleSystem.createSparkle(center.x, center.y);
        } else {
            console.log('Flap blocked:', {
                noDiamond: !this.diamond,
                wrongState: this.state !== CONSTANTS.STATES.COUNTDOWN && this.state !== CONSTANTS.STATES.PLAYING
            });
        }
    }

    // Game over
    gameOver() {
        this.state = CONSTANTS.STATES.GAME_OVER;
        this.gameStarted = false;
        
        // Create impact particles
        if (this.diamond) {
            const center = this.diamond.getCenter();
            this.particleSystem.createImpact(center.x, center.y);
        }
        
        // Check for new high score
        const isNewHighScore = scoreStorage.saveHighScore(this.currentDifficulty.name, this.score);
        
        // Show game over screen
        this.ui.showGameOver(this.score, isNewHighScore);
    }

    // Update game logic
    update(deltaTime) {
        if (this.state === CONSTANTS.STATES.MENU || this.state === CONSTANTS.STATES.LOADING) return;
        
        // Update countdown if in countdown state
        if (this.state === CONSTANTS.STATES.COUNTDOWN) {
            if (this.ui.updateCountdown()) {
                // Countdown finished, start the actual game
                this.state = CONSTANTS.STATES.PLAYING;
                this.gameStarted = true;
                console.log('Countdown finished! Game state changed to PLAYING');
                console.log(`Diamond position at game start: (${this.diamond.x}, ${this.diamond.y})`);
            }
        }
        
        // Update diamond (allow flapping during countdown and gameplay)
        if (this.diamond && (this.state === CONSTANTS.STATES.COUNTDOWN || this.state === CONSTANTS.STATES.PLAYING)) {
            // Only apply physics during actual gameplay, not during countdown
            if (this.state === CONSTANTS.STATES.PLAYING) {
                this.diamond.update(deltaTime, this.currentDifficulty);
            } else {
                // During countdown, only update visual effects (rotation, glow) but not physics
                this.diamond.updateVisuals(deltaTime);
            }
            
            // Create continuous trail particles
            if (Math.random() < 0.5) {
                const center = this.diamond.getCenter();
                this.particleSystem.createContinuousTrail(center.x, center.y, this.diamond.vx, this.diamond.vy);
            }
            
            // Only check collisions during actual gameplay (not during countdown)
            if (this.state === CONSTANTS.STATES.PLAYING) {
                // Check collision with obstacles
                if (this.obstacleManager.checkCollisions(this.diamond)) {
                    console.log('Game over: Collision with obstacle');
                    this.gameOver();
                    return;
                }
                
                // Check collision with boundaries - diamond dies if it hits top or bottom
                if (this.diamond.y <= this.diamond.size / 2 || 
                    this.diamond.y >= CONSTANTS.CANVAS_HEIGHT - this.diamond.size / 2) {
                    console.log(`Game over: Diamond hit boundary at y=${this.diamond.y}`);
                    this.gameOver();
                    return;
                }
            }
        }
        
        // Only update game systems during actual gameplay (not during countdown)
        if (this.state === CONSTANTS.STATES.PLAYING) {
            // Update obstacle manager
            this.obstacleManager.update(deltaTime, this.diamond);
            
            // Update score
            this.score = this.obstacleManager.getTotalScore();
            this.ui.updateScore(this.score);
        }
        
        // Always update background and particles (these continue during countdown)
        this.backgroundSystem.update(deltaTime);
        this.particleSystem.update(deltaTime);
    }

    // Render game
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
        
        // Draw background
        this.backgroundSystem.draw(this.ctx);
        
        // Draw obstacles
        this.obstacleManager.draw(this.ctx);
        
        // Draw diamond
        if (this.diamond) {
            this.diamond.draw(this.ctx);
        }
        
        // Draw particles
        this.particleSystem.draw(this.ctx);
    }

    // Main game loop
    gameLoop(currentTime = 0) {
        // Calculate delta time
        this.deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        // Cap delta time to prevent large jumps
        this.deltaTime = Math.min(this.deltaTime, 1/30); // Max 30fps worth of time
        
        // Update game
        this.update(this.deltaTime);
        
        // Render game
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
}

// Make Game class globally available
window.Game = Game;

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Check if all required classes are available
        const requiredClasses = ['UIManager', 'ParticleSystem', 'BackgroundSystem', 'ObstacleManager', 'Diamond'];
        const missingClasses = requiredClasses.filter(className => typeof window[className] === 'undefined');
        
        if (missingClasses.length > 0) {
            throw new Error(`Missing required classes: ${missingClasses.join(', ')}`);
        }
        
        // Check if constants are loaded
        if (typeof CONSTANTS === 'undefined') {
            throw new Error('CONSTANTS not loaded');
        }
        
        new Game();
    } catch (error) {
        console.error('Failed to initialize game:', error);
        // Show error message to user
        document.body.innerHTML = '<div style="text-align: center; padding: 50px; font-family: Arial; color: red;"><h1>Game Error</h1><p>Failed to load the game. Please refresh the page.</p><p>Error: ' + error.message + '</p></div>';
    }
});
