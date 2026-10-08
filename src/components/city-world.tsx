import { Suspense, useEffect, useMemo, useRef, type ComponentRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { DISTRICTS, type District } from "@/lib/grid";
import type { CityGfx } from "@/lib/gfx";
import { Elevator } from "@/components/elevator";
import { ThresholdPortal } from "@/components/threshold-portal";
import { CineLights } from "@/components/cine-lights";
import { CINE, cineRig } from "@/lib/cine";

export type { CityGfx };

type Props = {
  selected: string | null;
  inside: string | null;
  gfx: CityGfx;
  onSelect: (id: string | null) => void;
  onEnter: (id: string) => void;
};

const HOME: [number, number, number] = [0.2, 5.8, 16.5];
const HOME_LOOK: [number, number, number] = [0, 4.6, -8];
const BLOCK = 6.6;

type Slot = { x: number; z: number; h: number; w: number; depth: number; glow: string };

const LIVE_LAYER: Record<string, { page: string; still: string; repos: { label: string; href: string }[] }> = {
  hermes: {
    page: "https://agentropolis-city-of-agents.github.io/HERMES-CITY/",
    still: "/media/stills/live/hermes-pages.jpg",
    repos: [
      { label: "HERMES-CITY", href: "https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/HERMES-CITY" },
      { label: "HERMES-CITY-SOCIAL", href: "https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/HERMES-CITY-SOCIAL" },
      { label: "AGENTROPOLIS-DOCK", href: "https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-DOCK" },
    ],
  },
  mission: {
    page: "https://agentropolis.dev",
    still: "/media/stills/live/host-agentropolis.jpg",
    repos: [{ label: "HERMES-CITY", href: "https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/HERMES-CITY" }],
  },
  dock: {
    page: "https://agentropolis-city-of-agents.github.io/HERMES-CITY/community/",
    still: "/media/stills/live/hermes-community.jpg",
    repos: [
      { label: "AGENTROPOLIS-DOCK", href: "https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/AGENTROPOLIS-DOCK" },
      { label: "HERMES-CITY", href: "https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/HERMES-CITY" },
    ],
  },
  buzz: {
    page: "https://agentropolis-city-of-agents.github.io/HERMES-CITY/social/",
    still: "/media/stills/live/hermes-social.jpg",
    repos: [
      { label: "HERMES-CITY-SOCIAL", href: "https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/HERMES-CITY-SOCIAL" },
      { label: "HERMES-CITY", href: "https://github.com/AGENTROPOLIS-CITY-OF-AGENTS/HERMES-CITY" },
    ],
  },
  construct: {
    page: "https://agentropolis-city-of-agents.github.io/AGENTROPOLIS-BOTBAE/",
    still: "/media/stills/live/botbae-pages.jpg",
    repos: [],
  },
};

const LAYOUT: Record<string, Slot> = (() => {
  const map: Record<string, Slot> = {};
  const cells: [number, number][] = [];
  for (let gx = -4; gx <= 4; gx++) {
    for (let gz = -5; gz <= 2; gz++) {
      if (gx === 0 && gz >= -1) continue;
      if (Math.abs(gx) === 1 && gz === 0) continue;
      cells.push([gx, gz]);
    }
  }
  DISTRICTS.forEach((d, i) => {
    if (d.id === "mission") {
      map[d.id] = { x: 0, z: -18.5, h: 26, w: 6.2, depth: 5.4, glow: "#19E6E6" };
      return;
    }
    if (d.id === "hermes") {
      map[d.id] = { x: -7.2, z: -7.4, h: 22, w: 5.4, depth: 5.2, glow: "#19E6E6" };
      return;
    }
    if (d.id === "dock") {
      map[d.id] = { x: 7.2, z: -7.4, h: 16, w: 5.0, depth: 4.8, glow: "#19E6E6" };
      return;
    }
    const [gx, gz] = cells[i % cells.length] ?? [2, -2];
    const live = d.status === "LIVE";
    map[d.id] = {
      x: gx * BLOCK,
      z: gz * BLOCK,
      h: live ? 20 : d.status === "AVAILABLE" ? 14.5 : d.status === "PREVIEW" ? 10.5 : 7.2,
      w: live ? 4.4 : 3.5,
      depth: live ? 4.2 : 3.4,
      glow: live ? "#19E6E6" : d.status === "AVAILABLE" ? "#19E6E6" : d.status === "OFFLINE" ? "#FF2A2A" : "#0C5C5C",
    };
  });
  return map;
})();

function worldOf(d: District): Slot {
  return LAYOUT[d.id] ?? { x: 0, z: 0, h: 10, w: 3.4, depth: 3.2, glow: "#19E6E6" };
}

function byId(id: string | null) {
  return DISTRICTS.find((d) => d.id === id) ?? null;
}

function FacadeMaterial({ glow = "#9cefff", amp = 1 }: { glow?: string; amp?: number }) {
  const tex = useTexture("/media/stills/octane/facade.jpg");
  useEffect(() => {
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(2.4, 5.2);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
  }, [tex]);
  return (
    <meshStandardMaterial
      map={tex}
      color="#8aa0b4"
      emissive={glow}
      emissiveMap={tex}
      emissiveIntensity={0.55 * amp}
      metalness={0.62}
      roughness={0.28}
      envMapIntensity={1.1}
    />
  );
}

export function CityWorld({ selected, inside, gfx, onSelect, onEnter }: Props) {
  const fill = gfx === "high" ? 220 : gfx === "medium" ? 110 : 48;
  const rig = cineRig("city", gfx, Boolean(inside));

  return (
    <Canvas
      camera={{ position: HOME, fov: 50, near: 0.12, far: 160 }}
      dpr={gfx === "low" ? [1, 1] : [1, 1.4]}
      shadows={false}
      gl={{
        antialias: gfx !== "low",
        alpha: false,
        powerPreference: gfx === "low" ? "low-power" : "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: rig.exposure,
      }}
      resize={{ offsetSize: true, scroll: false }}
      onCreated={({ gl, scene }) => {
        gl.setClearColor(CINE.clear, 1);
        scene.fog = new THREE.Fog(CINE.fog, 22, 110);
      }}
      onPointerMissed={() => {
        if (!inside) onSelect(null);
      }}
      className="h-full w-full"
      style={{ touchAction: "none", background: CINE.clear }}
    >
      <CineLights stage="city" gfx={gfx} inside={Boolean(inside)} />
      <Suspense fallback={null}>
        <SkyAndStreet />
        <Avenue />
        <Plaza />
        <FillTowers count={fill} />
        {DISTRICTS.map((d) =>
          inside === d.id ? (
            <Interior key={d.id} id={d.id} onLeave={() => onSelect(null)} />
          ) : (
            <Hero
              key={d.id}
              district={d}
              active={selected === d.id}
              onSelect={onSelect}
              onEnter={onEnter}
            />
          ),
        )}
        <Lamps />
      </Suspense>
      <Rig selected={selected} inside={inside} />
    </Canvas>
  );
}

function SkyAndStreet() {
  const sky = useTexture("/media/stills/octane/sky.jpg");
  const asphalt = useTexture("/media/stills/octane/asphalt.jpg");
  const hero = useTexture("/media/stills/octane/hero.jpg");

  useEffect(() => {
    sky.mapping = THREE.EquirectangularReflectionMapping;
    sky.colorSpace = THREE.SRGBColorSpace;
    asphalt.wrapS = asphalt.wrapT = THREE.RepeatWrapping;
    asphalt.repeat.set(28, 28);
    asphalt.colorSpace = THREE.SRGBColorSpace;
    asphalt.anisotropy = 8;
    hero.colorSpace = THREE.SRGBColorSpace;
  }, [sky, asphalt, hero]);

  return (
    <group>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[90, 32, 20]} />
        <meshBasicMaterial map={sky} side={THREE.BackSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 18, -48]} rotation={[0, 0, 0]}>
        <planeGeometry args={[110, 42]} />
        <meshBasicMaterial map={hero} transparent opacity={0.22} depthWrite={false} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial
          map={asphalt}
          color="#1a222c"
          roughness={0.38}
          metalness={0.58}
          envMapIntensity={0.9}
        />
      </mesh>
    </group>
  );
}

