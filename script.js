// Toggle mobile menu
function toggleMenu() {
  document.getElementById('navLinks').classList.toggle('active');
}

// Scroll-reveal for .slide-up
const slideEls = document.querySelectorAll('.slide-up');
function revealOnScroll() {
  slideEls.forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 80) {
      el.classList.add('visible');
    }
  });
}
window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

// Flash effect on panic
let panicCount = 0;
function playAlarm() {
  const sound = document.getElementById('alarm-sound');
  sound.currentTime = 0;
  sound.play();

  const btn = document.querySelector('#panic .btn-red');
  btn.classList.add('flash');
  setTimeout(() => btn.classList.remove('flash'), 1500);

  const main = document.querySelector('main');
  main.style.transform = 'translateX(-2px)';
  setTimeout(() => main.style.transform = 'translateX(2px)', 50);
  setTimeout(() => main.style.transform = 'translateX(0)', 100);

  panicCount++;
  document.getElementById('count').innerText = panicCount;
}

// Flash CSS
const style = document.createElement('style');
style.innerHTML = `
@keyframes flashGlow {
  from { box-shadow: 0 0 10px #ff3333; }
  to   { box-shadow: 0 0 40px #ff0000; }
}
.btn-red.flash {
  animation: flashGlow .5s alternate 3;
}`;
document.head.appendChild(style);

// Launch missiles
let missileCount = 0;

function launchMissiles() {
  const missileTotal = 5; //  Ÿœœ «‰’Ë«—ÍŒ
  const interval = 2000;  //  »ÍÊ „‰ ’«—ËŒ Ë«‰‰Í »ŸœÁ (2s)

  for (let i = 0; i < missileTotal; i++) {
    setTimeout(() => fireMissile(), i * interval);
  }

  const launchBtn = document.getElementById("launchMissileButton");
  launchBtn.classList.add("disabled");

  //  ≈Ÿ«œ… «‰ ·ŸÍ‰ »Ÿœ «Ê Á«¡ ¬Œ— ’«—ËŒ
  setTimeout(() => {
    launchBtn.classList.remove("disabled");
  }, missileTotal * interval + 1000); // Á«Â‘ √Â«Ê »Ÿœ ¬Œ— Ë«Õœ
}

function fireMissile() {
  const missile = document.createElement("img");
  missile.src = "missile.png";
  missile.style.position = "fixed";
  missile.style.top = "-100px";
  const left = Math.random() * (window.innerWidth - 60);
  missile.style.left = left + "px";
  missile.style.width = "60px";
  missile.style.zIndex = 9999;
  missile.style.transition = "top 3s linear";
  document.body.appendChild(missile);

  //  ’Ë  ≈◊‰«‚ ÂŒ’’ ‰Á–« «‰’«—ËŒ ·‚◊
  const rocket = new Audio("rocket.mp3");
  rocket.play();

  // œŒ«Ê
  const smoke = document.createElement("div");
  smoke.className = "smoke";
  smoke.style.left = (left + 15) + "px";
  smoke.style.top = "60px";
  document.body.appendChild(smoke);
  setTimeout(() => smoke.remove(), 2000);

  //  Õ—Í„ «‰’«—ËŒ
  requestAnimationFrame(() => {
    missile.style.top = window.innerHeight + "px";
  });

  // «‰«Ê·Ã«—
  setTimeout(() => {
    const explosion = document.createElement("div");
    explosion.className = "explosion";
    const missileBottom = missile.getBoundingClientRect().bottom + window.scrollY;
    explosion.style.left = left + "px";
    explosion.style.top = (missileBottom - 60) + "px";
    document.body.appendChild(explosion);

    // «Á “«“ «‰‘«‘…
    const container = document.querySelector("main") || document.body;
    container.classList.remove("shake");
    void container.offsetWidth;
    container.classList.add("shake");

    setTimeout(() => {
      explosion.remove();
      missile.remove();
    }, 500);
  }, 3100);

  //  ÕœÍÀ «‰Ÿœ«œ
  missileCount++;
  const counter = document.getElementById("missileCount");
  if (counter) counter.textContent = missileCount;
}
// Countdown with alarm start
function startFullscreenCountdown(callback) {
  const el = document.getElementById("fullscreenCountdown");
  const alarm = document.getElementById("alarm-sound");
  const rocket = document.getElementById("rocket-sound");

  let count = 10;
  el.textContent = count;
  el.classList.add("active");

  //   Ÿ◊Í‰ «‰”Õ»
  document.body.classList.add("no-scroll");

  //  ‘⁄Í‰ ’Ë  «‰≈Ê–«—
  if (alarm && alarm.paused) {
    alarm.play();
  }

  const interval = setInterval(() => {
    count--;
    el.textContent = count;

    if (count === 0) {
      clearInterval(interval);
      setTimeout(() => {
        el.classList.remove("active");

        if (rocket) {
          rocket.currentTime = 0;
          rocket.play();
        }

        callback();

        //  ≈Ÿ«œ… «‰ Â—Í— »Ÿœ 7.5 À«ÊÍ… (Õ”» Ë‚  «‰’Ë«—ÍŒ)
        setTimeout(() => {
          document.body.classList.remove("no-scroll");
        }, 7500);

      }, 500);
    }
  }, 1000);
}
  
  //FAQ
  const items = document.querySelectorAll('.faq-item');
items.forEach(item => {
  const btn   = item.querySelector('.faq-question');
  const ans   = item.querySelector('.faq-answer');

  btn.addEventListener('click', () => {
    // √⁄‰‚ »«‚Í «‰√”∆‰…
    items.forEach(i => {
      if (i !== item) {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      }
    });
    // »œÒ‰ Õ«‰… «‰”ƒ«‰ «‰Õ«‰Í
    const isActive = item.classList.toggle('active');
    if (isActive) {
      // ÕœÒœ «‰«— ·«Ÿ Ÿ‰È Â‚«” «‰ÂÕ ËÈ ‰‰«Ê“‰«‚
      ans.style.maxHeight = ans.scrollHeight + 'px';
    } else {
      ans.style.maxHeight = null;
    }
  });
});

// Copy address
 

function copyAddress() {
  const address = document.getElementById("contractAddress").innerText;
  navigator.clipboard.writeText(address).then(function () {
    const btn = document.getElementById("copyBtn");
    btn.innerText = " Copied!";
    setTimeout(() => {
      btn.innerText = " Copy";
    }, 2000);
  });
}
  
  
  //COUNTDOWN 
  
  let tokenLaunched = false;

  window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("launchAction");
    const launchTime = new Date("2025-07-15T00:00:00").getTime();

    const update = setInterval(() => {
      const now = Date.now();
      const diff = launchTime - now;

      if (diff <= 0) {
        clearInterval(update);
        container.innerHTML = `
          <a href="https://pump.fun/your-coin-link"
             target="_blank"
             class="buy-button">
              Buy $WWIII
          </a>`;
        enableTokenUI(); //  ·„ «‰ ÂËÍÁ ŸÊœ «‰≈◊‰«‚
        return;
      }

      // Õ”«» «‰Ë‚  «‰Â »‚Í
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);

      const btn = container.querySelector(".countdown-button");
      if (btn) {
        btn.textContent = ` Launch In: ${d}d ${h}h ${m}m ${s}s`;
      }
    }, 1000);
  });

  function enableTokenUI() {
    tokenLaunched = true;
    document.getElementById('contractAddress')?.classList.remove('blurred');
  }
