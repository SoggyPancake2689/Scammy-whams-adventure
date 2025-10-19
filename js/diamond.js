// Diamond player class
class Diamond {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        this.size = CONSTANTS.DIAMOND.SIZE;
        this.isAlive = true;
        this.glowPhase = 0;
        this.isNearObstacle = false;
        this.proximityGlowIntensity = 0;
    }

    // Update only visual effects (no physics) - used during countdown
    updateVisuals(deltaTime) {
        if (!this.isAlive) return;

        // Update rotation based on velocity (but don't change velocity)
        this.rotation += CONSTANTS.DIAMOND.ROTATION_SPEED * deltaTime;
        
        // Update glow animation
        this.glowPhase += deltaTime * 3;
    }

    // Apply physics update
    update(deltaTime, difficulty) {
        if (!this.isAlive) return;

        // Apply gravity
        this.vy += difficulty.gravity * deltaTime;
        
        // Update position
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        
        // Update rotation based on velocity
        this.rotation += CONSTANTS.DIAMOND.ROTATION_SPEED * deltaTime;
        
        // Update glow animation
        this.glowPhase += deltaTime * 3;
        
        // Check boundaries - constrain position but don't kill diamond
        if (this.y < this.size / 2) {
            this.y = this.size / 2;
            this.vy = 0;
        }
        
        if (this.y > CONSTANTS.CANVAS_HEIGHT - this.size / 2) {
            this.y = CONSTANTS.CANVAS_HEIGHT - this.size / 2;
            this.vy = 0;
        }
    }

    // Make the diamond flap upward
    flap(difficulty) {
        if (!this.isAlive) return;
        this.vy = difficulty.flapVelocity;
        console.log(`Diamond flapped! New velocity: ${this.vy}`);
    }

    // Draw the diamond with gradient and glow effect
    draw(ctx) {
        if (!this.isAlive) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Create base glow effect
        const baseGlowIntensity = CONSTANTS.DIAMOND.GLOW_INTENSITY * (0.5 + 0.5 * Math.sin(this.glowPhase));
        
        // Enhanced glow when near obstacles
        const proximityGlowMultiplier = this.isNearObstacle ? 3.0 : 1.0;
        const proximityColorIntensity = this.isNearObstacle ? 0.8 : 0.3;
        
        const totalGlowIntensity = baseGlowIntensity * proximityGlowMultiplier;
        const glowSize = this.size * (this.isNearObstacle ? 3.5 : 2);
        
        // Outer glow with enhanced effect when near obstacles
        const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, glowSize);
        
        if (this.isNearObstacle) {
            // Enhanced red/orange glow when near obstacles (danger warning)
            glowGradient.addColorStop(0, `rgba(255, 100, 100, ${totalGlowIntensity * proximityColorIntensity})`);
            glowGradient.addColorStop(0.3, `rgba(255, 150, 50, ${totalGlowIntensity * proximityColorIntensity * 0.7})`);
            glowGradient.addColorStop(0.6, `rgba(255, 200, 100, ${totalGlowIntensity * proximityColorIntensity * 0.4})`);
            glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        } else {
            // Normal golden glow
            glowGradient.addColorStop(0, `rgba(255, 215, 0, ${totalGlowIntensity * 0.3})`);
            glowGradient.addColorStop(0.5, `rgba(255, 165, 0, ${totalGlowIntensity * 0.2})`);
            glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        }
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Diamond gradient
        const diamondGradient = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
        diamondGradient.addColorStop(0, CONSTANTS.COLORS.DIAMOND_GRADIENT[0]);
        diamondGradient.addColorStop(0.5, CONSTANTS.COLORS.DIAMOND_GRADIENT[1]);
        diamondGradient.addColorStop(1, CONSTANTS.COLORS.DIAMOND_GRADIENT[2]);
        
        ctx.fillStyle = diamondGradient;
        ctx.beginPath();
        
        // Draw diamond shape (rotated square)
        const halfSize = this.size / 2;
        ctx.moveTo(0, -halfSize);
        ctx.lineTo(halfSize, 0);
        ctx.lineTo(0, halfSize);
        ctx.lineTo(-halfSize, 0);
        ctx.closePath();
        ctx.fill();
        
        // Add bright outline for better visibility
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Add highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.moveTo(-halfSize * 0.3, -halfSize * 0.3);
        ctx.lineTo(halfSize * 0.3, -halfSize * 0.3);
        ctx.lineTo(0, halfSize * 0.3);
        ctx.closePath();
        ctx.fill();

        // Add border
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    // Check collision with rectangle
    checkCollision(rect) {
        if (!this.isAlive) return false;

        // Simple circle-rectangle collision
        const closestX = Math.max(rect.x, Math.min(this.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(this.y, rect.y + rect.height));
        
        const distanceX = this.x - closestX;
        const distanceY = this.y - closestY;
        const distanceSquared = distanceX * distanceX + distanceY * distanceY;
        
        return distanceSquared < (this.size / 2) * (this.size / 2);
    }

    // Check proximity to obstacles and update glow effect
    checkProximityToObstacles(obstacles) {
        this.isNearObstacle = false;
        this.proximityGlowIntensity = 0;
        
        if (!this.isAlive) return;
        
        const proximityThreshold = 80; // Distance threshold for proximity detection
        
        for (const obstacle of obstacles) {
            // Check distance to top obstacle
            const topObstacleDistance = this.getDistanceToRect({
                x: obstacle.x,
                y: 0,
                width: obstacle.width,
                height: obstacle.topHeight
            });
            
            // Check distance to bottom obstacle
            const bottomObstacleDistance = this.getDistanceToRect({
                x: obstacle.x,
                y: obstacle.bottomY,
                width: obstacle.width,
                height: obstacle.bottomHeight
            });
            
            // Check if diamond is close to either obstacle part
            if (topObstacleDistance < proximityThreshold || bottomObstacleDistance < proximityThreshold) {
                this.isNearObstacle = true;
                // Calculate intensity based on distance (closer = more intense)
                const minDistance = Math.min(topObstacleDistance, bottomObstacleDistance);
                this.proximityGlowIntensity = Math.max(0, 1 - (minDistance / proximityThreshold));
                break; // Found proximity, no need to check other obstacles
            }
        }
    }
    
    // Calculate distance from diamond center to nearest point on rectangle
    getDistanceToRect(rect) {
        const closestX = Math.max(rect.x, Math.min(this.x, rect.x + rect.width));
        const closestY = Math.max(rect.y, Math.min(this.y, rect.y + rect.height));
        
        const distanceX = this.x - closestX;
        const distanceY = this.y - closestY;
        
        return Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    }

    // Reset diamond to starting position
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        this.isAlive = true;
        this.glowPhase = 0;
        this.isNearObstacle = false;
        this.proximityGlowIntensity = 0;
    }

    // Get center position
    getCenter() {
        return { x: this.x, y: this.y };
    }
}

// Make classes globally available
window.Diamond = Diamond;
