/* ============================================
   Christmas Love Story - JavaScript
   Magical interactions for our special day
   ============================================ */

// ============================================
// Snow Effect
// ============================================
class SnowEffect {
    constructor() {
        this.canvas = document.getElementById('snowCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.snowflakes = [];
        this.maxFlakes = 150;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.createSnowflakes();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createSnowflakes() {
        for (let i = 0; i < this.maxFlakes; i++) {
            this.snowflakes.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 4 + 1,
                speed: Math.random() * 2 + 0.5,
                wind: Math.random() * 0.5 - 0.25,
                opacity: Math.random() * 0.6 + 0.4
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.snowflakes.forEach(flake => {
            // Draw snowflake
            this.ctx.beginPath();
            this.ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
            this.ctx.fill();
            
            // Update position
            flake.y += flake.speed;
            flake.x += flake.wind + Math.sin(flake.y * 0.01) * 0.5;
            
            // Reset if off screen
            if (flake.y > this.canvas.height) {
                flake.y = -10;
                flake.x = Math.random() * this.canvas.width;
            }
            
            if (flake.x > this.canvas.width) {
                flake.x = 0;
            } else if (flake.x < 0) {
                flake.x = this.canvas.width;
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// Music Controller
// ============================================
class MusicController {
    constructor() {
        this.audio = document.getElementById('bgMusic');
        this.btn = document.getElementById('musicToggle');
        this.icon = this.btn.querySelector('.music-icon');
        this.isPlaying = false;
        this.hasInteracted = false;
        
        // Set audio to play
        this.audio.volume = 0.5;
        
        this.btn.addEventListener('click', () => this.toggle());
        
        // Try to auto-play immediately on page load
        this.tryAutoPlay();
        
        // Keep trying to autoplay
        this.retryInterval = setInterval(() => {
            if (!this.isPlaying) {
                this.tryAutoPlay();
            } else {
                clearInterval(this.retryInterval);
            }
        }, 1000);
        
        // Fallback: Auto-play on ANY user interaction
        const startMusic = () => this.autoStart();
        document.addEventListener('click', startMusic);
        document.addEventListener('keydown', startMusic);
        document.addEventListener('mousemove', startMusic, { once: true });
        document.addEventListener('touchstart', startMusic);
        document.addEventListener('scroll', startMusic, { once: true });
    }
    
    tryAutoPlay() {
        // Attempt immediate auto-play
        this.audio.volume = 0.5;
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.hasInteracted = true;
                this.btn.classList.add('playing');
                this.icon.textContent = '🎵';
                if (this.retryInterval) {
                    clearInterval(this.retryInterval);
                }
            }).catch(() => {
                // Auto-play was prevented, will play on user interaction
                console.log('Auto-play blocked, waiting for user interaction...');
            });
        }
    }
    
    autoStart() {
        if (!this.isPlaying) {
            this.play();
        }
    }
    
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        this.audio.volume = 0.5;
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.btn.classList.add('playing');
            this.icon.textContent = '🎵';
        }).catch(err => {
            console.log('Audio play failed:', err);
        });
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.btn.classList.remove('playing');
        this.icon.textContent = '🔇';
    }
}

// ============================================
// Section Navigation
// ============================================
function goToSection(sectionId) {
    const currentSection = document.querySelector('section.active');
    const nextSection = document.getElementById(sectionId);
    
    if (currentSection && nextSection && currentSection !== nextSection) {
        // Fade out current section
        currentSection.style.animation = 'fadeOut 0.5s ease forwards';
        
        setTimeout(() => {
            currentSection.classList.remove('active');
            currentSection.style.animation = '';
            currentSection.style.display = 'none';
            
            // Fade in next section
            nextSection.style.display = 'flex';
            nextSection.classList.add('active');
            nextSection.style.animation = 'fadeIn 0.8s ease forwards';
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 500);
    }
}

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-20px); }
    }
