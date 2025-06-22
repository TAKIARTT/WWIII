let points = 108;
let clickCount = 0;
const maxClicks = 20;
let adPurpose = null;
let lastBoostButton = null;
const cooldownDuration = 24 * 60 * 60 * 1000;
let cooldownStart = null;

let isActive = false;
let elapsedSeconds = 0;
const maxDuration = 6 * 60 * 60;
const generationRate = 0.001;

let boostMultiplier = 1;
let boostActive = false;
let boostEndTime = null;

function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function updateDisplay() {
  document.getElementById("counter").textContent = points.toFixed(3);
  document.getElementById("rate-display").textContent = isActive
    ? (generationRate * boostMultiplier).toFixed(3)
    : "0.000";

  const autoEl = document.getElementById("auto-status");
  const clickEl = document.getElementById("click-status");

  if (cooldownStart) {
    const now = Date.now();
    const remaining = cooldownDuration - (now - cooldownStart);
    if (remaining > 0) {
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      clickEl.textContent = `Daily limit click reached  available in ${h.toString().padStart(2, '0')}:${m
        .toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    } else {
      clickCount = 0;
      cooldownStart = null;
      clickEl.textContent = "You can now tap the rocket!";
    }
  } else {
    clickEl.textContent = "";
  }

  autoEl.textContent = isActive
    ? `Active: ${formatTime(maxDuration - elapsedSeconds)} remaining`
    : `Inactive  Tap the rocket to start`;

  // ≈ÿÁ«— √Ë ≈Œ·«¡ Õ«‰… «‰»Ë” 
  const status = document.getElementById("boost-status");
  if (boostActive && boostEndTime) {
    const remaining = boostEndTime - Date.now();
    if (remaining > 0 && status) {
      const hours = Math.floor(remaining / 3600000);
      const minutes = Math.floor((remaining % 3600000) / 60000);
      status.textContent = ` Boost Active for  ${hours}h ${minutes}m`;
      status.style.display = "block";
    } else if (status) {
      status.style.display = "none";
    }
  } else if (status) {
    status.style.display = "none";
  }
}

function tapRocket() {
  const now = Date.now();
  if (cooldownStart && now - cooldownStart < cooldownDuration) return;
  if (clickCount >= maxClicks) {
    cooldownStart = now;
    return;
  }

  clickCount++;
  points += 1;
  showTapPlus('+1');
 addActivity("tap", 1)

  if (!isActive) {
    isActive = true;
    elapsedSeconds = 0;
  }

  updateDisplay();
}

function showTapPlus(text) {
  const container = document.querySelector('.rocket-container');
  const plus = document.createElement('span');
  plus.className = 'plus-one ' + (clickCount % 2 === 0 ? 'left' : 'right');
  plus.textContent = text;
  container.appendChild(plus);
  setTimeout(() => plus.remove(), 800);
}

setInterval(() => {
  if (isActive) {
    if (elapsedSeconds < maxDuration) {
      const now = Date.now();

      // «Ê Á«¡ «‰»Ë” 
      if (boostActive && boostEndTime && now >= boostEndTime) {
        boostMultiplier = 1;
        boostActive = false;
        boostEndTime = null;
        showToast(" Boost expired");

        // ≈“«‰…  √ÀÍ— «‰‘Ÿ‰… ÂÊ «‰“—
        const activeBtn = document.querySelector(".active-boost");
        if (activeBtn) activeBtn.classList.remove("active-boost");

        // ≈“«‰… «‰‘Ÿ‰… ŸÊ «‰’«—ËŒ
        const rocket = document.querySelector("#rocket");
        if (rocket) rocket.classList.remove("rocket-boosted");
      }

      const boostRate = generationRate * boostMultiplier;
      points += boostRate;
      elapsedSeconds++;
      showTapPlus(`+${boostRate.toFixed(3)}`);
    } else {
      isActive = false;
    }
  }
  updateDisplay();
}, 1000);

function activateBoost(source, button) {
  if (boostActive) {
    showToast(" Already active");
    return;
  }

  boostMultiplier = 2;
  boostActive = true;
  boostEndTime = Date.now() + 6 * 60 * 60 * 1000;

  const rocket = document.querySelector("#rocket");
  if (rocket) {
    rocket.classList.add("fly");
    rocket.classList.add("rocket-boosted"); //  √÷·Ê«  √ÀÍ— «‰‘Ÿ‰… Ÿ‰È «‰’«—ËŒ
    setTimeout(() => rocket.classList.remove("fly"), 1000);
  }

  if (button) {
    button.classList.add("active-boost"); //  ‘Ÿ‰… «‰“—
  }

  showToast(" Boost activated");
  updateDisplay();
}

function activateBoostByPoints(button) {
  if (boostActive) {
    showToast(" Already active");
    return;
  }

  if (points < 10) {
    showToast(" No enough points");
    return;
  }

  points -= 10;
  updateDisplay();
  addActivity("boost", "Points");
  activateBoost("Points", button);
}


function claimTask(button, reward) {
  button.disabled = true;
  button.textContent = "Claimed";
  points += reward;
  updateDisplay();
  showTapPlus(`+${reward}`);
}

function toggleTasks() {
  const section = document.getElementById("tasks-section");
  section.style.display = section.style.display === "none" ? "block" : "none";
}

function showTab(tabName) {
  const sections = ["home-section", "tasks-section", "rank-section", "refer-section", "profile-section"];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.display = id === `${tabName}-section` ? "block" : "none";
    }
  });

  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    const tabNameAttr = tab.dataset.tab;
    tab.classList.toggle("active", tabNameAttr === tabName);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  showTab("home");
});

function copyReferLink() {
  const input = document.getElementById("refer-link");
  input.select();
  document.execCommand("copy");
  showToast("Referral link copied!");
}

function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

function checkDailyLogin() {
  const today     = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const lastLogin = localStorage.getItem("last-login");
  let streak      = parseInt(localStorage.getItem("login-streak")) || 0;

  if (lastLogin === today) return;

  streak = (lastLogin === yesterday) ? Math.min(streak + 1, 7) : 1;
  const reward = 10 + (streak - 1) * 5;
  localStorage.setItem("last-login", today);
  localStorage.setItem("login-streak", streak);
  localStorage.setItem("daily-reward", reward);

  showDailyPopup(streak, reward);
}

function showDailyPopup(streak, reward) {
  const popup = document.getElementById("daily-popup");
  const grid  = document.getElementById("day-grid");
  const btn   = document.getElementById("daily-btn");

  grid.innerHTML = "";

  for (let i = 0; i < 7; i++) {
    const card = document.createElement("div");
    card.className = "day-card";

    if (i === streak - 1) card.classList.add("active");

    // ≈–« «‰Â„«·√… ‰Á–« «‰ÍËÂ  Â «” ‰«ÂÁ« ”«»‚Î« (ÍËÂ «‰ÍËÂ ·‚◊)
    const claimed = !localStorage.getItem("daily-reward") && (i === streak - 1);
    if (claimed) card.classList.add("selected");

    card.innerHTML = `Day ${i + 1}<br><span>+${10 + i * 5} pts</span>`;
    grid.appendChild(card);
  }

  btn.disabled = false;
  popup.classList.add("active");
}

function claimDailyReward() {
  const reward = parseInt(localStorage.getItem("daily-reward") || "0");
  if (!reward) return;

  points += reward;
  addActivity("login", reward);
  updateDisplay();
  showToast(` You received +${reward} points`);
  document.getElementById("daily-popup").classList.remove("active");
  localStorage.removeItem("daily-reward");
}

window.addEventListener("DOMContentLoaded", () => {
  showTab("home");
  updateDisplay();
  checkDailyLogin();
});


lottie.loadAnimation({
  container: document.getElementById('mystery-box'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'gift.json' // Â”«— Â‰· JSON «‰Œ«’ »„
});


function moveBoxAnywhere() {
  const box = document.getElementById('mystery-box');
  const maxX = window.innerWidth - 80;
  const maxY = window.innerHeight - 80;

  const randX = Math.random() * maxX;
  const randY = Math.random() * maxY;

  box.style.left = `${randX}px`;
  box.style.top = `${randY}px`;
}

// √Ë‰ Õ—„…
moveBoxAnywhere();

// Í Õ—„ „‰ 3.5 ÀË«ÊÌ
setInterval(moveBoxAnywhere, 3500);




function openFullScreenMenu() {
  document.getElementById('fullscreen-overlay').classList.add('active');
}

function closeOverlay() {
  document.getElementById('fullscreen-overlay').classList.remove('active');
}

function launchQuiz() {
  alert(" Coming Soon!");
}

function launchSnake() {
  alert(" Coming Soon!");
}

function launchWheel() {
  alert(" Wheel spinning coming up!");
}

const canvas = document.getElementById("wheel-canvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spin-button");
const watchAdBtn = document.getElementById("watch-ad-btn");
const spinsLeftLabel = document.getElementById("spins-left");

//  ÃË«∆“ «‰ŸÃ‰… Ë Ë“ÍŸÁ« Õ”» «‰Ë“Ê («Õ Â«‰« „)
const prizes = [
  { label: " 100 pts", weight: 0.5 },
  { label: " 50 pts", weight: 1 },
  { label: " 25 pts", weight: 3 },
  { label: " 10 pts", weight: 5 },
  { label: " 5 pts", weight: 9.5 },
  { label: " Boost x2", weight: 5 },
  { label: " Spin Again", weight: 21 },
  { label: " Nothing", weight: 55 }
];

//   œËÍ— ÂË“ËÊ Õ”» «‰«Õ Â«‰« 
function getWeightedRandom() {
  const totalWeight = prizes.reduce((acc, p) => acc + p.weight, 0);
  let rand = Math.random() * totalWeight;
  for (let i = 0; i < prizes.length; i++) {
    if (rand < prizes[i].weight) return i;
    rand -= prizes[i].weight;
  }
  return 0;
}

//  —”Â «‰ŸÃ‰…
function drawWheel() {
  const center = canvas.width / 2;
  const arc = (2 * Math.PI) / prizes.length;
  for (let i = 0; i < prizes.length; i++) {
    const start = i * arc;
    const end = start + arc;
    ctx.beginPath();
   const colors = [
  "#4DD0E1", // ·Í—Ë“Í ·« Õ
  "#FF4500", // »— ‚«‰Í Ê«—Í
  "#4CAF50", // √Œ÷— ÊŸÊ«ŸÍ
  "#2196F3", // √“—‚ ”Â«ËÍ
  "#FF69B4", // Ë—œÍ ‚ËÍ
  "#9C27B0", // »Ê·”ÃÍ Â‰„Í
  "#00BCD4", // ”Â«ËÍ Ê‚Í
  "#F06292"  // Ë—œÍ »«Á  ‰◊Í·
];

ctx.fillStyle = colors[i % colors.length];
    ctx.moveTo(center, center);
    ctx.arc(center, center, 140, start, end);
    ctx.fill();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(start + arc / 2);
    ctx.fillStyle = "#fff";
ctx.font = "bold 14px 'Segoe UI', sans-serif";
ctx.shadowColor = "rgba(0,0,0,0.4)";
ctx.shadowBlur = 2;
    ctx.fillText(prizes[i].label, 60, 4);
    ctx.restore();
  }
  ctx.beginPath();
ctx.arc(center, center, 30, 0, 2 * Math.PI);
ctx.fillStyle = "#333";
ctx.fill();

ctx.fillStyle = "#fff";
ctx.font = "bold 12px Arial";
ctx.textAlign = "center";
ctx.fillText("SPIN", center, center + 4);
}

drawWheel();

//  «‰ œËÍ— «‰ÂÕœËœ ÍËÂÍÎ«
let spinsToday = 0;
let adSpinsUsed = 0;
const baseSpins = 5;
const maxAdSpins = 5;

function updateSpinsUI() {
  const totalSpins = baseSpins + adSpinsUsed;
  spinsLeftLabel.textContent = `${totalSpins - spinsToday}`;
}

function loadSpinData() {
  const today = new Date().toDateString();
  const data = JSON.parse(localStorage.getItem("spinData")) || {};
  if (data.date !== today) {
    spinsToday = 0;
    adSpinsUsed = 0;
    saveSpinData();
  } else {
    spinsToday = data.spinsToday || 0;
    adSpinsUsed = data.adSpinsUsed || 0;
  }
  updateSpinsUI();
}

function saveSpinData() {
  const today = new Date().toDateString();
  localStorage.setItem(
    "spinData",
    JSON.stringify({
      date: today,
      spinsToday,
      adSpinsUsed
    })
  );
}

function spinWheel() {
  const totalSpins = baseSpins + adSpinsUsed;
  if (spinsToday >= totalSpins) {
    alert(" No more spins. Watch an ad or come back tomorrow!");
    return;
  }

  spinsToday++;
  saveSpinData();
  updateSpinsUI();

  let rotation = 0;
  const targetIndex = getWeightedRandom();
  const anglePerSlice = 360 / prizes.length;
  const finalAngle = 360 * 4 + (360 - targetIndex * anglePerSlice - anglePerSlice / 2);

  const interval = setInterval(() => {
    rotation += 10;
    canvas.style.transform = `rotate(${rotation}deg)`;

    if (rotation >= finalAngle) {
      clearInterval(interval);
      const prize = prizes[targetIndex].label;

      if (!prize.includes("Nothing") && !prize.includes("Spin Again")) {
        dropLossEffect();
      }

      setTimeout(() => {
        alert(` You got: ${prize}`);

        if (prize.includes("Spin Again")) {
          spinsToday--;
          saveSpinData();
          updateSpinsUI();
        }

        if (prize.includes("Boost")) {
          if (boostActive) {
            const fallbackPoints = 10;
            points += fallbackPoints;
            updateDisplay();
            showToast(` Boost already active  converted to +${fallbackPoints} pts`);
            addActivity("boost", "Converted");
          } else {
            boostActive = true;
            boostMultiplier = 2;
            boostEndTime = Date.now() + 6 * 60 * 60 * 1000;
            updateDisplay();
            showToast(" Boost activated!");
            addActivity("boost", "Spin");

            //   ‘⁄Í‰ «‰’«—ËŒ
            const rocket = document.getElementById("rocket");
            if (rocket) {
              rocket.classList.add("rocket-boosted", "fly");
              setTimeout(() => rocket.classList.remove("fly"), 1000);
            }
          }
        }

        if (
          !prize.includes("Spin Again") &&
          !prize.includes("Boost") &&
          !prize.includes("Nothing")
        ) {
          const match = prize.match(/(\d+)/);
          if (match && match[1]) {
            const numericPrize = parseInt(match[1]);
            if (!isNaN(numericPrize)) {
              points += numericPrize;
              addActivity("wheel", numericPrize);
              updateDisplay();
              showToast(` +${numericPrize} pts`);
            }
          }
        }
      }, 1000);
    }
  }, 10);
}


function watchAdAndGetSpin() {
  if (adSpinsUsed >= maxAdSpins) {
    alert(" You've used all ad spins for today.");
    return;
  }
  alert(" Thanks for watching the ad!");
  adSpinsUsed++;
  saveSpinData();
  updateSpinsUI();
}


function openWheel() {
  document.getElementById("wheel-overlay").style.display = "flex";
}

function closeWheel() {
  document.getElementById("wheel-overlay").style.display = "none";
}

// Ê—»◊ «‰√Õœ«À »Ÿœ  ÕÂÍ‰ «‰’·Õ…
// »Ÿœ  ÕÂÍ‰ «‰’·Õ…
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("spin-button").addEventListener("click", openWheel);
  document.getElementById("real-spin-button").addEventListener("click", spinWheel);
  document.getElementById("watch-ad-btn").addEventListener("click", watchAdAndGetSpin);
  loadSpinData();
});

function dropLossEffect() {
  const container = document.getElementById("confetti-container");
  for (let i = 0; i < 30; i++) {
    const c = document.createElement("div");
    c.classList.add("confetti");
    c.style.left = Math.random() * 100 + "%";
    c.style.backgroundColor = i % 2 ? "#ccc" : "#ffcc00";
    container.appendChild(c);

    setTimeout(() => container.removeChild(c), 1600);
  }
}



let activityLog = [];


function addActivity(type, value) {
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const icons = {
    boost: "",
    bot: "",
    wheel: "",
    login: "",
    tap: ""
  };

  const descriptions = {
    boost: value === "Ad"
  ? `Boost activated via Ad (x2)`
  : value === "Points"
  ? `Boost activated with Points (x2)`
  : value === "Spin"
  ? `Boost won from Wheel (x2)`
  : value === "Converted"
  ? `Wheel Boost auto-converted +10 pts`
  : `Boost activated (${value})`,
    bot: `Bot reward +${value} pts`,
    wheel: `Wheel prize +${value} pts`,
    login: `Daily login +${value} pts`,
    tap: `Tap reward +${value} pts`
  };

  const message = descriptions[type] || `${type} +${value}`;

  //  œÂÃ Tap reward ·Í «‰”◊— «‰√Ë‰ ·‚◊
  if (
    type === "tap" &&
    activityLog.length > 0 &&
    activityLog[0].message.includes("Tap reward")
  ) {
    const prev = activityLog[0];
    const prevValue = parseInt(prev.message.match(/(\d+)/)?.[1] || "0");
    const newValue = prevValue + value;
    prev.message = `Tap reward +${newValue} pts`;
    prev.time = time;
  } else {
    activityLog.unshift({ icon: icons[type] || "", message, time });
  }

  renderActivityList();
}




function renderActivityList() {
  const list = document.getElementById("activity-list");
  list.innerHTML = "";

  activityLog.forEach(entry => {
    const div = document.createElement("div");
    div.className = "activity-item";
    div.innerHTML = `
      <span>${entry.icon} ${entry.message}</span>
      <span style="opacity:0.6;">${entry.time}</span>
    `;
    list.appendChild(div);
  });
}

document.querySelector(".activity-button")?.addEventListener("click", openActivityLog);
function openActivityLog() {
  document.getElementById("activity-log-modal").classList.add("show");
}

function closeActivityLog() {
  document.getElementById("activity-log-modal").classList.remove("show");
}



function updateActivityList(entries) {
  const container = document.getElementById("activity-list");
  const emptyMsg = document.getElementById("empty-message");

  // ≈“«‰… „‰ «‰ŸÊ«’— «‰”«»‚…
  container.querySelectorAll(".activity-item").forEach(e => e.remove());

  if (!entries || entries.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
    entries.forEach(entry => {
      const div = document.createElement("div");
      div.className = "activity-item";
      div.textContent = entry;
      container.appendChild(div);
    });
  }
} 


document.getElementById("spin-image-button").addEventListener("click", () => {
  spinWheel(); //   œË— «‰ŸÃ‰… ·‚◊
});




//Show Ad

window.addEventListener("DOMContentLoaded", function () {
  const AdController = window.Adsgram.init({ blockId: "12078" });

  let adPurpose = null;
  let lastBoostButton = null;

  const modal     = document.getElementById("ad-modal");
  const messageEl = document.getElementById("ad-message");
  const closeBtn  = document.getElementById("close-ad-btn");

  modal.style.display = "none";
  closeBtn.style.display = "none";

  function activateBoostByAd(button) {
    if (boostActive) {
      showToast(" Boost already active");
      return;
    }

    adPurpose = "boost";
    lastBoostButton = button;
    showAd();
  }

  function openAdModal(purpose = null, button = null) {
    if (purpose === "spin" && adSpinsUsed >= maxAdSpins) {
      showToast(" No more ads today. Come back tomorrow!");
      return;
    }

    adPurpose = purpose;
    lastBoostButton = button;
    showAd();
  }

  document.getElementById("watch-ad-btn").addEventListener("click", () => {
    openAdModal("spin");
  });

  document.getElementById("boost-ad-btn").addEventListener("click", function () {
  activateBoostByAd(this);
});

  function showAd() {
    modal.style.display = "flex";
    messageEl.textContent = " Loading your ad...";
    closeBtn.style.display = "none";

    AdController.show()
      .then(() => {
        messageEl.textContent = " Ad finished! Tap to claim your reward.";
        closeBtn.textContent = " Claim Reward";
        closeBtn.style.display = "inline-block";

        closeBtn.onclick = () => {
          modal.style.display = "none";

          if (adPurpose === "spin") {
            adSpinsUsed++;
            saveSpinData();
            updateSpinsUI();
            showToast(" +1 spin added!");
          }

          if (adPurpose === "boost") {
            activateBoost("Ad", lastBoostButton);
            addActivity("boost", "Ad");
          }

          adPurpose = null;
          lastBoostButton = null;
        };
      })
      .catch((err) => {
        console.warn("Ad Error:", err);
        closeBtn.style.display = "none";

        setTimeout(() => {
          modal.style.display = "none";
          showToast("Failed to Load Ad");
          adPurpose = null;
          lastBoostButton = null;
        }, 2500);
      });
  }
  
});