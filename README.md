# WWIII Meme Coin Website

A modern, highly-designed meme coin website inspired by the WWIII Meme Coin concept. This features a dark, military-themed design with interactive animations, missile effects, and engaging user experience.

## Features

### 🎨 **Design Elements**
- Modern dark theme with military/panic aesthetic
- Gradient effects and glassmorphism
- Custom animations and transitions
- Fully responsive design for all devices
- Professional typography with Orbitron and Space Mono fonts

### 🚀 **Interactive Features**
- **Panic Button**: Triggers missile animations and screen shake
- **Missile System**: Animated missiles falling from the sky
- **Live Stats**: Animated counters with intersection observer
- **Smooth Navigation**: Mobile-friendly hamburger menu
- **FAQ Accordion**: Expandable FAQ sections
- **Parallax Effects**: Scroll-based animations

### 🎯 **Sections**
- **Hero Section**: Eye-catching landing with panic button
- **How It Works**: 3-step process explanation
- **About Us**: Mission and team information
- **Utility**: Token utilities and features
- **FAQ**: Frequently asked questions
- **Footer**: Complete navigation and social links

### � **Sound System**
- **Synthesized Audio Effects**: Web Audio API generated sounds
- **Panic Button**: Triggers siren and explosion sounds
- **Missile Launches**: Launch and explosion sound effects
- **Interactive Elements**: Click sounds for buttons and navigation
- **Ambient Sounds**: Periodic radar beeps for atmosphere
- **Volume Control**: Adjustable sound panel with mute option
- **Sound Types**:
  - Siren sounds (rising/falling pitch)
  - Missile launch sounds
  - Explosion effects
  - Button clicks
  - Radar beeps
  - Panic alarm (multiple overlapping sirens)
- Konami code triggers missile party mode
- Random ambient missile launches
- Hover effects on all interactive elements

## Technologies Used

- **HTML5**: Semantic markup and modern structure
- **CSS3**: Advanced animations, flexbox, grid, and custom properties
- **Vanilla JavaScript**: No frameworks, pure JS for all interactions
- **Font Awesome**: Icon library
- **Google Fonts**: Orbitron and Space Mono typography

## File Structure

```
pumpfun/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and animations
├── script.js           # All JavaScript functionality
├── sounds.js           # Web Audio API sound system
└── README.md           # This documentation
```

## Key Features Explained

### Missile Animation System
The missile system includes:
- Random spawn positions at the top of screen
- Realistic falling animation with rotation
- Fire trail effects
- Automatic cleanup after animation

### Sound System
The sound system uses Web Audio API to generate synthesized effects:
- **Siren Sounds**: Rising and falling pitch oscillators
- **Missile Launch**: Low frequency sawtooth with filter sweep
- **Explosions**: White noise with envelope shaping
- **Button Clicks**: Square wave frequency sweeps
- **Radar Beeps**: Sine wave pulses
- **Panic Alarm**: Multiple overlapping siren effects

### Panic Button
- Launches multiple missiles on click
- Screen shake effect
- Updates statistics randomly
- Visual feedback with animations

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Flexible grid layouts
- Optimized typography scaling

### Performance Optimizations
- Debounced scroll handlers
- Intersection observers for lazy animations
- Efficient DOM manipulation
- Optimized animation frames

## Browser Compatibility

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #ff0040;
    --secondary-color: #ff6b35;
    --accent-color: #ffd700;
    /* ... */
}
```

### Animations
Animation speeds and effects can be modified in the CSS keyframes and JavaScript timing values.

### Content
All text content is easily editable in the HTML file. The structure is semantic and well-organized for easy updates.

## Getting Started

1. Clone or download the files
2. Open `index.html` in your browser
3. No build process required - it's pure HTML/CSS/JS!

## Future Enhancements

- [ ] Sound effects for panic button
- [ ] WebSocket integration for live stats
- [ ] 3D missile effects
- [ ] Particle system for explosions
- [ ] Integration with actual blockchain data
- [ ] Admin panel for content management

## License

This project is open source and available under the MIT License.

---

**Note**: This is a parody/meme website created for entertainment purposes only. Do not take any investment advice from this site. Always do your own research before investing in cryptocurrency.
