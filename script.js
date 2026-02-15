const envelopeWrap = document.getElementById("envelopeWrap");
const envelope = document.getElementById("envelope");
const messageEl = document.getElementById("message");

const sparkleBtn = document.getElementById("sparkleBtn");
const copyBtn = document.getElementById("copyBtn");

const bananaCountEl = document.getElementById("bananaCount");
const bananaBtn = document.getElementById("bananaBtn");

const boopBtn = document.getElementById("boopBtn");

// lightbox elements will be created dynamically

let bananaCount = 0;

// ✅ YOUR MESSAGE (baked in)
// Personal romantic message
const messageText = `Happy Valentine’s Day, Ishita 🍌🐒💛

This little monkey misses you soooo much.
He’s trying to act brave, but honestly… it’s hard for him to explain to his favourite human how much he loves her.

I can’t wait for you to be back in Glasgow — back to our tree 🌳
Until then, please accept unlimited hugs from this clingy monkey.

— your monkeee`;

// Sequential reveal (typewriter-like) so text appears in sequence
messageEl.textContent = "";
function typewriter(el, text, speedMs = 16) {
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i];
    i++;
    if (i >= text.length) clearInterval(timer);
  }, speedMs);
}

// Start the reveal shortly after load
setTimeout(() => typewriter(messageEl, messageText, 16), 260);

if (bananaBtn && bananaCountEl) {
  bananaBtn.addEventListener("click", () => {
    bananaCount += 1;
    bananaCountEl.textContent = bananaCount;
    popConfetti(bananaCount % 5 === 0 ? 140 : 50);
  });
}

if (sparkleBtn) sparkleBtn.addEventListener("click", () => popConfetti(260));

if (copyBtn) copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(messageText);
    copyBtn.textContent = "Copied ✅";
    setTimeout(() => (copyBtn.textContent = "Copy note"), 1400);
  } catch {
    const ta = document.createElement("textarea");
    ta.value = messageText;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    copyBtn.textContent = "Copied ✅";
    setTimeout(() => (copyBtn.textContent = "Copy note"), 1400);
  }
});

/* Cute boop: tiny beep + hearts */
if (boopBtn) {
  boopBtn.addEventListener("click", () => {
    popConfetti(90);
    boopBtn.textContent = "booped 🥹💛";
    setTimeout(() => (boopBtn.textContent = "👆 Boop monkey nose"), 1200);
    tryBoopSound();
  });
} else console.warn('boopBtn not found');

function tryBoopSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = 740;
    g.gain.value = 0.05;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    setTimeout(() => { o.stop(); ctx.close(); }, 90);
  } catch {}
}

// Remove chips/reasons functionality (section removed)

// Images: no magnify/lightbox — they should display fully in the grid

/* Banana confetti */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

let particles = [];
function popConfetti(count = 180) {
  const w = canvas.width, h = canvas.height;
  const cx = w * 0.5, cy = h * 0.18;

  for (let i = 0; i < count; i++) {
    const isBanana = Math.random() < 0.55;
    particles.push({
      x: cx,
      y: cy,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -8 - 3,
      g: 0.22 + Math.random() * 0.08,
      r: isBanana ? (6 + Math.random() * 4) : (3 + Math.random() * 4),
      life: 120 + Math.random() * 60,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      hue: isBanana ? (40 + Math.random() * 25) : (110 + Math.random() * 40),
      banana: isBanana
    });
  }
}

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles = particles.filter(p => p.life > 0);

  for (const p of particles) {
    p.life -= 1;
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);

    if (p.banana) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = `hsla(${p.hue}, 92%, 60%, 0.9)`;
      ctx.beginPath();
      ctx.arc(0, 0, p.r, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
    } else {
      ctx.fillStyle = `hsla(${p.hue}, 92%, 60%, 0.9)`;
      ctx.fillRect(-p.r, -p.r, p.r * 2.2, p.r * 1.6);
    }

    ctx.restore();
  }

  requestAnimationFrame(tick);
}
tick();