function Avenue() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, -4]}>
        <planeGeometry args={[7.2, 52]} />
        <meshStandardMaterial color="#0b1016" metalness={0.72} roughness={0.32} emissive="#102028" emissiveIntensity={0.25} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, -4]}>
        <planeGeometry args={[0.08, 50]} />
        <meshBasicMaterial color="#22e8ff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.4, 0.045, -4]}>
        <planeGeometry args={[0.05, 50]} />
        <meshBasicMaterial color="#ff2a4a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.4, 0.045, -4]}>
        <planeGeometry args={[0.05, 50]} />
        <meshBasicMaterial color="#ff2a4a" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[52, 6.4]} />
        <meshStandardMaterial color="#0b1016" metalness={0.7} roughness={0.34} emissive="#180814" emissiveIntensity={0.18} />
      </mesh>
    </group>
  );
}

function Plaza() {
  return (
    <group position={[0, 0, 2.2]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[5.4, 48]} />
        <meshStandardMaterial color="#10161e" metalness={0.8} roughness={0.22} emissive="#0a2430" emissiveIntensity={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[4.9, 5.15, 48]} />
        <meshBasicMaterial color="#22e8ff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, Math.PI, 0]} position={[0, 0.08, 0.15]}>
        <circleGeometry args={[1.15, 3]} />
        <meshBasicMaterial color="#22e8ff" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.081, 0.15]}>
        <circleGeometry args={[0.55, 3]} />
        <meshBasicMaterial color="#ff2a4a" />
      </mesh>
    </group>
  );
}

