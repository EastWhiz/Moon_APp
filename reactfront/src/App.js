import { OrbitControls, Sphere, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
// import { useFrame } from "@react-three/fiber";
// import { useRef } from "react";
import * as THREE from "three";

const Moon = () => {
    // const moonRef = useRef();

    const textureURL = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/17271/lroc_color_poles_1k.jpg";

    const [texture] = useTexture([textureURL]);

    // useFrame(() => {
    //     if (moonRef.current) {
    //         moonRef.current.rotation.y += 0.002;
    //         moonRef.current.rotation.x += 0.0001;
    //     }
    // });

    return (
        <>
            {/* Moon */}
            {/* ref={moonRef} */}
            <Sphere args={[2, 60, 60]} >
                <meshPhongMaterial
                    attach="material"
                    color={0xffffff}
                    map={texture}
                    bumpScale={0.04}
                    reflectivity={0}
                    sshininess={0}
                />
            </Sphere>

            {/* Lights */}
            {/* <ambientLight intensity={0} color={0xffffff} /> */}

            <directionalLight
                color={0xffffff}
                intensity={2.5}
                position={[-100, 5, 50]}
            />

            <hemisphereLight
                skyColor={new THREE.Color(0.5, 0.5, 0.5)}  // Lighter, more blue sky color
                groundColor={new THREE.Color(0.5, 0.5, 0.5)}  // More saturated blue ground color
                intensity={0.3}
                position={[0, 0, 0]}
            />
        </>
    );
};

const App = () => {
    return (
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ height: "700px" }}>
            <OrbitControls
                enablePan={false}
                enableZoom={false}
                enableRotate={true}
                touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_ROTATE }}
            />
            <Moon />
        </Canvas>
    );
};

export default App;
