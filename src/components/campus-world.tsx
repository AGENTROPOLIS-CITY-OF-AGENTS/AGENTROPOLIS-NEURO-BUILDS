import { useEffect, useMemo, useRef, Suspense, type ComponentRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { BUILDING_META, CAMPUS_AGENTS, UTILITY_BUILDINGS, UTILITY_LINKS } from "@/lib/destinations";
import type { GfxTier } from "@/lib/gfx";
import { CineLights } from "@/components/cine-lights";
import { cineRig } from "@/lib/cine";

export type { GfxTier };

type CampusWorldProps = {
  focus: string | null;
  inside: string | null;
  gfx: GfxTier;
  paused: boolean;
  onFocus: (id: string | null) => void;
  onEnter: (id: string) => void;
  onAgent: () => void;
};

const HOME: [number, number, number] = [11, 9.2, 18];
const HOME_LOOK: [number, number, number] = [1.4, 1.5, 3.2];

function byId(id: string) {
  return UTILITY_BUILDINGS.find((b) => b.id === id);
}

export function CampusWorld({ focus, inside, gfx, paused, onFocus, onEnter, onAgent }: CampusWorldProps) {
  const showAgents = gfx !== "low";
  const rig = cineRig("campus", gfx, Boolean(inside));

  return (
    <Canvas
      camera={{ position: HOME, fov: 40, near: 0.08, far: 160 }}
      dpr={gfx === "low" ? [1, 1.1] : [1, 1.7]}
      gl={{
        antialias: gfx !== "low",
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: gfx === "low" ? "low-power" : "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: rig.exposure,
      }}
      resize={{ offsetSize: true, scroll: false }}
      onCreated={({ gl }) => {
        gl.setClearColor("#000000", 0);
      }}
      onPointerMissed={() => {
        if (!inside) onFocus(null);
      }}
      className="h-full w-full bg-transparent"
      style={{ touchAction: "none", background: "transparent" }}
    >
      <CineLights stage="campus" gfx={gfx} inside={Boolean(inside)} />
      {inside ? (
        <Interior id={inside} gfx={gfx} paused={paused} />
      ) : (
        <>
          <Plaza />
          <Links />
          {UTILITY_BUILDINGS.map((b) => (
            <Building
              key={b.id}
              id={b.id}
              active={focus === b.id}
              onFocus={onFocus}
              onEnter={onEnter}
            />
          ))}
          {showAgents
            ? CAMPUS_AGENTS.map((a) => <MockAgent key={a.id} {...a} paused={paused} onAgent={onAgent} />)
            : null}
        </>
      )}
      <Rig focus={focus} inside={inside} />
    </Canvas>
  );
}

function Plaza() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0, 2.4]} receiveShadow>
        <circleGeometry args={[26, 72]} />
        <meshLambertMaterial color="#0c1118" toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.2, 0.02, 2.4]}>
        <ringGeometry args={[11.4, 11.7, 72]} />
        <meshBasicMaterial color="#1a3a44" transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <gridHelper args={[42, 42, "#163038", "#10161c"]} position={[1.2, 0.03, 2.4]} />
    </group>
  );
}

