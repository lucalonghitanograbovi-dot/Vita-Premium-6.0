
const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const videoWrapper = document.getElementById('videoWrapper');

// Controles de Efectos
const sepiaSlider = document.getElementById('sepiaSlider');
const invertSlider = document.getElementById('invertSlider');
const blurSlider = document.getElementById('blurSlider');
const fisheyeSlider = document.getElementById('fisheyeSlider');
const swirlSlider = document.getElementById('swirlSlider');

// Controles de Audio (Semitones)
const pitch1 = document.getElementById('pitch1');
const pitch2 = document.getElementById('pitch2');
const pitch3 = document.getElementById('pitch3');

let audioCtx, mediaSource, pitchNode;

// Cargar Video
videoInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    videoPreview.src = URL.createObjectURL(file);
  }
});

// Aplicar Efectos Visuales
function actualizarEfectosVisuales() {
  const sepia = sepiaSlider.value;
  const invert = invertSlider.value;
  const blur = blurSlider.value;
  const fisheye = fisheyeSlider.value;
  const swirl = swirlSlider.value;

  // Filtros CSS estándar
  videoPreview.style.filter = `sepia(${sepia}%) invert(${invert}%) blur(${blur}px)`;
  
  // Deformación física (Ojo de Pez / Remolino)
  videoWrapper.style.transform = `scale(${fisheye / 100}) rotate(${swirl}deg)`;
  if(fisheye > 100) {
    videoPreview.style.borderRadius = "50%";
  } else {
    videoPreview.style.borderRadius = "4px";
  }
}

// Escuchar cambios visuales
[sepiaSlider, invertSlider, blurSlider, fisheyeSlider, swirlSlider].forEach(slider => {
  slider.addEventListener('input', actualizarEfectosVisuales);
});

// Configurar y actualizar Semitonos Audio (-12 a +12)
function actualizarPitch(trackNum, slider, valEl) {
  const semitones = parseInt(slider.value);
  valEl.innerText = semitones > 0 ? `+${semitones}` : semitones;

  // Cálculo del cambio de tono de velocidad (Playback Rate)
  // Factor = 2 ^ (semitones / 12)
  if (videoPreview) {
    const rate = Math.pow(2, semitones / 12);
    videoPreview.playbackRate = rate;
  }
}

pitch1.addEventListener('input', () => actualizarPitch(1, pitch1, document.getElementById('val1')));
pitch2.addEventListener('input', () => actualizarPitch(2, pitch2, document.getElementById('val2')));
pitch3.addEventListener('input', () => actualizarPitch(3, pitch3, document.getElementById('val3')));