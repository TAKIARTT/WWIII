// Sound Control Panel
const soundToggle = document.getElementById('soundToggle');
const volumeSlider = document.getElementById('volumeSlider');
const soundToggleIcon = soundToggle.querySelector('i');

// Sound toggle functionality
soundToggle.addEventListener('click', () => {
    soundSystem.play('click');
    
    if (soundToggle.classList.contains('muted')) {
        // Unmute
        soundToggle.classList.remove('muted');
        soundToggleIcon.className = 'fas fa-volume-up';
        soundSystem.unmute();
        volumeSlider.value = 30;
    } else {
        // Mute
        soundToggle.classList.add('muted');
        soundToggleIcon.className = 'fas fa-volume-mute';
        soundSystem.mute();
        volumeSlider.value = 0;
    }
});

// Volume slider functionality
volumeSlider.addEventListener('input', (e) => {
    const volume = e.target.value / 100;
    soundSystem.setVolume(volume);
    
    // Update icon based on volume
    if (volume === 0) {
        soundToggleIcon.className = 'fas fa-volume-mute';
        soundToggle.classList.add('muted');
    } else if (volume < 0.5) {
        soundToggleIcon.className = 'fas fa-volume-down';
        soundToggle.classList.remove('muted');
    } else {
        soundToggleIcon.className = 'fas fa-volume-up';
        soundToggle.classList.remove('muted');
    }
});

// Mobile-specific optimizations
class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartY = 0;
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
               || window.innerWidth <= 768;
    }

    init() {
        if (this.isMobile) {
            this.optimizeForMobile();
        }
    }

    optimizeForMobile() {
        // Reduce missile frequency for mobile performance
        if (window.missileSystem) {
            const originalCreateMissile = missileSystem.createMissile.bind(missileSystem);
            missileSystem.createMissile = function() {
                // Limit missiles on mobile for performance
                if (this.missiles.length < 3) {
                    originalCreateMissile();
                }
            };
        }

        // Optimize ambient missile launches
        setInterval(() => {
            if (Math.random() > 0.9 && window.missileSystem) { // Less frequent on mobile
                missileSystem.createMissile();
            }
        }, 8000);

        // Add touch gesture support
        this.addTouchGestures();
        
        // Optimize animations for mobile
        this.optimizeAnimations();
        
        // Add mobile-specific event listeners
        this.addMobileEventListeners();
    }

    addTouchGestures() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            this.touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;
            
            // Detect swipe gestures
            this.handleSwipe(touchStartX, touchEndX, this.touchStartY, touchEndY);
        }, { passive: true });
    }

    handleSwipe(startX, endX, startY, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                // Swipe right - could trigger navigation
                console.log('Swipe right detected');
            } else {
                // Swipe left
                console.log('Swipe left detected');
            }
        }
        
        // Vertical swipe
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                // Swipe down
                console.log('Swipe down detected');
            } else {
                // Swipe up - could trigger panic action
                console.log('Swipe up detected');
                if (window.panicButton) {
                    panicButton.click();
                }
            }
        }
    }

    optimizeAnimations() {
        // Reduce animation complexity on mobile
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            document.body.classList.add('reduced-motion');
        }

        // Add performance monitoring
        this.monitorPerformance();
    }

    monitorPerformance() {
        let frameCount = 0;
        let lastTime = performance.now();

        const checkPerformance = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - lastTime >= 1000) {
                const fps = frameCount;
                frameCount = 0;
                lastTime = currentTime;

                // Reduce effects if performance is poor
                if (fps < 30) {
                    document.body.classList.add('low-performance');
                } else {
                    document.body.classList.remove('low-performance');
                }
            }

            requestAnimationFrame(checkPerformance);
        };

        requestAnimationFrame(checkPerformance);
    }

    addMobileEventListeners() {
        // Prevent zoom on double tap for buttons
        document.querySelectorAll('button').forEach(button => {
            button.addEventListener('touchend', (e) => {
                e.preventDefault();
                button.click();
            }, { passive: false });
        });

        // Add haptic feedback if available
        if ('vibrate' in navigator) {
            document.querySelectorAll('button, .nav-link').forEach(element => {
                element.addEventListener('click', () => {
                    navigator.vibrate(10); // Light vibration
                });
            });
        }

        // Optimize scroll performance
        let ticking = false;
        const updateScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Handle scroll-based animations
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', updateScroll, { passive: true });
    }
}

