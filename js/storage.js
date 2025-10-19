// High score storage management
class ScoreStorage {
    constructor() {
        this.storageKey = CONSTANTS.STORAGE_KEY;
        this.defaultScores = {
            easy: 0,
            normal: 0,
            hard: 0
        };
        this.unlockKey = 'diamondFlappyCustomUnlocked';
        this.achievementsKey = 'diamondFlappyAchievements';
        this.deathCountKey = 'diamondFlappyDeathCount';
        this.gamesPlayedKey = 'diamondFlappyGamesPlayed';
        this.difficultiesPlayedKey = 'diamondFlappyDifficultiesPlayed';
        this.highScoreBeatStreakKey = 'diamondFlappyHighScoreBeatStreak';
        this.bestSurvivalTimeKey = 'diamondFlappyBestSurvivalTime';
        this.quickDeathsKey = 'diamondFlappyQuickDeaths';
        this.coinsKey = 'diamondFlappyCoins';
        this.skinsKey = 'diamondFlappySkins';
        this.currentSkinKey = 'diamondFlappyCurrentSkin';
    }

    // Get all high scores
    getHighScores() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const scores = JSON.parse(stored);
                return { ...this.defaultScores, ...scores };
            }
        } catch (error) {
            console.warn('Error loading high scores:', error);
        }
        return { ...this.defaultScores };
    }

    // Get high score for specific difficulty
    getHighScore(difficulty) {
        const scores = this.getHighScores();
        return scores[difficulty] || 0;
    }

    // Save high score for specific difficulty
    saveHighScore(difficulty, score) {
        try {
            const scores = this.getHighScores();
            if (score > scores[difficulty]) {
                scores[difficulty] = score;
                localStorage.setItem(this.storageKey, JSON.stringify(scores));
                return true; // New high score
            }
        } catch (error) {
            console.warn('Error saving high score:', error);
        }
        return false; // Not a new high score
    }

    // Update UI with current high scores
    updateHighScoreDisplay() {
        const scores = this.getHighScores();
        document.getElementById('easyHighScore').textContent = scores.easy;
        document.getElementById('normalHighScore').textContent = scores.normal;
        document.getElementById('hardHighScore').textContent = scores.hard;
    }

    // Check if custom mode is unlocked
    isCustomModeUnlocked() {
        try {
            return localStorage.getItem(this.unlockKey) === 'true';
        } catch (error) {
            console.warn('Error checking custom mode unlock status:', error);
            return false;
        }
    }
    
    // Unlock custom mode
    unlockCustomMode() {
        try {
            localStorage.setItem(this.unlockKey, 'true');
            return true;
        } catch (error) {
            console.warn('Error unlocking custom mode:', error);
            return false;
        }
    }
    
    // Check if any difficulty has score >= 20
    checkCustomModeUnlock() {
        const scores = this.getHighScores();
        const hasHighScore = Object.values(scores).some(score => score >= 20);
        
        if (hasHighScore && !this.isCustomModeUnlocked()) {
            this.unlockCustomMode();
            return true; // Just unlocked
        }
        
        return false; // Already unlocked or not eligible
    }

    // Clear all high scores (for testing)
    clearHighScores() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.unlockKey);
            localStorage.removeItem(this.achievementsKey);
            localStorage.removeItem(this.deathCountKey);
            localStorage.removeItem(this.gamesPlayedKey);
            localStorage.removeItem(this.difficultiesPlayedKey);
            localStorage.removeItem(this.highScoreBeatStreakKey);
            localStorage.removeItem(this.bestSurvivalTimeKey);
            localStorage.removeItem(this.quickDeathsKey);
            localStorage.removeItem(this.coinsKey);
            localStorage.removeItem(this.skinsKey);
            localStorage.removeItem(this.currentSkinKey);
            this.updateHighScoreDisplay();
        } catch (error) {
            console.warn('Error clearing high scores:', error);
        }
    }

    // Coin system
    getCoins() {
        try {
            const stored = localStorage.getItem(this.coinsKey);
            return stored ? parseInt(stored) : 0;
        } catch (error) {
            console.warn('Error loading coins:', error);
            return 0;
        }
    }

    addCoins(amount) {
        try {
            const currentCoins = this.getCoins();
            const newAmount = currentCoins + amount;
            localStorage.setItem(this.coinsKey, newAmount.toString());
            return newAmount;
        } catch (error) {
            console.warn('Error adding coins:', error);
            return this.getCoins();
        }
    }

    spendCoins(amount) {
        try {
            const currentCoins = this.getCoins();
            if (currentCoins >= amount) {
                const newAmount = currentCoins - amount;
                localStorage.setItem(this.coinsKey, newAmount.toString());
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Error spending coins:', error);
            return false;
        }
    }

    // Skin system
    getSkins() {
        try {
            const stored = localStorage.getItem(this.skinsKey);
            let skins = {};
            if (stored) {
                skins = JSON.parse(stored);
            }
            
            // Ensure all default skins exist (merge with stored data)
            const defaultSkins = {
                'default': { name: 'Default', unlocked: true, cost: 0 },
                'rainbow': { name: 'Rainbow', unlocked: false, cost: 10 },
                'fire': { name: 'Fire', unlocked: false, cost: 15 },
                'ice': { name: 'Ice', unlocked: false, cost: 20 },
                'sparkles': { name: 'Sparkles', unlocked: false, cost: 25, secret: true },
                'voltz': { name: 'Voltz', unlocked: false, cost: 0, secret: true }
            };
            
            // Merge stored skins with defaults (stored takes precedence)
            const mergedSkins = { ...defaultSkins, ...skins };
            
            // Save merged skins back to localStorage to ensure all skins are present
            localStorage.setItem(this.skinsKey, JSON.stringify(mergedSkins));
            
            return mergedSkins;
        } catch (error) {
            console.warn('Error loading skins:', error);
            // Return default skins if there's an error
            return {
                'default': { name: 'Default', unlocked: true, cost: 0 },
                'rainbow': { name: 'Rainbow', unlocked: false, cost: 10 },
                'fire': { name: 'Fire', unlocked: false, cost: 15 },
                'ice': { name: 'Ice', unlocked: false, cost: 20 },
                'sparkles': { name: 'Sparkles', unlocked: false, cost: 25, secret: true },
                'voltz': { name: 'Voltz', unlocked: false, cost: 0, secret: true }
            };
        }
    }

    unlockSkin(skinId) {
        try {
            const skins = this.getSkins();
            if (skins[skinId]) {
                skins[skinId].unlocked = true;
                localStorage.setItem(this.skinsKey, JSON.stringify(skins));
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Error unlocking skin:', error);
            return false;
        }
    }

    getCurrentSkin() {
        try {
            const stored = localStorage.getItem(this.currentSkinKey);
            return stored || 'default';
        } catch (error) {
            console.warn('Error loading current skin:', error);
            return 'default';
        }
    }

    setCurrentSkin(skinId) {
        try {
            const skins = this.getSkins();
            if (skins[skinId] && skins[skinId].unlocked) {
                localStorage.setItem(this.currentSkinKey, skinId);
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Error setting current skin:', error);
            return false;
        }
    }

    // Secret code system
    checkSecretCode(code) {
        if (code === '123') {
            this.unlockSkin('voltz');
            return true;
        }
        if (code === 'ga') {
            this.unlockSkin('sparkles');
            return true;
        }
        return false;
    }

    // Achievement system
    getAchievements() {
        try {
            const stored = localStorage.getItem(this.achievementsKey);
            return stored ? JSON.parse(stored) : {};
        } catch (error) {
            console.warn('Error loading achievements:', error);
            return {};
        }
    }

    unlockAchievement(achievementId) {
        try {
            const achievements = this.getAchievements();
            if (!achievements[achievementId]) {
                achievements[achievementId] = true;
                localStorage.setItem(this.achievementsKey, JSON.stringify(achievements));
                // Give 5 coins for each achievement
                this.addCoins(5);
                return true;
            }
            return false;
        } catch (error) {
            console.warn('Error unlocking achievement:', error);
            return false;
        }
    }

    isAchievementUnlocked(achievementId) {
        const achievements = this.getAchievements();
        return achievements[achievementId] || false;
    }

    // Death tracking
    getDeathCount() {
        try {
            const stored = localStorage.getItem(this.deathCountKey);
            return stored ? parseInt(stored) : 0;
        } catch (error) {
            console.warn('Error loading death count:', error);
            return 0;
        }
    }

    incrementDeathCount() {
        try {
            const currentCount = this.getDeathCount();
            const newCount = currentCount + 1;
            localStorage.setItem(this.deathCountKey, newCount.toString());
            return newCount;
        } catch (error) {
            console.warn('Error incrementing death count:', error);
            return 0;
        }
    }

    checkAchievements() {
        const achievements = this.getAchievements();
        const deathCount = this.getDeathCount();
        const scores = this.getHighScores();
        
        const newAchievements = [];

        // Check 10 deaths achievement
        if (deathCount >= 10 && !achievements.deaths_10) {
            this.unlockAchievement('deaths_10');
            newAchievements.push({
                id: 'deaths_10',
                title: '💀 Persistence',
                description: 'Die 10 times'
            });
        }

        // Check custom mode achievement (if not already unlocked)
        const hasHighScore = Object.values(scores).some(score => score >= 20);
        if (hasHighScore && !achievements.custom_mode) {
            this.unlockAchievement('custom_mode');
            newAchievements.push({
                id: 'custom_mode',
                title: '🎯 High Scorer',
                description: 'Score 20+ points on any difficulty'
            });
        }

        return newAchievements;
    }

    // Check achievements immediately when score is updated
    checkAchievementsOnScoreUpdate(difficulty, score) {
        const achievements = this.getAchievements();
        const newAchievements = [];

        // Check high scorer achievement immediately when score reaches 20+
        if (score >= 20 && !achievements.custom_mode) {
            this.unlockAchievement('custom_mode');
            newAchievements.push({
                id: 'custom_mode',
                title: '🎯 High Scorer',
                description: 'Score 20+ points on any difficulty'
            });
        }

        // Check getting started achievement (5+ points)
        if (score >= 5 && !achievements.getting_started) {
            this.unlockAchievement('getting_started');
            newAchievements.push({
                id: 'getting_started',
                title: '⭐ Getting Started',
                description: 'Score 5+ points on any difficulty'
            });
        }

        // Check skilled player achievement (50+ points)
        if (score >= 50 && !achievements.skilled_player) {
            this.unlockAchievement('skilled_player');
            newAchievements.push({
                id: 'skilled_player',
                title: '🎯 Skilled Player',
                description: 'Score 50+ points on any difficulty'
            });
        }

        // Check centurion achievement (100+ points)
        if (score >= 100 && !achievements.centurion) {
            this.unlockAchievement('centurion');
            newAchievements.push({
                id: 'centurion',
                title: '💯 Centurion',
                description: 'Score 100+ points on any difficulty'
            });
        }

        // Check the answer achievement (exactly 42 points)
        if (score === 42 && !achievements.the_answer) {
            this.unlockAchievement('the_answer');
            newAchievements.push({
                id: 'the_answer',
                title: '🤖 The Answer',
                description: 'Score exactly 42 points'
            });
        }

        // Check hard mode master achievement (30+ on hard)
        if (difficulty === 'hard' && score >= 30 && !achievements.hard_mode_master) {
            this.unlockAchievement('hard_mode_master');
            newAchievements.push({
                id: 'hard_mode_master',
                title: '💪 Demon Master',
                description: 'Score 30+ on Demon difficulty'
            });
        }

        return newAchievements;
    }

    // Games played tracking
    getGamesPlayed() {
        try {
            const stored = localStorage.getItem(this.gamesPlayedKey);
            return stored ? parseInt(stored) : 0;
        } catch (error) {
            console.warn('Error loading games played:', error);
            return 0;
        }
    }

    incrementGamesPlayed() {
        try {
            const currentCount = this.getGamesPlayed();
            const newCount = currentCount + 1;
            localStorage.setItem(this.gamesPlayedKey, newCount.toString());
            return newCount;
        } catch (error) {
            console.warn('Error incrementing games played:', error);
            return 0;
        }
    }

    // Difficulty tracking
    getDifficultiesPlayed() {
        try {
            const stored = localStorage.getItem(this.difficultiesPlayedKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.warn('Error loading difficulties played:', error);
            return [];
        }
    }

    recordDifficultyPlayed(difficulty) {
        try {
            const difficulties = this.getDifficultiesPlayed();
            if (!difficulties.includes(difficulty)) {
                difficulties.push(difficulty);
                localStorage.setItem(this.difficultiesPlayedKey, JSON.stringify(difficulties));
            }
        } catch (error) {
            console.warn('Error recording difficulty played:', error);
        }
    }

    hasPlayedAllDifficulties() {
        const difficulties = this.getDifficultiesPlayed();
        return ['easy', 'normal', 'hard', 'custom'].every(d => difficulties.includes(d));
    }

    // High score beat streak tracking
    getHighScoreBeatStreak() {
        try {
            const stored = localStorage.getItem(this.highScoreBeatStreakKey);
            return stored ? parseInt(stored) : 0;
        } catch (error) {
            console.warn('Error loading high score beat streak:', error);
            return 0;
        }
    }

    incrementHighScoreBeatStreak() {
        try {
            const currentStreak = this.getHighScoreBeatStreak();
            const newStreak = currentStreak + 1;
            localStorage.setItem(this.highScoreBeatStreakKey, newStreak.toString());
            return newStreak;
        } catch (error) {
            console.warn('Error incrementing high score beat streak:', error);
            return 0;
        }
    }

    resetHighScoreBeatStreak() {
        try {
            localStorage.setItem(this.highScoreBeatStreakKey, '0');
        } catch (error) {
            console.warn('Error resetting high score beat streak:', error);
        }
    }

    // Survival time tracking
    getBestSurvivalTime() {
        try {
            const stored = localStorage.getItem(this.bestSurvivalTimeKey);
            return stored ? parseFloat(stored) : 0;
        } catch (error) {
            console.warn('Error loading best survival time:', error);
            return 0;
        }
    }

    recordSurvivalTime(time) {
        try {
            const bestTime = this.getBestSurvivalTime();
            if (time > bestTime) {
                localStorage.setItem(this.bestSurvivalTimeKey, time.toString());
            }
        } catch (error) {
            console.warn('Error recording survival time:', error);
        }
    }

    // Quick death tracking
    getQuickDeathCount() {
        try {
            const stored = localStorage.getItem(this.quickDeathsKey);
            return stored ? parseInt(stored) : 0;
        } catch (error) {
            console.warn('Error loading quick death count:', error);
            return 0;
        }
    }

    incrementQuickDeath() {
        try {
            const currentCount = this.getQuickDeathCount();
            const newCount = currentCount + 1;
            localStorage.setItem(this.quickDeathsKey, newCount.toString());
            return newCount;
        } catch (error) {
            console.warn('Error incrementing quick death count:', error);
            return 0;
        }
    }

    // Check achievements on game start
    checkAchievementsOnGameStart() {
        const achievements = this.getAchievements();
        const newAchievements = [];
        const gamesPlayed = this.getGamesPlayed();

        // Check first steps achievement (5 games)
        if (gamesPlayed >= 5 && !achievements.first_steps) {
            this.unlockAchievement('first_steps');
            newAchievements.push({
                id: 'first_steps',
                title: '🎮 First Steps',
                description: 'Play 5 games total'
            });
        }

        // Check dedicated achievement (25 games)
        if (gamesPlayed >= 25 && !achievements.dedicated) {
            this.unlockAchievement('dedicated');
            newAchievements.push({
                id: 'dedicated',
                title: '🏃 Dedicated',
                description: 'Play 25 games total'
            });
        }

        // Check explorer achievement (all difficulties)
        if (this.hasPlayedAllDifficulties() && !achievements.explorer) {
            this.unlockAchievement('explorer');
            newAchievements.push({
                id: 'explorer',
                title: '🗺️ Explorer',
                description: 'Play on all difficulty levels'
            });
        }

        return newAchievements;
    }

    // Check achievements on game over
    checkAchievementsOnGameOver(survivalTime, wasQuickDeath, isNewHighScore) {
        const achievements = this.getAchievements();
        const newAchievements = [];

        // Check survivor achievement (60+ seconds)
        if (survivalTime >= 60 && !achievements.survivor) {
            this.unlockAchievement('survivor');
            newAchievements.push({
                id: 'survivor',
                title: '⏱️ Survivor',
                description: 'Survive for 60 seconds in one game'
            });
        }

        // Check quick death achievement (5 deaths within 3 seconds)
        if (wasQuickDeath) {
            const quickDeaths = this.getQuickDeathCount();
            if (quickDeaths >= 5 && !achievements.speed_runner) {
                this.unlockAchievement('speed_runner');
                newAchievements.push({
                    id: 'speed_runner',
                    title: '⚡ Speed Runner (Wrong Way)',
                    description: 'Die within 3 seconds, 5 times total'
                });
            }
        }

        // Check high score beat streak achievement
        if (isNewHighScore) {
            const streak = this.incrementHighScoreBeatStreak();
            if (streak >= 3 && !achievements.climbing_ranks) {
                this.unlockAchievement('climbing_ranks');
                newAchievements.push({
                    id: 'climbing_ranks',
                    title: '📈 Climbing the Ranks',
                    description: 'Beat your own high score 3 times'
                });
            }
        } else {
            this.resetHighScoreBeatStreak();
        }

        // Check completionist achievement (all others unlocked)
        this.checkCompletionistAchievement(newAchievements);

        return newAchievements;
    }

    // Check if all other achievements are unlocked for completionist
    checkCompletionistAchievement(newAchievements) {
        const achievements = this.getAchievements();
        
        if (achievements.completionist) return; // Already unlocked

        const requiredAchievements = [
            'deaths_10', 'custom_mode', 'getting_started', 'skilled_player',
            'centurion', 'the_answer', 'hard_mode_master', 'first_steps',
            'dedicated', 'explorer', 'survivor', 'speed_runner', 'climbing_ranks'
        ];

        const allUnlocked = requiredAchievements.every(id => achievements[id]);

        if (allUnlocked) {
            this.unlockAchievement('completionist');
            newAchievements.push({
                id: 'completionist',
                title: '👑 Completionist',
                description: 'Unlock all other achievements'
            });
        }
    }
}

// Create global instance
const scoreStorage = new ScoreStorage();

// Make scoreStorage globally available
window.scoreStorage = scoreStorage;
