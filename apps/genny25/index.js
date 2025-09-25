(function () {
    const colors = ['#E76F51', '#2A9D8F', '#F4A261', '#264653', '#E9C46A', '#F7B2B7'];
    const stage = document.querySelector('.stage');
    const pieces = 70;

    // Confetti
    function createConfetti() {
        for (let i = 0; i < pieces; i++) {
            const el = document.createElement('div');
            el.className = 'confetti';
            el.style.background = colors[Math.floor(Math.random() * colors.length)];
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = (-Math.random() * 100) + 'vh';
            const dur = 5 + Math.random() * 5;
            el.style.animation = `fall ${dur}s linear 0s infinite`;
            el.style.zIndex = Math.floor(Math.random() * 3) + 1;
            stage.appendChild(el);
        }
    }
    createConfetti();

    const pastelColors = ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF'];

    // Balloons
    function createBalloons(count = 30) {
        const swayAnimations = [
            'sway1 4s ease-in-out infinite alternate',
            'sway2 5s ease-in-out infinite alternate',
            'sway3 6s ease-in-out infinite alternate'
        ];

        for (let i = 0; i < count; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            const color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
            balloon.style.backgroundColor = color;
            balloon.style.color = color; // triangle inherits balloon color
            balloon.style.left = Math.random() * 90 + 'vw';
            balloon.style.top = Math.random() * 90 + 'vh';
            balloon.style.animation = swayAnimations[Math.floor(Math.random() * swayAnimations.length)];
            stage.appendChild(balloon);
        }
    }
    createBalloons(30);

    // Disable scroll keys
    window.addEventListener('keydown', e => {
        const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','PageUp','PageDown','Home','End',' '];
        if (keys.includes(e.key)) e.preventDefault();
    }, { passive: false });

    // Password input
    const input = document.getElementById('passwordInput');
    input.type = 'password';
    const button = document.getElementById('submitBtn');
    const output = document.getElementById('output');
    const mainImage = document.getElementById('mainImage');
    const mainMessage = document.getElementById('mainMessage');
    const inputContainer = document.getElementById('inputContainer');
    const PASSWORDS = ['25','test'];

    // Shake animation reset
    input.addEventListener('animationend', () => input.classList.remove('shake'));
    button.addEventListener('animationend', () => button.classList.remove('shake'));

    button.addEventListener('click', () => {
        if (PASSWORDS.includes(input.value)) {
            const bypass = input.value === 'test';
            if (input.value === '25') {
                input.disabled = true;
                button.disabled = true;
                button.style.backgroundColor = '#999';
                button.style.cursor = 'not-allowed';
            }
            handlePassword(bypass);
        } else {
            input.value = '';
            input.classList.add('shake');
            button.classList.add('shake');
        }
    });

    function handlePassword(bypass) {
        const target = new Date('2025-09-26T04:00:00Z');
        const now = new Date();
        if (!bypass && now < target) {
            showCountdown(target);
        } else {
            fadeOutAndCelebrate();
        }
    }

    function showCountdown(target) {
        output.innerHTML = `
            <div class="coming-soon">Coming Soon!</div>
            <div class="countdown" id="countdown"></div>
        `;
        const countdownEl = document.getElementById('countdown');

        function updateCountdown() {
            const now = new Date();
            const diff = target - now;
            if (diff <= 0) { clearInterval(timer); fadeOutAndCelebrate(); return; }
            const days = Math.floor(diff / (1000*60*60*24));
            const hours = Math.floor((diff / (1000*60*60)) % 24);
            const minutes = Math.floor((diff / (1000*60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);
            countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }

        updateCountdown();
        const timer = setInterval(updateCountdown, 1000);
    }

    function fadeOutAndCelebrate() {
        mainImage.style.display = 'none';
        mainMessage.style.display = 'none';
        inputContainer.style.display = 'none';

        setTimeout(() => {
            const container = document.createElement('div');
            container.className = 'polaroid-container';

            const polaroid = document.createElement('div');
            polaroid.className = 'polaroid';
            polaroid.style.position = 'relative';

            // Notification badge
            const badge = document.createElement('div');
            badge.className = 'notification-badge';
            badge.textContent = '📧';
            polaroid.appendChild(badge);

            // Genny image carousel
            const gennyImages = [
                'resources/images/genny1.png',
                'resources/images/genny2.png',
                'resources/images/genny3.png'
            ];
            const gennyImg = document.createElement('img');
            gennyImg.src = gennyImages[0];
            polaroid.appendChild(gennyImg);

            let currentIndex = 0;
            setInterval(() => {
                currentIndex = (currentIndex + 1) % gennyImages.length;
                gennyImg.src = gennyImages[currentIndex];
            }, 300);

            // Birthday message
            const birthdayMessage = document.createElement('div');
            birthdayMessage.className = 'birthday-message';
            birthdayMessage.textContent = 'Happy 25th Birthday!!!';
            polaroid.appendChild(birthdayMessage);

            container.appendChild(polaroid);
            output.innerHTML = '';
            output.appendChild(container);

            // Shake animation
            function startShake() {
                let start = Date.now();
                function shake() {
                    let elapsed = Date.now() - start;
                    if (elapsed > 1000) {
                        birthdayMessage.style.transform = 'rotate(0deg) translateX(0px)';
                        return;
                    }
                    let angle = 20 * Math.sin((elapsed / 1000) * Math.PI * 6);
                    let translateX = 10 * Math.sin((elapsed / 1000) * Math.PI * 12);
                    birthdayMessage.style.transform = `rotate(${angle}deg) translateX(${translateX}px)`;
                    requestAnimationFrame(shake);
                }
                shake();
            }
            startShake();
            setInterval(startShake, 5000);

            // Audio
            const audio = document.createElement('audio');
            audio.src = 'resources/music/birthday_song.mp3';
            audio.loop = true;
            audio.autoplay = true;
            audio.muted = false;

            const muteBtn = document.createElement('button');
            muteBtn.className = 'mute-btn';
            muteBtn.textContent = '🔊';
            muteBtn.addEventListener('click', () => {
                audio.muted = !audio.muted;
                muteBtn.textContent = audio.muted ? '🔈' : '🔊';
            });

            document.body.appendChild(audio);
            document.body.appendChild(muteBtn);

            // Letter modal
            const letterModal = document.createElement('div');
            letterModal.className = 'letter-modal';
            letterModal.innerHTML = `
                <button class="close-btn">&times;</button>
                <div class="letter-image">
                  <img src="resources/images/danielgenny2.png" alt="Daniel & Genny" />
                </div>
                <div class="letter-content">
                  <p>🎉🎉 Happy 25th Birthday, my Love! 💖🎉🎉</p>
                  <p>Mahal na mahal kita! ❤️</p>
                  <p>Words cannot fully express how grateful I am to have you as my partner in life.</p>
                  <p>Your smile fills my heart with warmth and makes me feel completely at home.</p>
                  <p>You inspire me to grow, laugh, and become a better person every single day.</p>
                  <p>I want to remind you how deeply I love you and how excited I am for all the memories we will create together in the years to come.</p>
                  <p>Time flies whenever I'm with you, every moment feels like a beautiful dream.</p>
                  <p>I can't wait to spend forever with you, sharing adventures, laughter, and love along the way.</p>
                  <p>Life is brighter, happier, and more meaningful with you by my side.</p>
                  <p>I love you more than words can say, Genny.</p>
                  <p>Happy Birthday again, my love! 🎂🎈💖</p>
                  <div class="letter-bottom-image">
                    <img src="resources/images/danielgenny3.png" alt="Daniel & Genny" />
                  </div>
                </div>
            `;
            document.body.appendChild(letterModal);

            // Open modal on badge click
            badge.addEventListener('click', () => {
                letterModal.classList.add('show');
            });

            // Close modal on close button
            letterModal.querySelector('.close-btn').addEventListener('click', () => {
                letterModal.classList.remove('show');
            });

            // Close modal when clicking outside
            document.addEventListener('click', (e) => {
                if (!letterModal.contains(e.target) && !badge.contains(e.target)) {
                    letterModal.classList.remove('show');
                }
            });

        }, 1000);
    }
})();
