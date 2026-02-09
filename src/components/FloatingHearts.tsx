'use client'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import * as THREE from 'three'

function CrystalHeart({ theme, seed, ...props }: any) {
    const meshRef = useRef<THREE.Mesh>(null!)
    const [hovered, setHover] = useState(false)

    const getColor = () => {
        if (theme === 'party') return hovered ? '#60a5fa' : '#3b82f6'
        if (theme === 'cozy') return hovered ? '#fb923c' : '#ea580c'
        return hovered ? '#f472b6' : '#db2777'
    }

    useFrame((state, delta) => {
        meshRef.current.rotation.x += delta * 0.2
        meshRef.current.rotation.y += delta * 0.3
        meshRef.current.position.y += Math.sin(state.clock.elapsedTime + seed) * 0.005
    })

    return (
        <mesh
            {...props}
            ref={meshRef}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}>
            <octahedronGeometry args={[theme === 'party' ? 0.3 : 0.4, 0]} />
            <meshStandardMaterial
                color={getColor()}
                wireframe={theme !== 'cozy'}
                transparent
                opacity={0.6}
            />
        </mesh>
    )
}

export default function FloatingHearts({ theme = 'romantic' }: { theme?: 'romantic' | 'party' | 'cozy' }) {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
                <ambientLight intensity={theme === 'cozy' ? 0.8 : 0.5} />
                <pointLight position={[10, 10, 10]} />
                {Array.from({ length: 15 }).map((_, i) => (
                    <CrystalHeart
                        key={i}
                        theme={theme}
                        position={[
                            (Math.random() - 0.5) * 15,
                            (Math.random() - 0.5) * 15,
                            (Math.random() - 0.5) * 5
                        ]}
                        seed={Math.random() * 100}
                    />
                ))}
            </Canvas>
        </div>
    )
}