function FillTowers({ count }: { count: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const taken = useMemo(() => {
    const s = new Set<string>();
    for (const d of DISTRICTS) {
      const w = worldOf(d);
      s.add(`${Math.round(w.x / BLOCK)}_${Math.round(w.z / BLOCK)}`);
    }
    return s;
  }, []);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    let i = 0;
    let n = 0;
    while (i < count && n < count * 10) {
      n += 1;
      const gx = ((n * 17) % 19) - 9;
      const gz = ((n * 29) % 21) - 12;
      const key = `${gx}_${gz}`;
      if (taken.has(key)) continue;
      if (gx === 0 && gz > -2) continue;
      const x = gx * BLOCK + ((n % 5) - 2) * 0.18;
      const z = gz * BLOCK + (((n * 3) % 5) - 2) * 0.16;
      if (Math.hypot(x, z) < 7) continue;
      const h = 5 + ((n * 13) % 18);
      dummy.position.set(x, h / 2, z);
      dummy.scale.set(2.6 + (n % 4) * 0.28, h, 2.5 + ((n * 2) % 3) * 0.22);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      i += 1;
    }
    m.count = i;
    m.instanceMatrix.needsUpdate = true;
    m.computeBoundingSphere();
  }, [count, dummy, taken]);

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <boxGeometry args={[1, 1, 1]} />
      <FacadeMaterial glow="#9af4ff" amp={1.35} />
    </instancedMesh>
  );
}

