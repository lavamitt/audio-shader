export const vertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// export const fragmentShader = `
//   uniform float u_time;
//   uniform float u_volume;
//   uniform float u_subBass;
//   uniform float u_bass;
//   uniform float u_mid;
//   uniform float u_high;
//   uniform float u_presence;
    
//   varying vec2 vUv;

//   void main() {
//     vec2 center = vUv - 0.5;
//     float dist = length(center);
    
//     float circle = smoothstep(0.3 + u_volume * 0.2, 0.31, dist);
//     float wave = sin(dist * 20.0 - u_time * 5.0) * 0.5 + 0.5;
    
//     vec3 color1 = vec3(0.5, 0.8, 0.9);
//     vec3 color2 = vec3(0.9, 0.4, 0.3);
//     vec3 finalColor = mix(color1, color2, wave * u_volume);
    
//     gl_FragColor = vec4(finalColor * circle, 1.0);
//   }
// `;

export const fragmentShader = `
  uniform float u_time;
  uniform float u_volume;
  uniform float u_subBass;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_presence;
    
  varying vec2 vUv;

  void main() {
    // Divide screen into 5 vertical sections
    float section = floor(vUv.x * 5.0);  // 0,1,2,3,4
    
    // Get frequency value based on section
    float frequency = 0.0;
    if (section < 1.0) {
        frequency = u_subBass;  // Leftmost section
    } else if (section < 2.0) {
        frequency = u_bass;     // Second section
    } else if (section < 3.0) {
        frequency = u_mid;      // Middle section
    } else if (section < 4.0) {
        frequency = u_high;     // Fourth section
    } else {
        frequency = u_presence; // Rightmost section
    }
    
    // Create a bar that goes up based on frequency
    float bar = step(1.0 - frequency, vUv.y);
    
    // Color based on section
    vec3 color;
    if (section < 1.0) {
        color = vec3(1.0, 0.2, 0.2);  // Red for subBass
    } else if (section < 2.0) {
        color = vec3(1.0, 0.8, 0.2);  // Yellow for bass
    } else if (section < 3.0) {
        color = vec3(0.2, 1.0, 0.2);  // Green for mid
    } else if (section < 4.0) {
        color = vec3(0.2, 0.2, 1.0);  // Blue for high
    } else {
        color = vec3(1.0, 0.2, 1.0);  // Purple for presence
    }
    
    gl_FragColor = vec4(color * bar, 1.0);
  }
`;
