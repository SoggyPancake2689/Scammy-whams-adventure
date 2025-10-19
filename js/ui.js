// UI management system
class UIManager {
    constructor() {
        this.currentScreen = CONSTANTS.STATES.MENU;
        this.selectedDifficulty = null;
        this.countdownActive = false;
        this.countdownValue = 3;
        this.countdownStartTime = 0;
    }

    // Show specific screen
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Hide all game HUDs
        document.querySelectorAll('.game-hud').forEach(hud => {
            hud.classList.add('hidden');
        });
        
        // Show target screen - handle special cases
        let targetId = screenName + 'Screen';
        if (screenName === 'gameHUD') {
            targetId = 'gameHUD'; // Special case for gameHUD
        }
        
        const targetScreen = document.getElementById(targetId);
        if (targetScreen) {
            targetScreen.classList.remove('hidden');
        } else {
            console.warn(`Screen element not found: ${targetId}`);
        }
        
        this.currentScreen = screenName;
    }

    // Show loading screen with animation (now instant)
    showLoading(duration = 0) {
        // Skip loading screen entirely - go directly to game
        this.showScreen('gameHUD');
    }


    // Start countdown
    startCountdown() {
        console.log('Starting countdown...');
        this.countdownActive = true;
        this.countdownValue = 3;
        this.countdownStartTime = Date.now();
        this.showScreen('gameHUD');
        
        // Make sure countdown is visible and starts with 3
        const countdownElement = document.getElementById('countdown');
        console.log('Countdown element:', countdownElement);
        if (countdownElement) {
            countdownElement.textContent = '3';
            countdownElement.style.display = 'block';
            console.log('Countdown set to 3 and made visible');
        } else {
            console.error('Countdown element not found!');
        }
    }

    // Update countdown
    updateCountdown() {
        if (!this.countdownActive) return false;
        
        const elapsed = Date.now() - this.countdownStartTime;
        const secondsElapsed = Math.floor(elapsed / 1000);
        const newValue = Math.max(0, 3 - secondsElapsed);
        
        if (newValue !== this.countdownValue) {
            this.countdownValue = newValue;
            const countdownElement = document.getElementById('countdown');
            
            if (this.countdownValue > 0) {
                countdownElement.textContent = this.countdownValue;
                countdownElement.style.display = 'block';
                console.log(`Countdown: ${this.countdownValue} (${secondsElapsed}s elapsed)`);
            } else {
                countdownElement.style.display = 'none';
                this.countdownActive = false;
                console.log('Countdown finished! Game starting...');
                return true; // Countdown finished
            }
        }
        
        return false;
    }

    // Update score display
    updateScore(score) {
        const scoreElement = document.getElementById('currentScore');
        if (scoreElement) {
            scoreElement.textContent = score;
        } else {
            console.warn('Score element not found!');
        }
    }

    // Show game over screen
    showGameOver(finalScore, isNewHighScore) {
        const finalScoreElement = document.getElementById('finalScore');
        if (finalScoreElement) {
            finalScoreElement.textContent = finalScore;
        }
        
        const highScoreMessage = document.getElementById('highScoreMessage');
        if (highScoreMessage) {
            if (isNewHighScore) {
                highScoreMessage.textContent = '🎉 NEW HIGH SCORE! 🎉';
                highScoreMessage.style.color = '#FFD700';
            } else {
                highScoreMessage.textContent = 'Try again to beat your high score!';
                highScoreMessage.style.color = '#B0B0B0';
            }
        }
        
        this.showScreen('gameOver');
    }

    // Setup event listeners
    setupEventListeners(game) {
        // Difficulty selection
        const difficultyButtons = document.querySelectorAll('.difficulty-btn');
        if (difficultyButtons.length === 0) {
            console.warn('No difficulty buttons found!');
        } else {
            difficultyButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Remove previous selection
                    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
                    
                    // Add selection to clicked button
                    btn.classList.add('selected');
                    this.selectedDifficulty = btn.dataset.difficulty;
                    
                    // Start game immediately after selecting difficulty
                    this.showLoading();
                    game.startGame(this.selectedDifficulty);
                });
            });
        }

        // Game buttons
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                this.showLoading();
                game.restart();
            });
        }

        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                this.showLoading();
                game.showMenu();
            });
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                
                if (this.currentScreen === 'mainMenuScreen' && this.selectedDifficulty) {
                    // Start game
                    this.showLoading();
                    game.startGame(this.selectedDifficulty);
                } else if (this.currentScreen === 'gameHUD' && (game.state === CONSTANTS.STATES.COUNTDOWN || game.state === CONSTANTS.STATES.PLAYING)) {
                    // Flap diamond during countdown or gameplay
                    console.log('Spacebar pressed - attempting to flap diamond');
                    game.flapDiamond();
                }
            }
        });

        // Mouse/touch controls
        document.addEventListener('click', (e) => {
            if (this.currentScreen === 'mainMenuScreen' && this.selectedDifficulty) {
                // Start game from menu
                this.showLoading();
                game.startGame(this.selectedDifficulty);
            } else if (this.currentScreen === 'gameHUD' && (game.state === CONSTANTS.STATES.COUNTDOWN || game.state === CONSTANTS.STATES.PLAYING)) {
                // Flap diamond during countdown or gameplay
                console.log('Mouse clicked - attempting to flap diamond');
                game.flapDiamond();
            }
        });

        // Mobile touch controls
        let touchStartY = 0;
        let touchStartTime = 0;
        
        // Touch start - prevent default to avoid scrolling
        document.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
        }, { passive: false });
        
        // Touch end - handle tap/flap
        document.addEventListener('touchend', (e) => {
            e.preventDefault();
            
            const touchEndTime = Date.now();
            const touchDuration = touchEndTime - touchStartTime;
            const touchEndY = e.changedTouches[0].clientY;
            const touchDistance = Math.abs(touchEndY - touchStartY);
            
            // Consider it a tap if:
            // - Touch duration is short (< 300ms)
            // - Touch distance is small (< 50px)
            const isTap = touchDuration < 300 && touchDistance < 50;
            
            if (isTap) {
                if (this.currentScreen === 'mainMenuScreen' && this.selectedDifficulty) {
                    // Start game from menu
                    this.showLoading();
                    game.startGame(this.selectedDifficulty);
                } else if (this.currentScreen === 'gameHUD' && (game.state === CONSTANTS.STATES.COUNTDOWN || game.state === CONSTANTS.STATES.PLAYING)) {
                    // Flap diamond during countdown or gameplay
                    console.log('Touch tap - attempting to flap diamond');
                    game.flapDiamond();
                }
            }
        }, { passive: false });
        
        // Prevent context menu on long press (mobile)
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    // Initialize UI
    initialize() {
        this.showScreen('mainMenu');
        scoreStorage.updateHighScoreDisplay();
    }

    // Get current difficulty
    getSelectedDifficulty() {
        return this.selectedDifficulty;
    }

    // Check if countdown is active
    isCountdownActive() {
        return this.countdownActive;
    }
}

// Make UIManager globally available
window.UIManager = UIManager;
