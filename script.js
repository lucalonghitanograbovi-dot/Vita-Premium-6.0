const videoInput = document.getElementById('videoInput');
const videoPreview = document.getElementById('videoPreview');
const satSlider = document.getElementById('satSlider');
const hueSlider = document.getElementById('hueSlider');

// Cargar video local
videoInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    videoPreview.src = URL.createObjectURL(file);
  }
});

// Aplicar efectos visuales en tiempo real
function actualizarEfectos() {
  const sat = satSlider.value;
  const hue = hueSlider.value;
  videoPreview.style.filter = `saturate(${sat}%) hue-rotate(${hue}deg)`;
}

satSlider.addEventListener('input', actualizarEfectos);
hueSlider.addEventListener('input', actualizarEfectos);