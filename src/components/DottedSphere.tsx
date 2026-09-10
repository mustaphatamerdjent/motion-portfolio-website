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
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);

    const canvas = renderer.domElement;
    canvas.className =
      'w-full h-full block touch-none cursor-grab active:cursor-grabbing select-none';
    container.appendChild(canvas);

    // 3. Dot Texture generation (soft gaussian core with subtle outer corona)
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 64;
    dotCanvas.height = 64;
    const ctx = dotCanvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
      gradient.addColorStop(0.28, 'rgba(242, 245, 252, 0.88)');
      gradient.addColorStop(0.55, 'rgba(195, 205, 222, 0.35)');
      gradient.addColorStop(0.82, 'rgba(150, 160, 180, 0.08)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(32, 32, 31, 0, Math.PI * 2);
      ctx.fill();
    }
    const dotTexture = new THREE.CanvasTexture(dotCanvas);

    // 4. Procedural Fibonacci Golden Sphere Distribution
    const particleCount = isMobile ? 1400 : 2600;
    const sphereRadius = isMobile ? 2.35 : 3.15;

    const geometry = new THREE.BufferGeometry();
    const basePositions = new Float32Array(particleCount * 3);
    const positions = new Float32Array(particleCount * 3);
    const currentDisplacements = new Float32Array(particleCount * 3);
    const targetDisplacements = new Float32Array(particleCount * 3);

    // Dynamic per-dot scaling arrays
    const currentScales = new Float32Array(particleCount);
    const targetScales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

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

      // Subtle monochromatic tonal depth
      const tone = 0.82 + Math.random() * 0.18;
      colors[i * 3] = tone;
      colors[i * 3 + 1] = tone * 0.98;
      colors[i * 3 + 2] = tone * 1.0;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(currentScales, 1));

    // 5. Custom Points Shader Material for Smooth Per-Dot Scaling & Luminescence
    const baseParticleSize = isMobile ? 0.052 : 0.058;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: dotTexture },
        uBaseSize: { value: baseParticleSize },
        uHeight: { value: height * pixelRatio }
      },
      vertexShader: `
        attribute float aScale;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vScale;
        uniform float uBaseSize;
        uniform float uHeight;

        void main() {
          vColor = color;
          vScale = aScale;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          // Attenuated particle size with smooth per-dot dynamic scale
          gl_PointSize = (uBaseSize * aScale) * (uHeight / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        varying float vScale;

        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          if (tex.a < 0.015) discard;
          // Dots scaling up gain refined energetic radiance
          float lumBoost = 1.0 + (vScale - 1.0) * 0.32;
          vec3 finalColor = vColor * lumBoost;
          gl_FragColor = vec4(finalColor, tex.a * 0.82);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    const sphereGroup = new THREE.Group();
    sphereGroup.add(points);
    scene.add(sphereGroup);

    // 6. Interaction State Tracking
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
    const projectionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const worldHit = new THREE.Vector3();
    const localHit = new THREE.Vector3();
    const scratchInvMatrix = new THREE.Matrix4();
    let isDeformed = false;

    const updateCursorPosition = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      mouseNDC.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouseNDC.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    // Pointer Events: Desktop vs Mobile Specific Behavior
    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      hasDragged = false;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      pointerDownTime = performance.now();

      updateCursorPosition(e.clientX, e.clientY);

      if (e.pointerType === 'touch' || isTouchDevice) {
        // Mobile screen press: activate 3D distortion & dot proximity scaling under finger
        isFingerPressing = true;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateCursorPosition(e.clientX, e.clientY);

      if (e.pointerType === 'mouse') {
        // Computer version: cursor hovering activates proximity scaling
        isMouseHovering = true;
      }

      if (isDragging) {
        const deltaX = e.clientX - lastPointerX;
        const deltaY = e.clientY - lastPointerY;

        if (Math.abs(e.clientX - pointerStartX) > 4 || Math.abs(e.clientY - pointerStartY) > 4) {
          hasDragged = true;
        }

        targetVelocityY += deltaX * 0.0006;
        targetVelocityX += deltaY * 0.0006;

        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      const now = performance.now();
      const clickDuration = now - pointerDownTime;

      // Desktop click ripple trigger
      if (e.pointerType === 'mouse' && !hasDragged && clickDuration < 380 && isMouseHovering) {
        raycaster.setFromCamera(mouseNDC, camera);
        if (raycaster.ray.intersectPlane(projectionPlane, worldHit)) {
          scratchInvMatrix.copy(sphereGroup.matrixWorld).invert();
          localHit.copy(worldHit).applyMatrix4(scratchInvMatrix);

          activeRipples.push({
            origin: localHit.clone(),
            startTime: now,
            duration: 1200,
            maxRadius: sphereRadius * 2.2,
            amplitude: 0.28
          });
          isDeformed = true;
        }
      }

      // Mobile screen release: finger lifted, distortion & scaling smoothly spring back
      if (e.pointerType === 'touch' || isTouchDevice) {
        isFingerPressing = false;
      }

      isDragging = false;
    };

    const handlePointerCancel = () => {
      isFingerPressing = false;
      isDragging = false;
      isMouseHovering = false;
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
    const baseAutoRotation = prefersReducedMotion ? 0 : 0.0014;

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

      // Smooth rotation velocity interpolation
      rotVelocityX += (targetVelocityX - rotVelocityX) * 0.12;
      rotVelocityY += (targetVelocityY - rotVelocityY) * 0.12;

      sphereGroup.rotation.y += rotVelocityY + (isDragging ? 0 : baseAutoRotation);
      sphereGroup.rotation.x += rotVelocityX;

      // Drag velocity decay
      targetVelocityX *= 0.93;
      targetVelocityY *= 0.93;

      // Gentle pitch leveling towards 0
      sphereGroup.rotation.x *= 0.965;

      // Raycast pointer position into sphere local coordinate space
      let hasInteractionPoint = false;
      const shouldInteract = isTouchDevice ? isFingerPressing : isMouseHovering;

      if (shouldInteract) {
        raycaster.setFromCamera(mouseNDC, camera);
        if (raycaster.ray.intersectPlane(projectionPlane, worldHit)) {
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

        const influenceRadius = isTouchDevice
          ? sphereRadius * 0.95
          : sphereRadius * 0.85;
        const influenceRadiusSq = influenceRadius * influenceRadius;
        const dampingSpeed = isTouchDevice ? 0.12 : 0.09;
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
                const distortAmp = Math.pow(norm, 1.7) * 0.95;
                targetDisplacements[idx] = dx * invDist * distortAmp;
                targetDisplacements[idx + 1] = dy * invDist * distortAmp;
                targetDisplacements[idx + 2] = dz * invDist * distortAmp;
                targetScales[i] = 1.0 + Math.pow(norm, 1.4) * 1.45;
              } else if (!isTouchDevice && isMouseHovering) {
                targetScales[i] = 1.0 + Math.pow(norm, 1.5) * 1.35;
                const repelAmp = Math.pow(norm, 2.0) * 0.45;
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
            const waveWidth = 0.9;
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
      dotTexture.dispose();
      renderer.dispose();

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Soft atmospheric cinematic radial aura behind the sphere */}
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
