"use client";

import { cn } from "@/lib/utils";

interface ShimmerGridProps extends React.HTMLAttributes<HTMLDivElement> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    strokeWidth?: number;
    color?: string;
}

export function ShimmerGrid({
    className,
    width = 40,
    height = 40,
    x = 0,
    y = 0,
    strokeWidth = 1,
    color = "rgba(255, 255, 255, 0.1)",
    ...props
}: ShimmerGridProps) {
    return (
        <div
            className={cn(
                "pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
                className
            )}
            {...props}
        >
            <div className="absolute inset-0 z-0 flex items-center justify-center bg-transparent">
                <div
                    className="absolute inset-0 z-0 h-full w-full"
                    style={{
                        backgroundImage: `linear-gradient(to right, ${color} ${strokeWidth}px, transparent ${strokeWidth}px), linear-gradient(to bottom, ${color} ${strokeWidth}px, transparent ${strokeWidth}px)`,
                        backgroundSize: `${width}px ${height}px`,
                        backgroundPosition: `${x}px ${y}px`,
                        maskImage: "radial-gradient(ellipse at center, black 40%, transparent 70%)",
                        WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 70%)",
                    }}
                />
                {/* Shimmer effect */}
                <div className="absolute inset-0 z-10 animate-shimmer-slide bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0" />
            </div>
        </div>
    );
}
