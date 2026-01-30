// Sound System for WWIII Meme Coin
class SoundSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.isInitialized = false;
        this.volume = 0.3;
    }

    // Initialize Web Audio API
    init() {
        if (this.isInitialized) return;
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
            this.isInitialized = true;
            console.log('Sound system initialized');
        } catch (error) {
            console.log('Web Audio API not supported');
        }
    }

    // Create synthesized sounds using Web Audio API
    createSounds() {
        // Siren Sound
        this.sounds.siren = () => this.playSiren();
        
        // Missile Launch Sound
        this.sounds.missile = () => this.playMissileSound();
        
        // Explosion Sound
        this.sounds.explosion = () => this.playExplosion();
        
        // Button Click Sound
        this.sounds.click = () => this.playClickSound();
        
        // Radar Beep
        this.sounds.radar = () => this.playRadarSound();
        
        // Panic Alarm
        this.sounds.panic = () => this.playPanicAlarm();
    }

    // Siren Sound (rising and falling pitch)
    playSiren() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.5);
        oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.3, this.audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 1);
    }

    // Missile Launch Sound
    playMissileSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Explosion Sound
    playExplosion() {
        if (!this.audioContext) return;
        
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        // Generate noise for explosion
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.1));
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();
        
        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(this.volume * 0.4, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        source.start(this.audioContext.currentTime);
    }

    // Button Click Sound
    playClickSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.1, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Radar Beep Sound
    playRadarSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.volume * 0.2, this.audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Panic Alarm (multiple sirens)
    playPanicAlarm() {
        if (!this.audioContext) return;
        
        // Play multiple overlapping sirens for panic effect
        this.playSiren();
        setTimeout(() => this.playSiren(), 200);
        setTimeout(() => this.playSiren(), 400);
        setTimeout(() => this.playExplosion(), 600);
    }

    // Play a sound by name
    play(soundName) {
        if (!this.isInitialized) {
            this.init();
        }
        
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    // Set volume
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }

    // Mute all sounds
    mute() {
        this.volume = 0;
    }

    // Unmute sounds
    unmute() {
        this.volume = 0.3;
    }
}

// Create global sound system instance
const soundSystem = new SoundSystem();

// Auto-initialize on first user interaction
document.addEventListener('click', () => {
    soundSystem.init();
}, { once: true });

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundSystem;
} else {
    window.SoundSystem = SoundSystem;
    window.soundSystem = soundSystem;
}
