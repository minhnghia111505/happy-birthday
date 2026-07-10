document.addEventListener('DOMContentLoaded', () => {
    // ---- Elements Setup ----
    const screens = {
        welcome: document.getElementById('welcome-screen'),
        giftBox: document.getElementById('gift-box-screen'),
        cake: document.getElementById('birthday-cake-screen'),
        message: document.getElementById('secret-message-screen'),
        gallery: document.getElementById('memory-gallery-screen'),
        final: document.getElementById('final-wish-screen'),
        end: document.getElementById('end-screen')
    };

    const buttons = {
        openGift: document.getElementById('btn-open-gift'),
        blowCandle: document.getElementById('btn-blow-candle'),
        readMessage: document.getElementById('btn-read-message'),
        nextGallery: document.getElementById('btn-next-gallery'),
        nextWish: document.getElementById('btn-next-wish'),
        claimGift: document.getElementById('btn-claim-gift'),
        closePopup: document.getElementById('btn-close-popup'),
        replay: document.getElementById('btn-replay')
    };
    
    const ui = {
        animatedGift: document.getElementById('animated-gift'),
        flame: document.querySelector('.flame'),
        glow: document.querySelector('.glow'),
        makeWishText: document.getElementById('make-wish-text'),
        envelopeWrapper: document.getElementById('envelope-wrapper'),
        typedMessage: document.getElementById('typed-message'),
        giftPopup: document.getElementById('gift-popup'),
        musicControl: document.getElementById('music-control'),
        musicIcon: document.getElementById('music-icon')
    };

    let isMusicPlaying = false;
    let ytPlayer;

    // Khởi tạo YouTube Player
    window.onYouTubeIframeAPIReady = function() {
        ytPlayer = new YT.Player('youtube-audio', {
            height: '0',
            width: '0',
            // ID bài Hơn Cả Yêu - Đức Phúc (Nhạc Việt tình cảm trẻ trung)
            videoId: '9vA_w5lXqZ4', 
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'rel': 0,
                'showinfo': 0,
                'loop': 1,
                'playlist': '9vA_w5lXqZ4'
            }
        });
    };

    // === LỜI CHÚC CỦA BẠN ===
    const secretText = "Chúc em yêu sinh nhật thật vui vẻ và hạnh phúc nhé! Cảm ơn em vì đã đến và mang lại cho anh thật nhiều niềm vui. Chúc cho nụ cười trên môi em luôn rạng rỡ, và chúng ta sẽ cùng nhau tạo thêm thật nhiều kỷ niệm đẹp nữa nhé. Anh yêu em nhiều! Happy Birthday công chúa của anh! 🎂💖";

    // ---- Canvas Particles Background (Fireflies) ----
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 1 - 0.5;
            this.speedY = Math.random() * 1 - 0.5;
            this.opacity = Math.random();
            this.fadeSpeed = Math.random() * 0.02 + 0.005;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            
            // Fading effect
            this.opacity += this.fadeSpeed;
            if(this.opacity >= 1 || this.opacity <= 0) this.fadeSpeed *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 200, ${Math.abs(this.opacity)})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 60; i++) {
            particles.push(new Particle());
        }
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    
    initParticles();
    animateParticles();

    // ---- Helper Functions ----

    function switchScreen(currentScreen, nextScreen) {
        currentScreen.classList.remove('active');
        setTimeout(() => {
            currentScreen.classList.add('hidden');
            nextScreen.classList.remove('hidden');
            void nextScreen.offsetWidth; 
            nextScreen.classList.add('active');
        }, 800); 
    }

    function toggleMusic(forcePlay = false) {
        if (!ytPlayer || typeof ytPlayer.playVideo !== 'function') return;

        if (forcePlay || !isMusicPlaying) {
            ytPlayer.playVideo();
            isMusicPlaying = true;
            ui.musicIcon.textContent = '🎵';
            ui.musicControl.style.animation = 'pulse 2s infinite';
        } else {
            ytPlayer.pauseVideo();
            isMusicPlaying = false;
            ui.musicIcon.textContent = '🔇';
            ui.musicControl.style.animation = 'none';
        }
    }

    function shootConfetti(colors = ['#ffb6b9', '#fae3d9', '#bbded6', '#ff8a8c']) {
        const duration = 2500;
        const end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: colors, zIndex: 100 });
            confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: colors, zIndex: 100 });
            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }

    function typeWriter(text, i, fnCallback) {
        if (i < text.length) {
            ui.typedMessage.innerHTML = text.substring(0, i+1) + '<span aria-hidden="true" class="cursor">|</span>';
            setTimeout(function() { typeWriter(text, i + 1, fnCallback); }, 50); 
        } else {
            ui.typedMessage.innerHTML = text; 
            if (typeof fnCallback == 'function') setTimeout(fnCallback, 800);
        }
    }

    // ---- Event Listeners ----

    ui.musicControl.addEventListener('click', () => toggleMusic(false));

    // 1. Màn hình mở quà
    buttons.openGift.addEventListener('click', () => {
        toggleMusic(true);
        switchScreen(screens.welcome, screens.giftBox);
        
        setTimeout(() => {
            ui.animatedGift.classList.add('shake-anim');
            setTimeout(() => {
                ui.animatedGift.classList.remove('shake-anim');
                ui.animatedGift.classList.add('zoom-out-open');
                shootConfetti();
                
                setTimeout(() => {
                    switchScreen(screens.giftBox, screens.cake);
                }, 1200);
            }, 1800);
        }, 800);
    });

    // 2. Thổi nến
    buttons.blowCandle.addEventListener('click', () => {
        ui.flame.classList.add('off');
        ui.glow.classList.add('off');
        
        confetti({
            particleCount: 30, spread: 50, origin: { y: 0.4 },
            colors: ['#cccccc', '#e0e0e0'], gravity: -0.2, ticks: 150, zIndex: 100
        });

        buttons.blowCandle.classList.add('hidden');
        ui.makeWishText.classList.remove('hidden');

        setTimeout(() => switchScreen(screens.cake, screens.message), 3500);
    });

    // 3. Mở thư 3D
    buttons.readMessage.addEventListener('click', () => {
        buttons.readMessage.classList.add('hidden');
        ui.envelopeWrapper.classList.add('open'); // Mở nắp thư & giấy kéo lên
        
        setTimeout(() => {
            typeWriter(secretText, 0, () => {
                buttons.nextGallery.classList.remove('hidden');
            });
        }, 1500); // Chờ animation giấy kéo lên hoàn tất
    });

    // 4. Chuyển sang Ảnh
    buttons.nextGallery.addEventListener('click', () => switchScreen(screens.message, screens.gallery));

    // Logic lật ảnh Polaroid
    const polaroids = document.querySelectorAll('.polaroid');
    let currentPolaroid = polaroids.length - 1; // Bắt đầu từ ảnh trên cùng (index lớn nhất)

    polaroids.forEach((polaroid, index) => {
        polaroid.addEventListener('click', () => {
            if (index !== currentPolaroid) return; // Chỉ cho phép click ảnh trên cùng
            
            polaroid.classList.add('leave');
            currentPolaroid--;
            
            if(currentPolaroid >= 0) {
                polaroids[currentPolaroid].classList.add('active');
            } else {
                // Hết ảnh, reset hoặc hiện nút đi tiếp
                setTimeout(() => {
                    polaroids.forEach(p => { p.classList.remove('leave'); p.classList.remove('active'); });
                    currentPolaroid = polaroids.length - 1;
                    polaroids[currentPolaroid].classList.add('active');
                }, 1000);
            }
        });
    });

    // 5. Chuyển sang Lời ước cuối
    buttons.nextWish.addEventListener('click', () => switchScreen(screens.gallery, screens.final));

    // 6. Nhận quà & Mở Popup
    buttons.claimGift.addEventListener('click', () => {
        ui.giftPopup.classList.add('show');
        shootConfetti(['#ffdf00', '#ff8a8c', '#ffffff']);
    });

    buttons.closePopup.addEventListener('click', () => {
        ui.giftPopup.classList.remove('show');
        setTimeout(() => switchScreen(screens.final, screens.end), 500);
    });

    // 7. Xem lại
    buttons.replay.addEventListener('click', () => {
        window.location.reload(); // Cách sạch nhất để reset toàn bộ trạng thái animation phức tạp
    });
});
