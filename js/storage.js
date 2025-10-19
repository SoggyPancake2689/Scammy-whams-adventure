// High score storage management
class ScoreStorage {
    constructor() {
        this.storageKey = CONSTANTS.STORAGE_KEY;
        this.defaultScores = {
            easy: 0,
            normal: 0,
            hard: 0
        };
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

    // Clear all high scores (for testing)
    clearHighScores() {
        try {
            localStorage.removeItem(this.storageKey);
            this.updateHighScoreDisplay();
        } catch (error) {
            console.warn('Error clearing high scores:', error);
        }
    }
}

// Create global instance
const scoreStorage = new ScoreStorage();

// Make scoreStorage globally available
window.scoreStorage = scoreStorage;