function Hero({
  district,
  active,
  onSelect,
  onEnter,
}: {
  district: District;
  active: boolean;
  onSelect: (id: string | null) => void;
  onEnter: (id: string) => void;
}) {
  const { x, z, h, w, depth, glow } = worldOf(district);
  const live = district.status === "LIVE";

  const tap = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    if (active) onEnter(district.id);
    else onSelect(district.id);
  };

  return (
    <group position={[x, 0, z]}>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.06, 0]}
        onClick={tap}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEnter(district.id);
        }}
      >
        <circleGeometry args={[Math.max(w, depth) * 0.78, 28]} />
        <meshBasicMaterial color={glow} transparent opacity={active ? 0.45 : 0.08} />
      </mesh>
      <group
        onClick={tap}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onEnter(district.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <mesh position={[0, 0.55, 0]}>
          <boxGeometry args={[w * 1.12, 1.1, depth * 1.12]} />
          <meshStandardMaterial color="#121820" metalness={0.72} roughness={0.35} />
        </mesh>
        <mesh position={[0, 1.1 + (h - 1.1) / 2, 0]}>
          <boxGeometry args={[w, h - 1.1, depth]} />
          <FacadeMaterial glow={glow} amp={active ? 1.45 : live ? 1.2 : 0.95} />
        </mesh>
        <mesh position={[0, h + 0.22, 0]}>
          <boxGeometry args={[w * 0.78, 0.45, depth * 0.78]} />
          <meshStandardMaterial color="#0b0e14" metalness={0.9} roughness={0.2} emissive={glow} emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0, h + 1.05, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 1.4, 6]} />
          <meshBasicMaterial color={glow} />
        </mesh>
        <mesh position={[0, h * 0.62, depth / 2 + 0.03]}>
          <boxGeometry args={[w * 0.92, 0.12, 0.06]} />
          <meshBasicMaterial color={glow} />
        </mesh>
        <Elevator active={active} glow={glow} onEnter={() => onEnter(district.id)} facadeZ={depth / 2} />
      </group>
      {active ? (
        <Html position={[0, h + 1.8, 0]} center distanceFactor={22} zIndexRange={[18, 0]} style={{ pointerEvents: "none" }}>
          <div className="city-pin">
            <span className="city-pin-code">{district.code}</span>
            <span className="city-pin-name">{district.name}</span>
          </div>
        </Html>
      ) : null}
    </group>
  );
}

function Lamps() {
  const zs = [-16, -10, -4, 2, 8, 14];
  return (
    <group>
      {zs.map((z) =>
        [-3.9, 3.9].map((x) => (
          <group key={`${x}-${z}`} position={[x, 0, z]}>
            <mesh position={[0, 1.7, 0]}>
              <cylinderGeometry args={[0.05, 0.07, 3.4, 6]} />
              <meshStandardMaterial color="#1a222c" metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 3.45, 0]}>
              <sphereGeometry args={[0.12, 10, 8]} />
              <meshBasicMaterial color={x < 0 ? "#22e8ff" : "#ff2a4a"} />
            </mesh>
          </group>
        )),
      )}
    </group>
  );
}

