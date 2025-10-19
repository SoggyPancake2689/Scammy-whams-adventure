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
    }

    // Update only visual effects (no physics) - used during countdown
    updateVisuals(deltaTime) {
        if (!this.isAlive) return;

        // Update rotation based on velocity (but don't change velocity)
        this.rotation += CONSTANTS.DIAMOND.ROTATION_SPEED * deltaTime;
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

    // Draw the diamond with gradient (no glow effect)
    draw(ctx) {
        if (!this.isAlive) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Get current skin
        const currentSkin = scoreStorage ? scoreStorage.getCurrentSkin() : 'default';
        const skins = scoreStorage ? scoreStorage.getSkins() : {};
        const skinData = skins[currentSkin] || { name: 'Default' };
        
        // Draw based on skin
        switch (currentSkin) {
            case 'rainbow':
                this.drawRainbowSkin(ctx);
                break;
            case 'fire':
                this.drawFireSkin(ctx);
                break;
            case 'ice':
                this.drawIceSkin(ctx);
                break;
            case 'sparkles':
                this.drawSparklesSkin(ctx);
                break;
            case 'voltz':
                this.drawVoltzSkin(ctx);
                break;
            case 'saturn':
                this.drawSaturnSkin(ctx);
                break;
            case 'fajilla':
                this.drawFajillaSkin(ctx);
                break;
            case 'stinky':
                this.drawStinkySkin(ctx);
                break;
            default:
                this.drawDefaultSkin(ctx);
        }

        ctx.restore();
    }

    // Default diamond skin
    drawDefaultSkin(ctx) {
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
    }

    // Rainbow skin
    drawRainbowSkin(ctx) {
        // Create rainbow gradient
        const gradient = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
        gradient.addColorStop(0, '#FF0000');
        gradient.addColorStop(0.2, '#FF8000');
        gradient.addColorStop(0.4, '#FFFF00');
        gradient.addColorStop(0.6, '#00FF00');
        gradient.addColorStop(0.8, '#0080FF');
        gradient.addColorStop(1, '#8000FF');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        const halfSize = this.size / 2;
        ctx.moveTo(0, -halfSize);
        ctx.lineTo(halfSize, 0);
        ctx.lineTo(0, halfSize);
        ctx.lineTo(-halfSize, 0);
        ctx.closePath();
        ctx.fill();
        
        // Add outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Fire skin
    drawFireSkin(ctx) {
        // Create fire gradient
        const gradient = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
        gradient.addColorStop(0, '#FF4500');
        gradient.addColorStop(0.5, '#FF6347');
        gradient.addColorStop(1, '#FF0000');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        const halfSize = this.size / 2;
        ctx.moveTo(0, -halfSize);
        ctx.lineTo(halfSize, 0);
        ctx.lineTo(0, halfSize);
        ctx.lineTo(-halfSize, 0);
        ctx.closePath();
        ctx.fill();
        
        // Add fire outline
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // Ice skin
    drawIceSkin(ctx) {
        // Create ice gradient
        const gradient = ctx.createLinearGradient(-this.size, -this.size, this.size, this.size);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.5, '#B0E0E6');
        gradient.addColorStop(1, '#E0F6FF');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        const halfSize = this.size / 2;
        ctx.moveTo(0, -halfSize);
        ctx.lineTo(halfSize, 0);
        ctx.lineTo(0, halfSize);
        ctx.lineTo(-halfSize, 0);
        ctx.closePath();
        ctx.fill();
        
        // Add ice outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    // Voltz skin (smiley face)
    drawVoltzSkin(ctx) {
        // Draw yellow circle background
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw smiley face
        ctx.fillStyle = '#000000';
        
        // Eyes
        ctx.beginPath();
        ctx.arc(-this.size/6, -this.size/8, this.size/12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(this.size/6, -this.size/8, this.size/12, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/3, 0, Math.PI);
        ctx.stroke();
        
        // Add outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, this.size/2, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Saturn skin (planet with rings)
    drawSaturnSkin(ctx) {
        const halfSize = this.size / 2;
        
        // Draw planet body (main circle)
        const planetGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, halfSize);
        planetGradient.addColorStop(0, '#FAD5A5'); // Light cream center
        planetGradient.addColorStop(0.4, '#E6B800'); // Golden yellow
        planetGradient.addColorStop(0.8, '#CC9900'); // Darker gold
        planetGradient.addColorStop(1, '#B8860B'); // Dark goldenrod edge
        
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(0, 0, halfSize * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw planet rings (elliptical)
        ctx.strokeStyle = '#DAA520';
        ctx.lineWidth = 3;
        
        // Outer ring
        ctx.beginPath();
        ctx.ellipse(0, 0, halfSize * 0.9, halfSize * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Middle ring
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, halfSize * 0.8, halfSize * 0.25, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Inner ring
        ctx.strokeStyle = '#CD853F';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, halfSize * 0.7, halfSize * 0.2, 0, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add planet surface details (bands)
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 1;
        
        // Horizontal bands
        for (let i = -2; i <= 2; i++) {
            const y = (i * halfSize * 0.15);
            if (Math.abs(y) < halfSize * 0.6) {
                ctx.beginPath();
                ctx.moveTo(-halfSize * 0.6, y);
                ctx.lineTo(halfSize * 0.6, y);
                ctx.stroke();
            }
        }
        
        // Add subtle glow effect
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, halfSize * 0.7, 0, Math.PI * 2);
        ctx.stroke();
        
        // Add outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, halfSize * 0.7, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Fajilla skin (tiger)
    drawFajillaSkin(ctx) {
        const halfSize = this.size / 2;
        
        // Draw tiger body (orange circle)
        const tigerGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, halfSize);
        tigerGradient.addColorStop(0, '#FF8C00'); // Dark orange center
        tigerGradient.addColorStop(0.5, '#FFA500'); // Orange
        tigerGradient.addColorStop(1, '#FF6347'); // Tomato red edge
        
        ctx.fillStyle = tigerGradient;
        ctx.beginPath();
        ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw tiger stripes (black lines)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        
        // Vertical stripes
        for (let i = -2; i <= 2; i++) {
            const x = (i * halfSize * 0.3);
            if (Math.abs(x) < halfSize * 0.8) {
                ctx.beginPath();
                ctx.moveTo(x, -halfSize * 0.8);
                ctx.lineTo(x, halfSize * 0.8);
                ctx.stroke();
            }
        }
        
        // Horizontal stripes
        for (let i = -2; i <= 2; i++) {
            const y = (i * halfSize * 0.25);
            if (Math.abs(y) < halfSize * 0.7) {
                ctx.beginPath();
                ctx.moveTo(-halfSize * 0.7, y);
                ctx.lineTo(halfSize * 0.7, y);
                ctx.stroke();
            }
        }
        
        // Draw tiger face features
        ctx.fillStyle = '#000000';
        
        // Eyes
        ctx.beginPath();
        ctx.arc(-halfSize/4, -halfSize/6, halfSize/8, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(halfSize/4, -halfSize/6, halfSize/8, 0, Math.PI * 2);
        ctx.fill();
        
        // Nose
        ctx.beginPath();
        ctx.arc(0, halfSize/8, halfSize/12, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth (small curved line)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, halfSize/4, halfSize/6, 0, Math.PI);
        ctx.stroke();
        
        // Draw tiger ears
        ctx.fillStyle = '#FF8C00';
        ctx.beginPath();
        ctx.moveTo(-halfSize * 0.6, -halfSize * 0.8);
        ctx.lineTo(-halfSize * 0.4, -halfSize * 0.6);
        ctx.lineTo(-halfSize * 0.5, -halfSize * 0.4);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(halfSize * 0.6, -halfSize * 0.8);
        ctx.lineTo(halfSize * 0.4, -halfSize * 0.6);
        ctx.lineTo(halfSize * 0.5, -halfSize * 0.4);
        ctx.closePath();
        ctx.fill();
        
        // Ear stripes
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-halfSize * 0.5, -halfSize * 0.7);
        ctx.lineTo(-halfSize * 0.45, -halfSize * 0.5);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(halfSize * 0.5, -halfSize * 0.7);
        ctx.lineTo(halfSize * 0.45, -halfSize * 0.5);
        ctx.stroke();
        
        // Add outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Stinky skin (poop)
    drawStinkySkin(ctx) {
        const halfSize = this.size / 2;
        
        // Draw poop body (brown oval shape)
        const poopGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, halfSize);
        poopGradient.addColorStop(0, '#8B4513'); // Saddle brown center
        poopGradient.addColorStop(0.5, '#A0522D'); // Sienna
        poopGradient.addColorStop(1, '#654321'); // Dark brown edge
        
        ctx.fillStyle = poopGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, halfSize * 0.8, halfSize * 1.1, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw poop texture (bumpy surface)
        ctx.fillStyle = '#654321';
        ctx.strokeStyle = '#654321';
        ctx.lineWidth = 1;
        
        // Add bumps and ridges
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const radius = halfSize * (0.6 + Math.random() * 0.2);
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius * 0.7;
            
            ctx.beginPath();
            ctx.arc(x, y, halfSize * 0.1, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw poop swirls (spiral texture)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        
        // Main spiral
        ctx.beginPath();
        ctx.arc(0, 0, halfSize * 0.3, 0, Math.PI * 4);
        ctx.stroke();
        
        // Secondary spiral
        ctx.beginPath();
        ctx.arc(0, 0, halfSize * 0.5, 0, Math.PI * 3);
        ctx.stroke();
        
        // Draw poop face (simple eyes and mouth)
        ctx.fillStyle = '#000000';
        
        // Eyes
        ctx.beginPath();
        ctx.arc(-halfSize/5, -halfSize/4, halfSize/12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(halfSize/5, -halfSize/4, halfSize/12, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth (small curved line)
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, halfSize/6, halfSize/8, 0, Math.PI);
        ctx.stroke();
        
        // Add stink lines (wavy lines above)
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            const startX = -halfSize * 0.3 + (i * halfSize * 0.3);
            const startY = -halfSize * 1.2;
            
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX + halfSize * 0.1, startY - halfSize * 0.2);
            ctx.lineTo(startX + halfSize * 0.2, startY - halfSize * 0.1);
            ctx.lineTo(startX + halfSize * 0.3, startY - halfSize * 0.3);
            ctx.stroke();
        }
        
        // Add outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, halfSize * 0.8, halfSize * 1.1, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Sparkles skin (confetti ball)
    drawSparklesSkin(ctx) {
        const halfSize = this.size / 2;
        
        // Draw base circle with confetti colors
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, halfSize);
        gradient.addColorStop(0, '#FF69B4'); // Hot pink center
        gradient.addColorStop(0.3, '#FF1493'); // Deep pink
        gradient.addColorStop(0.6, '#FF6347'); // Tomato
        gradient.addColorStop(1, '#FFD700'); // Gold edge
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw confetti pieces (small colored rectangles)
        const confettiColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'];
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const distance = halfSize * 0.7;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle + Math.PI / 4);
            
            // Random confetti color
            ctx.fillStyle = confettiColors[i % confettiColors.length];
            ctx.fillRect(-halfSize * 0.1, -halfSize * 0.05, halfSize * 0.2, halfSize * 0.1);
            
            ctx.restore();
        }
        
        // Add sparkle effects (small stars)
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const distance = halfSize * 0.4;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            
            ctx.save();
            ctx.translate(x, y);
            
            // Draw small star
            ctx.beginPath();
            ctx.moveTo(0, -halfSize * 0.08);
            ctx.lineTo(halfSize * 0.03, -halfSize * 0.03);
            ctx.lineTo(halfSize * 0.08, 0);
            ctx.lineTo(halfSize * 0.03, halfSize * 0.03);
            ctx.lineTo(0, halfSize * 0.08);
            ctx.lineTo(-halfSize * 0.03, halfSize * 0.03);
            ctx.lineTo(-halfSize * 0.08, 0);
            ctx.lineTo(-halfSize * 0.03, -halfSize * 0.03);
            ctx.closePath();
            ctx.fill();
            
            ctx.restore();
        }
        
        // Add outline
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, halfSize, 0, Math.PI * 2);
        ctx.stroke();
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

    // Reset diamond to starting position
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.rotation = 0;
        this.isAlive = true;
    }

    // Get center position
    getCenter() {
        return { x: this.x, y: this.y };
    }
}

// Make classes globally available
window.Diamond = Diamond;
