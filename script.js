let points = 108;
let clickCount = 0;
const maxClicks = 20;

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

  // إظهار أو إخفاء حالة البوست
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

      // انتهاء البوست
      if (boostActive && boostEndTime && now >= boostEndTime) {
        boostMultiplier = 1;
        boostActive = false;
        boostEndTime = null;
        showToast("🔋 Boost expired");

        // إزالة تأثير الشعلة من الزر
        const activeBtn = document.querySelector(".active-boost");
        if (activeBtn) activeBtn.classList.remove("active-boost");

        // إزالة الشعلة عن الصاروخ
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
    showToast("🚀 Already active");
    return;
  }

  boostMultiplier = 2;
  boostActive = true;
  boostEndTime = Date.now() + 6 * 60 * 60 * 1000;

  const rocket = document.querySelector("#rocket");
  if (rocket) {
    rocket.classList.add("fly");
    rocket.classList.add("rocket-boosted"); // 🌟 أضفنا تأثير الشعلة على الصاروخ
    setTimeout(() => rocket.classList.remove("fly"), 1000);
  }

  if (button) {
    button.classList.add("active-boost"); // 🔥 شعلة الزر
  }

  showToast("🚀 Boost activated");
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
  activateBoost("Points", button);
}

function activateBoostByAd(button) {
  if (boostActive) {
    showToast(" Already active");
    return;
  }

  window.open("https://youradlink.com", "_blank");

  setTimeout(() => {
    activateBoost("Ad", button);
  }, 15000);
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
