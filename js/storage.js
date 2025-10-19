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
            this.updateHighScoreDisplay();
        } catch (error) {
            console.warn('Error clearing high scores:', error);
        }
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
            achievements[achievementId] = true;
            localStorage.setItem(this.achievementsKey, JSON.stringify(achievements));
            return true;
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
}

// Create global instance
const scoreStorage = new ScoreStorage();

// Make scoreStorage globally available
window.scoreStorage = scoreStorage;
