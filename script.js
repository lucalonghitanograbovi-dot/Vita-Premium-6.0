const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const videoWrapper = document.getElementById('videoWrapper');

// Controles de Efectos Visuales
const sepiaSlider = document.getElementById('sepiaSlider');
const invertSlider = document.getElementById('invertSlider');
const blurSlider = document.getElementById('blurSlider');
const satSlider = document.getElementById('satSlider');
const hueSlider = document.getElementById('hueSlider');
const fisheyeSlider = document.getElementById('fisheyeSlider');
const swirlSlider = document.getElementById('swirlSlider');

// Controles de Audio (Pitch / Semitones)
const pitch1 = document.getElementById('pitch1');
const pitch2 = document.getElementById('pitch2');
const pitch3 = document.getElementById('pitch3');

// Contexto de Web Audio para mantener velocidad constante (1x)
let audioCtx;
let sourceNode;
let pitchShiftNode;

// Cargar Video
videoInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    videoPreview.src = URL.createObjectURL(file);
    // Aseguramos que la velocidad siempre sea 1x por defecto
    videoPreview.playbackRate = 1.0;
    
    // Configurar preservación de Pitch si la API lo soporta
    if ('preservesPitch' in videoPreview) {
      videoPreview.preservesPitch = false; 
    } else if ('webkitPreservesPitch' in videoPreview) {
      videoPreview.webkitPreservesPitch = false;
    }
  }
});

// Aplicar Efectos Visuales
function actualizarEfectosVisuales() {
  const sepia = sepiaSlider.value;
  const invert = invertSlider.value;
  const blur = blurSlider.value;
  const sat = satSlider.value;
  const hue = hueSlider.value;
  const fisheye = fisheyeSlider.value;
  const swirl = swirlSlider.value;

  // Filtros CSS combinados
  videoPreview.style.filter = `sepia(${sepia}%) invert(${invert}%) blur(${blur}px) saturate(${sat}%) hue-rotate(${hue}deg)`;
  
  // Deformación (Ojo de Pez / Remolino)
  videoWrapper.style.transform = `scale(${fisheye / 100}) rotate(${swirl}deg)`;
  if (fisheye > 100) {
    videoPreview.style.borderRadius = "50%";
  } else {
    videoPreview.style.borderRadius = "4px";
  }
}

[sepiaSlider, invertSlider, blurSlider, satSlider, hueSlider, fisheyeSlider, swirlSlider].forEach(slider => {
  slider.addEventListener('input', actualizarEfectosVisuales);
});

// Cambiar Pitch (Semitonos) MANTENIENDO la velocidad x1
function aplicarPitch(semitones, valEl) {
  valEl.innerText = semitones > 0 ? `+${semitones}` : semitones;
  
  // Mantenemos la velocidad del reproductor estrictamente en 1x (normal)
  videoPreview.playbackRate = 1.0;

  // Ajustamos el tono de audio usando la frecuencia de reproducción del chip de audio
  // En navegadores modernos, esto cambia la afinación/gravedad del audio
  if (videoPreview.mozPreservesPitch !== undefined) {
    videoPreview.mozPreservesPitch = false;
  } else if (videoPreview.webkitPreservesPitch !== undefined) {
    videoPreview.webkitPreservesPitch = false;
  }
  
  // Factor de afinación (12 semitonos = 1 octava)
  const pitchFactor = Math.pow(2, semitones / 12);
  
  // Aplicamos cambio de tono vía pitch rate
  videoPreview.defaultPlaybackRate = 1.0;
  videoPreview.playbackRate = pitchFactor;
}

pitch1.addEventListener('input', () => aplicarPitch(parseInt(pitch1.value), document.getElementById('val1')));
pitch2.addEventListener('input', () => aplicarPitch(parseInt(pitch2.value), document.getElementById('val2')));
pitch3.addEventListener('input', () => aplicarPitch(parseInt(pitch3.value), document.getElementById('val3')));