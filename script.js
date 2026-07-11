// VARIABLES GLOBAL DEL EDITOR
let isPlaying = false;
let currentFrame = 0;
let playheadPosition = 0; // en pixeles
let animationFrameId = null;

// ELEMENTOS DOM
const playhead = document.getElementById('playhead');
const timecode = document.getElementById('timecode');
const btnPlay = document.getElementById('btnPlay');
const btnStop = document.getElementById('btnStop');
const btnPrev = document.getElementById('btnPrev');
const trackArea = document.getElementById('trackArea');
const mainVideo = document.getElementById('mainVideo');
const placeholderText = document.getElementById('placeholderText');
const mediaInput = document.getElementById('mediaInput');

// 1. CAMBIO DE PESTAÑAS
function switchTab(tabName) {
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => tab.classList.remove('active'));
  contents.forEach(content => content.classList.remove('active'));

  event.currentTarget.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// 2. IMPORTACIÓN DE MEDIOS SIMULADA/REAL
mediaInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const fileURL = URL.createObjectURL(file);
    mainVideo.src = fileURL;
    placeholderText.style.display = 'none';
    document.getElementById('videoClip').innerText = file.name;
  }
});

// 3. REPRODUCCIÓN Y CONTROL DE PLAYHEAD
btnPlay.addEventListener('click', togglePlay);
btnStop.addEventListener('click', stopPlayback);
btnPrev.addEventListener('click', resetPlayhead);

function togglePlay() {
  isPlaying = !isPlaying;

  if (isPlaying) {
    btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
    if (mainVideo.src) mainVideo.play();
    animate();
  } else {
    btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
    if (mainVideo.src) mainVideo.pause();
    cancelAnimationFrame(animationFrameId);
  }
}

function stopPlayback() {
  isPlaying = false;
  btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
  if (mainVideo.src) {
    mainVideo.pause();
    mainVideo.currentTime = 0;
  }
  cancelAnimationFrame(animationFrameId);
  resetPlayhead();
}

function resetPlayhead() {
  playheadPosition = 0;
  currentFrame = 0;
  updatePlayheadUI();
}

function animate() {
  if (!isPlaying) return;

  playheadPosition += 1.5; // Velocidad del cursor
  currentFrame++;

  if (playheadPosition > trackArea.offsetWidth) {
    stopPlayback();
    return;
  }

  updatePlayheadUI();
  animationFrameId = requestAnimationFrame(animate);
}

function updatePlayheadUI() {
  playhead.style.left = `${playheadPosition}px`;
  
  // Formatear Timecode (HH:MM:SS:FF)
  const totalSeconds = Math.floor(playheadPosition / 20); // 20px = 1 segundo simulado
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  const frames = (currentFrame % 30).toString().padStart(2, '0');

  timecode.innerText = `00:${minutes}:${seconds}:${frames}`;
}

// 4. HACER CLIC EN LA REGLA PARA MOVER EL CURSOR
trackArea.addEventListener('click', function(e) {
  const rect = trackArea.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  
  playheadPosition = clickX;
  if (mainVideo.src && mainVideo.duration) {
    const totalDurationSeconds = (clickX / 20);
    mainVideo.currentTime = totalDurationSeconds;
  }
  
  updatePlayheadUI();
});