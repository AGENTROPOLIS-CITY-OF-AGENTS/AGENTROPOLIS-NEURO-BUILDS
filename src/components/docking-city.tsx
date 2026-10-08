import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  ALL_FACILITIES,
  DOCK_FACILITIES,
  SIM_AGENTS,
  type DockFacility,
} from "@/lib/docking-district";
import type { CityGfx } from "@/lib/gfx";

const TONE = { cyan: "#19E6E6", red: "#FF2A2A", lime: "#B6FF4A" };

function webglOk() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function Routes() {
  const geo = useMemo(() => {
    const points: THREE.Vector3[] = [];
    DOCK_FACILITIES.forEach((f, i) => {
      const next = DOCK_FACILITIES[i + 1];
      if (!next) return;
      points.push(new THREE.Vector3(f.x, 0.08, f.z), new THREE.Vector3(next.x, 0.08, next.z));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);
  return (
    <lineSegments geometry={geo}>
      <lineBasicMaterial color="#19E6E6" transparent opacity={0.85} />
    </lineSegments>
  );
}

function Block({
  facility,
  active,
  onPick,
}: {
  facility: DockFacility;
  active: boolean;
  onPick: (id: string) => void;
}) {
  const color = active ? TONE.lime : TONE[facility.tone];
  return (
    <group position={[facility.x, facility.h / 2, facility.z]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onPick(facility.id);
        }}
      >
        <boxGeometry args={[3.2, facility.h, 2.4]} />
        <meshStandardMaterial color="#0b1016" emissive={color} emissiveIntensity={active ? 0.85 : 0.35} metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0, facility.h / 2 + 0.08, 0]}>
        <boxGeometry args={[1.4, 0.12, 1.4]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

function Agents({ onPick }: { onPick: (id: string) => void }) {
  return (
    <>
      {SIM_AGENTS.map((agent) => {
        const home = ALL_FACILITIES.find((f) => f.id === agent.facilityId);
        if (!home) return null;
        const color = agent.activity === "blocked" ? "#FF2A2A" : agent.activity === "reviewing" ? "#B6FF4A" : "#19E6E6";
        return (
          <mesh
            key={agent.id}
            position={[home.x + 1.1, 0.55, home.z + 1.3]}
            onClick={(e) => {
              e.stopPropagation();
              onPick(agent.id);
            }}
          >
            <sphereGeometry args={[0.38, 16, 12]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
          </mesh>
        );
      })}
    </>
  );
}

export function DockingCity({
  gfx,
  reduced,
  mode,
  selected,
  onSelect,
}: {
  gfx: CityGfx;
  reduced: boolean;
  mode: "overview" | "walk";
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const [ok] = useState(webglOk);
  const dpr: [number, number] = gfx === "high" ? [1, 1.25] : [1, 1];
  if (!ok) return null;
  const ortho = mode === "overview";
  return (
    <Canvas
      className="h-full w-full"
      orthographic={ortho}
      camera={
        ortho
          ? { position: [18, 22, 18], zoom: 22, near: 0.1, far: 80 }
          : { position: [0, 6, 22], fov: 42, near: 0.1, far: 80 }
      }
      dpr={dpr}
      gl={{ antialias: gfx !== "low", powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      onCreated={({ gl }) => gl.setClearColor("#05070A", 1)}
    >
      <color attach="background" args={["#05070A"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[8, 14, 6]} intensity={1.1} color="#d7fff8" />
      <pointLight position={[0, 6, 0]} color="#19E6E6" intensity={8} distance={28} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} onClick={() => onSelect("commons")}>
        <planeGeometry args={[48, 42]} />
        <meshStandardMaterial color="#070b10" metalness={0.8} roughness={0.4} />
      </mesh>
      <Routes />
      {ALL_FACILITIES.map((f) => (
        <Block key={f.id} facility={f} active={selected === f.id} onPick={onSelect} />
      ))}
      <Agents onPick={onSelect} />
      <OrbitControls
        makeDefault
        enablePan
        maxPolarAngle={ortho ? Math.PI / 2.2 : Math.PI / 2.05}
        minDistance={8}
        maxDistance={40}
        target={[0, 0, 0]}
      />
    </Canvas>
  );
}
