'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

interface Sparkle {
    id: string;
    createdAt: number;
    color: string;
    size: number;
    style: {
        top: string;
        left: string;
        zIndex: number;
    };
}

const DEFAULT_COLOR = '#FFC700';
const generateSparkle = (color: string = DEFAULT_COLOR): Sparkle => {
    const sparkle = {
        id: `${Math.random().toString(36).substr(2, 9)}-${Date.now()}`,
        createdAt: Date.now(),
        color,
        size: random(10, 20),
        style: {
            top: random(0, 100) + '%',
            left: random(0, 100) + '%',
            zIndex: 2,
        },
    };
    return sparkle;
};

export const Sparkles = ({ color = DEFAULT_COLOR, children, ...delegated }: { color?: string; children?: React.ReactNode;[key: string]: any }) => {
    const [sparkles, setSparkles] = useState<Sparkle[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const sparkle = generateSparkle(color);
            setSparkles(prev => {
                const nextSparkles = prev.filter((sp) => {
                    const delta = now - sp.createdAt;
                    return delta < 750;
                });
                return [...nextSparkles, sparkle];
            });
        }, 200);
        return () => clearInterval(interval);
    }, [color]);

    return (
        <span className="relative inline-block" {...delegated}>
            {sparkles.map((sparkle) => (
                <SparkleInstance key={sparkle.id} color={sparkle.color} size={sparkle.size} style={sparkle.style} />
            ))}
            <strong className="relative z-1 font-bold">{children}</strong>
        </span>
    );
};

const SparkleInstance = ({ color, size, style }: { color: string; size: number; style: any }) => {
    return (
        <motion.span
            className="absolute pointer-events-none block"
            initial={{ scale: 0, rotate: 0 }}
            animate={{ scale: 1, rotate: 180 }}
            exit={{ scale: 0, rotate: 0 }}
            transition={{ duration: 0.7 }}
            style={style}
        >
            <svg width={size} height={size} viewBox="0 0 68 68" fill="none">
                <path d="M26.5 25.5C19.0043 33.3697 0 34 0 34C0 34 19.1013 35.3684 26.5 43.5C33.234 50.901 34 68 34 68C34 68 36.9884 50.7065 44.5 43.5C51.6431 36.647 68 34 68 34C68 34 51.6947 32.0939 44.5 25.5C36.5605 18.2235 34 0 34 0C34 0 33.6591 17.9837 26.5 25.5Z" fill={color} />
            </svg>
        </motion.span>
    );
};

// Full screen sparkle effect wrapper
export const FullScreenSparkles = ({ theme = 'romantic' }: { theme?: 'romantic' | 'party' | 'cozy' }) => {
    const [sparks, setSparks] = useState<Sparkle[]>([]);

    useEffect(() => {
        const getThemeColor = () => {
            if (theme === 'party') return '#60a5fa' // Blue
            if (theme === 'cozy') return '#fb923c' // Orange
            return '#fb7185' // Pink
        }

        const count = 12;
        const newSparks = Array.from({ length: count }).map(() => generateSparkle(getThemeColor()));
        setSparks(newSparks);

        // Randomly refresh one sparkle every few seconds for dynamic feel
        const interval = setInterval(() => {
            setSparks(prev => {
                const next = [...prev];
                const index = random(0, next.length);
                next[index] = generateSparkle(getThemeColor());
                return next;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [theme]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {sparks.map(s => (
                <SparkleInstance key={s.id} color={s.color} size={random(10, 30)} style={{ ...s.style, position: 'absolute' }} />
            ))}
        </div>
    )
}
