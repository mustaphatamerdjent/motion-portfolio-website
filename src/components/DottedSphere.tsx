import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DottedSphereProps {
  className?: string;
}

export function DottedSphere({ className = '' }: DottedSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const isTouchDevice =
      window.matchMedia('(hover: none)').matches || 'ontouchstart' in window;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene & Perspective Camera
    const scene = new THREE.Scene();
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 8.5;

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.className = 'w-full h-full block cursor-grab active:cursor-grabbing select-none';
    // Allow native vertical scroll so sphere does not block downward page scrolling on mobile
    canvas.style.touchAction = 'pan-y';
    container.appendChild(canvas);

    // 3. Crisp High-Resolution Glyph & Symbol Texture Atlas
    // 4x4 grid (16 cells) in a 1024x1024 canvas = 256x256 px per glyph
    const atlasCanvas = document.createElement('canvas');
    const atlasSize = 1024;
    atlasCanvas.width = atlasSize;
    atlasCanvas.height = atlasSize;
    const ctx = atlasCanvas.getContext('2d');

    const symbols = [
      '+', '×', '✦', '▲',
      '◆', '■', '*', '#',
      '0', '1', 'X', 'Ø',
      '%', '•', ':', '~'
    ];

    if (ctx) {
      ctx.clearRect(0, 0, atlasSize, atlasSize);
      const cols = 4;
      const cellSize = atlasSize / cols; // 256px

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let s = 0; s < symbols.length; s++) {
        const col = s % cols;
        const row = Math.floor(s / cols);
        const cx = col * cellSize + cellSize / 2;
        const cy = row * cellSize + cellSize / 2;
        const sym = symbols[s];

        if (sym === '•') {
          // Sharp solid circular dot with crisp rasterization
          ctx.beginPath();
          ctx.arc(cx, cy, 48, 0, Math.PI * 2);
          ctx.fill();
        } else if (sym === '✦') {
          // Sharp kinetic 4-point star
          ctx.beginPath();
          const outerR = 76;
          const innerR = 24;
          for (let p = 0; p < 8; p++) {
            const angle = (p * Math.PI) / 4 - Math.PI / 2;
            const r = p % 2 === 0 ? outerR : innerR;
            const px = cx + Math.cos(angle) * r;
            const py = cy + Math.sin(angle) * r;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        } else if (sym === '▲') {
          // Sharp geometric triangle
          ctx.beginPath();
          const triR = 68;
          ctx.moveTo(cx, cy - triR);
          ctx.lineTo(cx + triR * 0.9, cy + triR * 0.65);
          ctx.lineTo(cx - triR * 0.9, cy + triR * 0.65);
          ctx.closePath();
          ctx.fill();
        } else if (sym === '◆') {
          // Sharp diamond
          ctx.beginPath();
          const diaR = 68;
          ctx.moveTo(cx, cy - diaR);
          ctx.lineTo(cx + diaR, cy);
          ctx.lineTo(cx, cy + diaR);
          ctx.lineTo(cx - diaR, cy);
          ctx.closePath();
          ctx.fill();
        } else if (sym === '■') {
          // Sharp square
          const sqSize = 98;
          ctx.fillRect(cx - sqSize / 2, cy - sqSize / 2, sqSize, sqSize);
        } else {
          // Sharp alphanumeric and code symbols using bold geometric monospace/grotesk
          const fontSize = sym === '+' || sym === '×' ? 144 : (sym === ':' || sym === '~' ? 150 : 128);
          ctx.font = `800 ${fontSize}px "Space Grotesk", "JetBrains Mono", "SF Mono", monospace, sans-serif`;
          ctx.fillText(sym, cx, cy);
        }
      }
    }

    const charTexture = new THREE.CanvasTexture(atlasCanvas);
    charTexture.flipY = false;
    charTexture.minFilter = THREE.LinearMipmapLinearFilter;
    charTexture.magFilter = THREE.LinearFilter;
    charTexture.generateMipmaps = true;

    // 4. Procedural Fibonacci Golden Sphere Distribution
    // Mobile: 1.75 radius (frames typography cleanly without overflowing screen)
    // Desktop: 3.60 radius (balanced halo surrounding the headline)
    const particleCount = isMobile ? 1150 : 2000;
    const sphereRadius = isMobile ? 2.3 : 4;

    const geometry = new THREE.BufferGeometry();
    const basePositions = new Float32Array(particleCount * 3);
    const positions = new Float32Array(particleCount * 3);
    const currentDisplacements = new Float32Array(particleCount * 3);
    const targetDisplacements = new Float32Array(particleCount * 3);

    // Dynamic per-glyph scaling and symbol indices
    const currentScales = new Float32Array(particleCount);
    const targetScales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const charIndices = new Float32Array(particleCount);

    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      basePositions[i * 3] = x * sphereRadius;
      basePositions[i * 3 + 1] = y * sphereRadius;
      basePositions[i * 3 + 2] = z * sphereRadius;

      positions[i * 3] = basePositions[i * 3];
      positions[i * 3 + 1] = basePositions[i * 3 + 1];
      positions[i * 3 + 2] = basePositions[i * 3 + 2];

      currentScales[i] = 1.0;
      targetScales[i] = 1.0;

      // Assign a random symbol index from the 16 available in the atlas
      charIndices[i] = Math.floor(Math.random() * symbols.length);

      // Clean, bright monochrome tonal depth
      const tone = 0.86 + Math.random() * 0.14;
      colors[i * 3] = tone;
      colors[i * 3 + 1] = tone * 0.98;
      colors[i * 3 + 2] = tone * 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(currentScales, 1));
    geometry.setAttribute('aCharIndex', new THREE.BufferAttribute(charIndices, 1));

    // 5. Custom Points Shader Material for Razor-Sharp Glyph Rendering
    const baseParticleSize = isMobile ? 0.080 : 0.098;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: charTexture },
        uBaseSize: { value: baseParticleSize },
        uHeight: { value: height * pixelRatio }
      },
      vertexShader: `
        attribute float aScale;
        attribute float aCharIndex;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vScale;
        varying float vCharIndex;
        uniform float uBaseSize;
        uniform float uHeight;

        void main() {
          vColor = color;
          vScale = aScale;
          vCharIndex = aCharIndex;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // Scale glyph size with perspective distance
          gl_PointSize = (uBaseSize * aScale) * (uHeight / -mvPosition.z);
          // Prevent particle clipping, allow rich scaling during proximity hover
          gl_PointSize = clamp(gl_PointSize, 3.0, 96.0);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        varying float vScale;
        varying float vCharIndex;

        void main() {
          float cols = 4.0;
          float rows = 4.0;
          float idx = floor(vCharIndex + 0.5);
          float col = mod(idx, cols);
          float row = floor(idx / cols);

          // Map gl_PointCoord (0..1) into character atlas cell
          vec2 uv = vec2((col + gl_PointCoord.x) / cols, (row + gl_PointCoord.y) / rows);
          vec4 tex = texture2D(uTexture, uv);

          // Hard threshold to completely remove blurry edges and create razor-sharp glyphs
          if (tex.a < 0.28) discard;

          // Crisp anti-aliasing cutoff
          float alpha = smoothstep(0.28, 0.42, tex.a);

          // Subtle brightness boost during hover or interaction
          float lumBoost = 1.0 + (vScale - 1.0) * 0.35;
          vec3 finalColor = vColor * lumBoost;

          gl_FragColor = vec4(finalColor, alpha * 0.95);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    const sphereGroup = new THREE.Group();
    sphereGroup.add(points);
    scene.add(sphereGroup);

    // 6. Interaction State Tracking & Refined Sensitivity
    const mouseNDC = new THREE.Vector2(-999, -999);
    let isMouseHovering = false;
    let isFingerPressing = false;
    let isDragging = false;
    let hasDragged = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerDownTime = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;

    let touchStartX = 0;
    let touchStartY = 0;
    let isScrolling = false;

    let rotVelocityX = 0;
    let rotVelocityY = 0;
    let targetVelocityX = 0;
    let targetVelocityY = 0;

    // Subtle click ripple array for desktop clicks
    interface Ripple {
      origin: THREE.Vector3;
      startTime: number;
      duration: number;
      maxRadius: number;
      amplitude: number;
    }
    const activeRipples: Ripple[] = [];

    const raycaster = new THREE.Raycaster();
    const boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), sphereRadius);
    const frontPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -sphereRadius * 0.4);
    const worldHit = new THREE.Vector3();
    const localHit = new THREE.Vector3();
    const scratchInvMatrix = new THREE.Matrix4();
    let isDeformed = false;

    const updateCursorPosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    // Pointer Events: Controlled tactile rotation & smooth mobile gestures
    const handlePointerDown = (e: PointerEvent) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      pointerDownTime = performance.now();

      if (e.pointerType === 'touch' || isTouchDevice) {
        touchStartX = e.clientX;
        touchStartY = e.clientY;
        isScrolling = false;
        isFingerPressing = true;
      }

      isDragging = true;
      hasDragged = false;
      targetVelocityX = 0;
      targetVelocityY = 0;
      updateCursorPosition(e.clientX, e.clientY);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || isTouchDevice) {
        const deltaX = Math.abs(e.clientX - touchStartX);
        const deltaY = Math.abs(e.clientY - touchStartY);

        // If finger moves vertically more than horizontally, immediately yield to browser page scrolling!
        if (deltaY > 8 && deltaY > deltaX * 1.15) {
          isScrolling = true;
          isDragging = false;
          isFingerPressing = false;
          return;
        }
      }

      if (isScrolling) return;

      updateCursorPosition(e.clientX, e.clientY);

      if (e.pointerType === 'mouse') {
        isMouseHovering = Math.abs(mouseNDC.x) <= 1.25 && Math.abs(mouseNDC.y) <= 1.25;
      }

      if (isDragging) {
        const deltaX = e.clientX - lastPointerX;
        const deltaY = e.clientY - lastPointerY;

        if (Math.abs(e.clientX - pointerStartX) > 3 || Math.abs(e.clientY - pointerStartY) > 3) {
          hasDragged = true;
        }

        // Fluid, responsive drag rotation sensitivity
        const dragSpeedY = isMobile ? 0.0058 : 0.0048;
        const dragSpeedX = isMobile ? 0.0042 : 0.0036;
        sphereGroup.rotation.y += deltaX * dragSpeedY;
        sphereGroup.rotation.x += deltaY * dragSpeedX;

        // Dynamic flick momentum calculation
        targetVelocityY = deltaX * (isMobile ? 0.00065 : 0.00055);
        targetVelocityX = deltaY * (isMobile ? 0.00045 : 0.00038);

        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const now = performance.now();
      const clickDuration = now - pointerDownTime;

      // Desktop click ripple trigger (gentle, controlled wave)
      if (e.pointerType === 'mouse' && !hasDragged && clickDuration < 380 && isMouseHovering) {
        raycaster.setFromCamera(mouseNDC, camera);
        const hit = raycaster.ray.intersectSphere(boundingSphere, worldHit) || raycaster.ray.intersectPlane(frontPlane, worldHit);
        if (hit) {
          scratchInvMatrix.copy(sphereGroup.matrixWorld).invert();
          localHit.copy(worldHit).applyMatrix4(scratchInvMatrix);

          activeRipples.push({
            origin: localHit.clone(),
            startTime: now,
            duration: 950,
            maxRadius: sphereRadius * 1.6,
            amplitude: 0.08
          });
          isDeformed = true;
        }
      }

      if (isDragging) {
        // Cap max flick velocity to prevent wild spinning, but allow smooth satisfying momentum
        targetVelocityY = Math.max(-0.028, Math.min(0.028, targetVelocityY));
        targetVelocityX = Math.max(-0.020, Math.min(0.020, targetVelocityX));
      }

      if (e.pointerType === 'touch' || isTouchDevice) {
        isFingerPressing = false;
        isScrolling = false;
      }

      isDragging = false;
    };

    const handlePointerCancel = () => {
      isFingerPressing = false;
      isDragging = false;
      isMouseHovering = false;
      isScrolling = false;
    };

    const handlePointerLeave = (e: PointerEvent) => {
      if (e.pointerType === 'mouse') {
        isMouseHovering = false;
      }
      isDragging = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointercancel', handlePointerCancel);

    // 7. Responsive Viewport Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      material.uniforms.uHeight.value = height * renderer.getPixelRatio();
    };
    window.addEventListener('resize', handleResize);

    // 8. Intersection Observer (pause RAF when scrolled out of view)
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (!wasVisible && isVisible) {
          rafIdRef.current = requestAnimationFrame(animate);
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 9. Core 60fps Animation Loop
    const baseAutoRotation = prefersReducedMotion ? 0 : 0.0012;

    const animate = () => {
      if (!isVisible) {
        rafIdRef.current = null;
        return;
      }

      const now = performance.now();

      // Clean up finished ripples
      for (let r = activeRipples.length - 1; r >= 0; r--) {
        if (now - activeRipples[r].startTime > activeRipples[r].duration) {
          activeRipples.splice(r, 1);
        }
      }

      // Smooth rotation velocity interpolation with controlled deceleration
      if (!isDragging) {
        rotVelocityX += (targetVelocityX - rotVelocityX) * 0.12;
        rotVelocityY += (targetVelocityY - rotVelocityY) * 0.12;

        sphereGroup.rotation.y += rotVelocityY + baseAutoRotation;
        sphereGroup.rotation.x += rotVelocityX;

        // Quick flick decay with natural inertia glide
        targetVelocityX *= 0.955;
        targetVelocityY *= 0.955;
      } else {
        rotVelocityX = 0;
        rotVelocityY = 0;
      }

      // Gentle pitch leveling towards 0
      sphereGroup.rotation.x *= 0.95;

      // Raycast pointer position into sphere local coordinate space
      let hasInteractionPoint = false;
      const shouldInteract = isTouchDevice ? (isFingerPressing && !isScrolling) : isMouseHovering;

      if (shouldInteract) {
        raycaster.setFromCamera(mouseNDC, camera);
        const hitFound =
          raycaster.ray.intersectSphere(boundingSphere, worldHit) !== null ||
          raycaster.ray.intersectPlane(frontPlane, worldHit) !== null;

        if (hitFound) {
          scratchInvMatrix.copy(sphereGroup.matrixWorld).invert();
          localHit.copy(worldHit).applyMatrix4(scratchInvMatrix);
          hasInteractionPoint = true;
          isDeformed = true;
        }
      }

      if (activeRipples.length > 0) {
        isDeformed = true;
      }

      // Only recompute and re-upload vertex buffers to GPU if there is active distortion
      if (isDeformed) {
        const posAttr = geometry.attributes.position as THREE.BufferAttribute;
        const posArray = posAttr.array as Float32Array;
        const scaleAttr = geometry.attributes.aScale as THREE.BufferAttribute;
        const scaleArray = scaleAttr.array as Float32Array;

        // Proximity influence radius on sphere surface
        const influenceRadius = sphereRadius * (isTouchDevice ? 0.65 : 0.58);
        const influenceRadiusSq = influenceRadius * influenceRadius;
        const dampingSpeed = isTouchDevice ? 0.14 : 0.10;
        let maxDelta = 0;

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          const bx = basePositions[idx];
          const by = basePositions[idx + 1];
          const bz = basePositions[idx + 2];

          if (hasInteractionPoint) {
            const dx = bx - localHit.x;
            const dy = by - localHit.y;
            const dz = bz - localHit.z;
            const distSq = dx * dx + dy * dy + dz * dz;

            if (distSq < influenceRadiusSq) {
              const dist = Math.sqrt(distSq);
              const norm = 1.0 - dist / influenceRadius;
              const invDist = 1 / (dist || 0.001);

              if (isTouchDevice && isFingerPressing) {
                // Mobile touch: tactile 3D distortion indenting and pushing outwards
                const distortAmp = Math.pow(norm, 1.6) * 0.65;
                targetDisplacements[idx] = dx * invDist * distortAmp;
                targetDisplacements[idx + 1] = dy * invDist * distortAmp;
                targetDisplacements[idx + 2] = dz * invDist * distortAmp;

                // Scaling under finger up to 2.2x
                targetScales[i] = 1.0 + Math.pow(norm, 1.3) * 1.25;
              } else if (!isTouchDevice && isMouseHovering) {
                // Desktop cursor hover: responsive glyph swelling up to 2.4x
                targetScales[i] = 1.0 + Math.pow(norm, 1.4) * 1.40;

                // Kinetic organic deflection
                const repelAmp = Math.pow(norm, 1.8) * 0.42;
                targetDisplacements[idx] = dx * invDist * repelAmp;
                targetDisplacements[idx + 1] = dy * invDist * repelAmp;
                targetDisplacements[idx + 2] = dz * invDist * repelAmp;
              }
            } else {
              targetDisplacements[idx] = 0;
              targetDisplacements[idx + 1] = 0;
              targetDisplacements[idx + 2] = 0;
              targetScales[i] = 1.0;
            }
          } else {
            targetDisplacements[idx] = 0;
            targetDisplacements[idx + 1] = 0;
            targetDisplacements[idx + 2] = 0;
            targetScales[i] = 1.0;
          }

          // Smooth damping towards targets
          currentDisplacements[idx] +=
            (targetDisplacements[idx] - currentDisplacements[idx]) * dampingSpeed;
          currentDisplacements[idx + 1] +=
            (targetDisplacements[idx + 1] - currentDisplacements[idx + 1]) * dampingSpeed;
          currentDisplacements[idx + 2] +=
            (targetDisplacements[idx + 2] - currentDisplacements[idx + 2]) * dampingSpeed;

          currentScales[i] += (targetScales[i] - currentScales[i]) * 0.11;
          scaleArray[i] = currentScales[i];

          // Ripple wave calculation (desktop clicks)
          let rippleX = 0;
          let rippleY = 0;
          let rippleZ = 0;

          for (let r = 0; r < activeRipples.length; r++) {
            const ripple = activeRipples[r];
            const progress = (now - ripple.startTime) / ripple.duration;
            const waveRadius = progress * ripple.maxRadius;
            const waveWidth = 0.7;
            const decay = Math.pow(1 - progress, 1.5);

            const rx = bx - ripple.origin.x;
            const ry = by - ripple.origin.y;
            const rz = bz - ripple.origin.z;
            const d = Math.sqrt(rx * rx + ry * ry + rz * rz);
            const waveDiff = Math.abs(d - waveRadius);

            if (waveDiff < waveWidth) {
              const wave =
                Math.cos((waveDiff / waveWidth) * (Math.PI / 2)) * ripple.amplitude * decay;
              rippleX += (bx / sphereRadius) * wave;
              rippleY += (by / sphereRadius) * wave;
              rippleZ += (bz / sphereRadius) * wave;
            }
          }

          const curDispX = currentDisplacements[idx] + rippleX;
          const curDispY = currentDisplacements[idx + 1] + rippleY;
          const curDispZ = currentDisplacements[idx + 2] + rippleZ;

          posArray[idx] = bx + curDispX;
          posArray[idx + 1] = by + curDispY;
          posArray[idx + 2] = bz + curDispZ;

          const deltaMag = Math.abs(curDispX) + Math.abs(curDispY) + Math.abs(curDispZ) + Math.abs(currentScales[i] - 1.0);
          if (deltaMag > maxDelta) {
            maxDelta = deltaMag;
          }
        }

        posAttr.needsUpdate = true;
        scaleAttr.needsUpdate = true;

        // If returned to rest and no interaction or ripple active, stop re-uploading attributes
        if (!hasInteractionPoint && activeRipples.length === 0 && maxDelta < 0.001) {
          isDeformed = false;
        }
      }

      renderer.render(scene, camera);

      rafIdRef.current = requestAnimationFrame(animate);
    };

    rafIdRef.current = requestAnimationFrame(animate);

    // 10. Resource Disposals
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      observer.disconnect();

      canvas.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      charTexture.dispose();
      renderer.dispose();

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Atmospheric cinematic radial aura behind the sphere */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.035) 0%, rgba(200, 210, 225, 0.015) 30%, transparent 68%)'
        }}
      />
      {/* 3D WebGL Canvas mount container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
