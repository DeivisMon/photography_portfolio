export const ScrollGlitchShader = {
  uniforms: {
    tDiffuse: { value: null },
    scrollIntensity: { value: 0 },
    time: { value: 0 },
    bendAmount: { value: 7.5 }
  },
  vertexShader: `
    uniform float scrollIntensity;
    uniform float bendAmount;
    uniform float time;
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      
      // Enhanced cylindrical bend with easing
      float curve = bendAmount * pow(scrollIntensity, 1.5);
      float wave = sin(time * 2.0) * 0.1 * scrollIntensity;
      
      vec3 pos = position;
      pos.z += sin(uv.x * 3.14159 * 2.0) * curve * (1.0 + wave);
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float scrollIntensity;
    uniform float time;
    varying vec2 vUv;
    
    float rand(vec2 n) { 
      return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Horizontal stretch effect
      uv.y += sin(uv.x * 0.5 + time * 0.1) * 0.1 * scrollIntensity;
      
      vec4 color = texture2D(tDiffuse, uv);
      
      // Glitch effects when scrolling
      if (scrollIntensity > 0.01) {
        // RGB shift with easing
        float shift = pow(scrollIntensity, 1.5) * 0.03;
        color.r = texture2D(tDiffuse, uv + vec2(shift, 0.0)).r;
        color.b = texture2D(tDiffuse, uv - vec2(shift, 0.0)).b;
        
        // Block displacement
        float blockSize = 1000.0;
        float blockX = floor(uv.x * blockSize) / blockSize;
        float blockY = floor(uv.y * blockSize * 0.5) / (blockSize * 0.5);
        float block = rand(vec2(blockX, blockY + time * 0.1));
        
        if (block > 0.8) {
          float displaceX = (rand(vec2(blockX, blockY + time * 0.2)) - 0.5) * 0.1 * scrollIntensity;
          float displaceY = (rand(vec2(blockX, blockY + time * 0.3)) - 0.5) * 0.1 * scrollIntensity;
          color = texture2D(tDiffuse, uv + vec2(displaceX, displaceY));
        }
        
        // Scan lines
        color.rgb += sin(uv.y * 500.0 + time * 4.0) * 0.05 * scrollIntensity;
        
        // Noise
        color.rgb += rand(uv + time * 0.5) * 0.1 * scrollIntensity;
      }
      
      gl_FragColor = color;
    }
  `
};