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
                // Handle both click and touch events for mobile compatibility
                const handleDifficultySelection = (e) => {
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
                };
                
                // Add both click and touch event listeners
                btn.addEventListener('click', handleDifficultySelection);
                btn.addEventListener('touchend', handleDifficultySelection);
            });
        }

        // Custom settings buttons
        const startCustomGameBtn = document.getElementById('startCustomGame');
        if (startCustomGameBtn) {
            const handleStartCustom = () => {
                this.showLoading();
                game.startGame('custom');
            };
            startCustomGameBtn.addEventListener('click', handleStartCustom);
            startCustomGameBtn.addEventListener('touchend', handleStartCustom);
        }

        const backToMenuBtn = document.getElementById('backToMenu');
        if (backToMenuBtn) {
            const handleBackToMenu = () => {
                this.clearDifficultySelection();
                this.showScreen('mainMenu');
            };
            backToMenuBtn.addEventListener('click', handleBackToMenu);
            backToMenuBtn.addEventListener('touchend', handleBackToMenu);
        }

        const achievementsBtn = document.getElementById('achievementsBtn');
        if (achievementsBtn) {
            const handleShowAchievements = () => {
                this.showAchievements();
            };
            achievementsBtn.addEventListener('click', handleShowAchievements);
            achievementsBtn.addEventListener('touchend', handleShowAchievements);
        }

        const backToMenuFromAchievementsBtn = document.getElementById('backToMenuFromAchievements');
        if (backToMenuFromAchievementsBtn) {
            const handleBackFromAchievements = () => {
                this.clearDifficultySelection();
                this.showScreen('mainMenu');
            };
            backToMenuFromAchievementsBtn.addEventListener('click', handleBackFromAchievements);
            backToMenuFromAchievementsBtn.addEventListener('touchend', handleBackFromAchievements);
        }

        // Shop button
        const shopBtn = document.getElementById('shopBtn');
        if (shopBtn) {
            const handleShowShop = () => {
                this.showShop();
            };
            shopBtn.addEventListener('click', handleShowShop);
            shopBtn.addEventListener('touchend', handleShowShop);
        }

        const backToMenuFromShopBtn = document.getElementById('backToMenuFromShop');
        if (backToMenuFromShopBtn) {
            const handleBackFromShop = () => {
                this.clearDifficultySelection();
                this.showScreen('mainMenu');
            };
            backToMenuFromShopBtn.addEventListener('click', handleBackFromShop);
            backToMenuFromShopBtn.addEventListener('touchend', handleBackFromShop);
        }

        // Secret code input
        const secretCodeInput = document.getElementById('secretCodeInput');
        const submitSecretCodeBtn = document.getElementById('submitSecretCode');
        if (secretCodeInput && submitSecretCodeBtn) {
            const handleSecretCode = () => {
                const code = secretCodeInput.value.trim();
                if (code) {
                    if (scoreStorage.checkSecretCode(code)) {
                        let skinName = '';
                        if (code === '123') {
                            skinName = 'Voltz';
                        } else if (code === 'ga') {
                            skinName = 'Sparkles';
                        }
                        this.showNotification(`🎉 Secret code accepted! ${skinName} skin unlocked!`, 'success');
                        this.populateSkins(); // Refresh skins display
                        secretCodeInput.value = ''; // Clear input
                    } else {
                        this.showNotification('❌ Invalid secret code!', 'error');
                    }
                }
            };
            
            submitSecretCodeBtn.addEventListener('click', handleSecretCode);
            submitSecretCodeBtn.addEventListener('touchend', handleSecretCode);
            
            // Also handle Enter key
            secretCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSecretCode();
                }
            });
        }

        // Game buttons
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            const handleRestart = () => {
                this.showLoading();
                game.restart();
            };
            restartBtn.addEventListener('click', handleRestart);
            restartBtn.addEventListener('touchend', handleRestart);
        }

        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            const handleMenu = () => {
                this.showLoading();
                game.showMenu();
            };
            menuBtn.addEventListener('click', handleMenu);
            menuBtn.addEventListener('touchend', handleMenu);
        }

        const changeSettingsBtn = document.getElementById('changeSettingsBtn');
        if (changeSettingsBtn) {
            const handleChangeSettings = () => {
                this.showCustomSettings();
            };
            changeSettingsBtn.addEventListener('click', handleChangeSettings);
            changeSettingsBtn.addEventListener('touchend', handleChangeSettings);
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

    // Clear difficulty selection
    clearDifficultySelection() {
        // Remove selection from all difficulty buttons
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        this.selectedDifficulty = null;
    }

    // Show shop screen
    showShop() {
        this.showScreen('shop');
        this.updateCoinsDisplay();
        this.populateSkins();
    }

    // Update coins display
    updateCoinsDisplay() {
        const coinsElement = document.getElementById('coinsAmount');
        if (coinsElement) {
            coinsElement.textContent = scoreStorage.getCoins();
        }
    }

    // Populate skins grid
    populateSkins() {
        const skinsGrid = document.getElementById('skinsGrid');
        if (!skinsGrid) return;

        const skins = scoreStorage.getSkins();
        const currentSkin = scoreStorage.getCurrentSkin();
        
        skinsGrid.innerHTML = '';

        Object.entries(skins).forEach(([skinId, skinData]) => {
            const skinItem = document.createElement('div');
            skinItem.className = `skin-item ${skinData.unlocked ? 'unlocked' : 'locked'} ${skinId === currentSkin ? 'selected' : ''} ${skinData.secret ? 'secret' : ''}`;
            
            // Create skin preview based on skin type
            let previewEmoji = '💎'; // Default diamond
            switch (skinId) {
                case 'rainbow':
                    previewEmoji = '🌈';
                    break;
                case 'fire':
                    previewEmoji = '🔥';
                    break;
                case 'ice':
                    previewEmoji = '❄️';
                    break;
                case 'sparkles':
                    previewEmoji = '🎉';
                    break;
                case 'voltz':
                    previewEmoji = '😊'; // Smiley face
                    break;
                default:
                    previewEmoji = '💎';
            }

            skinItem.innerHTML = `
                <div class="skin-preview">${previewEmoji}</div>
                <div class="skin-name">${skinData.name}</div>
                <div class="skin-cost">${skinData.secret ? 'Only for devs' : (skinData.cost === 0 ? 'Free' : `${skinData.cost} coins`)}</div>
                <div class="skin-status ${skinData.unlocked ? 'unlocked' : 'locked'}">
                    ${skinId === currentSkin ? 'Selected' : (skinData.unlocked ? 'Unlocked' : 'Locked')}
                </div>
            `;

            // Add click handler
            if (skinData.unlocked) {
                skinItem.addEventListener('click', () => {
                    this.selectSkin(skinId);
                });
                skinItem.addEventListener('touchend', () => {
                    this.selectSkin(skinId);
                });
            } else if (skinData.cost > 0 && !skinData.secret) {
                skinItem.addEventListener('click', () => {
                    this.buySkin(skinId, skinData.cost);
                });
                skinItem.addEventListener('touchend', () => {
                    this.buySkin(skinId, skinData.cost);
                });
            }

            // Add hover tooltip for secret skins
            if (skinId === 'voltz') {
                skinItem.title = 'Only for devs';
            }
            if (skinId === 'sparkles') {
                skinItem.title = 'Only for devs';
            }

            skinsGrid.appendChild(skinItem);
        });
    }

    // Select a skin
    selectSkin(skinId) {
        if (scoreStorage.setCurrentSkin(skinId)) {
            this.populateSkins(); // Refresh display
            this.showNotification(`🎨 ${scoreStorage.getSkins()[skinId].name} skin selected!`, 'success');
        }
    }

    // Buy a skin
    buySkin(skinId, cost) {
        if (scoreStorage.spendCoins(cost)) {
            if (scoreStorage.unlockSkin(skinId)) {
                this.updateCoinsDisplay();
                this.populateSkins(); // Refresh display
                this.showNotification(`🎉 ${scoreStorage.getSkins()[skinId].name} skin purchased!`, 'success');
            }
        } else {
            this.showNotification('💰 Not enough coins!', 'error');
        }
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10001;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            color: white;
            text-align: center;
            max-width: 90vw;
            word-wrap: break-word;
            animation: notificationSlideIn 0.3s ease-out;
        `;

        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(45deg, #4CAF50, #388E3C)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(45deg, #F44336, #D32F2F)';
                break;
            default:
                notification.style.background = 'linear-gradient(45deg, #2196F3, #1976D2)';
        }

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'notificationSlideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    // Initialize UI
    initialize() {
        this.clearDifficultySelection();
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
        
        // Check for death-based achievements only (score achievements are checked immediately)
        const achievements = scoreStorage.getAchievements();
        const deathCount = scoreStorage.getDeathCount();
        
        // Check 10 deaths achievement
        if (deathCount >= 10 && !achievements.deaths_10) {
            scoreStorage.unlockAchievement('deaths_10');
            this.showAchievementNotification(
                '🏆 Achievement Unlocked!',
                '💀 Persistence: Die 10 times'
            );
        }
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

        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'achievementSlideOut 0.5s ease-in forwards';
                setTimeout(() => {
                    notification.remove();
                }, 500);
            }
        }, 5000);
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
            // Easy achievements
            {
                id: 'getting_started',
                icon: '⭐',
                title: 'Getting Started',
                description: 'Score 5+ points on any difficulty',
                unlocked: scoreStorage.isAchievementUnlocked('getting_started'),
                secret: false
            },
            {
                id: 'first_steps',
                icon: '🎮',
                title: 'First Steps',
                description: 'Play 5 games total',
                unlocked: scoreStorage.isAchievementUnlocked('first_steps'),
                secret: false
            },
            {
                id: 'explorer',
                icon: '🗺️',
                title: 'Explorer',
                description: 'Play on all difficulty levels',
                unlocked: scoreStorage.isAchievementUnlocked('explorer'),
                secret: false
            },
            // Medium achievements
            {
                id: 'custom_mode',
                icon: '🎯',
                title: 'High Scorer',
                description: 'Score 20+ points on any difficulty',
                unlocked: scoreStorage.isAchievementUnlocked('custom_mode'),
                secret: false
            },
            {
                id: 'deaths_10',
                icon: '💀',
                title: 'Persistence',
                description: 'Die 10 times',
                unlocked: scoreStorage.isAchievementUnlocked('deaths_10'),
                secret: false
            },
            {
                id: 'skilled_player',
                icon: '🎯',
                title: 'Skilled Player',
                description: 'Score 50+ points on any difficulty',
                unlocked: scoreStorage.isAchievementUnlocked('skilled_player'),
                secret: false
            },
            {
                id: 'survivor',
                icon: '⏱️',
                title: 'Survivor',
                description: 'Survive for 60 seconds in one game',
                unlocked: scoreStorage.isAchievementUnlocked('survivor'),
                secret: false
            },
            {
                id: 'dedicated',
                icon: '🏃',
                title: 'Dedicated',
                description: 'Play 25 games total',
                unlocked: scoreStorage.isAchievementUnlocked('dedicated'),
                secret: false
            },
            {
                id: 'climbing_ranks',
                icon: '📈',
                title: 'Climbing the Ranks',
                description: 'Beat your own high score 3 times',
                unlocked: scoreStorage.isAchievementUnlocked('climbing_ranks'),
                secret: false
            },
            // Hard achievements
            {
                id: 'centurion',
                icon: '💯',
                title: 'Centurion',
                description: 'Score 100+ points on any difficulty',
                unlocked: scoreStorage.isAchievementUnlocked('centurion'),
                secret: false
            },
            {
                id: 'hard_mode_master',
                icon: '💪',
                title: 'Demon Master',
                description: 'Score 30+ on Demon difficulty',
                unlocked: scoreStorage.isAchievementUnlocked('hard_mode_master'),
                secret: false
            },
            // Secret achievements
            {
                id: 'speed_runner',
                icon: '⚡',
                title: 'Speed Runner (Wrong Way)',
                description: 'Die within 3 seconds, 5 times total',
                unlocked: scoreStorage.isAchievementUnlocked('speed_runner'),
                secret: true
            },
            {
                id: 'the_answer',
                icon: '🤖',
                title: 'The Answer',
                description: 'Score exactly 42 points',
                unlocked: scoreStorage.isAchievementUnlocked('the_answer'),
                secret: true
            },
            {
                id: 'completionist',
                icon: '👑',
                title: 'Completionist',
                description: 'Unlock all other achievements',
                unlocked: scoreStorage.isAchievementUnlocked('completionist'),
                secret: true
            }
        ];

        achievementsList.innerHTML = achievements.map(achievement => {
            const isSecret = achievement.secret && !achievement.unlocked;
            return `
                <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'} ${achievement.secret ? 'secret' : ''}">
                    <span class="achievement-icon">${isSecret ? '???' : achievement.icon}</span>
                    <h3 class="achievement-title">${isSecret ? '???' : achievement.title}</h3>
                    <p class="achievement-description">${isSecret ? 'Secret achievement - unlock to reveal!' : achievement.description}</p>
                    <span class="achievement-status ${achievement.unlocked ? 'unlocked' : 'locked'}">
                        ${achievement.unlocked ? '✓ Unlocked' : '🔒 Locked'}
                    </span>
                </div>
            `;
        }).join('');
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
