// Simple icon creation script
const fs = require('fs');
const { createCanvas } = require('canvas');

function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, size, size);
    
    // Diamond
    const centerX = size / 2;
    const centerY = size / 2;
    const diamondSize = size * 0.6;
    
    // Diamond gradient
    const gradient = ctx.createLinearGradient(
        centerX - diamondSize/2, centerY - diamondSize/2,
        centerX + diamondSize/2, centerY + diamondSize/2
    );
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFA500');
    gradient.addColorStop(1, '#FF8C00');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - diamondSize/2);
    ctx.lineTo(centerX + diamondSize/2, centerY);
    ctx.lineTo(centerX, centerY + diamondSize/2);
    ctx.lineTo(centerX - diamondSize/2, centerY);
    ctx.closePath();
    ctx.fill();
    
    // Outline
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = size * 0.02;
    ctx.stroke();
    
    return canvas.toBuffer('image/png');
}

// Create icons for all required sizes
const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
    const iconBuffer = createIcon(size);
    fs.writeFileSync(`icons/icon-${size}x${size}.png`, iconBuffer);
    console.log(`Created icon-${size}x${size}.png`);
});

console.log('All icons created successfully!');