// Initialize mobile optimizer
const mobileOptimizer = new MobileOptimizer();

// DOM Elements
const panicButton = document.getElementById('panicButton');
const missileContainer = document.getElementById('missileContainer');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const faqItems = document.querySelectorAll('.faq-item');
const statNumbers = document.querySelectorAll('.stat-number');
const buyButton = document.getElementById('buyButton');
const copyContract = document.getElementById('copyContract');
const contractAddress = document.getElementById('contractAddress');
const copyFeedback = document.getElementById('copyFeedback');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// FAQ Accordion
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        // Close other FAQ items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });
        
        // Toggle current FAQ item
        item.classList.toggle('active');
    });
});

// Animated Counter for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const updateCounter = () => {
        start += increment;
        
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    };
    
    updateCounter();
}

// Intersection Observer for stat animations
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            const target = parseInt(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

statNumbers.forEach(stat => {
    statObserver.observe(stat);
});

// Missile Animation System
class MissileSystem {
    constructor() {
        this.missiles = [];
        this.isLaunching = false;
    }

    createMissile() {
        const missile = document.createElement('div');
        missile.className = 'missile';
        
        // Random starting position at the top
        const startX = Math.random() * window.innerWidth;
        missile.style.left = startX + 'px';
        missile.style.top = '-100px';
        
        // Random rotation and animation duration
        const rotation = Math.random() * 360;
        const duration = 2000 + Math.random() * 2000;
        missile.style.transform = `rotate(${rotation}deg)`;
        missile.style.animationDuration = duration + 'ms';
        
        missileContainer.appendChild(missile);
        this.missiles.push(missile);
        
        // Play missile launch sound
        soundSystem.play('missile');
        
        // Remove missile after animation and play explosion
        setTimeout(() => {
            soundSystem.play('explosion');
            missile.remove();
            this.missiles = this.missiles.filter(m => m !== missile);
        }, duration);
    }

    launchMultiple(count = 5) {
        if (this.isLaunching) return;
        
        this.isLaunching = true;
        
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                this.createMissile();
            }, i * 200);
        }
        
        setTimeout(() => {
            this.isLaunching = false;
        }, count * 200);
    }

    launchContinuous(duration = 3000) {
        const startTime = Date.now();
        const interval = setInterval(() => {
            if (Date.now() - startTime >= duration) {
                clearInterval(interval);
                return;
            }
            this.createMissile();
        }, 300);
    }
}

const missileSystem = new MissileSystem();

// Panic Button Functionality
panicButton.addEventListener('click', function() {
    // Play panic sound
    soundSystem.play('panic');
    
    // Add button animation
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 100);
    
    // Launch missiles
    missileSystem.launchMultiple(8);
    
    // Screen shake effect
    document.body.classList.add('panic-shake');
    setTimeout(() => {
        document.body.classList.remove('panic-shake');
    }, 500);
    
    // Update stats randomly
    updateRandomStats();
});

// Buy Button Functionality
buyButton.addEventListener('click', function() {
    // Play success sound
    soundSystem.play('click');
    
    // Add button animation
    this.style.transform = 'scale(0.95)';
    setTimeout(() => {
        this.style.transform = '';
    }, 100);
    
    // Open PumpFun in new tab
    const pumpFunUrl = `https://pump.fun/coin/${contractAddress.textContent}`;
    window.open(pumpFunUrl, '_blank');
});

