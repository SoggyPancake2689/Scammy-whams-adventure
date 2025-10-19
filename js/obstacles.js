// Obstacle system with themed variants
class Obstacle {
    constructor(x, theme, gapSize, difficulty = 'normal') {
        this.x = x;
        this.theme = theme;
        this.width = CONSTANTS.OBSTACLE.WIDTH;
        this.gapSize = gapSize;
        
        // Add difficulty-based randomness to gap position
        const baseCenterY = CONSTANTS.CANVAS_HEIGHT / 2;
        
        // Difficulty-based variation multipliers
        const difficultyMultipliers = {
            'easy': 0.2,      // 20% of max variation (minimal gaps)
            'normal': 0.5,    // 50% of max variation (moderate gaps)
            'hard': 1.0,      // 100% of max variation (maximum gaps - very hard)
            'custom': 0.5     // 50% for custom (uses normal as base)
        };
        
        const baseMaxOffset = Math.min(80, (CONSTANTS.CANVAS_HEIGHT - gapSize) / 4);
        const multiplier = difficultyMultipliers[difficulty] || 0.6;
        const maxOffset = baseMaxOffset * multiplier;
        
        // Randomize centerY based on difficulty multiplier
        const centerYVariation = (Math.random() - 0.5) * maxOffset;
        const centerY = baseCenterY + centerYVariation;
        
        this.gapY = centerY + (Math.random() - 0.5) * maxOffset;
        
        // Ensure gap stays within bounds
        this.gapY = Math.max(
            CONSTANTS.OBSTACLE.MIN_HEIGHT + gapSize / 2,
            Math.min(
                CONSTANTS.CANVAS_HEIGHT - CONSTANTS.OBSTACLE.MIN_HEIGHT - gapSize / 2,
                this.gapY
            )
        );
        
        this.topHeight = this.gapY - gapSize / 2;
        this.bottomY = this.gapY + gapSize / 2;
        
        // Add random height variation to bottom obstacle
        const maxHeightVariation = 100; // Maximum pixels to vary bottom height
        const heightVariation = (Math.random() - 0.5) * maxHeightVariation;
        this.bottomY += heightVariation;
        
        // Ensure bottom obstacle stays within bounds
        this.bottomY = Math.max(
            this.gapY + gapSize / 2, // Don't go above the gap
            Math.min(
                CONSTANTS.CANVAS_HEIGHT - CONSTANTS.OBSTACLE.MIN_HEIGHT, // Don't go below minimum height
                this.bottomY
            )
        );
        
        this.bottomHeight = CONSTANTS.CANVAS_HEIGHT - this.bottomY;
        
        this.colors = CONSTANTS.COLORS.OBSTACLE_COLORS[theme];
        this.passed = false;
        
        // RGB animation properties
        this.colorIndex = 0;
        this.colorTime = 0;
        this.colorSpeed = 0.3; // Color change speed (seconds per color)
    }

    update(deltaTime, speed) {
        this.x -= speed * deltaTime;
        
        // Update RGB color animation
        if (this.theme === 'rgb') {
            this.colorTime += deltaTime;
            if (this.colorTime >= this.colorSpeed) {
                this.colorTime = 0;
                this.colorIndex = (this.colorIndex + 1) % this.colors.length;
            }
        }
    }

    draw(ctx) {
        ctx.save();
        
        // Draw top obstacle
        this.drawObstaclePart(ctx, this.x, 0, this.width, this.topHeight, true);
        
        // Draw bottom obstacle
        this.drawObstaclePart(ctx, this.x, this.bottomY, this.width, this.bottomHeight, false);
        
        ctx.restore();
    }

    drawObstaclePart(ctx, x, y, width, height, isTop) {
        // Create gradient
        const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
        gradient.addColorStop(0, this.colors[0]);
        gradient.addColorStop(1, this.colors[1]);
        
        ctx.fillStyle = gradient;
        
        // Draw based on theme
        switch (this.theme) {
            case 'pipes':
                this.drawPipe(ctx, x, y, width, height, isTop);
                break;
            case 'rocks':
                this.drawRock(ctx, x, y, width, height);
                break;
            case 'crystals':
                this.drawCrystal(ctx, x, y, width, height);
                break;
            case 'lasers':
                this.drawLaser(ctx, x, y, width, height);
                break;
            case 'thorns':
                this.drawThorns(ctx, x, y, width, height);
                break;
            case 'buildings':
                this.drawBuilding(ctx, x, y, width, height);
                break;
            case 'grass':
                this.drawGrassBlock(ctx, x, y, width, height, isTop);
                break;
            case 'rainbow':
                this.drawRainbowBlock(ctx, x, y, width, height);
                break;
            case 'rgb':
                this.drawRGBBlock(ctx, x, y, width, height);
                break;
            default:
                this.drawRectangle(ctx, x, y, width, height);
        }
        
        // Add shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(x + 3, y + 3, width, height);
        
        // Reset fill style and redraw main shape
        ctx.fillStyle = gradient;
        switch (this.theme) {
            case 'pipes':
                this.drawPipe(ctx, x, y, width, height, isTop);
                break;
            case 'rocks':
                this.drawRock(ctx, x, y, width, height);
                break;
            case 'crystals':
                this.drawCrystal(ctx, x, y, width, height);
                break;
            case 'lasers':
                this.drawLaser(ctx, x, y, width, height);
                break;
            case 'thorns':
                this.drawThorns(ctx, x, y, width, height);
                break;
            case 'buildings':
                this.drawBuilding(ctx, x, y, width, height);
                break;
            case 'grass':
                this.drawGrassBlock(ctx, x, y, width, height, isTop);
                break;
            case 'rainbow':
                this.drawRainbowBlock(ctx, x, y, width, height);
                break;
            case 'rgb':
                this.drawRGBBlock(ctx, x, y, width, height);
                break;
        }
    }

