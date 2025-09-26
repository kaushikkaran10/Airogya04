'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CausticBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    containerRef.current.appendChild(renderer.domElement);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Vertex shader
    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    // Fragment shader with caustic effect
    const fragmentShader = `
      uniform float iTime;
      uniform vec2 iResolution;

      vec4 mod289(vec4 x) {
        return x - floor(x / 289.0) * 289.0;
      }

      vec4 permute(vec4 x) {
        return mod289((x * 34.0 + 1.0) * x);
      }

      vec4 snoise(vec3 v) {
        const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);

        vec3 i  = floor(v + dot(v, vec3(C.y)));
        vec3 x0 = v   - i + dot(i, vec3(C.x));

        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);

        vec3 x1 = x0 - i1 + C.x;
        vec3 x2 = x0 - i2 + C.y;
        vec3 x3 = x0 - 0.5;

        vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
                                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                                + i.x + vec4(0.0, i1.x, i2.x, 1.0));

        vec4 j = p - 49.0 * floor(p / 49.0);

        vec4 x_ = floor(j / 7.0);
        vec4 y_ = floor(j - 7.0 * x_);

        vec4 x = (x_ * 2.0 + 0.5) / 7.0 - 1.0;
        vec4 y = (y_ * 2.0 + 0.5) / 7.0 - 1.0;

        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);

        vec4 s0 = floor(b0) * 2.0 + 1.0;
        vec4 s1 = floor(b1) * 2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

        vec3 g0 = vec3(a0.xy, h.x);
        vec3 g1 = vec3(a0.zw, h.y);
        vec3 g2 = vec3(a1.xy, h.z);
        vec3 g3 = vec3(a1.zw, h.w);

        vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
        vec4 m2 = m * m;
        vec4 m3 = m2 * m;
        vec4 m4 = m2 * m2;
        vec3 grad = 
          -6.0 * m3.x * x0 * dot(x0, g0) + m4.x * g0 + 
          -6.0 * m3.y * x1 * dot(x1, g1) + m4.y * g1 + 
          -6.0 * m3.z * x2 * dot(x2, g2) + m4.z * g2 + 
          -6.0 * m3.w * x3 * dot(x3, g3) + m4.w * g3;
        vec4 px = vec4(dot(x0, g0), dot(x1, g1), dot(x2, g2), dot(x3, g3));
        return 42.0 * vec4(grad, dot(m4, px));
      }

      void main() {
        vec2 fragCoord = gl_FragCoord.xy;
        vec2 p = (-iResolution.xy + 2.0*fragCoord) / iResolution.y;

        vec3 ww = normalize(-vec3(0., 1., 1.));
        vec3 uu = normalize(cross(ww, vec3(0., 1., 0.)));
        vec3 vv = normalize(cross(uu,ww));

        vec3 rd = p.x*uu + p.y*vv + 1.5*ww;
        vec3 pos = -ww + rd*(ww.y/rd.y);
        pos.y = iTime*0.3;
        pos *= 3.;

        vec4 n = snoise( pos );
             
        pos -= 0.07*n.xyz;
        n = snoise( pos );

        pos -= 0.07*n.xyz;
        n = snoise( pos );

        float intensity = exp(n.w*3. - 1.5);
         
        // Healthcare-themed colors with caustic effect
        vec3 color = vec3(intensity);
        color.b += intensity * 0.4; // More blue for healthcare theme
        color.g += intensity * 0.6; // Enhanced green for medical feel
        color.r += intensity * 0.2; // Subtle red accent
         
        // Add some transparency and blend with dark background
        gl_FragColor = vec4(color * 0.3, 0.8);
      }
    `;

    // Create shader material
    const material = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    // Create plane geometry
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      material.uniforms.iTime.value += 0.003;
      renderer.render(scene, camera);
    };

    // Handle window resize
    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.iResolution.value.set(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
      }}
    />
  );
};

export default CausticBackground;