function Interior({ id, onLeave }: { id: string; onLeave: () => void }) {
  const d = byId(id);
  const slot = LAYOUT[id] ?? { x: 0, z: 0, h: 10, w: 3.4, depth: 3.2, glow: "#22e8ff" };
  const wall = useTexture("/media/stills/octane/interior.jpg");
  const glow = slot.glow;
  const live = LIVE_LAYER[id] ?? null;
  const still = live?.still ?? "/media/stills/octane/interior.jpg";
  const screen = useTexture(still);
  wall.colorSpace = THREE.SRGBColorSpace;
  screen.colorSpace = THREE.SRGBColorSpace;
  screen.anisotropy = 8;

  const rw = 11.2;
  const rd = 8.6;
  const rh = 4.2;

  return (
    <group position={[slot.x, 0, slot.z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.4]}>
        <planeGeometry args={[rw, rd]} />
        <meshStandardMaterial color="#0b1218" metalness={0.82} roughness={0.18} emissive="#082028" emissiveIntensity={0.55} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0.4]}>
        <planeGeometry args={[rw, rd]} />
        <meshBasicMaterial color={glow} transparent opacity={0.07} />
      </mesh>
      <mesh position={[0, rh / 2, -rd / 2 + 0.5]}>
        <planeGeometry args={[rw, rh]} />
        <meshStandardMaterial map={wall} color="#6d7a88" roughness={0.38} metalness={0.22} />
      </mesh>
      <mesh position={[-(rw / 2), rh / 2, 0.4]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[rd, rh]} />
        <meshPhysicalMaterial color="#0a141c" metalness={0.28} roughness={0.06} transmission={0.42} thickness={0.35} transparent opacity={0.62} />
      </mesh>
      <mesh position={[rw / 2, rh / 2, 0.4]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[rd, rh]} />
        <meshPhysicalMaterial color="#0a141c" metalness={0.28} roughness={0.06} transmission={0.42} thickness={0.35} transparent opacity={0.62} />
      </mesh>
      <mesh position={[0, rh, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[rw, rd]} />
        <meshStandardMaterial color="#070b10" />
      </mesh>
      <mesh position={[0, 2.35, -rd / 2 + 0.56]}>
        <planeGeometry args={[6.6, 2.55]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
      <mesh position={[0, 2.35, -rd / 2 + 0.54]}>
        <planeGeometry args={[6.9, 2.85]} />
        <meshBasicMaterial color={glow} transparent opacity={0.16} />
      </mesh>
      <mesh position={[0, 0.72, -0.4]}>
        <boxGeometry args={[3.4, 0.08, 1.6]} />
        <meshPhysicalMaterial color="#101820" metalness={0.9} roughness={0.12} transmission={0.28} transparent opacity={0.75} />
      </mesh>
      <Html position={[0, 2.15, -rd / 2 + 0.7]} center distanceFactor={16} zIndexRange={[12, 0]} style={{ pointerEvents: "none" }}>
        <div className="city-live-board">
          <p>{d?.name ?? "AGENTROPOLIS"}</p>
          <span>{live ? "LIVE LAYER" : (d?.role ?? "")}</span>
          <div className="city-live-actions">
            {live ? <ThresholdPortal label="Open" href={live.page} /> : null}
            <ThresholdPortal label="Leave" onClick={onLeave} />
          </div>
          {live?.repos.length ? (
            <div className="city-git-row">
              {live.repos.map((r) => (
                <a key={r.href} className="city-git" href={r.href} target="_blank" rel="noreferrer">
                  {r.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </Html>
      <Station position={[-2.6, 0, 0.35]} hue={glow} />
      <Station position={[2.6, 0, 0.35]} hue="#22e8ff" />
      <Station position={[-1.15, 0, 2.15]} hue="#c9b6ff" facing />
      <Station position={[1.15, 0, 2.15]} hue="#ff2a4a" facing />
      <mesh position={[-3.6, 3.7, 0.2]}>
        <boxGeometry args={[1.1, 0.08, 1.1]} />
        <meshBasicMaterial color={glow} />
      </mesh>
      <mesh position={[3.6, 3.7, 0.2]}>
        <boxGeometry args={[1.1, 0.08, 1.1]} />
        <meshBasicMaterial color="#22e8ff" />
      </mesh>
      <pointLight position={[0, 2.8, 0.4]} color={glow} intensity={1.15} distance={10} decay={2} />
      <pointLight position={[0, 2.1, 2.1]} color="#19E6E6" intensity={0.55} distance={8} decay={2} />
    </group>
  );
}

function Station({
  position,
  hue,
  facing = false,
}: {
  position: [number, number, number];
  hue: string;
  facing?: boolean;
}) {
  return (
    <group position={position} rotation={facing ? [0, Math.PI, 0] : [0, 0, 0]}>
      <mesh position={[0, 0.72, 0]}>
        <boxGeometry args={[1.35, 0.08, 0.78]} />
        <meshStandardMaterial color="#161c26" metalness={0.88} roughness={0.16} />
      </mesh>
      <mesh position={[0, 0.36, 0.28]}>
        <boxGeometry args={[1.2, 0.64, 0.08]} />
        <meshStandardMaterial color="#0b1016" metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[0, 1.18, -0.28]}>
        <boxGeometry args={[0.92, 0.58, 0.06]} />
        <meshStandardMaterial color="#05080c" emissive={hue} emissiveIntensity={0.85} metalness={0.4} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.88, -0.22]}>
        <boxGeometry args={[0.16, 0.22, 0.1]} />
        <meshStandardMaterial color="#1a222c" metalness={0.8} roughness={0.25} />
      </mesh>
      <Agent hue={hue} />
    </group>
  );
}

function Agent({ hue }: { hue: string }) {
  return (
    <group position={[0, 0, 0.12]}>
      <mesh position={[0, 0.42, 0.08]}>
        <boxGeometry args={[0.34, 0.28, 0.34]} />
        <meshStandardMaterial color="#0a0e14" metalness={0.7} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.92, 0.02]}>
        <boxGeometry args={[0.42, 0.52, 0.24]} />
        <meshStandardMaterial color="#0c1018" metalness={0.82} roughness={0.18} emissive={hue} emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[-0.28, 0.78, -0.08]} rotation={[0.4, 0, 0.5]}>
        <boxGeometry args={[0.1, 0.42, 0.1]} />
        <meshStandardMaterial color="#10141c" metalness={0.75} roughness={0.22} />
      </mesh>
      <mesh position={[0.28, 0.78, -0.08]} rotation={[0.4, 0, -0.5]}>
        <boxGeometry args={[0.1, 0.42, 0.1]} />
        <meshStandardMaterial color="#10141c" metalness={0.75} roughness={0.22} />
      </mesh>
      <mesh position={[0, 1.28, 0.02]}>
        <sphereGeometry args={[0.16, 20, 14]} />
        <meshStandardMaterial color="#05070c" metalness={0.9} roughness={0.12} emissive={hue} emissiveIntensity={0.45} />
      </mesh>
      <mesh position={[0, 1.28, 0.14]}>
        <boxGeometry args={[0.22, 0.07, 0.04]} />
        <meshBasicMaterial color={hue} />
      </mesh>
    </group>
  );
}

