import { Game, HudState, MinimapState } from "./game/Game";
import { ISLAND_RADIUS } from "./game/world";

const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;

const app = document.getElementById("app")!;
app.innerHTML = `
  <div id="game-mount"></div>

  <div id="hud" class="hidden">
    <div id="score-pill">🍦 <span id="score">0</span> / <span id="total">0</span></div>
    <canvas id="minimap" width="150" height="150"></canvas>
    <div id="hint" class="${isTouchDevice ? "hidden" : ""}">
      WASD / arrows move · Space jump · Shift sprint · drag to look · scroll to zoom
    </div>
    <div id="win-banner" class="hidden">
      <div class="win-card">
        <div class="win-emoji">🎉🍨🎉</div>
        <div class="win-title">All scoops collected!</div>
        <div class="win-sub">Keep exploring Scoop World ✨</div>
      </div>
    </div>
    ${isTouchDevice ? `
      <div id="joystick" class="hidden"><div id="joystick-knob"></div></div>
      <button id="jump-btn" aria-label="Jump">⬆️</button>
    ` : ""}
  </div>

  <div id="start-overlay">
    <div class="start-card">
      <div class="start-emoji">🍦</div>
      <h1>Scoop World</h1>
      <p>Explore a pastel ice-cream island and collect every floating scoop.</p>
      <button id="play-btn">▶ Play</button>
      <p class="start-hint">${
        isTouchDevice
          ? "Left side: move · right side: look · button: jump"
          : "WASD move · Space jump · Shift sprint · drag mouse to look"
      }</p>
    </div>
  </div>
`;

const mount = document.getElementById("game-mount")!;
const game = new Game(mount);

// Expose for automated perf checks.
(window as unknown as { __game?: Game }).__game = game;

const scoreEl = document.getElementById("score")!;
const totalEl = document.getElementById("total")!;
const winBanner = document.getElementById("win-banner")!;

game.onHud = (hud: HudState) => {
  scoreEl.textContent = String(hud.score);
  totalEl.textContent = String(hud.total);
  winBanner.classList.toggle("hidden", !hud.won);
};

const minimap = document.getElementById("minimap") as HTMLCanvasElement;
const mmCtx = minimap.getContext("2d")!;
const MM_SIZE = 150;
const MM_RADIUS = MM_SIZE / 2 - 6;
const MM_SCALE = MM_RADIUS / (ISLAND_RADIUS * 1.08);

game.onMinimap = (s: MinimapState) => {
  const cx = MM_SIZE / 2;
  const cy = MM_SIZE / 2;
  mmCtx.clearRect(0, 0, MM_SIZE, MM_SIZE);

  // sea backdrop
  mmCtx.beginPath();
  mmCtx.arc(cx, cy, MM_RADIUS, 0, Math.PI * 2);
  mmCtx.fillStyle = "rgba(191, 232, 242, 0.9)";
  mmCtx.fill();
  mmCtx.strokeStyle = "rgba(255,255,255,0.9)";
  mmCtx.lineWidth = 3;
  mmCtx.stroke();

  // island
  mmCtx.beginPath();
  mmCtx.arc(cx, cy, ISLAND_RADIUS * 0.9 * MM_SCALE, 0, Math.PI * 2);
  mmCtx.fillStyle = "rgba(168, 230, 193, 0.85)";
  mmCtx.fill();

  // collectibles
  for (const c of s.collectibles) {
    if (c.taken) continue;
    mmCtx.beginPath();
    mmCtx.arc(cx + c.x * MM_SCALE, cy + c.z * MM_SCALE, 2.4, 0, Math.PI * 2);
    mmCtx.fillStyle = "#ff6b9d";
    mmCtx.fill();
  }

  // player marker (triangle pointing in facing direction)
  const px = cx + s.x * MM_SCALE;
  const py = cy + s.z * MM_SCALE;
  mmCtx.save();
  mmCtx.translate(px, py);
  // world +X maps to canvas +X, world +Z maps to canvas +Y; heading is
  // measured so that (sin h, cos h) is the facing direction in world XZ,
  // so mirror the canvas rotation (rotate(-heading)) to match.
  mmCtx.rotate(-s.heading);
  mmCtx.beginPath();
  mmCtx.moveTo(0, 7);
  mmCtx.lineTo(5, -6);
  mmCtx.lineTo(-5, -6);
  mmCtx.closePath();
  mmCtx.fillStyle = "#ec4899";
  mmCtx.fill();
  mmCtx.strokeStyle = "#fff";
  mmCtx.lineWidth = 1.5;
  mmCtx.stroke();
  mmCtx.restore();
};

document.getElementById("play-btn")!.addEventListener("click", () => {
  document.getElementById("start-overlay")!.classList.add("hidden");
  document.getElementById("hud")!.classList.remove("hidden");
  game.start();
});

if (isTouchDevice) {
  const jumpBtn = document.getElementById("jump-btn")!;
  jumpBtn.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    game.pressJump();
  });
  jumpBtn.addEventListener("pointerup", () => game.releaseJump());
  jumpBtn.addEventListener("pointerleave", () => game.releaseJump());

  const joy = document.getElementById("joystick")!;
  const knob = document.getElementById("joystick-knob")!;
  game.input.onJoystickVisual = (s) => {
    joy.classList.toggle("hidden", !s.active);
    if (s.active) {
      joy.style.left = `${s.ox - 60}px`;
      joy.style.top = `${s.oy - 60}px`;
      knob.style.transform = `translate(${s.dx}px, ${s.dy}px)`;
    }
  };
}
