// Animated background system
class Cloud {
    constructor(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
        this.opacity = 0.3 + Math.random() * 0.4;
    }

    update(deltaTime) {
        this.x -= this.speed * deltaTime;
        
        // Wrap around when off screen
        if (this.x < -this.size) {
            this.x = CONSTANTS.CANVAS_WIDTH + this.size;
            this.y = Math.random() * CONSTANTS.CANVAS_HEIGHT * 0.6;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#FFFFFF';
        
        // Draw cloud as multiple circles
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.arc(this.x + this.size * 0.8, this.y, this.size * 0.8, 0, Math.PI * 2);
        ctx.arc(this.x - this.size * 0.8, this.y, this.size * 0.8, 0, Math.PI * 2);
        ctx.arc(this.x, this.y - this.size * 0.6, this.size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}


class BackgroundSystem {
    constructor() {
        this.clouds = [];
        this.initializeElements();
    }

    initializeElements() {
        // Create clouds
        for (let i = 0; i < CONSTANTS.BACKGROUND.CLOUD_COUNT; i++) {
            const x = Math.random() * CONSTANTS.CANVAS_WIDTH;
            const y = Math.random() * CONSTANTS.CANVAS_HEIGHT * 0.6;
            const size = 20 + Math.random() * 30;
            const speed = CONSTANTS.BACKGROUND.CLOUD_SPEED * (0.5 + Math.random() * 0.5);
            
            this.clouds.push(new Cloud(x, y, size, speed));
        }

    }

    update(deltaTime) {
        this.clouds.forEach(cloud => cloud.update(deltaTime));
    }

    draw(ctx) {
        // Draw background gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, CONSTANTS.CANVAS_HEIGHT);
        gradient.addColorStop(0, CONSTANTS.COLORS.BACKGROUND_GRADIENT[0]);
        gradient.addColorStop(1, CONSTANTS.COLORS.BACKGROUND_GRADIENT[1]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, CONSTANTS.CANVAS_WIDTH, CONSTANTS.CANVAS_HEIGHT);
        
        // Draw clouds
        this.clouds.forEach(cloud => cloud.draw(ctx));
    }

    reset() {
        this.clouds = [];
        this.initializeElements();
    }
}

// Make classes globally available
window.BackgroundSystem = BackgroundSystem;