`;
document.head.appendChild(style);

// ============================================
// Photo Gallery - Data & Reveal
// ============================================
const mockPhotos = {
    // Preparation photos - Your handmade gift card journey
    'prep-photo-1': {
        src: 'image_asset/1.jpg',
        caption: 'Starting my first handmade card...'
    },
    'prep-photo-2': {
        src: 'image_asset/2.jpg',
        caption: 'Putting in the details'
    },
    'prep-photo-3': {
        src: 'image_asset/3.jpg',
        caption: 'The finished gift card!'
    },
    
    // Workshop photos - Tô Dĩa
    'workshop-photo-1': {
        src: 'image_asset/4.jpg',
        caption: 'The cute workshop atmosphere'
    },
    'workshop-photo-2': {
        src: 'image_asset/5.jpg',
        caption: 'Getting creative together'
    },
    'workshop-photo-3': {
        src: 'image_asset/6.jpg',
        caption: 'Our creative space'
    },
    
    // Walking photos
    'walking-photo-1': {
        src: 'image_asset/8.jpeg',
        caption: 'Our artwork - Front side'
    },
    'walking-photo-2': {
        src: 'image_asset/9.jpeg',
        caption: 'Our artwork - Back side'
    },
    'walking-photo-3': {
        src: 'image_asset/10.jpeg',
        caption: 'Us! 💕'
    },
    
    // After date photos
    'after-photo-1': {
        src: 'image_asset/11.jpg',
        caption: 'Her Instagram Story 💫'
    },
    
    // Gift photos
    'gift-14': {
        src: 'image_asset/14.jpg',
        caption: 'Flowers for you 💐'
    },
    'gift-15': {
        src: 'image_asset/15.jpg',
        caption: 'Gift from Indonesia 🇮🇩'
    }
};

function initPhotoGallery() {
    const photoFrames = document.querySelectorAll('.photo-frame, .polaroid, .gift-card');
    
    photoFrames.forEach(frame => {
        frame.addEventListener('click', () => revealPhoto(frame));
    });
}

function revealPhoto(frame) {
    if (frame.classList.contains('revealed')) return;
    
    const photoId = frame.id;
    const photoData = mockPhotos[photoId];
    
    if (photoData) {
        const img = frame.querySelector('img');
        img.src = photoData.src;
        
        // Update caption if exists
        const caption = frame.querySelector('.photo-caption, .polaroid-caption');
        if (caption && photoData.caption) {
            caption.textContent = photoData.caption;
        }
        
        // Add loading state
        img.onload = () => {
            frame.classList.add('revealed');
            
            // Add sparkle effect
            createSparkles(frame);
        };
        
        img.onerror = () => {
            // Fallback for when images can't load
            frame.classList.add('revealed');
            const placeholder = frame.querySelector('.photo-placeholder');
            if (placeholder) {
                placeholder.style.display = 'flex';
                placeholder.innerHTML = `
                    <span class="placeholder-icon">💝</span>
                    <span class="placeholder-text">Our special moment</span>
                `;
            }
        };
    }
}

function createSparkles(element) {
    const rect = element.getBoundingClientRect();
    const sparkleCount = 10;
    
    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.cssText = `
            position: fixed;
            pointer-events: none;
            font-size: ${Math.random() * 20 + 10}px;
            left: ${rect.left + Math.random() * rect.width}px;
            top: ${rect.top + Math.random() * rect.height}px;
            z-index: 2000;
            animation: sparkleAnim 1s ease forwards;
        `;
        sparkle.textContent = ['✨', '⭐', '💫', '❄️'][Math.floor(Math.random() * 4)];
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
}

// Add sparkle animation
const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
    @keyframes sparkleAnim {
        0% {
            opacity: 1;
            transform: scale(0) translateY(0);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) translateY(-20px);
        }
        100% {
            opacity: 0;
            transform: scale(0.5) translateY(-50px);
        }
    }
`;
document.head.appendChild(sparkleStyle);

// ============================================
// Video Timelapse
// ============================================
let timelapseInitialized = false;

