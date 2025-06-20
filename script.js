let points = 108;
let clickCount = 0;
const maxClicks = 20;

const cooldownDuration = 24 * 60 * 60 * 1000;
let cooldownStart = null;

let isActive = false;
let elapsedSeconds = 0;
const maxDuration = 6 * 60 * 60;
const generationRate = 0.001;

let boostActive = false;
let boostMultiplier = 1;

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
  // عرض القسم المطلوب
  const sections = ["home-section", "tasks-section", "rank-section", "refer-section", "profile-section"];
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === `${tabName}-section` ? "block" : "none";
  });

  // تحديث التبويبات
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach(tab => {
    const tabNameAttr = tab.dataset.tab;
    tab.classList.toggle("active", tabNameAttr === tabName);
  });
}

function copyReferLink() {
  const input = document.getElementById("refer-link");
  input.select();
  document.execCommand("copy");
  alert("Referral link copied!");
}
