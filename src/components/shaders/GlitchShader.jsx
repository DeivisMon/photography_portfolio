export const GlitchShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    intensity: { value: 0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform float intensity;
    varying vec2 vUv;
    
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = vUv;
      
    // Horizontal stretch (only when glitching)
    if (intensity > 0.0) {
        uv.y += sin(uv.x * 0.5 + time * 0.1) * 0.1 * intensity;
    }

      // Base color
      vec4 color = texture2D(tDiffuse, uv);
      gl_FragColor = color;
      
      // Add glitch effects based on intensity
      if (intensity > 0.0) {
        // RGB shift
        float shift = 0.02 * intensity;
        vec4 shiftR = texture2D(tDiffuse, uv + vec2(shift, 0.0));
        vec4 shiftB = texture2D(tDiffuse, uv - vec2(shift, 0.0));
        color.r = shiftR.r;
        color.b = shiftB.b;
        
        // Random block displacement
        float blockSize = 1000.0;
        float blockX = floor(uv.x * blockSize) / blockSize;
        float blockY = floor(uv.y * blockSize * 0.5) / (blockSize * 0.5);
        float block = rand(vec2(blockX, blockY + time * 0.1));
        
        if (block > 0.8) {
          float displaceX = (rand(vec2(blockX, blockY + time * 0.2)) - 0.5) * 0.1 * intensity;
          float displaceY = (rand(vec2(blockX, blockY + time * 0.3)) - 0.5) * 0.1 * intensity;
          color = texture2D(tDiffuse, uv + vec2(displaceX, displaceY));
        }
        
        // Scan lines
        float scanLine = sin(uv.y * 500.0 + time * 4.0) * 0.05 * intensity;
        color.rgb += scanLine;
        
        // Noise
        float noise = rand(uv + time * 0.5) * 0.1 * intensity;
        color.rgb += noise;
      }
      
      gl_FragColor = color;
    }
  `,
};