function initTimelapse() {
    const container = document.getElementById('timelapse-container');
    const placeholder = document.getElementById('video-placeholder');
    const video = document.getElementById('timelapse-video');
    
    if (!container || !video) return;
    
    container.addEventListener('click', () => {
        if (!timelapseInitialized) {
            // First click - show and play video
            placeholder.style.display = 'none';
            video.classList.remove('hidden');
            video.play();
            timelapseInitialized = true;
            createSparkles(container);
        } else {
            // Toggle play/pause
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    });
}

// ============================================
// Quiz System - Multiple Quizzes
// ============================================
let selectedAnswers1 = new Set();
const correctAnswers1 = new Set(['nail', 'spark']);

// Quiz 1 Options - will be randomized
const quiz1Options = [
    { answer: 'nail', icon: '💅' },
    { answer: 'spark', icon: '✨' },
    { answer: 'love', icon: '❤️' },
    { answer: 'haha', icon: '😂' },
    { answer: 'angry', icon: '😠' },
    { answer: 'smile', icon: '😊' },
    { answer: 'rolling', icon: '🙄' },
    { answer: 'handmouth', icon: '🤭' }
];

// Shuffle array ensuring nail and spark are NOT adjacent
function shuffleWithConstraint(array) {
    let shuffled;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
        shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        attempts++;
    } while (areNailAndSparkAdjacent(shuffled) && attempts < maxAttempts);
    
    return shuffled;
}

// Check if nail and spark are next to each other
function areNailAndSparkAdjacent(array) {
    for (let i = 0; i < array.length - 1; i++) {
        const current = array[i].answer;
        const next = array[i + 1].answer;
        if ((current === 'nail' && next === 'spark') || 
            (current === 'spark' && next === 'nail')) {
            return true;
        }
    }
    // Also check wrap-around (last and first in grid could be visually adjacent)
    return false;
}

// Initialize Quiz 1 with randomized options
function initQuiz1() {
    const container = document.getElementById('quiz-1-options');
    if (!container) return;
    
    const shuffledOptions = shuffleWithConstraint(quiz1Options);
    
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'quiz-option';
        button.dataset.answer = option.answer;
        button.onclick = function() { selectQuiz1Option(this); };
        button.innerHTML = `<span class="option-icon">${option.icon}</span>`;
        container.appendChild(button);
    });
}

function selectQuiz1Option(button) {
    const answer = button.dataset.answer;
    
    if (selectedAnswers1.has(answer)) {
        selectedAnswers1.delete(answer);
        button.classList.remove('selected');
    } else {
        selectedAnswers1.add(answer);
        button.classList.add('selected');
    }
    
    // Clear previous feedback
    const feedback = document.getElementById('quiz-1-feedback');
    feedback.textContent = '';
    feedback.className = 'quiz-feedback';
}

