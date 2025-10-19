// Obstacle system with themed variants
class Obstacle {
    constructor(x, theme, gapSize) {
        this.x = x;
        this.theme = theme;
        this.width = CONSTANTS.OBSTACLE.WIDTH;
        this.gapSize = gapSize;
        this.gapY = CONSTANTS.CANVAS_HEIGHT / 2 + (Math.random() - 0.5) * 100;
        
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
        this.bottomHeight = CONSTANTS.CANVAS_HEIGHT - this.bottomY;
        
        this.colors = CONSTANTS.COLORS.OBSTACLE_COLORS[theme];
        this.passed = false;
    }

    update(deltaTime, speed) {
        this.x -= speed * deltaTime;
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
            default:
                this.drawPipe(ctx, x, y, width, height, isTop);
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
        }
    }

    drawPipe(ctx, x, y, width, height, isTop) {
        // Draw pipe with rounded edges
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x, y, width, height, 10);
        } else {
            // Fallback for browsers without roundRect
            ctx.rect(x, y, width, height);
        }
        ctx.fill();
        
        // Add pipe cap
        ctx.fillStyle = this.colors[1];
        ctx.beginPath();
        if (ctx.roundRect) {
            ctx.roundRect(x - 5, isTop ? y + height - 15 : y, width + 10, 15, 5);
        } else {
            ctx.rect(x - 5, isTop ? y + height - 15 : y, width + 10, 15);
        }
        ctx.fill();
    }

    drawRock(ctx, x, y, width, height) {
        // Draw irregular rock shape
        ctx.beginPath();
        ctx.moveTo(x, y + height * 0.2);
        ctx.lineTo(x + width * 0.3, y);
        ctx.lineTo(x + width * 0.7, y + height * 0.1);
        ctx.lineTo(x + width, y + height * 0.3);
        ctx.lineTo(x + width * 0.8, y + height);
        ctx.lineTo(x + width * 0.2, y + height * 0.9);
        ctx.lineTo(x, y + height);
        ctx.closePath();
        ctx.fill();
    }

    drawCrystal(ctx, x, y, width, height) {
        // Draw crystal shape
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width, y + height * 0.3);
        ctx.lineTo(x + width * 0.8, y + height);
        ctx.lineTo(x + width * 0.2, y + height);
        ctx.lineTo(x, y + height * 0.3);
        ctx.closePath();
        ctx.fill();
        
        // Add crystal highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.moveTo(x + width / 2, y);
        ctx.lineTo(x + width * 0.6, y + height * 0.3);
        ctx.lineTo(x + width * 0.5, y + height);
        ctx.lineTo(x + width * 0.3, y + height * 0.3);
        ctx.closePath();
        ctx.fill();
    }

    drawLaser(ctx, x, y, width, height) {
        // Draw laser beam
        ctx.fillRect(x, y, width, height);
        
        // Add laser glow
        ctx.fillStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.fillRect(x - 5, y, width + 10, height);
    }

    drawThorns(ctx, x, y, width, height) {
        // Draw thorny shape
        ctx.beginPath();
        ctx.moveTo(x, y + height);
        for (let i = 0; i < 5; i++) {
            const spikeX = x + (width / 4) * i;
            const spikeY = y + (i % 2 === 0 ? 0 : height * 0.3);
            ctx.lineTo(spikeX, spikeY);
        }
        ctx.lineTo(x + width, y + height);
        ctx.closePath();
        ctx.fill();
    }

    drawBuilding(ctx, x, y, width, height) {
        // Draw building with windows
        ctx.fillRect(x, y, width, height);
        
        // Add windows
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        const windowSize = 8;
        const windowSpacing = 15;
        
        for (let wy = y + 10; wy < y + height - 10; wy += windowSpacing) {
            for (let wx = x + 10; wx < x + width - 10; wx += windowSpacing) {
                ctx.fillRect(wx, wy, windowSize, windowSize);
            }
        }
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
        const obstacle = new Obstacle(CONSTANTS.CANVAS_WIDTH, theme, this.currentDifficulty.gapSize);
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
