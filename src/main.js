import * as THREE from 'three';
import * as Meyda from "meyda";
import { vertexShader, fragmentShader } from './shaders.js';

let analyser, dataArray, meydaAnalyzer;
const uniforms = {
  u_time: { value: 0 },
  u_volume: { value: 0 },
  u_subBass: { value: 0 },
  u_bass: { value: 0 },
  u_mid: { value: 0 },
  u_high: { value: 0 },
  u_presence: { value: 0 },
};


const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.ShaderMaterial({
  uniforms,
  vertexShader,
  fragmentShader
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);


window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function analyzeAudio(analyser, frequencyData) {
  analyser.getByteFrequencyData(frequencyData);
  // Each bin ≈ 21.5 Hz

  const subBass = frequencyData.slice(1, 3).reduce((a, b) => a + b) / 2;      // 20-60 Hz
  const bass = frequencyData.slice(3, 12).reduce((a, b) => a + b) / 9;        // 60-250 Hz
  const mid = frequencyData.slice(12, 48).reduce((a, b) => a + b) / 36;       // 250-1000 Hz
  const high = frequencyData.slice(48, 192).reduce((a, b) => a + b) / 144;    // 1000-4000 Hz
  const presence = frequencyData.slice(192).reduce((a, b) => a + b) /
    (frequencyData.length - 192);  // 4000+ Hz

  return {
    subBass: subBass / 255,     // Feel: rumble (kick drums, bass synths)
    bass: bass / 255,           // Feel: punch (bass guitar, bass line)
    mid: mid / 255,             // Feel: warmth (vocals, piano, guitar)
    high: high / 255,           // Feel: clarity (cymbals, hi-hats)
    presence: presence / 255    // Feel: air (sibilance, shimmer)
  };
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  if (analyser) {
    analyser.getByteFrequencyData(dataArray);

    const bands = analyzeAudio(analyser, dataArray);

    for (let key in bands) {
      let uniform_key = "u_" + key;
      uniforms[uniform_key].value = bands[key];
    }

    const volume = dataArray.reduce((a, b) => a + b) / dataArray.length / 255;
    uniforms.u_volume.value = volume;
  }

  uniforms.u_time.value += 0.01;
  renderer.render(scene, camera);
}

async function startAudio() {
  const audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.8;
  dataArray = new Uint8Array(analyser.frequencyBinCount);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    meydaAnalyzer = Meyda.createMeydaAnalyzer({
      audioContext: audioContext,
      source: source,
      bufferSize: 512,
      featureExtractors: [
        "rms",
        "energy",
        "zcr",
        "amplitudeSpectrum",
        "powerSpectrum",
        "spectralCentroid",
        "spectralFlatness",
        // "spectralFlux" - doesn't work :(
        "spectralSlope",
        "spectralRolloff",
        "spectralSpread",
      ],
      callback: (features) => {
        console.log(features);
      },
    });
    meydaAnalyzer.start();

    animate();

    // audioFeatureExtractor(audioContext, source);
  } catch (err) {
    console.error('Error accessing microphone:', err);
  }
}

// Add button listener
document.getElementById('startAudio').addEventListener('click', startAudio);

// Add sensitivity control
document.getElementById('sensitivity').addEventListener('input', (e) => {
  const sensitivity = e.target.value / 100;
  // You can use this to adjust how the visualization responds
});
