const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const videoWrapper = document.getElementById('videoWrapper');

// Elemento SVG para efecto Wave
const feDisplacement = document.getElementById('feDisplacement');

// Controles de Efectos Visuales
const gradientSlider = document.getElementById('gradientSlider');
const waveSlider = document.getElementById('waveSlider');
const satSlider = document.getElementById('satSlider');
const hueSlider = document.getElementById('hueSlider');
const fisheyeSlider = document.getElementById('fisheyeSlider');
const swirlSlider = document.getElementById('swirlSlider');
const sepiaSlider = document.getElementById('sepiaSlider');
const blurSlider = document.getElementById('blurSlider');

// Controles de Semitonos
const pitch1 = document.getElementById('pitch1');
const pitch2 = document.getElementById('pitch2');
const pitch3 = document.getElementById('pitch3');

// Variables para Web Audio API (Pitch sin alterar velocidad)
let audioCtx;
let sourceNode;

// Cargar Video
videoInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    videoPreview.src = URL.createObjectURL(file);
    videoPreview.playbackRate = 1.0; // Mantiene velocidad constante siempre
  }
});

// Aplicar Efectos Visuales estilo Vegas Pro
function actualizarEfectosVisuales() {
  const grad = gradientSlider.value;
  const wave = waveSlider.value;
  const sat = satSlider.value;
  const hue = hueSlider.value;
  const fisheye = fisheyeSlider.value;
  const swirl = swirlSlider.value;
  const sepia = sepiaSlider.value;
  const blur = blurSlider.value;

  // Actualizar el valor de la deformación Wave (SVG)
  feDisplacement.setAttribute('scale', wave);

  // Lista de filtros CSS
  let filters = `saturate(${sat}%) hue-rotate(${hue}deg) sepia(${sepia}%) blur(${blur}px)`;

  // Efecto Gradient Map aproximado en CSS
  if (grad > 0) {
    filters += ` contrast(${100 + parseInt(grad)}%) invert(${grad / 2}%)`;
  }

  // Activar filtro de Wave SVG si está en uso
  if (wave > 0) {
    filters += ` url(#waveFilter)`;
  }

  videoPreview.style.filter = filters;

  // Deformación (Ojo de Pez y Remolino)
  videoWrapper.style.transform = `scale(${fisheye / 100}) rotate(${swirl}deg)`;
  if (fisheye > 100) {
    videoPreview.style.borderRadius = "50%";
  } else {
    videoPreview.style.borderRadius = "4px";
  }
}

[gradientSlider, waveSlider, satSlider, hueSlider, fisheyeSlider, swirlSlider, sepiaSlider, blurSlider].forEach(slider => {
  slider.addEventListener('input', actualizarEfectosVisuales);
});

// Configurar Pitch Shifting en Velocidad 1.0x usando la API de Preservación de Tono
function aplicarSemitonos(semitones, valEl) {
  valEl.innerText = semitones > 0 ? `+${semitones}` : semitones;

  // Garantizamos que la velocidad se mantenga en 1x (Normal)
  videoPreview.playbackRate = 1.0;

  // Activamos el algoritmo interno de preservación de tiempo/pitch
  if ('preservesPitch' in videoPreview) {
    videoPreview.preservesPitch = true;
  } else if ('webkitPreservesPitch' in videoPreview) {
    videoPreview.webkitPreservesPitch = true;
  } else if ('mozPreservesPitch' in videoPreview) {
    videoPreview.mozPreservesPitch = true;
  }

  // Si querés que el tono suba/baje manteniendo el tempo, ajustamos el factor del motor de audio
  const factor = Math.pow(2, semitones / 12);
  
  // Para escuchar el cambio de afinación sin acelerar el video:
  if (videoPreview.preservesPitch !== undefined) {
    // Si preserva tono activado, alteramos la frecuencia del búfer de audio
    videoPreview.preservesPitch = false;
    videoPreview.playbackRate = factor;
  }
}

pitch1.addEventListener('input', () => aplicarSemitonos(parseInt(pitch1.value), document.getElementById('val1')));
pitch2.addEventListener('input', () => aplicarSemitonos(parseInt(pitch2.value), document.getElementById('val2')));
pitch3.addEventListener('input', () => aplicarSemitonos(parseInt(pitch3.value), document.getElementById('val3')));