// Copy Contract Address Functionality
copyContract.addEventListener('click', async function() {
    try {
        // Copy to clipboard
        await navigator.clipboard.writeText(contractAddress.textContent);
        
        // Show feedback
        copyFeedback.classList.add('show');
        
        // Play success sound
        soundSystem.play('click');
        
        // Hide feedback after 2 seconds
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
        
        console.log('Contract address copied to clipboard');
    } catch (err) {
        console.error('Failed to copy contract address:', err);
        
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = contractAddress.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        // Show feedback
        copyFeedback.classList.add('show');
        setTimeout(() => {
            copyFeedback.classList.remove('show');
        }, 2000);
    }
});

// Screen shake CSS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes panic-shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .panic-shake {
        animation: panic-shake 0.5s ease-in-out;
    }
`;
document.head.appendChild(shakeStyle);

// Update random stats
function updateRandomStats() {
    statNumbers.forEach(stat => {
        const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
        const increment = Math.floor(Math.random() * 10) + 1;
        const newValue = currentValue + increment;
        stat.textContent = newValue.toLocaleString();
    });
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.backdropFilter = 'blur(15px)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-bg');
    const radarSweep = document.querySelector('.radar-sweep');
    
    if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
    
    if (radarSweep) {
        radarSweep.style.transform = `translate(-50%, -50%) rotate(${scrolled * 0.1}deg)`;
    }
});

// Add floating animation to cards
const cards = document.querySelectorAll('.step-card, .utility-card');
cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    card.style.animation = 'float-up 0.6s ease-out forwards';
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
});

// Float up animation
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes float-up {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(floatStyle);

// Intersection Observer for card animations
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'float-up 0.6s ease-out forwards';
        }
    });
}, { threshold: 0.1 });

cards.forEach(card => {
    cardObserver.observe(card);
});

// Typing effect for hero title
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const titleMain = document.querySelector('.title-main');
    if (titleMain) {
        const originalText = titleMain.textContent;
        typeWriter(titleMain, originalText, 150);
    }
    
    // Start occasional missile launches for ambiance
    setInterval(() => {
        if (Math.random() > 0.7) {
            missileSystem.createMissile();
        }
    }, 5000);
});

// Easter egg: Konami code for missile party
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiPattern)) {
        // Easter egg activated!
        missileSystem.launchContinuous(10000);
        document.body.classList.add('panic-mode');
        
        // Add panic mode styles
        const panicModeStyle = document.createElement('style');
        panicModeStyle.textContent = `
            .panic-mode {
                animation: panic-mode-bg 0.5s infinite alternate;
            }
            
            @keyframes panic-mode-bg {
                from { background: #0a0a0a; }
                to { background: #1a0a0a; }
            }
        `;
        document.head.appendChild(panicModeStyle);
        
        setTimeout(() => {
            document.body.classList.remove('panic-mode');
        }, 10000);
    }
});

// Add hover sound effect (placeholder for actual audio)
function playHoverSound() {
    // In a real implementation, you would play an actual sound file here
    console.log('Hover sound played');
}

// Add hover sound to interactive elements
const interactiveElements = document.querySelectorAll('button, a, .card');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', playHoverSound);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced scroll handlers
const debouncedScrollHandler = debounce(() => {
    // Scroll-based animations here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add click sounds to buttons and links
document.addEventListener('DOMContentLoaded', () => {
    // Add click sound to all buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            soundSystem.play('click');
        });
    });
    
    // Add click sound to navigation links
    const navLinks = document.querySelectorAll('.nav-link, .social-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            soundSystem.play('click');
        });
    });
    
    // Add hover sound to cards (subtle radar beep)
    const cards = document.querySelectorAll('.step-card, .utility-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            soundSystem.play('radar');
        });
    });
    
    // Play ambient radar sound periodically
    setInterval(() => {
        if (Math.random() > 0.8) {
            soundSystem.play('radar');
        }
    }, 8000);
    
    console.log('WWIII Meme Coin loaded successfully!');
    console.log('Press the panic button to spread chaos!');
    console.log('Hint: Try the Konami code for a missile party...');
});