    drawPipe(ctx, x, y, width, height, isTop) {
        // Draw simple rectangle
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    drawRock(ctx, x, y, width, height) {
        // Draw simple rectangle
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    drawCrystal(ctx, x, y, width, height) {
        // Draw simple rectangle
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    drawLaser(ctx, x, y, width, height) {
        // Draw simple rectangle
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    drawThorns(ctx, x, y, width, height) {
        // Draw simple rectangle
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    drawBuilding(ctx, x, y, width, height) {
        // Draw simple rectangle
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    drawGrassBlock(ctx, x, y, width, height, isTop) {
        // Draw simple rectangle
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    drawRainbowBlock(ctx, x, y, width, height) {
        // Draw rainbow gradient rectangle
        const gradient = ctx.createLinearGradient(x, y, x + width, y);
        const colors = this.colors; // Rainbow colors array
        
        for (let i = 0; i < colors.length; i++) {
            gradient.addColorStop(i / (colors.length - 1), colors[i]);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    drawRGBBlock(ctx, x, y, width, height) {
        // Calculate smooth color transition
        const progress = this.colorTime / this.colorSpeed; // 0 to 1
        const currentColorIndex = this.colorIndex;
        const nextColorIndex = (this.colorIndex + 1) % this.colors.length;
        
        // Get current and next colors
        const currentColor = this.colors[currentColorIndex];
        const nextColor = this.colors[nextColorIndex];
        
        // Interpolate between colors for smooth transition
        const interpolatedColor = this.interpolateColor(currentColor, nextColor, progress);
        
        // Draw main rectangle with interpolated color
        ctx.fillStyle = interpolatedColor;
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Add glow effect for RGB blocks with interpolated color
        ctx.shadowColor = interpolatedColor;
        ctx.shadowBlur = 10;
        ctx.fillStyle = interpolatedColor;
        ctx.fillRect(x - 2, y - 2, width + 4, height + 4);
        
        // Reset shadow
        ctx.shadowBlur = 0;
    }
    
    interpolateColor(color1, color2, progress) {
        // Parse hex colors to RGB
        const rgb1 = this.hexToRgb(color1);
        const rgb2 = this.hexToRgb(color2);
        
        // Interpolate each component
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);
        
        // Convert back to hex
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    
    hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse hex to RGB
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        return { r, g, b };
    }

    drawRectangle(ctx, x, y, width, height) {
        // Generic rectangle drawing method
        ctx.fillRect(x, y, width, height);
        
        // Add outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    }

    isOffScreen() {
        return this.x + this.width < 0;
    }

    checkCollision(diamond) {
        // Check collision with top obstacle
        if (diamond.checkCollision({
            x: this.x,
            y: 0,
            width: this.width,
            height: this.topHeight
        })) {
            return true;
        }
        
        // Check collision with bottom obstacle
        if (diamond.checkCollision({
            x: this.x,
            y: this.bottomY,
            width: this.width,
            height: this.bottomHeight
        })) {
            return true;
        }
        
        return false;
    }

    markPassed() {
        this.passed = true;
    }

    hasPassed() {
        return this.passed;
    }
}

class ObstacleManager {
    constructor() {
        this.obstacles = [];
        this.lastSpawnTime = 0;
        this.currentDifficulty = CONSTANTS.DIFFICULTY.NORMAL;
        this.totalScore = 0; // Track total score separately
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
    }

    update(deltaTime, diamond) {
        const now = Date.now();
        
        // Spawn new obstacles
        if (now - this.lastSpawnTime > this.currentDifficulty.spawnInterval) {
            this.spawnObstacle();
            this.lastSpawnTime = now;
        }
        
        // Update existing obstacles
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.update(deltaTime, this.currentDifficulty.obstacleSpeed);
            
            // Check if diamond passed this obstacle
            if (!obstacle.hasPassed() && diamond.x > obstacle.x + obstacle.width) {
                obstacle.markPassed();
                this.totalScore++; // Increment total score
                console.log(`Obstacle passed! Total score: ${this.totalScore}`);
            }
            
            // Remove off-screen obstacles
            if (obstacle.isOffScreen()) {
                this.obstacles.splice(i, 1);
            }
        }
    }

    spawnObstacle() {
        const theme = CONSTANTS.OBSTACLE.THEMES[Math.floor(Math.random() * CONSTANTS.OBSTACLE.THEMES.length)];
        const difficulty = this.currentDifficulty.name || 'normal';
        const obstacle = new Obstacle(CONSTANTS.CANVAS_WIDTH, theme, this.currentDifficulty.gapSize, difficulty);
        this.obstacles.push(obstacle);
    }

    draw(ctx) {
        this.obstacles.forEach(obstacle => obstacle.draw(ctx));
    }

    checkCollisions(diamond) {
        return this.obstacles.some(obstacle => obstacle.checkCollision(diamond));
    }

    getPassedObstacles() {
        return this.obstacles.filter(obstacle => obstacle.hasPassed());
    }

    getTotalScore() {
        return this.totalScore;
    }

    clear() {
        this.obstacles = [];
        this.lastSpawnTime = 0;
        this.totalScore = 0; // Reset score when clearing
    }
}

// Make classes globally available
window.ObstacleManager = ObstacleManager;
