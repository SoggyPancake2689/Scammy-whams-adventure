// UI management system
class UIManager {
    constructor() {
        this.currentScreen = CONSTANTS.STATES.MENU;
        this.selectedDifficulty = null;
        this.countdownActive = false;
        this.countdownValue = 3;
        this.countdownStartTime = 0;
        this.customSettings = {
            speed: 250,
            gapSize: 150
        };
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
        
        // Show/hide Change Settings button based on current difficulty
        const changeSettingsBtn = document.getElementById('changeSettingsBtn');
        if (changeSettingsBtn) {
            const isCustomMode = this.selectedDifficulty === 'custom';
            if (isCustomMode) {
                changeSettingsBtn.classList.remove('hidden');
            } else {
                changeSettingsBtn.classList.add('hidden');
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
                    
                    // Check if custom mode is locked
                    if (btn.dataset.difficulty === 'custom' && btn.classList.contains('locked')) {
                        // Show locked message
                        this.showLockedMessage();
                        return;
                    }
                    
                    // Remove previous selection
                    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('selected'));
                    
                    // Add selection to clicked button
                    btn.classList.add('selected');
                    this.selectedDifficulty = btn.dataset.difficulty;
                    
                    // Handle custom mode differently
                    if (this.selectedDifficulty === 'custom') {
                        this.showCustomSettings();
                    } else {
                        // Start game immediately after selecting difficulty
                        this.showLoading();
                        game.startGame(this.selectedDifficulty);
                    }
                });
            });
        }

        // Custom settings buttons
        const startCustomGameBtn = document.getElementById('startCustomGame');
        if (startCustomGameBtn) {
            startCustomGameBtn.addEventListener('click', () => {
                this.showLoading();
                game.startGame('custom');
            });
        }

        const backToMenuBtn = document.getElementById('backToMenu');
        if (backToMenuBtn) {
            backToMenuBtn.addEventListener('click', () => {
                this.showScreen('mainMenu');
            });
        }

        const achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) {
            achievementsBtn.addEventListener('click', () => {
                this.showAchievements();
            });
        }

        const backToMenuFromAchievementsBtn = document.getElementById('backToMenuFromAchievements');
        if (backToMenuFromAchievementsBtn) {
            backToMenuFromAchievementsBtn.addEventListener('click', () => {
                this.showScreen('mainMenu');
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

        const changeSettingsBtn = document.getElementById('changeSettingsBtn');
        if (changeSettingsBtn) {
            changeSettingsBtn.addEventListener('click', () => {
                this.showCustomSettings();
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

    // Show locked message
    showLockedMessage() {
        // Create temporary notification
        const notification = document.createElement('div');
        notification.className = 'locked-notification';
        notification.innerHTML = `
            <div class="locked-content">
                <h3>🔒 Custom Mode Locked</h3>
                <p>Score 20+ points on any difficulty to unlock Custom Mode!</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }
    
    // Show custom settings screen
    showCustomSettings() {
        this.showScreen('customSettings');
        this.setupCustomSettings();
    }
    
    // Setup custom settings sliders
    setupCustomSettings() {
        const speedSlider = document.getElementById('speedSlider');
        const gapSlider = document.getElementById('gapSlider');
        const speedValue = document.getElementById('speedValue');
        const gapValue = document.getElementById('gapValue');
        
        if (speedSlider && speedValue) {
            speedSlider.value = this.customSettings.speed;
            speedValue.textContent = this.customSettings.speed;
            
            speedSlider.addEventListener('input', (e) => {
                this.customSettings.speed = parseInt(e.target.value);
                speedValue.textContent = this.customSettings.speed;
            });
        }
        
        if (gapSlider && gapValue) {
            gapSlider.value = this.customSettings.gapSize;
            gapValue.textContent = this.customSettings.gapSize;
            
            gapSlider.addEventListener('input', (e) => {
                this.customSettings.gapSize = parseInt(e.target.value);
                gapValue.textContent = this.customSettings.gapSize;
            });
        }
    }
    
    // Get custom settings
    getCustomSettings() {
        return this.customSettings;
    }

    // Initialize UI
    initialize() {
        this.showScreen('mainMenu');
        scoreStorage.updateHighScoreDisplay();
        this.updateCustomModeLock();
    }
    
    // Update custom mode lock status
    updateCustomModeLock() {
        const customBtn = document.getElementById('customModeBtn');
        if (!customBtn) return;
        
        if (scoreStorage.isCustomModeUnlocked()) {
            customBtn.classList.remove('locked');
            customBtn.innerHTML = `
                <span class="btn-text">Custom</span>
                <span class="high-score">Choose your settings</span>
            `;
        } else {
            customBtn.classList.add('locked');
            customBtn.innerHTML = `
                <span class="btn-text">Custom</span>
                <span class="lock-overlay">
                    <span class="lock-icon">🔒</span>
                    <span class="lock-text">Score 20+ to unlock</span>
                </span>
            `;
        }
    }
    
    // Check for custom mode unlock after game over
    checkCustomModeUnlock() {
        if (scoreStorage.checkCustomModeUnlock()) {
            this.updateCustomModeLock();
            // Show achievement notification
            this.showAchievementNotification(
                '🎉 Achievement Unlocked!',
                'Custom Mode is now available!'
            );
        }
        
        // Check for other achievements
        const newAchievements = scoreStorage.checkAchievements();
        newAchievements.forEach(achievement => {
            this.showAchievementNotification(
                '🏆 Achievement Unlocked!',
                `${achievement.title}: ${achievement.description}`
            );
        });
    }
    
    // Show achievement notification
    showAchievementNotification(title, message) {
        // Remove any existing achievement notification
        const existingNotification = document.querySelector('.achievement-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create achievement notification element
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
        `;

        // Add to document
        document.body.appendChild(notification);

        // Remove after 30 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'achievementSlideOut 0.5s ease-in forwards';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }
        }, 30000);
    }

    // Show achievements page
    showAchievements() {
        this.populateAchievements();
        this.showScreen('achievements');
    }

    // Populate achievements list
    populateAchievements() {
        const achievementsList = document.getElementById('achievementsList');
        if (!achievementsList) return;

        const achievements = [
            {
                id: 'deaths_10',
                icon: '💀',
                title: 'Persistence',
                description: 'Die 10 times',
                unlocked: scoreStorage.isAchievementUnlocked('deaths_10')
            },
            {
                id: 'custom_mode',
                icon: '🎯',
                title: 'High Scorer',
                description: 'Score 20+ points on any difficulty',
                unlocked: scoreStorage.isAchievementUnlocked('custom_mode')
            }
        ];

        achievementsList.innerHTML = achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <span class="achievement-icon">${achievement.icon}</span>
                <h3 class="achievement-title">${achievement.title}</h3>
                <p class="achievement-description">${achievement.description}</p>
                <span class="achievement-status ${achievement.unlocked ? 'unlocked' : 'locked'}">
                    ${achievement.unlocked ? '✓ Unlocked' : '🔒 Locked'}
                </span>
            </div>
        `).join('');
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