function Rig({ focus, inside }: { focus: string | null; inside: string | null }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const flying = useRef(false);
  const goal = useRef(new THREE.Vector3(...HOME));
  const look = useRef(new THREE.Vector3(...HOME_LOOK));

  useEffect(() => {
    const b = inside ? byId(inside) : focus ? byId(focus) : null;
    if (inside && b) {
      const depth = Math.max(8.4, b.size[2] * 1.35);
      goal.current.set(b.position[0], 1.62, b.position[2] + depth * 0.18);
      look.current.set(b.position[0], 1.28, b.position[2] - depth * 0.22);
      flying.current = true;
      return;
    }
    if (b) {
      const [x, , z] = b.position;
      const h = b.size[1];
      goal.current.set(x + 7.2, h + 4.6, z + 8);
      look.current.set(x, h * 0.42, z);
      flying.current = true;
      return;
    }
    goal.current.set(...HOME);
    look.current.set(...HOME_LOOK);
    flying.current = true;
  }, [focus, inside]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.1);
    const ctrl = controls.current as unknown as {
      object: THREE.Camera;
      target: THREE.Vector3;
      update: () => void;
      minDistance: number;
      maxDistance: number;
    } | null;
    if (!ctrl) return;
    const reduce =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cam = ctrl.object;
    ctrl.minDistance = inside ? 1.2 : 8;
    ctrl.maxDistance = inside ? 8 : 42;

    if (flying.current) {
      if (reduce) {
        cam.position.copy(goal.current);
        ctrl.target.copy(look.current);
        ctrl.update();
        flying.current = false;
      } else {
        const k = inside ? 5.2 : 3.2;
        cam.position.lerp(goal.current, 1 - Math.exp(-d * k));
        ctrl.target.lerp(look.current, 1 - Math.exp(-d * k));
        ctrl.update();
        if (cam.position.distanceTo(goal.current) < 0.12) flying.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={inside ? 0.7 : 0.32}
      maxPolarAngle={inside ? Math.PI / 1.85 : Math.PI / 2.2}
      minDistance={inside ? 1.2 : 8}
      maxDistance={inside ? 8 : 42}
      onStart={() => {
        flying.current = false;
      }}
    />
  );
}

function Links() {
  const geom = useMemo(() => {
    const positions: number[] = [];
    for (const [a, b] of UTILITY_LINKS) {
      const da = byId(a);
      const db = byId(b);
      if (!da || !db) continue;
      positions.push(da.position[0], 0.05, da.position[2], db.position[0], 0.05, db.position[2]);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);
  return (
    <lineSegments geometry={geom}>
      <lineBasicMaterial color="#2de8e0" transparent opacity={0.18} toneMapped={false} />
    </lineSegments>
  );
}

function Building({
  id,
  active,
  onFocus,
  onEnter,
}: {
  id: string;
  active: boolean;
  onFocus: (id: string) => void;
  onEnter: (id: string) => void;
}) {
  const b = byId(id);
  if (!b) return null;
  const [w, h, d] = b.size;
  const [x, y, z] = b.position;
  const live = b.status === "LIVE";
  const emissive = active ? b.color : live ? b.color : "#000000";
  const emissiveIntensity = active ? 0.22 : live ? 0.1 : 0;

  return (
    <group position={[x, y, z]}>
      <mesh
        position={[0, 0.03, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          if (active) onEnter(id);
          else onFocus(id);
        }}
      >
        <circleGeometry args={[Math.max(w, d) * 0.72, 32]} />
        <meshBasicMaterial color={b.pad} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      {active ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
          <ringGeometry args={[Math.max(w, d) * 0.58, Math.max(w, d) * 0.68, 32]} />
          <meshBasicMaterial color={live ? "#d4ff4a" : "#22e8ff"} transparent opacity={0.85} />
        </mesh>
      ) : null}
      <group
        onClick={(e) => {
          e.stopPropagation();
          if (active) onEnter(id);
          else onFocus(id);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEnter(id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <Volume shape={b.shape} w={w} h={h} d={d} color={b.color} emissive={emissive} emissiveIntensity={emissiveIntensity} />
      </group>
      <Html position={[0, h + 0.55, 0]} center distanceFactor={28} zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
        <div className="campus-pin">
          {b.name}
          {live ? <span className="campus-live">LIVE</span> : null}
        </div>
      </Html>
    </group>
  );
}

function Volume({
  shape,
  w,
  h,
  d,
  color,
  emissive,
  emissiveIntensity,
}: {
  shape: (typeof UTILITY_BUILDINGS)[number]["shape"];
  w: number;
  h: number;
  d: number;
  color: string;
  emissive: string;
  emissiveIntensity: number;
}) {
  const radius = Math.min(0.28, Math.min(w, h, d) * 0.12);
  const matProps = {
    color,
    emissive,
    emissiveIntensity,
    roughness: 0.22,
    metalness: 0.68,
    clearcoat: 0.45,
    toneMapped: true as const,
  };
  const door = (
    <mesh position={[0, 0.7, d / 2 + 0.02]}>
      <boxGeometry args={[0.72, 1.38, 0.1]} />
      <meshPhysicalMaterial color="#071018" emissive="#22e8ff" emissiveIntensity={0.18} roughness={0.45} toneMapped={false} />
    </mesh>
  );

  if (shape === "tower") {
    return (
      <group>
        <RoundedBox args={[w, h * 0.78, d]} radius={radius} smoothness={4} position={[0, h * 0.39, 0]}>
          <meshPhysicalMaterial {...matProps} />
        </RoundedBox>
        <mesh position={[0, h * 0.86, 0]}>
          <cylinderGeometry args={[w * 0.22, w * 0.34, h * 0.2, 12]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        <mesh position={[0, h * 1.04, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 1.15, 8]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {door}
      </group>
    );
  }
  if (shape === "dome") {
    return (
      <group>
        <mesh position={[0, h * 0.42, 0]}>
          <sphereGeometry args={[w * 0.48, 28, 20]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        <mesh position={[0, 0.55, w * 0.46]}>
          <boxGeometry args={[0.62, 1.05, 0.1]} />
          <meshPhysicalMaterial color="#0b1020" roughness={0.5} toneMapped={false} />
        </mesh>
      </group>
    );
  }
  if (shape === "arch") {
    return (
      <group>
        <RoundedBox args={[0.72, h * 0.9, d]} radius={0.16} smoothness={4} position={[-w * 0.38, h * 0.45, 0]}>
          <meshPhysicalMaterial {...matProps} />
        </RoundedBox>
        <RoundedBox args={[0.72, h * 0.9, d]} radius={0.16} smoothness={4} position={[w * 0.38, h * 0.45, 0]}>
          <meshPhysicalMaterial {...matProps} />
        </RoundedBox>
        <RoundedBox args={[w * 0.92, 0.7, d]} radius={0.16} smoothness={4} position={[0, h * 0.82, 0]}>
          <meshPhysicalMaterial {...matProps} />
        </RoundedBox>
      </group>
    );
  }
  if (shape === "house") {
    return (
      <group>
        <RoundedBox args={[w, h * 0.76, d]} radius={radius} smoothness={4} position={[0, h * 0.38, 0]}>
          <meshPhysicalMaterial {...matProps} />
        </RoundedBox>
        <mesh position={[0, h * 0.82, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[Math.max(w, d) * 0.7, h * 0.4, 4]} />
          <meshPhysicalMaterial {...matProps} />
        </mesh>
        {door}
      </group>
    );
  }
  if (shape === "factory") {
    return (
      <group>
        <RoundedBox args={[w, h * 0.84, d]} radius={radius} smoothness={4} position={[0, h * 0.42, 0]}>
          <meshPhysicalMaterial {...matProps} />
        </RoundedBox>
        {[-1.4, 0, 1.4].map((ox) => (
          <mesh key={ox} position={[ox, h * 0.95, -d * 0.18]}>
            <cylinderGeometry args={[0.28, 0.34, 1.4, 12]} />
            <meshPhysicalMaterial {...matProps} />
          </mesh>
        ))}
        {door}
      </group>
    );
  }
  return (
    <group>
      <RoundedBox args={[w, h, d]} radius={radius} smoothness={4} position={[0, h / 2, 0]}>
        <meshLambertMaterial {...matProps} />
      </RoundedBox>
      {door}
    </group>
  );
}

function Interior({ id, gfx, paused }: { id: string; gfx: GfxTier; paused: boolean }) {
  const b = byId(id);
  if (!b) return null;
  const meta = BUILDING_META[id];
  const live = b.status === "LIVE";
  const w = Math.max(8.4, b.size[0] * 1.35);
  const d = Math.max(9.6, b.size[2] * 1.55);
  const h = 3.6;
  const wall = live ? "#3a2430" : "#243044";
  const floor = live ? "#2a1c24" : "#1c2834";
  const trim = live ? "#ff2d8a" : b.color;
  const gap = 2.4;

  return (
    <group position={[b.position[0], 0, b.position[2]]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[w, d]} />
        <meshLambertMaterial color={floor} toneMapped={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[1.6, 1.85, 48]} />
        <meshBasicMaterial color={trim} transparent opacity={0.55} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, h, 0]}>
        <planeGeometry args={[w, d]} />
        <meshLambertMaterial color="#12161e" toneMapped={false} />
      </mesh>
      <mesh position={[0, h / 2, -d / 2]}>
        <boxGeometry args={[w, h, 0.16]} />
        <meshLambertMaterial color={wall} emissive={trim} emissiveIntensity={0.08} toneMapped={false} />
      </mesh>
      <mesh position={[-w / 2, h / 2, 0]}>
        <boxGeometry args={[0.16, h, d]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[w / 2, h / 2, 0]}>
        <boxGeometry args={[0.16, h, d]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[-(w / 2 + gap) / 2, h / 2, d / 2]}>
        <boxGeometry args={[w / 2 - gap / 2, h, 0.16]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[(w / 2 + gap) / 2, h / 2, d / 2]}>
        <boxGeometry args={[w / 2 - gap / 2, h, 0.16]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[0, h * 0.86, d / 2]}>
        <boxGeometry args={[gap + 0.2, h * 0.28, 0.16]} />
        <meshLambertMaterial color={wall} toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.4, d / 2 + 0.04]}>
        <boxGeometry args={[gap, 2.6, 0.08]} />
        <meshBasicMaterial color={trim} transparent opacity={0.22} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 2.5, 0]} intensity={1.05} color="#e8f4f4" distance={12} decay={2} />
      <pointLight position={[0, 2.0, d / 2 - 1.2]} intensity={0.55} color="#19E6E6" distance={8} decay={2} />
      <RoomFit id={id} w={w} d={d} color={trim} />
      {id === "botbae" ? (
        <Suspense fallback={null}>
          <BotBaeWall d={d} />
        </Suspense>
      ) : null}
      {gfx === "high" ? <SplatCloud seed={id} color={trim} w={w} h={h} d={d} /> : null}
      {gfx !== "low" ? <DeskAgent color={live ? "#ff2d8a" : trim} paused={paused} /> : null}
      <Html position={[0, 1.85, -d / 2 + 0.28]} center distanceFactor={12} zIndexRange={[12, 0]} transform>
        <div className="origin-html">
          <p className="origin-html-kicker">{live ? "BOTBAE LIVE" : "ENTERED · MOCK"}</p>
          <p className="origin-html-title">{b.name}</p>
          <p className="origin-html-body">{meta?.interior ?? b.neuro}</p>
        </div>
      </Html>
    </group>
  );
}

function RoomFit({ id, w, d, color }: { id: string; w: number; d: number; color: string }) {
  if (id === "approval") {
    return (
      <group>
        <mesh position={[-1.4, 0.7, -0.6]}>
          <boxGeometry args={[1.1, 1.4, 1.1]} />
          <meshLambertMaterial color="#143318" emissive="#d4ff4a" emissiveIntensity={0.12} toneMapped={false} />
        </mesh>
        <mesh position={[1.4, 0.7, -0.6]}>
          <boxGeometry args={[1.1, 1.4, 1.1]} />
          <meshLambertMaterial color="#3a1218" emissive="#ff2a4a" emissiveIntensity={0.16} toneMapped={false} />
        </mesh>
      </group>
    );
  }
  if (id === "ledger" || id === "vault") {
    return (
      <group>
        {[-2.2, -0.7, 0.8, 2.3].map((x) => (
          <mesh key={x} position={[x, 1.2, -d / 2 + 0.7]}>
            <boxGeometry args={[1.1, 2.4, 0.4]} />
            <meshLambertMaterial color="#1a2230" emissive={color} emissiveIntensity={0.08} toneMapped={false} />
          </mesh>
        ))}
      </group>
    );
  }
  if (id === "onchain") {
    return (
      <mesh position={[0, 1.4, -0.4]}>
        <boxGeometry args={[2.2, 2.8, 0.5]} />
        <meshLambertMaterial color="#3a1218" emissive="#ff2a4a" emissiveIntensity={0.28} toneMapped={false} />
      </mesh>
    );
  }
  if (id === "lens") {
    return (
      <mesh position={[0, 1.4, 0]}>
        <sphereGeometry args={[1.1, 24, 16]} />
        <meshPhysicalMaterial color="#0b2014" emissive="#3dcc3a" emissiveIntensity={0.2} roughness={0.2} transmission={0.15} toneMapped={false} />
      </mesh>
    );
  }
  if (id === "core") {
    return (
      <group>
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[0.55, 0.7, 3, 12]} />
          <meshLambertMaterial color="#123230" emissive="#2de8e0" emissiveIntensity={0.25} toneMapped={false} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
          <ringGeometry args={[1.8, 2.05, 40]} />
          <meshBasicMaterial color="#2de8e0" transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }
  return (
    <group>
      <mesh position={[0, 0.55, -0.4]}>
        <boxGeometry args={[Math.min(4.6, w * 0.62), 0.12, 1.6]} />
        <meshLambertMaterial color="#1a1e28" toneMapped={false} />
      </mesh>
      <mesh position={[0, 1.15, -1.1]}>
        <boxGeometry args={[2.4, 1.2, 0.08]} />
        <meshLambertMaterial color="#0b1020" emissive={color} emissiveIntensity={0.18} toneMapped={false} />
      </mesh>
    </group>
  );
}

function BotBaeWall({ d }: { d: number }) {
  const tex = useTexture("/media/stills/botbae-live.jpg");
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh position={[0, 1.9, -d / 2 + 0.12]}>
      <planeGeometry args={[2.8, 2.8]} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  );
}

function SplatCloud({
  seed,
  color,
  w,
  h,
  d,
}: {
  seed: string;
  color: string;
  w: number;
  d: number;
  h: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const count = 720;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const rand = useMemo(() => {
    let s = 2166136261;
    for (let i = 0; i < seed.length; i++) s = Math.imul(s ^ seed.charCodeAt(i), 16777619);
    return () => {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      return s / 4294967296;
    };
  }, [seed]);

  useEffect(() => {
    if (!mesh.current) return;
    const r = rand;
    for (let i = 0; i < count; i++) {
      const face = Math.floor(r() * 5);
      let x = (r() - 0.5) * w * 0.92;
      let y = r() * h * 0.92 + 0.08;
      let z = (r() - 0.5) * d * 0.92;
      if (face === 0) y = 0.04 + r() * 0.08;
      if (face === 1) z = -d / 2 + 0.06;
      if (face === 2) x = -w / 2 + 0.06;
      if (face === 3) x = w / 2 - 0.06;
      dummy.position.set(x, y, z);
      dummy.rotation.set(r() * 0.6, r() * 1.4, r() * 0.4);
      const s = 0.035 + r() * 0.055;
      dummy.scale.set(s * (0.6 + r()), s * (0.5 + r()), s * (0.7 + r()));
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy, rand, w, h, d]);

  useFrame((state) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.012;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.38} toneMapped={false} />
    </instancedMesh>
  );
}

function DeskAgent({ color, paused }: { color: string; paused: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current || paused) return;
    ref.current.position.y = 0.02 + Math.sin(state.clock.elapsedTime * 1.4) * 0.02;
  });
  return (
    <group ref={ref} position={[1.15, 0, 0.2]}>
      <mesh position={[0, 1.18, 0]}>
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshPhysicalMaterial color={color} roughness={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.28, 0.4, 0.18]} />
        <meshPhysicalMaterial color="#14161c" roughness={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.42, 0.12]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.34, 0.08, 0.22]} />
        <meshPhysicalMaterial color="#14161c" roughness={0.5} toneMapped={false} />
      </mesh>
    </group>
  );
}

