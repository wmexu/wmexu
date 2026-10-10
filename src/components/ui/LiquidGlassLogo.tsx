"use client";

import React, { useEffect, useRef, useState } from "react";

export default function LiquidGlassLogo({
  text = "w.",
  fontSize = 28,
  className = "",
}: {
  text?: string;
  fontSize?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglActive, setWebglActive] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Automatically re-render as soon as custom fonts (Geist) are loaded so user never needs to reload
  useEffect(() => {
    if (typeof document !== "undefined" && document.fonts) {
      if (document.fonts.status === "loaded") {
        setFontsLoaded(true);
      } else {
        document.fonts.ready.then(() => {
          setFontsLoaded(true);
        });
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Strict 1:1 square dimensions (guaranteed 1:1)
    const dpr = Math.min(window.devicePixelRatio || 2, 2.5);
    const canvasSize = 64; // Exactly 64px x 64px CSS (1:1 square)
    const width = Math.round(canvasSize * dpr);
    const height = width; // Strictly 1:1 square

    canvas.width = width;
    canvas.height = height;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });

    if (!gl) {
      setWebglActive(false);
      return;
    }

    // 1. Create Texture iChannel0 from Offscreen Canvas
    const textCanvas = document.createElement("canvas");
    textCanvas.width = width;
    textCanvas.height = height;
    const ctx = textCanvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    const computedFont =
      typeof window !== "undefined"
        ? getComputedStyle(document.body).fontFamily
        : "sans-serif";
    const textPx = Math.round(fontSize * dpr);

    ctx.fillStyle = "#ffffff";
    ctx.font = `600 ${textPx}px ${computedFont}`;

    const centerX = width / 2;
    const centerY = height / 2;

    // CENTERED DIRECTLY ON THE LETTER "w", WITH DOT NATURAL AND TIGHT (NO AWKWARD GAP):
    // Measure lowercase "w" to anchor its center directly at centerX
    const wMetrics = ctx.measureText("w");
    const wWidth = wMetrics.width;
    const actualAscent = wMetrics.actualBoundingBoxAscent || textPx * 0.52;
    const actualDescent = wMetrics.actualBoundingBoxDescent || 0;

    // Positioning:
    // startX places the center of the letter 'w' precisely at centerX
    const startX = centerX - wWidth / 2;
    const drawY = centerY + (actualAscent - actualDescent) / 2;

    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    // Draw "w." as a unified typographic unit with natural font kerning so dot hits the gap
    ctx.fillText("w.", startX, drawY);

    // 1:1 SQUARE SHADER LENS SIZING:
    // lensRCss = 25.0px gives a 50px x 50px 1:1 squircle lens
    // Surrounds the ~20px x 14.5px "w." with comfortable ~18px top/bottom margins
    const lensRCss = 25.0; // CSS pixels
    const uvR = lensRCss / canvasSize; // ~0.3906 in normalized space

    // Mask multipliers for 1:1 squircle formula:
    // roundedBox = pow(abs(m2.x), 6.0) + pow(abs(m2.y), 6.0)
    const maskMult1 = 1.0 / Math.pow(uvR, 6.0);
    const maskMult2 = maskMult1 * 0.95;
    const maskMult3 = maskMult1 * 1.10;
    const lensMult = maskMult1 * 0.35;

    // Draggable hover interaction radius: 40% bigger than the lens
    const maxDragRadius = lensRCss * 1.40 * dpr;

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      textCanvas
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // 2. Vertex Shader
    const vsSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    // 3. Liquid Glass Fragment Shader (strictly 1:1 isotropic squircle)
    const fsSource = `
      precision mediump float;

      uniform vec3 iResolution;
      uniform float iTime;
      uniform vec4 iMouse;
      uniform sampler2D iChannel0;

      uniform float uMaskMult1;
      uniform float uMaskMult2;
      uniform float uMaskMult3;
      uniform float uLensMult;
      uniform float uBlurPower;

      void mainImage(out vec4 fragColor, in vec2 fragCoord)
      {
        const float NUM_ZERO = 0.0;
        const float NUM_ONE = 1.0;
        const float NUM_HALF = 0.5;
        const float NUM_TWO = 2.0;
        const float POWER_EXPONENT = 6.0;

        const float MASK_STRENGTH_1 = 8.0;
        const float MASK_STRENGTH_2 = 16.0;
        const float MASK_STRENGTH_3 = 2.0;
        const float MASK_THRESHOLD_1 = 0.95;
        const float MASK_THRESHOLD_2 = 0.9;
        const float MASK_THRESHOLD_3 = 1.5;
        const float SAMPLE_RANGE = 4.0;
        const float SAMPLE_OFFSET = 0.5;
        const float GRADIENT_RANGE = 0.2;
        const float GRADIENT_OFFSET = 0.1;
        const float GRADIENT_EXTREME = -1000.0;
        const float LIGHTING_INTENSITY = 0.35;

        vec2 uv = fragCoord.xy / iResolution.xy;
        vec2 mouse = iMouse.xy;
        if (length(mouse) < NUM_ONE) {
          mouse = iResolution.xy / NUM_TWO;
        }
        // Isotropic coordinates (guaranteed 1:1 square aspect ratio)
        vec2 m2 = (fragCoord.xy - mouse) / iResolution.y;

        // Strict 1:1 rounded square calculation (symmetric on both axes)
        float roundedBox = pow(abs(m2.x), POWER_EXPONENT) + pow(abs(m2.y), POWER_EXPONENT);
        float rb1 = clamp((NUM_ONE - roundedBox * uMaskMult1) * MASK_STRENGTH_1, NUM_ZERO, NUM_ONE);
        float rb2 = clamp((MASK_THRESHOLD_1 - roundedBox * uMaskMult2) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE) -
          clamp(pow(MASK_THRESHOLD_2 - roundedBox * uMaskMult2, NUM_ONE) * MASK_STRENGTH_2, NUM_ZERO, NUM_ONE);
        float rb3 = clamp((MASK_THRESHOLD_3 - roundedBox * uMaskMult3) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE) -
          clamp(pow(NUM_ONE - roundedBox * uMaskMult3, NUM_ONE) * MASK_STRENGTH_3, NUM_ZERO, NUM_ONE);

        fragColor = vec4(NUM_ZERO);
        float transition = smoothstep(NUM_ZERO, NUM_ONE, rb1 + rb2);

        if (transition > NUM_ZERO) {
          vec2 lens = ((uv - NUM_HALF) * NUM_ONE * (NUM_ONE - roundedBox * uLensMult) + NUM_HALF);
          vec4 sharpCol = texture2D(iChannel0, lens);
          vec4 blurCol = vec4(NUM_ZERO);
          float total = NUM_ZERO;
          // Scale blur sampling offset by uBlurPower (0.60 unhovered for -40% power, 1.0 on hover)
          float sampleOffset = SAMPLE_OFFSET * uBlurPower;
          for (float x = -SAMPLE_RANGE; x <= SAMPLE_RANGE; x++) {
            for (float y = -SAMPLE_RANGE; y <= SAMPLE_RANGE; y++) {
              vec2 offset = vec2(x, y) * sampleOffset / iResolution.xy;
              blurCol += texture2D(iChannel0, offset + lens);
              total += NUM_ONE;
            }
          }
          blurCol /= total;

          // Blend sharp and blur components: 0.60 when unhovered (-40% power), 1.0 when hovered (-0% power)
          fragColor = mix(sharpCol, blurCol, uBlurPower);

          float gradient = clamp((clamp(m2.y, NUM_ZERO, GRADIENT_RANGE) + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE) +
            clamp((clamp(-m2.y, GRADIENT_EXTREME, GRADIENT_RANGE) * rb3 + GRADIENT_OFFSET) / NUM_TWO, NUM_ZERO, NUM_ONE);
          vec4 lighting = clamp(fragColor + vec4(rb1) * gradient + vec4(rb2) * LIGHTING_INTENSITY, NUM_ZERO, NUM_ONE);

          fragColor = mix(texture2D(iChannel0, uv), lighting, transition);
        } else {
          fragColor = texture2D(iChannel0, uv);
        }
      }

      void main() {
        mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    function compileShader(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) {
      setWebglActive(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      setWebglActive(false);
      return;
    }

    gl.useProgram(program);

    // Full-screen Quad
    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const resLoc = gl.getUniformLocation(program, "iResolution");
    const timeLoc = gl.getUniformLocation(program, "iTime");
    const mouseLoc = gl.getUniformLocation(program, "iMouse");
    const channel0Loc = gl.getUniformLocation(program, "iChannel0");

    const uMask1Loc = gl.getUniformLocation(program, "uMaskMult1");
    const uMask2Loc = gl.getUniformLocation(program, "uMaskMult2");
    const uMask3Loc = gl.getUniformLocation(program, "uMaskMult3");
    const uLensLoc = gl.getUniformLocation(program, "uLensMult");
    const uBlurPowerLoc = gl.getUniformLocation(program, "uBlurPower");

    gl.uniform3f(resLoc, width, height, 1.0);
    gl.uniform1i(channel0Loc, 0);
    gl.uniform1f(uMask1Loc, maskMult1);
    gl.uniform1f(uMask2Loc, maskMult2);
    gl.uniform1f(uMask3Loc, maskMult3);
    gl.uniform1f(uLensLoc, lensMult);
    gl.uniform1f(uBlurPowerLoc, 0.60);

    let currentMouse = [centerX, centerY];
    let targetMouse = [centerX, centerY];
    let isHovered = false;
    let currentBlurPower = 0.60; // Default -40% blur power (0.60)

    const handleMouseEnter = () => {
      isHovered = true;
    };

    // Draggable effect on hover within radius 40% bigger than the lens
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const rawX = (e.clientX - rect.left) * dpr;
      const rawY = (rect.height - (e.clientY - rect.top)) * dpr; // Flip Y for WebGL

      const dx = rawX - centerX;
      const dy = rawY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= maxDragRadius) {
        targetMouse = [rawX, rawY];
      } else {
        const factor = maxDragRadius / dist;
        targetMouse = [centerX + dx * factor, centerY + dy * factor];
      }
      isHovered = true;
    };

    const handleMouseLeave = () => {
      targetMouse = [centerX, centerY];
      isHovered = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const rawX = (e.touches[0].clientX - rect.left) * dpr;
      const rawY = (rect.height - (e.touches[0].clientY - rect.top)) * dpr;
      targetMouse = [rawX, rawY];
      isHovered = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (!e.touches[0]) return;
      const rect = canvas.getBoundingClientRect();
      const rawX = (e.touches[0].clientX - rect.left) * dpr;
      const rawY = (rect.height - (e.touches[0].clientY - rect.top)) * dpr;
      const dx = rawX - centerX;
      const dy = rawY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist <= maxDragRadius) {
        targetMouse = [rawX, rawY];
      } else {
        const factor = maxDragRadius / dist;
        targetMouse = [centerX + dx * factor, centerY + dy * factor];
      }
      isHovered = true;
    };

    const handleTouchEnd = () => {
      targetMouse = [centerX, centerY];
      isHovered = false;
    };

    const parent = canvas.parentElement;
    parent?.addEventListener("mouseenter", handleMouseEnter);
    parent?.addEventListener("mousemove", handleMouseMove);
    parent?.addEventListener("mouseleave", handleMouseLeave);
    parent?.addEventListener("touchstart", handleTouchStart, { passive: false });
    parent?.addEventListener("touchmove", handleTouchMove, { passive: false });
    parent?.addEventListener("touchend", handleTouchEnd, { passive: true });

    let animId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      if (!gl) return;
      // Smooth liquid spring inertia
      currentMouse[0] += (targetMouse[0] - currentMouse[0]) * 0.14;
      currentMouse[1] += (targetMouse[1] - currentMouse[1]) * 0.14;

      // Smooth blur power transition: 0.60 unhovered (-40% power) to 1.0 hovered (-0% power)
      const targetBlurPower = isHovered ? 1.0 : 0.60;
      currentBlurPower += (targetBlurPower - currentBlurPower) * 0.14;

      gl.viewport(0, 0, width, height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform3f(resLoc, width, height, 1.0);
      gl.uniform1f(timeLoc, (now - startTime) / 1000.0);
      gl.uniform4f(
        mouseLoc,
        currentMouse[0],
        currentMouse[1],
        isHovered ? 1.0 : 0.0,
        0.0
      );
      gl.uniform1f(uBlurPowerLoc, currentBlurPower);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    setWebglActive(true);

    return () => {
      cancelAnimationFrame(animId);
      parent?.removeEventListener("mouseenter", handleMouseEnter);
      parent?.removeEventListener("mousemove", handleMouseMove);
      parent?.removeEventListener("mouseleave", handleMouseLeave);
      parent?.removeEventListener("touchstart", handleTouchStart);
      parent?.removeEventListener("touchmove", handleTouchMove);
      parent?.removeEventListener("touchend", handleTouchEnd);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteTexture(texture);
      gl.deleteBuffer(quadBuffer);
    };
  }, [text, fontSize, fontsLoaded]);

  const canvasSize = 64; // Strictly 1:1 square

  return (
    <div
      data-lenis-prevent="true"
      data-lenis-prevent-touch="true"
      className={`shrink-0 aspect-square relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: `${canvasSize}px`,
        height: `${canvasSize}px`,
        aspectRatio: "1 / 1",
        touchAction: "none",
      }}
    >
      {/* Pixel-perfect SSR & Pre-WebGL fallback matching the exact shader squircle shape & text */}
      {!webglActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <div
            className="rounded-[15px] bg-[#000000] border border-white/[0.12] flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]"
            style={{
              width: "50px",
              height: "50px",
            }}
          >
            <span
              className="text-white select-none"
              style={{
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontSize: `${fontSize}px`,
                lineHeight: "1",
                letterSpacing: "-0.5px",
                fontWeight: 600,
              }}
            >
              {text}
            </span>
          </div>
        </div>
      )}

      {/* Real WebGL Canvas with strictly 1:1 square shader */}
      <canvas
        ref={canvasRef}
        data-lenis-prevent="true"
        data-lenis-prevent-touch="true"
        className="shrink-0 aspect-square w-full h-full block cursor-pointer"
        style={{
          width: `${canvasSize}px`,
          height: `${canvasSize}px`,
          aspectRatio: "1 / 1",
          touchAction: "none",
        }}
      />
    </div>
  );
}