function submitQuiz1() {
    const feedback = document.getElementById('quiz-1-feedback');
    
    // Check if exactly 2 answers are selected
    if (selectedAnswers1.size !== 2) {
        feedback.textContent = 'Please select exactly 2 answers! 🤔';
        feedback.className = 'quiz-feedback error';
        shakeElement(document.querySelector('#quiz-1 .quiz-card'));
        return;
    }
    
    // Check if answers are correct
    const isCorrect = 
        selectedAnswers1.size === correctAnswers1.size &&
        [...selectedAnswers1].every(answer => correctAnswers1.has(answer));
    
    if (isCorrect) {
        feedback.textContent = 'Correct! 🎉💅✨';
        feedback.className = 'quiz-feedback success';
        
        // Show reward section and next quiz
        setTimeout(() => {
            const quizContainer = document.getElementById('quiz-1');
            const rewardSection = document.getElementById('reward-section-1');
            const rewardReveal = document.getElementById('reward-reveal-1');
            const quiz2 = document.getElementById('quiz-2');
            
            quizContainer.classList.add('completed');
            rewardSection.classList.remove('hidden');
            rewardSection.classList.add('reveal');
            
            // Show quiz 2
            setTimeout(() => {
                quiz2.classList.remove('hidden');
                quiz2.classList.add('reveal');
            }, 500);
            
            // Scroll to reward reveal (the celebration message)
            setTimeout(() => {
                rewardReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
            
            // Create celebration sparkles
            for (let i = 0; i < 3; i++) {
                setTimeout(() => createSparkles(rewardReveal), i * 200);
            }
        }, 1000);
    } else {
        feedback.textContent = 'Not quite right... Try again! 💭';
        feedback.className = 'quiz-feedback error';
        shakeElement(document.querySelector('#quiz-1 .quiz-card'));
        
        // Clear selections
        selectedAnswers1.clear();
        document.querySelectorAll('#quiz-1 .quiz-option').forEach(btn => {
            btn.classList.remove('selected');
        });
    }
}

// Quiz 2: First Date
function submitQuiz2() {
    const feedback = document.getElementById('quiz-2-feedback');
    const datePicker = document.getElementById('date-picker-1');
    const selectedDate = datePicker.value;
    
    if (!selectedDate) {
        feedback.textContent = 'Please select a date! 📅';
        feedback.className = 'quiz-feedback error';
        shakeElement(document.querySelector('#quiz-2 .quiz-card'));
        return;
    }
    
    // Correct answer: 2025-12-20 (format: YYYY-MM-DD)
    const isCorrect = selectedDate === '2025-12-20';
    
    if (isCorrect) {
        feedback.textContent = 'Yes! December 20, 2025 - our special day! 🎉💕';
        feedback.className = 'quiz-feedback success';
        
        setTimeout(() => {
            const quizContainer = document.getElementById('quiz-2');
            const rewardSection = document.getElementById('reward-section-2');
            const rewardReveal = document.getElementById('reward-reveal-2');
            const quiz3 = document.getElementById('quiz-3');
            
            quizContainer.classList.add('completed');
            rewardSection.classList.remove('hidden');
            rewardSection.classList.add('reveal');
            
            // Show quiz 3
            setTimeout(() => {
                quiz3.classList.remove('hidden');
                quiz3.classList.add('reveal');
            }, 500);
            
            // Scroll to reward reveal (the celebration message)
            setTimeout(() => {
                rewardReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
            
            for (let i = 0; i < 3; i++) {
                setTimeout(() => createSparkles(rewardReveal), i * 200);
            }
        }, 1000);
    } else {
        feedback.textContent = 'Hmm, that\'s not it... Think harder! 🤔';
        feedback.className = 'quiz-feedback error';
        shakeElement(document.querySelector('#quiz-2 .quiz-card'));
    }
}

// Quiz 3: Birthday
function submitQuiz3() {
    const feedback = document.getElementById('quiz-3-feedback');
    const datePicker = document.getElementById('date-picker-2');
    const selectedDate = datePicker.value;
    
    if (!selectedDate) {
        feedback.textContent = 'Please select a date! 🎂';
        feedback.className = 'quiz-feedback error';
        shakeElement(document.querySelector('#quiz-3 .quiz-card'));
        return;
    }
    
    // Correct answer: 2001-11-09 (format: YYYY-MM-DD)
    const isCorrect = selectedDate === '2001-11-09';
    
    if (isCorrect) {
        feedback.textContent = 'You got it! November 9, 2001! 🎂🎉';
        feedback.className = 'quiz-feedback success';
        
        setTimeout(() => {
            const quizContainer = document.getElementById('quiz-3');
            const rewardSection = document.getElementById('reward-section-3');
            const rewardReveal = document.getElementById('reward-reveal-3');
            const giftsSection = document.getElementById('our-gifts-section');
            
            quizContainer.classList.add('completed');
            rewardSection.classList.remove('hidden');
            rewardSection.classList.add('reveal');
            
            // Show gifts section
            setTimeout(() => {
                giftsSection.classList.remove('hidden');
                giftsSection.classList.add('reveal');
            }, 500);
            
            // Scroll to reward reveal (the celebration message)
            setTimeout(() => {
                rewardReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
            
            for (let i = 0; i < 3; i++) {
                setTimeout(() => createSparkles(rewardReveal), i * 200);
            }
        }, 1000);
    } else {
        feedback.textContent = 'Not quite... Try again! 💭';
        feedback.className = 'quiz-feedback error';
        shakeElement(document.querySelector('#quiz-3 .quiz-card'));
    }
}

function shakeElement(element) {
    element.classList.add('shake');
    setTimeout(() => element.classList.remove('shake'), 500);
}

// Add shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    .shake {
        animation: shake 0.5s ease;
    }
`;
document.head.appendChild(shakeStyle);

// ============================================
// Cursor Trail Effect (Subtle snowflakes)
// ============================================
class CursorTrail {
    constructor() {
        this.trails = [];
        this.maxTrails = 5;
        
        document.addEventListener('mousemove', (e) => this.createTrail(e));
    }
    
    createTrail(e) {
        if (Math.random() > 0.9) { // Only occasionally create trails
            const trail = document.createElement('div');
            trail.className = 'cursor-trail';
            trail.style.cssText = `
                position: fixed;
                pointer-events: none;
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                font-size: 12px;
                opacity: 0.7;
                z-index: 999;
                animation: trailFade 1.5s ease forwards;
            `;
            trail.textContent = '❄️';
            document.body.appendChild(trail);
            
            setTimeout(() => trail.remove(), 1500);
        }
    }
}

// Add trail animation
const trailStyle = document.createElement('style');
trailStyle.textContent = `
    @keyframes trailFade {
        0% {
            opacity: 0.7;
            transform: scale(1) translateY(0);
        }
        100% {
            opacity: 0;
            transform: scale(0.3) translateY(30px);
        }
    }
`;
document.head.appendChild(trailStyle);

// ============================================
// Keyboard Navigation
// ============================================
function initKeyboardNav() {
    const sections = ['landing', 'preparation', 'thedate', 'after', 'finale', 'christmas-gift'];
    
    document.addEventListener('keydown', (e) => {
        const currentSection = document.querySelector('section.active');
        const currentIndex = sections.indexOf(currentSection.id);
        
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
            goToSection(sections[nextIndex]);
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = Math.max(currentIndex - 1, 0);
            goToSection(sections[prevIndex]);
        }
    });
}

// ============================================
// Initialize Everything
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize snow effect
    new SnowEffect();
    
    // Initialize music controller
    new MusicController();
    
    // Initialize photo gallery
    initPhotoGallery();
    
    // Initialize timelapse video
    initTimelapse();
    
    // Initialize birthday video (pause/resume music)
    initBirthdayVideo();
    
    // Initialize Quiz 1 with randomized options
    initQuiz1();
    
    // Initialize cursor trail
    new CursorTrail();
    
    // Initialize keyboard navigation
    initKeyboardNav();
    
    // Show landing section
    const landing = document.getElementById('landing');
    landing.classList.add('active');
    
    // Force music to start on page load
    setTimeout(() => {
        const bgMusic = document.getElementById('bgMusic');
        if (bgMusic) {
            bgMusic.volume = 0.5;
            bgMusic.play().catch(() => {});
        }
    }, 100);
    
    // Add welcome message to console
    console.log('%c💕 Our Story 💕', 'font-size: 24px; color: #C41E3A; font-family: serif;');
    console.log('%cMerry Christmas 2025! 🎄', 'font-size: 16px; color: #228B22;');
});

// ============================================
// Preload Images
// ============================================
function preloadImages() {
    Object.values(mockPhotos).forEach(photo => {
        const img = new Image();
        img.src = photo.src;
    });
}

// Start preloading after page load
window.addEventListener('load', preloadImages);

// ============================================
// Reset and Restart
// ============================================
function resetAndRestart() {
    // Reset quiz 1
    selectedAnswers1.clear();
    document.querySelectorAll('#quiz-1 .quiz-option').forEach(btn => {
        btn.classList.remove('selected');
    });
    document.getElementById('quiz-1').classList.remove('completed');
    document.getElementById('quiz-1-feedback').textContent = '';
    
    // Hide reward sections
    document.getElementById('reward-section-1').classList.add('hidden');
    document.getElementById('reward-section-1').classList.remove('reveal');
    document.getElementById('reward-section-2').classList.add('hidden');
    document.getElementById('reward-section-2').classList.remove('reveal');
    document.getElementById('reward-section-3').classList.add('hidden');
    document.getElementById('reward-section-3').classList.remove('reveal');
    
    // Hide quiz 2 and 3
    document.getElementById('quiz-2').classList.add('hidden');
    document.getElementById('quiz-2').classList.remove('reveal', 'completed');
    document.getElementById('quiz-2-feedback').textContent = '';
    document.getElementById('date-picker-1').value = '';
    
    document.getElementById('quiz-3').classList.add('hidden');
    document.getElementById('quiz-3').classList.remove('reveal', 'completed');
    document.getElementById('quiz-3-feedback').textContent = '';
    document.getElementById('date-picker-2').value = '';
    
    // Reset gift box
    giftOpened = false;
    const giftBox = document.getElementById('gift-box');
    if (giftBox) {
        giftBox.style.display = 'block';
        giftBox.classList.remove('gift-opening');
    }
    document.getElementById('countdown-overlay').classList.add('hidden');
    document.getElementById('confetti-container').classList.add('hidden');
    document.getElementById('confetti-container').innerHTML = '';
    document.getElementById('christmas-letter').classList.add('hidden');
    document.getElementById('christmas-letter').classList.remove('letter-reveal');
    
    // Reset timelapse video
    timelapseInitialized = false;
    const timelapsePlaceholder = document.getElementById('video-placeholder');
    const timelapseVideo = document.getElementById('timelapse-video');
    if (timelapsePlaceholder && timelapseVideo) {
        timelapsePlaceholder.style.display = 'flex';
        timelapseVideo.classList.add('hidden');
        timelapseVideo.pause();
        timelapseVideo.currentTime = 0;
    }
    
    // Reset birthday video
    const birthdayVideo = document.getElementById('birthday-video');
    if (birthdayVideo) {
        birthdayVideo.pause();
        birthdayVideo.currentTime = 0;
    }
    
    // Reset all photo frames - properly restore click functionality
    document.querySelectorAll('.photo-frame, .polaroid').forEach(frame => {
        frame.classList.remove('revealed');
        const placeholder = frame.querySelector('.photo-placeholder');
        if (placeholder) {
            placeholder.style.display = 'flex';
        }
        const img = frame.querySelector('img');
        if (img) {
            img.classList.add('hidden');
            img.src = '';
            img.style.display = '';
        }
    });
    
    // Go to landing
    goToSection('landing');
}

// ============================================
// Birthday Video - Pause/Resume Music
// ============================================
function initBirthdayVideo() {
    const video = document.getElementById('birthday-video');
    const bgMusic = document.getElementById('bgMusic');
    
    if (!video || !bgMusic) return;
    
    let musicWasPlaying = false;
    
    video.addEventListener('play', () => {
        // Check if music is playing and pause it
        if (!bgMusic.paused) {
            musicWasPlaying = true;
            bgMusic.pause();
        }
    });
    
    video.addEventListener('pause', () => {
        // Resume music if it was playing before
        if (musicWasPlaying) {
            bgMusic.play();
        }
    });
    
    video.addEventListener('ended', () => {
        // Resume music when video ends
        if (musicWasPlaying) {
            bgMusic.play();
            musicWasPlaying = false;
        }
    });
}

// ============================================
// Gift Box Animation
// ============================================
let giftOpened = false;

function openGiftBox() {
    if (giftOpened) return;
    giftOpened = true;
    
    const giftBox = document.getElementById('gift-box');
    const countdownOverlay = document.getElementById('countdown-overlay');
    const countdownNumber = document.getElementById('countdown-number');
    const confettiContainer = document.getElementById('confetti-container');
    const christmasLetter = document.getElementById('christmas-letter');
    
    // Hide gift box
    giftBox.classList.add('gift-opening');
    
    // Start countdown
    setTimeout(() => {
        giftBox.style.display = 'none';
        countdownOverlay.classList.remove('hidden');
        
        let count = 3;
        countdownNumber.textContent = count;
        
        const countdownInterval = setInterval(() => {
            count--;
            if (count > 0) {
                countdownNumber.textContent = count;
                countdownNumber.classList.add('countdown-pulse');
                setTimeout(() => countdownNumber.classList.remove('countdown-pulse'), 300);
            } else {
                clearInterval(countdownInterval);
                countdownOverlay.classList.add('hidden');
                
                // Show confetti
                confettiContainer.classList.remove('hidden');
                createConfetti();
                
                // Show letter after confetti
                setTimeout(() => {
                    christmasLetter.classList.remove('hidden');
                    christmasLetter.classList.add('letter-reveal');
                }, 1500);
            }
        }, 1000);
    }, 500);
}

function createConfetti() {
    const container = document.getElementById('confetti-container');
    const confettiCount = 150;
    const emojis = ['🎉', '🎊', '✨', '⭐', '❄️', '🎄', '🎁', '💕', '❤️', '🔔'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        confetti.style.cssText = `
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
            font-size: ${Math.random() * 20 + 15}px;
        `;
        container.appendChild(confetti);
    }
    
    // Clean up confetti after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}
