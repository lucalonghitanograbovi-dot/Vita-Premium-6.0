// REPRODUCCIÓN & LÍNEA DE TIEMPO
let isPlaying = false;
let playheadPos = 0;
let animId = null;

const playhead = document.getElementById('playhead');
const timecode = document.getElementById('timecode');
const btnPlay = document.getElementById('btnPlay');
const mainVideo = document.getElementById('mainVideo');
const videoContainer = document.getElementById('videoContainer');

function switchTab(tabName) {
  document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  event.currentTarget.classList.add('active');
  document.getElementById(`tab-${tabName}`).classList.add('active');
}

// CARGA DE ARCHIVO DE VIDEO
document.getElementById('mediaInput').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    mainVideo.src = URL.createObjectURL(file);
    document.getElementById('placeholderText').style.display = 'none';
    document.getElementById('videoClip').innerText = file.name;
  }
});

// MODAL FX Y DIÁLOGOS TIPO VEGAS
function openFXModal(fxName) {
  document.getElementById('fxModal').style.display = 'flex';
  showFXConfig(fxName);
}

function closeFXModal() {
  document.getElementById('fxModal').style.display = 'none';
}

function showFXConfig(fxName) {
  document.querySelectorAll('.dialog-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.fx-config-panel').forEach(p => p.style.display = 'none');

  document.getElementById(`tab-btn-${fxName}`).classList.add('active');
  document.getElementById(`config-${fxName}`).style.display = 'block';
}

// APLICACIÓN REAL DE EFECTOS (MIRROR, BLUR, COLOR)
function applyFX() {
  const mode = document.getElementById('mirrorMode').value;
  const blur = document.getElementById('blurVal').value;
  const sat = document.getElementById('satVal').value;
  const hue = document.getElementById('hueVal').value;
  const sepia = document.getElementById('sepiaVal').value;

  // Mirror
  videoContainer.className = 'video-container';
  if (mode !== 'none') {
    videoContainer.classList.add(`mirror-${mode}`);
  }

  // CSS Filters
  mainVideo.style.filter = `blur(${blur}px) saturate(${sat}%) hue-rotate(${hue}deg) sepia(${sepia}%)`;
}

// BOTÓN EXPORTAR
document.getElementById('btnExport').addEventListener('click', function() {
  const projectData = {
    title: "Proyecto_Vegas_Web",
    effects: {
      mirror: document.getElementById('mirrorMode').value,
      blur: document.getElementById('blurVal').value,
      saturation: document.getElementById('satVal').value
    }
  };

  alert("¡Proyecto Renderizado!\nSe ha generado el estado final del video con los efectos activos.");
  console.log("Exported Project Data:", projectData);
});

// LOGICA PLAY / PAUSE
btnPlay.addEventListener('click', () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    btnPlay.innerHTML = '<i class="fa-solid fa-pause"></i>';
    if (mainVideo.src) mainVideo.play();
    runPlayhead();
  } else {
    btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
    if (mainVideo.src) mainVideo.pause();
    cancelAnimationFrame(animId);
  }
});

document.getElementById('btnStop').addEventListener('click', () => {
  isPlaying = false;
  btnPlay.innerHTML = '<i class="fa-solid fa-play"></i>';
  if (mainVideo.src) { mainVideo.pause(); mainVideo.currentTime = 0; }
  playheadPos = 0;
  playhead.style.left = '0px';
  timecode.innerText = "00:00:00:00";
  cancelAnimationFrame(animId);
});

function runPlayhead() {
  if (!isPlaying) return;
  playheadPos += 1;
  playhead.style.left = `${playheadPos}px`;

  const secs = Math.floor(playheadPos / 20);
  timecode.innerText = `00:00:${secs < 10 ? '0' + secs : secs}:00`;

  animId = requestAnimationFrame(runPlayhead);
}