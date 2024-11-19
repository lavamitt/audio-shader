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
//     // Divide screen into 5 vertical sections
//     float section = floor(vUv.x * 5.0);  // 0,1,2,3,4
    
//     // Get frequency value based on section
//     float frequency = 0.0;
//     if (section < 1.0) {
//         frequency = u_subBass;  // Leftmost section
//     } else if (section < 2.0) {
//         frequency = u_bass;     // Second section
//     } else if (section < 3.0) {
//         frequency = u_mid;      // Middle section
//     } else if (section < 4.0) {
//         frequency = u_high;     // Fourth section
//     } else {
//         frequency = u_presence; // Rightmost section
//     }
    
//     // Create a bar that goes up based on frequency
//     float bar = step(1.0 - frequency, vUv.y);
    
//     // Color based on section
//     vec3 color;
//     if (section < 1.0) {
//         color = vec3(1.0, 0.2, 0.2);  // Red for subBass
//     } else if (section < 2.0) {
//         color = vec3(1.0, 0.8, 0.2);  // Yellow for bass
//     } else if (section < 3.0) {
//         color = vec3(0.2, 1.0, 0.2);  // Green for mid
//     } else if (section < 4.0) {
//         color = vec3(0.2, 0.2, 1.0);  // Blue for high
//     } else {
//         color = vec3(1.0, 0.2, 1.0);  // Purple for presence
//     }
    
//     gl_FragColor = vec4(color * bar, 1.0);
//   }
// `;

// export const fragmentShader = `
//     uniform float u_time;
//     uniform float u_volume;
//     uniform float u_subBass;
//     uniform float u_bass;
//     uniform float u_mid;
//     uniform float u_high;
//     uniform float u_presence;
    
//     varying vec2 vUv;

//     vec2 tile(vec2 _st, float _zoom){
//         _st *= _zoom;
//         return fract(_st);
//     }

//     float flower(vec2 st, float num_petals, float size) {
//         vec2 pos = vec2(0.5)-st;

//         float r = length(pos)*2.0;
//         float a = atan(pos.y,pos.x);
//         float f = abs(cos(a*num_petals))*size+.3;

//         return 1.-smoothstep(f,f+0.02,r);
//     }

//     float circle(vec2 st, float size, float x_loc) {
//         vec2 pos = vec2(0.5)-st;

//         pos.x += x_loc;
//         float r = length(pos)*size;
//         float a = atan(pos.y,pos.x);
//         float f = cos(a);

//         return 1.-smoothstep(f,f+0.02,r);
//     }

//     float random (vec2 st) {
//         return fract(sin(dot(st.xy,
//                             vec2(13.9898,78.233)))*
//             43758.5453123);
//         }

//     void main() {
//         // float section = mod(vUv.x * 5.0, 5.0);
//         vec3 color = vec3(0.);
        
//         // float s1 = step(0.0, section) * step(section, 1.0);
//         // float s2 = step(1.0, section) * step(section, 2.0);
//         // float s3 = step(2.0, section) * step(section, 3.0);
//         // float s4 = step(3.0, section) * step(section, 4.0);
//         // float s5 = step(4.0, section) * step(section, 5.0);

        
//         // vec2 grid = tile(vUv, u_subBass * 10.);
        
//         float flower_pct = flower(vUv, u_bass * 10., u_mid);
        
//         // float frequency = u_subBass * s1 +
//         //                 u_bass * s2 +
//         //                 u_mid * s3 +
//         //                 u_high * s4 +
//         //                 u_presence * s5;
        
//         // float bar = step(1.0 - frequency, vUv.y);
        
//         // vec3 c1 = vec3(1.0, 0.2, 0.2); // Red
//         // vec3 c2 = vec3(1.0, 0.8, 0.2); // Yellow
//         // vec3 c3 = vec3(0.2, 1.0, 0.2); // Green
//         // vec3 c4 = vec3(0.2, 0.2, 1.0); // Blue
//         // vec3 c5 = vec3(1.0, 0.2, 1.0); // Purple

//         vec3 flower_color = vec3(u_high, u_presence, u_volume);
        
//         // vec3 color = c1 * s1 +
//         //             c2 * s2 +
//         //             c3 * s3 +
//         //             c4 * s4 +
//         //             c5 * s5;

//         color += mix(color, flower_color, flower_pct);
        
//         gl_FragColor = vec4(color, 1.0);
//     }
// `;


export const fragmentShader = `
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform float u_volume;
    uniform float u_subBass;
    uniform float u_bass;
    uniform float u_mid;
    uniform float u_high;
    uniform float u_presence;
    
    varying vec2 vUv;

    void main() {
        vec3 c;
        float l;
        float z = u_time;
        for (int i=0; i<3; i++) {
            vec2 uv, p = vUv.xy;
            uv=p;
            p-=.5;
            p.x*=u_resolution.x/u_resolution.y;
            z+=.07;
            l=length(p);
            uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
            c[i]=.01/length(mod(uv,1.)-.5);
        }
        gl_FragColor = vec4(c/l,u_time);
    }
`;