function Rig({ selected, inside }: { selected: string | null; inside: string | null }) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const flying = useRef(false);
  const goal = useRef(new THREE.Vector3(...HOME));
  const look = useRef(new THREE.Vector3(...HOME_LOOK));

  useEffect(() => {
    const d = inside ? byId(inside) : selected ? byId(selected) : null;
    if (inside && d) {
      const w = worldOf(d);
      goal.current.set(w.x, 1.72, w.z + 6.6);
      look.current.set(w.x, 1.48, w.z - 1.4);
      flying.current = true;
      return;
    }
    if (d) {
      const w = worldOf(d);
      goal.current.set(w.x, 2.55, w.z + Math.max(7.4, w.depth + 5.2));
      look.current.set(w.x, 2.8, w.z);
      flying.current = true;
      return;
    }
    goal.current.set(...HOME);
    look.current.set(...HOME_LOOK);
    flying.current = true;
  }, [selected, inside]);

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
    ctrl.minDistance = inside ? 2.4 : 6;
    ctrl.maxDistance = inside ? 18 : 48;
    if (flying.current) {
      if (reduce) {
        ctrl.object.position.copy(goal.current);
        ctrl.target.copy(look.current);
        ctrl.update();
        flying.current = false;
      } else {
        const k = inside ? 4.8 : 2.8;
        ctrl.object.position.lerp(goal.current, 1 - Math.exp(-d * k));
        ctrl.target.lerp(look.current, 1 - Math.exp(-d * k));
        ctrl.update();
        if (ctrl.object.position.distanceTo(goal.current) < 0.16) flying.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enableDamping
      dampingFactor={0.08}
      minPolarAngle={inside ? 0.85 : 1.02}
      maxPolarAngle={inside ? Math.PI / 2.05 : Math.PI / 2.08}
      minDistance={inside ? 2.4 : 5}
      maxDistance={inside ? 22 : 36}
      onStart={() => {
        flying.current = false;
      }}
    />
  );
}