function MockAgent({
  color,
  home,
  radius,
  speed,
  phase,
  paused,
  onAgent,
}: {
  color: string;
  home: string;
  radius: number;
  speed: number;
  phase: number;
  paused: boolean;
  onAgent: () => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const b = byId(home);
  const t0 = useRef(0);
  useFrame((state) => {
    if (!ref.current || !b) return;
    if (!paused) t0.current = state.clock.elapsedTime;
    const t = t0.current * speed + phase;
    ref.current.position.set(b.position[0] + Math.cos(t) * radius, 0, b.position[2] + Math.sin(t) * radius);
    ref.current.rotation.y = -t + Math.PI / 2;
  });
  return (
    <group
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onAgent();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.22, 0.3, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} />
      </mesh>
      <mesh position={[0, 1.22, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshPhysicalMaterial color={color} roughness={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.78, 0]}>
        <boxGeometry args={[0.32, 0.46, 0.2]} />
        <meshPhysicalMaterial color="#14161c" roughness={0.5} toneMapped={false} />
      </mesh>
      <mesh position={[-0.08, 0.32, 0]}>
        <boxGeometry args={[0.07, 0.44, 0.07]} />
        <meshPhysicalMaterial color={color} roughness={0.4} toneMapped={false} />
      </mesh>
      <mesh position={[0.08, 0.32, 0]}>
        <boxGeometry args={[0.07, 0.44, 0.07]} />
        <meshPhysicalMaterial color={color} roughness={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}
