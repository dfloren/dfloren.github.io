// index.js
(function() {
  const colors = ['#E76F51','#2A9D8F','#F4A261','#264653','#E9C46A','#F7B2B7'];
  const stage = document.querySelector('.stage');
  const pieces = 70;

  function createConfetti() {
    for (let i = 0; i < pieces; i++) {
      const el = document.createElement('div');
      el.className = 'confetti';
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top  = (-Math.random() * 100) + 'vh';
      const dur = 5 + Math.random() * 5;
      el.style.animation = `fall ${dur}s linear 0s infinite`;
      el.style.zIndex = Math.floor(Math.random() * 3) + 1;
      stage.appendChild(el);
    }
  }

  createConfetti();

  window.addEventListener('keydown', e => {
    const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','PageUp','PageDown','Home','End',' '];
    if (keys.includes(e.key)) e.preventDefault();
  }, { passive: false });

  const resize = () => {
    stage.style.width = window.innerWidth + 'px';
    stage.style.height = window.innerHeight + 'px';
  };
  window.addEventListener('resize', resize);
  resize();

  const input = document.getElementById('passwordInput');
  input.type = 'password';

  const button = document.getElementById('submitBtn');
  const output = document.getElementById('output');
  const mainImage = document.getElementById('mainImage');
  const mainMessage = document.getElementById('mainMessage');
  const inputContainer = document.getElementById('inputContainer');

  button.addEventListener('click', () => {
    if (input.value === '25' || input.value === 'test') {
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
      setTimeout(() => {
        input.classList.remove('shake');
        button.classList.remove('shake');
      }, 1000);
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
    output.innerHTML = '<div class="coming-soon">Coming Soon!</div><div class="countdown" id="countdown"></div>';
    const countdownEl = document.getElementById('countdown');

    function updateCountdown() {
      const now = new Date();
      const diff = target - now;
      if (diff <= 0) { clearInterval(timer); fadeOutAndCelebrate(); return; }
      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff / (1000*60*60)) % 24);
      const minutes = Math.floor((diff / (1000*60)) % 60);
      const seconds = Math.floor((diff/1000)%60);
      countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    const timer = setInterval(updateCountdown,1000);
  }

  function fadeOutAndCelebrate() {
    // Hide Pochacco image, input field, and submit button
    mainImage.style.display = 'none';
    mainMessage.style.display = 'none';
    inputContainer.style.display = 'none';

    setTimeout(() => {
      // Center container for image and message
      const container = document.createElement('div');
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.justifyContent = 'center';
      container.style.height = '100vh';

      // Add Genny image above birthday message (max width 200px, maintain aspect ratio, no bottom margin)
      const gennyImages = ['resources/images/genny1.png', 'resources/images/genny2.png', 'resources/images/genny3.png'];
      const gennyImg = document.createElement('img');
      gennyImg.src = gennyImages[0];
      gennyImg.style.width = '200px';
      gennyImg.style.height = 'auto';
      gennyImg.style.borderRadius = '10px';
      gennyImg.style.marginBottom = '0';
      container.appendChild(gennyImg);

      // Alternate images every 0.3 seconds
      let currentIndex = 0;
      setInterval(() => {
        currentIndex = (currentIndex + 1) % gennyImages.length;
        gennyImg.src = gennyImages[currentIndex];
      }, 300);

      const birthdayMessage = document.createElement('div');
      birthdayMessage.className = 'birthday-message';
      birthdayMessage.textContent = 'Happy 25th Birthday!!!';
      container.appendChild(birthdayMessage);

      output.innerHTML = '';
      output.appendChild(container);
      output.style.opacity = 1;

      // Add mute/unmute button for music (bottom-right)
      const audio = document.createElement('audio');
      audio.src = 'resources/music/birthday_song.mp3';
      audio.loop = true;
      audio.autoplay = true;
      audio.muted = false;

      const muteBtn = document.createElement('button');
      muteBtn.textContent = '🔊';
      muteBtn.style.position = 'fixed';
      muteBtn.style.bottom = '10px';
      muteBtn.style.right = '10px';
      muteBtn.style.zIndex = 20;
      muteBtn.style.fontSize = '1.5rem';
      muteBtn.style.background = 'transparent';
      muteBtn.style.border = 'none';
      muteBtn.style.cursor = 'pointer';

      muteBtn.addEventListener('click', () => {
        audio.muted = !audio.muted;
        muteBtn.textContent = audio.muted ? '🔈' : '🔊';
      });

      document.body.appendChild(audio);
      document.body.appendChild(muteBtn);
    }, 1000);
  }
})();
