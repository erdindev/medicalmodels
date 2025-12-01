"use client";

import { useEffect, useRef } from "react";

interface Point {
    x: number;
    y: number;
    originX: number;
    originY: number;
    vx: number;
    vy: number;
}

export function MagneticMesh() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let points: Point[] = [];
        let animationFrameId: number;
        let mouseX = -1000;
        let mouseY = -1000;

        // Configuration
        const GRID_SPACING = 40; // Less dense mesh
        const POINT_RADIUS = 1.5; // Slightly smaller points
        const EFFECT_RADIUS = 60; // Slightly larger radius
        const PULL_FACTOR = 0.4; // Stronger pull (less subtle)
        const EASE_FACTOR = 0.15; // Faster movement (less molasses)

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
                    });
                }
            }
        };

        const update = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const time = Date.now() * 0.001; // Current time in seconds

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

                if (distMouse < EFFECT_RADIUS) {
                    const force = (1 - distMouse / EFFECT_RADIUS) * PULL_FACTOR;
                    // Target is shifted towards mouse
                    targetX += dxMouse * force;
                    targetY += dyMouse * force;
                }

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

                if (distMouse < EFFECT_RADIUS * 1.5) {
                    // Interpolate color for active points
                    // Base: 100, 100, 255 (Blue-ish)
                    // Target: 200, 50, 255 (Magenta/Purple)
                    const intensity = Math.max(0, 1 - distMouse / (EFFECT_RADIUS * 1.5));
                    const r = 100 + (100 * intensity);
                    const g = 100 - (50 * intensity);
                    const b = 255;
                    const a = 0.2 + (0.6 * intensity); // More opaque when active
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
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        init();
        update();

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[-1] pointer-events-none bg-background"
        />
    );
}
