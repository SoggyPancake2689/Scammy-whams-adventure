// Particle system for visual effects
class Particle {
    constructor(x, y, vx, vy, life, color, size = 3) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.life = life;
        this.maxLife = life;
        this.color = color;
        this.size = size;
        this.alpha = 1;
    }

    update(deltaTime) {
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
        this.life -= deltaTime;
        this.alpha = this.life / this.maxLife;
        
        // Apply gravity to particles
        this.vy += 500 * deltaTime;
    }

    draw(ctx) {
        if (this.life <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // Add glow effect for trail particles
        if (this.color === '#FFD700' || this.color === '#FFA500' || this.color === '#FF6347') {
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 10;
        }
        
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    // Create trail particles behind the diamond
    createTrail(x, y, vx, vy) {
        const count = CONSTANTS.PARTICLES.TRAIL_COUNT;
        const colors = CONSTANTS.COLORS.PARTICLE_COLORS;
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = CONSTANTS.PARTICLES.TRAIL_SPEED * (0.5 + Math.random() * 0.5);
            const particleVx = Math.cos(angle) * speed - vx * 0.1;
            const particleVy = Math.sin(angle) * speed - vy * 0.1;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = CONSTANTS.PARTICLES.TRAIL_LIFE * (0.5 + Math.random() * 0.5);
            
            this.particles.push(new Particle(
                x + (Math.random() - 0.5) * 20,
                y + (Math.random() - 0.5) * 20,
                particleVx,
                particleVy,
                life,
                color,
                2 + Math.random() * 3
            ));
        }
    }

    // Create continuous trail that follows diamond movement
    createContinuousTrail(x, y, vx, vy) {
        const count = 3; // Fewer particles but more frequent
        const colors = ['#FFD700', '#FFA500', '#FF6347', '#FF69B4', '#00BFFF'];
        
        for (let i = 0; i < count; i++) {
            // Create particles that trail behind the diamond
            const offsetX = (Math.random() - 0.5) * 15;
            const offsetY = (Math.random() - 0.5) * 15;
            
            // Particles move opposite to diamond's velocity to create trailing effect
            const particleVx = -vx * 0.3 + (Math.random() - 0.5) * 50;
            const particleVy = -vy * 0.3 + (Math.random() - 0.5) * 50;
            
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = 0.8 + Math.random() * 0.4; // Longer life for better trail
            
            this.particles.push(new Particle(
                x + offsetX,
                y + offsetY,
                particleVx,
                particleVy,
                life,
                color,
                2 + Math.random() * 4 // Larger particles
            ));
        }
    }

    // Create impact particles on collision
    createImpact(x, y) {
        const count = CONSTANTS.PARTICLES.IMPACT_COUNT;
        const colors = CONSTANTS.COLORS.PARTICLE_COLORS;
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = CONSTANTS.PARTICLES.IMPACT_SPEED * (0.5 + Math.random() * 0.5);
            const particleVx = Math.cos(angle) * speed;
            const particleVy = Math.sin(angle) * speed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = CONSTANTS.PARTICLES.IMPACT_LIFE * (0.5 + Math.random() * 0.5);
            
            this.particles.push(new Particle(
                x,
                y,
                particleVx,
                particleVy,
                life,
                color,
                3 + Math.random() * 4
            ));
        }
    }

    // Create sparkle particles
    createSparkle(x, y) {
        const count = 5;
        const colors = ['#FFD700', '#FFA500', '#FF6347'];
        
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.2 + Math.random() * 0.3;
            const particleVx = Math.cos(angle) * speed;
            const particleVy = Math.sin(angle) * speed;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const life = 0.3 + Math.random() * 0.4;
            
            this.particles.push(new Particle(
                x + (Math.random() - 0.5) * 10,
                y + (Math.random() - 0.5) * 10,
                particleVx,
                particleVy,
                life,
                color,
                1 + Math.random() * 2
            ));
        }
    }

    update(deltaTime) {
        // Update all particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(deltaTime);
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }

    clear() {
        this.particles = [];
    }
}

// Make classes globally available
window.ParticleSystem = ParticleSystem;
