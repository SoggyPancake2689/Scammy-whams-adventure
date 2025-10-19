# Scammy's Whams - Diamond Flappy Game

A polished Flappy Bird-style game featuring a diamond character with animated backgrounds, themed obstacles, and multiple difficulty levels.

## How to Play

1. **Open the Game**: Double-click on `index.html` to open the game in your web browser
2. **Select Difficulty**: Choose Easy, Normal, or Hard from the main menu
3. **Start Playing**: Press SPACEBAR or click anywhere to begin
4. **Control the Diamond**: Press SPACEBAR or click to make the diamond flap upward
5. **Avoid Obstacles**: Navigate through randomly themed obstacles (pipes, rocks, crystals, lasers, thorns, buildings)
6. **Score Points**: Pass through obstacle pairs to increase your score
7. **Beat High Scores**: Try to achieve new high scores for each difficulty level

## Features

- **Polished Visuals**: Gradient-filled diamond with glow effects and rotation animation
- **Animated Background**: Scrolling clouds and twinkling stars
- **Particle Effects**: Sparkle trails and impact particles
- **Multiple Themes**: 6 different obstacle themes that appear randomly
- **Three Difficulty Levels**:
  - **Easy**: Larger gaps, slower speed, easier to navigate
  - **Normal**: Medium gaps and speed for balanced gameplay
  - **Hard**: Smaller gaps, faster speed, challenging gameplay
- **High Score Tracking**: Persistent high scores saved per difficulty level
- **Smooth Animations**: Loading screens and countdown timers
- **Responsive Design**: Works on different screen sizes

## Game Mechanics

- **Physics**: Realistic gravity and flap mechanics
- **Collision Detection**: Precise collision detection between diamond and obstacles
- **Score System**: Points awarded for each obstacle pair passed
- **Game Over**: Collision with obstacles or screen boundaries ends the game

## Technical Details

- Built with vanilla HTML5, CSS3, and JavaScript
- Uses Canvas API for smooth 60fps rendering
- localStorage for persistent high score storage
- Responsive design with mobile-friendly controls

## File Structure

```
Camile's Game/
├── index.html          # Main HTML file
├── styles.css          # Game styling and animations
├── js/
│   ├── constants.js    # Game configuration and constants
│   ├── storage.js      # High score management
│   ├── particles.js    # Particle system for visual effects
│   ├── background.js   # Animated background system
│   ├── diamond.js      # Diamond player class
│   ├── obstacles.js    # Obstacle generation and rendering
│   ├── ui.js          # User interface management
│   └── game.js        # Main game loop and logic
```

## Browser Compatibility

The game works in all modern browsers that support:
- HTML5 Canvas
- CSS3 gradients and animations
- ES6 JavaScript features
- localStorage API

## Version Control Setup

To initialize Git for this project:

1. **Install Git** (if not already installed):
   - Download from: https://git-scm.com/downloads
   - Or run: `winget install Git.Git` (Windows)

2. **Initialize Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Diamond Flappy Bird game with full features"
   ```

3. **Or use the provided script**:
   - Run `init_git.bat` on Windows
   - This will automatically initialize Git and create the first commit

4. **Connect to GitHub** (optional):
   ```bash
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

## Project Files

- `index.html` - Main game file
- `styles.css` - Game styling
- `js/` - JavaScript modules
- `README.md` - This file
- `PROJECT_SUMMARY.md` - Detailed project overview
- `.gitignore` - Git ignore rules
- `init_git.bat` - Git initialization script

Enjoy playing Scammy's Whams! 🎮✨
