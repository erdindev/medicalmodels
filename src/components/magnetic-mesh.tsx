"use client";

import { useEffect, useRef } from "react";

interface Point {
    x: number;
    y: number;
    originX: number;
    originY: number;
    vx: number;
    vy: number;
    waveIntensity: number; // For idle wave animation
}

import { usePathname } from "next/navigation";

export function MagneticMesh() {
    const pathname = usePathname();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Only render on home page
    const shouldRender = pathname === "/";

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let points: Point[] = [];
        let animationFrameId: number;
        let mouseX = -1000;
        let mouseY = -1000;
        let isMouseInWindow = false;
        let lastMouseMoveTime = 0;
        const IDLE_TIMEOUT = 2000; // 2 seconds of no movement triggers idle mode

        // Configuration
        const GRID_SPACING = 40; // Less dense mesh
        const POINT_RADIUS = 1.5; // Slightly smaller points
        const EFFECT_RADIUS = 60; // Slightly larger radius
        const PULL_FACTOR = 0.4; // Stronger pull (less subtle)
        const EASE_FACTOR = 0.15; // Faster movement (less molasses)
        const WAVE_SPEED = 0.0015; // Speed of the idle wave (slower)
        const WAVE_RADIUS = 150; // Radius of the wave effect

        // Colors
        let primaryColor = "rgba(100, 100, 255, 0.2)";

        const init = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const style = getComputedStyle(document.body);
            const primaryHsl = style.getPropertyValue("--primary").trim();
            if (primaryHsl) {
                primaryColor = `hsl(${primaryHsl} / 0.2)`;
            }

            points = [];
            const cols = Math.ceil(canvas.width / GRID_SPACING) + 1;
            const rows = Math.ceil(canvas.height / GRID_SPACING) + 1;

            for (let i = 0; i < cols; i++) {
                for (let j = 0; j < rows; j++) {
                    const x = i * GRID_SPACING;
                    const y = j * GRID_SPACING;
                    points.push({
                        x,
                        y,
                        originX: x,
                        originY: y,
                        vx: 0,
                        vy: 0,
                        waveIntensity: 0,
                    });
                }
            }
        };

        // Wave centers for idle animation
        let waveCenters: { x: number; y: number; startTime: number; }[] = [];
        let lastWaveTime = 0;

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const time = Date.now() * 0.001; // Current time in seconds
            const now = Date.now();

            // Check if we're in idle mode (mouse not in window or not moved for a while)
            const isIdle = !isMouseInWindow || (now - lastMouseMoveTime > IDLE_TIMEOUT);

            // Spawn new wave centers randomly when idle
            if (isIdle && now - lastWaveTime > 2500) { // New wave every 2.5 seconds
                lastWaveTime = now;
                waveCenters.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    startTime: now,
                });
                // Keep only last 3 waves
                if (waveCenters.length > 3) {
                    waveCenters.shift();
                }
            }

            // Clean up old waves when not idle
            if (!isIdle) {
                waveCenters = waveCenters.filter(w => now - w.startTime < 2000);
            }

            for (let i = 0; i < points.length; i++) {
                const p = points[i];

                // Calculate distance from origin to mouse (to determine target position)
                const dxMouse = mouseX - p.originX;
                const dyMouse = mouseY - p.originY;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                let targetX = p.originX;
                let targetY = p.originY;

                // Idle floating animation
                // Use sine waves based on position and time to create organic movement
                const floatX = Math.sin(time + p.originY * 0.05) * 2;
                const floatY = Math.cos(time + p.originX * 0.05) * 2;

                targetX += floatX;
                targetY += floatY;

                if (!isIdle && distMouse < EFFECT_RADIUS) {
                    const force = (1 - distMouse / EFFECT_RADIUS) * PULL_FACTOR;
                    // Target is shifted towards mouse
                    targetX += dxMouse * force;
                    targetY += dyMouse * force;
                }

                // Calculate wave intensity for idle mode
                let waveIntensityTarget = 0;
                if (isIdle || waveCenters.length > 0) {
                    for (const wave of waveCenters) {
                        const waveAge = (now - wave.startTime) * WAVE_SPEED;
                        const waveCurrentRadius = waveAge * 300; // Wave expands outward
                        const dx = p.originX - wave.x;
                        const dy = p.originY - wave.y;
                        const distToWaveCenter = Math.sqrt(dx * dx + dy * dy);

                        // Point is affected if it's near the wave front
                        const distToWaveFront = Math.abs(distToWaveCenter - waveCurrentRadius);
                        if (distToWaveFront < WAVE_RADIUS) {
                            const waveStrength = 1 - distToWaveFront / WAVE_RADIUS;
                            // Fade out wave over time
                            const waveFade = Math.max(0, 1 - waveAge * 0.3);
                            waveIntensityTarget = Math.max(waveIntensityTarget, waveStrength * waveFade);
                        }
                    }
                }

                // Smooth wave intensity transition
                p.waveIntensity += (waveIntensityTarget - p.waveIntensity) * 0.1;

                // Smoothly move towards target (Lerp) - No spring/bounce
                p.x += (targetX - p.x) * EASE_FACTOR;
                p.y += (targetY - p.y) * EASE_FACTOR;
            }

            // Draw points
            for (let i = 0; i < points.length; i++) {
                const p = points[i];

                // Calculate distance to mouse for color interpolation
                const dxMouse = mouseX - p.x;
                const dyMouse = mouseY - p.y;
                const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

                ctx.beginPath();
                ctx.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2);

                // Determine color intensity from mouse or wave
                let intensity = 0;

                if (!isIdle && distMouse < EFFECT_RADIUS * 1.5) {
                    intensity = Math.max(0, 1 - distMouse / (EFFECT_RADIUS * 1.5));
                }

                // Wave intensity takes over or adds to mouse intensity
                intensity = Math.max(intensity, p.waveIntensity);

                if (intensity > 0.01) {
                    // Interpolate color for active points
                    // Base: 100, 100, 255 (Blue-ish)
                    // Target: 255, 0, 255 (Full Magenta - more saturated)
                    const r = 100 + (155 * intensity);
                    const g = 100 - (100 * intensity);
                    const b = 255;
                    const a = 0.2 + (0.7 * intensity); // More opaque when active
                    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
                } else {
                    ctx.fillStyle = primaryColor;
                }

                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(update);
        };



        const handleResize = () => {
            init();
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            lastMouseMoveTime = Date.now();
        };

        const handleMouseEnter = () => {
            isMouseInWindow = true;
            lastMouseMoveTime = Date.now();
        };

        const handleMouseLeave = () => {
            isMouseInWindow = false;
            mouseX = -1000;
            mouseY = -1000;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseenter", handleMouseEnter);
        document.addEventListener("mouseleave", handleMouseLeave);

        init();
        update();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseenter", handleMouseEnter);
            document.removeEventListener("mouseleave", handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    if (!shouldRender) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none bg-background"
        />
    );
}
