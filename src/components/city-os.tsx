import { useEffect, useMemo, useRef, useState, type ComponentType } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Play, Search, Volume2, VolumeX, X } from "lucide-react";
import { CityStage } from "@/components/city-stage";
import { type CityGfx } from "@/lib/gfx";
import { useCompute } from "@/lib/compute";
import { AgentNode, AgentDock, AttentionStrip, ComputeDock, Corridor, Disclose, HierarchyTrail, ResponseScene } from "@/components/grid-chrome";
import { agentStateOf } from "@/lib/design-system";
import { INFO_CAPS, attentionFloor, infoDepthFor, nextDepth, rankAgents, take, type InfoDepth } from "@/lib/info";
import { FloorDock, StartHere } from "@/components/start-floor";
import type { FilmHandle } from "@/components/film-player";
import { StatusChip } from "@/components/status-chip";
import { chapterById } from "@/lib/film";
import {
  AGENT_SPRITE_CONSTRAINT,
  BOTBAE_BUILDINGS,
  PARALLAX_LOOP,
  destById,
  destForApp,
  destFrame,
  destUrl,
  districtSurfaces,
  HERMES_STACK,
  verifiedHosts,
} from "@/lib/destinations";
import { DestLink, HostCard, StudioRail } from "@/components/dest-link";
import {
  AGENTS,
  COLLECTIVES,
  DATA_MODE,
  DATA_MODE_NOTE,
  DISTRICT_BY_ID,
  DISTRICT_CHAPTER,
  FLOOR,
  MCPS,
  NAV,
  PALETTE,
  SITE_TAGLINE,
  SITE_TITLE,
  neighborsOf,
  type ViewId,
} from "@/lib/grid";
import { CITY_RUNS, JOURNEY_TRAIL, PROTOCOL_TRAIL, stepIndexForDistrict, type FloorMode } from "@/lib/journeys";
import { protocolIndexForDistrict, PROTOCOL_RUNS } from "@/lib/atg";
import { cn } from "@/lib/utils";
import { createLofiBed, type LofiBed } from "@/lib/lofi-bed";
import type { GlobeOpen } from "@/lib/globe-nav";
import { GLOBE_BY_SLUG } from "@/lib/globe-nav";
import { useWorldLayer } from "@/features/world-globe/WorldLayerState";

export function CityOS({ globePath }: { globePath?: string[] }) {
  const navigate = useNavigate();
  const [view, setView] = useState<ViewId>("city");
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [palette, setPalette] = useState(false);
  const [tick, setTick] = useState(0);
  const [filmSeek, setFilmSeek] = useState<number | null>(null);
  const [filmOpen, setFilmOpen] = useState(false);
  const [signalOpen, setSignalOpen] = useState(false);
  const [ambientMuted, setAmbientMuted] = useState(false);
  const [filmAspect, setFilmAspect] = useState<"film" | "feed">("film");
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<FloorMode>("world");
  const [step, setStep] = useState(0);
  const [compareA, setCompareA] = useState("hermes");
  const [compareB, setCompareB] = useState("construct");
  const [campusFocus, setCampusFocus] = useState<string | null>(null);
  const [cityInside, setCityInside] = useState<string | null>(null);
  const [focusAgent, setFocusAgent] = useState<string | null>(null);
  const [compute, setCompute, cityGfx] = useCompute();
  const [World, setWorld] = useState<ComponentType<{
    selected: string | null;
    inside: string | null;
    gfx: CityGfx;
    onSelect: (id: string | null) => void;
    onEnter: (id: string) => void;
  }> | null>(null);
  const [OsPane, setOsPane] = useState<ComponentType<{
    view: ViewId;
    onDistrict: (id: string) => void;
    onPlayFilm: (chapterId: string) => void;
    filmSeek: number | null;
    onFilmSeekConsumed: () => void;
  }> | null>(null);
  const [Campus, setCampus] = useState<ComponentType<{
    focus: string | null;
    onFocus: (id: string | null) => void;
    onClose: () => void;
  }> | null>(null);
  const [Street, setStreet] = useState<ComponentType<{ onClose: () => void; onCity: () => void }> | null>(null);
  const [Foil, setFoil] = useState<ComponentType<{ onClose: () => void }> | null>(null);
  const [Stack, setStack] = useState<ComponentType<{
    onClose: () => void;
    onCity: () => void;
    onOpen?: (open: GlobeOpen, districtId?: string, href?: string) => void;
    onPath?: (district: string | null, child: string | null) => void;
  }> | null>(null);
  const [Archive, setArchive] = useState<ComponentType<{
    onClose: () => void;
    onCity: () => void;
    onWorld: () => void;
    onFilm: (chapterId: string) => void;
  }> | null>(null);
  const [Film, setFilm] = useState<any>(null);
  const [Guide, setGuide] = useState<ComponentType<{
    step: number;
    onStep: (n: number) => void;
    onFilm: (id: string) => void;
    onEnter: (id: string) => void;
    onCity: () => void;
  }> | null>(null);
  const [Proto, setProto] = useState<ComponentType<{
    step: number;
    onStep: (n: number) => void;
    onFilm: (id: string) => void;
    onEnter: (id: string) => void;
    onCity: () => void;
    onMcp: () => void;
  }> | null>(null);
  const [Compare, setCompare] = useState<ComponentType<{
    a: string;
    b: string;
    onA: (id: string) => void;
    onB: (id: string) => void;
    onDistrict: (id: string) => void;
  }> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const filmRef = useRef<FilmHandle | null>(null);
  const ambientRef = useRef<LofiBed | null>(null);
  const filmOpenRef = useRef(false);
  const mutedRef = useRef(false);
  filmOpenRef.current = filmOpen;

  const depth = infoDepthFor(compute);
  const caps = INFO_CAPS[depth];
  const attn = useMemo(() => attentionFloor(FLOOR), []);

  useEffect(() => {
    if (!caps.tickerMs) return;
    const id = window.setInterval(() => setTick((n) => (n + 1) % attn.length), caps.tickerMs);
    const onVis = () => {
      if (document.hidden) window.clearInterval(id);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [caps.tickerMs, attn.length]);

  useEffect(() => {
    const bed = createLofiBed();
    ambientRef.current = bed;
    const stored = window.localStorage.getItem("agentropolis-ambient") === "off";
    setAmbientMuted(stored);
    mutedRef.current = stored;
    bed.setMuted(stored);
    const kick = () => {
      if (!filmOpenRef.current && !mutedRef.current) void bed.start();
    };
    window.addEventListener("pointerdown", kick, { once: true });
    return () => {
      window.removeEventListener("pointerdown", kick);
      bed.dispose();
      ambientRef.current = null;
    };
  }, []);

  useEffect(() => {
    mutedRef.current = ambientMuted;
    const bed = ambientRef.current;
    if (!bed) return;
    bed.setMuted(ambientMuted);
    if (filmOpen || signalOpen || ambientMuted) bed.stop();
    else void bed.start();
  }, [filmOpen, signalOpen, ambientMuted]);

  useEffect(() => {
    if (compute === "minimum" || mode === "start" || mode === "world") {
      setWorld(null);
      return;
    }
    let alive = true;
    void import("@/components/city-world").then((mod) => {
      if (alive) setWorld(() => mod.CityWorld);
    });
    return () => {
      alive = false;
    };
  }, [compute, mode]);

  useEffect(() => {
    if (view === "city") return;
    let alive = true;
    void import("@/components/os-views").then((mod) => {
      if (alive) setOsPane(() => mod.OsView);
    });
    return () => {
      alive = false;
    };
  }, [view]);

  useEffect(() => {
    if (!(view === "city" && mode === "city" && selected === "utility" && !filmOpen)) return;
    let alive = true;
    void import("@/components/utility-campus").then((mod) => {
      if (alive) setCampus(() => mod.UtilityCampus);
    });
    return () => {
      alive = false;
    };
  }, [view, mode, selected, filmOpen]);

  useEffect(() => {
    if (!(view === "city" && mode === "city" && selected === "street" && !filmOpen)) return;
    let alive = true;
    void import("@/components/main-street").then((mod) => {
      if (alive) setStreet(() => mod.MainStreet);
    });
    return () => {
      alive = false;
    };
  }, [view, mode, selected, filmOpen]);

  useEffect(() => {
    const open = !filmOpen && (view === "observatory" || (view === "city" && mode === "city" && selected === "holofoil"));
    if (!open) return;
    let alive = true;
    void import("@/components/holofoil-campus").then((mod) => {
      if (alive) setFoil(() => mod.HolofoilCampus);
    });
    return () => {
      alive = false;
    };
  }, [view, mode, selected, filmOpen]);

  useEffect(() => {
    if (!(view === "city" && mode === "world" && !filmOpen)) return;
    let alive = true;
    void import("@/components/world-stack").then((mod) => {
      if (alive) setStack(() => mod.WorldStack);
    });
    return () => {
      alive = false;
    };
  }, [view, mode, filmOpen]);

  useEffect(() => {
    if (!signalOpen) {
      setArchive(null);
      return;
    }
    let alive = true;
    void import("@/components/neuro-archive").then((mod) => {
      if (alive) setArchive(() => mod.NeuroArchive);
    });
    return () => {
      alive = false;
    };
  }, [signalOpen]);

  useEffect(() => {
    if (!filmOpen) return;
    let alive = true;
    void import("@/components/film-player").then((mod) => {
      if (alive) setFilm(() => mod.FilmPlayer);
    });
    return () => {
      alive = false;
    };
  }, [filmOpen]);

  useEffect(() => {
    if (!["journey", "protocol", "compare"].includes(mode)) return;
    let alive = true;
    void import("@/components/city-flow").then((mod) => {
      if (!alive) return;
      setGuide(() => mod.GuidedTour);
      setProto(() => mod.ProtocolTour);
      setCompare(() => mod.CompareFloors);
    });
    return () => {
      alive = false;
    };
  }, [mode]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPalette((open) => !open);
        setMode((m) => (m === "find" ? "city" : "find"));
        return;
      }
      if (e.key === "/" && !typing) {
        e.preventDefault();
        setPalette(true);
        setMode("find");
        return;
      }
      if (e.key === "Escape") {
        if (palette) {
          setPalette(false);
          setMode("city");
          return;
        }
        if (filmOpen) {
          filmRef.current?.pause();
          setFilmOpen(false);
          return;
        }
        if (signalOpen) {
          setSignalOpen(false);
          return;
        }
        if (selected === "utility" && mode === "city") {
          setSelected(null);
          setCampusFocus(null);
          return;
        }
        if (selected === "street" && mode === "city") {
          setSelected(null);
          return;
        }
        if ((selected === "holofoil" || view === "observatory") && mode === "city") {
          setSelected(null);
          setView("city");
          return;
        }
        if (focusAgent) {
          setFocusAgent(null);
          return;
        }
        if (cityInside) {
          setCityInside(null);
          return;
        }
        if (mode === "world") {
          setMode("city");
          return;
        }
        if (mode !== "city") {
          if (mode !== "find") setSelected(null);
          setMode("city");
          return;
        }
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [palette, filmOpen, signalOpen, mode, selected, cityInside, focusAgent]);

  useEffect(() => {
    if (palette) {
      setQuery("");
      setCursor(0);
      const t = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(t);
    }
  }, [palette]);

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const seen = new Set<string>();
    const extra = verifiedHosts().map((d) => ({
      id: d.id,
      label: `${d.label} · ${d.href?.replace(/^https:\/\//, "") ?? ""}`,
      view: "city" as ViewId,
      districtId: d.districtId,
      href: d.href,
    }));
    return [...PALETTE.map((p) => ({ ...p, href: undefined as string | undefined })), ...extra].filter((p) => {
      if (q && !p.label.toLowerCase().includes(q)) return false;
      if (seen.has(p.label)) return false;
      seen.add(p.label);
      return true;
    });
  }, [query]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  const goView = (next: ViewId) => {
    filmRef.current?.pause();
    setFilmOpen(false);
    setSignalOpen(false);
    setPalette(false);
    setMode("city");
    if (next === "observatory") {
      setView("observatory");
      setSelected("holofoil");
      setCityInside(null);
      setFocusAgent(null);
      return;
    }
    setView(next);
    if (next !== "city") setSelected(null);
  };

  const openDistrict = (id: string) => {
    filmRef.current?.pause();
    setFilmOpen(false);
    setSignalOpen(false);
    setSelected(id);
    setView("city");
    setMode("city");
    setPalette(false);
    setCityInside(null);
    setFocusAgent(null);
    if (id !== "utility") setCampusFocus(null);
  };

  const enterBuilding = (id: string) => {
    if (id === "utility" || id === "street" || id === "holofoil") {
      openDistrict(id);
      return;
    }
    setSelected(id);
    setCityInside(id);
    setView("city");
    setMode("city");
    setPalette(false);
    setFilmOpen(false);
  };

  const playFilm = (chapterId: string) => {
    const ch = chapterById(chapterId) ?? chapterById("open");
    if (!ch) return;
    if (mode !== "journey" && mode !== "protocol") setSelected(null);
    setView("city");
    setFilmOpen(true);
    setSignalOpen(false);
    setPalette(false);
    setFilmSeek(ch.start);
  };

  const startJourney = (at = 0) => {
    const next = Math.max(0, Math.min(CITY_RUNS.length - 1, at));
    filmRef.current?.pause();
    setFilmOpen(false);
    setView("city");
    setMode("journey");
    setStep(next);
    setSelected(CITY_RUNS[next]!.districtId);
    setPalette(false);
  };

  const gotoStep = (index: number) => {
    const next = Math.max(0, Math.min(CITY_RUNS.length - 1, index));
    setStep(next);
    setSelected(CITY_RUNS[next]!.districtId);
  };

  const startProtocol = (at = 0) => {
    const next = Math.max(0, Math.min(PROTOCOL_RUNS.length - 1, at));
    filmRef.current?.pause();
    setFilmOpen(false);
    setView("city");
    setMode("protocol");
    setStep(next);
    setSelected(PROTOCOL_RUNS[next]!.districtId);
    setPalette(false);
  };

  const gotoProtocol = (index: number) => {
    const next = Math.max(0, Math.min(PROTOCOL_RUNS.length - 1, index));
    setStep(next);
    setSelected(PROTOCOL_RUNS[next]!.districtId);
  };

  const setFloor = (next: FloorMode) => {
    if (next === "find") {
      setPalette(true);
      setMode("find");
      return;
    }
    filmRef.current?.pause();
    setFilmOpen(false);
    setSignalOpen(false);
    setView("city");
    setPalette(false);
    setMode(next);
    if (next === "journey") {
      startJourney(mode === "journey" ? step : 0);
      return;
    }
    if (next === "protocol") {
      startProtocol(mode === "protocol" ? step : 0);
      return;
    }
    if (next === "city") {
      if (mode === "journey" || mode === "start" || mode === "compare" || mode === "protocol") setSelected(null);
    }
    if (next === "start" || next === "compare" || next === "world") {
      setSelected(null);
    }
  };

  useEffect(() => {
    const d = globePath?.[0];
    if (!d || !GLOBE_BY_SLUG[d]) return;
    useWorldLayer.getState().pickGlobe(d, globePath[1] ?? null);
  }, [globePath]);

  const openFromGlobe = (open: GlobeOpen, districtId?: string, href?: string) => {
    if (open === "stay" || open === "worldq") return;
    if (open === "external" && href) {
      window.open(href, "_blank", "noopener,noreferrer");
      return;
    }
    if (open === "protocol") {
      setFloor("protocol");
      return;
    }
    if (open === "campus") {
      setSelected("utility");
      setFloor("city");
      return;
    }
    if (open === "street") {
      setSelected("street");
      setFloor("city");
      return;
    }
    if (open === "holofoil") {
      setSelected("holofoil");
      setFloor("city");
      return;
    }
    if (districtId) setSelected(districtId);
    setFloor("city");
  };

  const pickDistrict = (id: string) => {
    if (mode === "journey") {
      const idx = stepIndexForDistrict(id);
      if (idx !== null) {
        gotoStep(idx);
        return;
      }
    }
    if (mode === "protocol") {
      const idx = protocolIndexForDistrict(id);
      if (idx !== null) {
        gotoProtocol(idx);
        return;
      }
    }
    openDistrict(id);
  };

  const pick = (item: (typeof PALETTE)[number] & { href?: string }) => {
    if (item.href) {
      window.open(item.href, "_blank", "noopener,noreferrer");
      setPalette(false);
      setMode("city");
      return;
    }
    if (item.id === "world-stack") {
      setMode("world");
      setView("city");
      setPalette(false);
      setSignalOpen(false);
      return;
    }
    if (item.id === "signal") {
      setSignalOpen(true);
      setFilmOpen(false);
      setPalette(false);
      setMode("city");
      return;
    }
    if (item.id === "protocol-walk" || item.id === "run-mandate") {
      startProtocol(0);
      return;
    }
    if (item.districtId) openDistrict(item.districtId);
    else if (item.id === "film") playFilm("open");
    else goView(item.view as ViewId);
  };

  const district = selected && mode === "city" ? DISTRICT_BY_ID[selected] : null;
  const agentFocus = focusAgent ? AGENTS.find((a) => a.id === focusAgent) : null;
  const line = attn[tick % attn.length] ?? FLOOR[0]!;
  const cityLit = view === "city" && !filmOpen && !signalOpen;
  const campusOpen = view === "city" && mode === "city" && selected === "utility" && !filmOpen && !signalOpen;
  const streetOpen = view === "city" && mode === "city" && selected === "street" && !filmOpen && !signalOpen;
  const foilOpen =
    !filmOpen && !signalOpen && (view === "observatory" || (view === "city" && mode === "city" && selected === "holofoil"));
  const worldOpen = view === "city" && mode === "world" && !filmOpen && !signalOpen;
  const overlayOpen = campusOpen || streetOpen || foilOpen || worldOpen || signalOpen;
  const trail =
    view === "city" && !filmOpen && mode === "journey"
      ? JOURNEY_TRAIL
      : view === "city" && !filmOpen && mode === "protocol"
        ? PROTOCOL_TRAIL
        : undefined;
  const trailKind = mode === "protocol" ? "protocol" : mode === "journey" ? "city" : undefined;

  return (
    <div className="relative h-dvh overflow-hidden bg-obsidian text-paper" data-compute={compute}>
      <div className="absolute inset-0">
        {cityGfx === "map" || overlayOpen || !World || mode === "start" || filmOpen || mode === "world" || signalOpen ? (
          mode === "start" || filmOpen || mode === "world" || signalOpen ? (
            <div className="h-full w-full bg-obsidian" />
          ) : (
            <CityStage
              selected={view === "city" ? selected : null}
              hovered={view === "city" ? hovered : null}
              lit={cityLit}
              quiet={!selected}
              trail={trail}
              trailKind={trailKind}
              onHover={setHovered}
              onSelect={pickDistrict}
            />
          )
        ) : (
          <World
            selected={view === "city" ? selected : null}
            inside={cityInside}
            gfx={cityGfx}
            onSelect={(id) => {
              if (!id) {
                setSelected(null);
                setCityInside(null);
                return;
              }
              pickDistrict(id);
            }}
            onEnter={enterBuilding}
          />
        )}
      </div>

      {view === "city" && mode === "city" && cityInside ? (
        <div className="absolute left-4 top-[7.6rem] z-30 flex flex-wrap gap-2 sm:left-6">
          {cityInside === "hermes" ? (
            <a
              href="https://agentropolis-city-of-agents.github.io/HERMES-CITY/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center rounded-md bg-cyan px-4 text-2xs font-medium tracking-[0.16em] text-obsidian"
            >
              OPEN LIVE
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => {
              setCityInside(null);
              setFocusAgent(null);
            }}
            className="h-11 rounded-md bg-obsidian/70 px-4 text-2xs font-medium tracking-[0.16em] text-red shadow-[var(--shadow-border)]"
          >
            LEAVE ROOM
          </button>
        </div>
      ) : null}

      {view === "city" && mode === "start" && !filmOpen && !signalOpen ? (
        <StartHere
          onGuide={() => startJourney(0)}
          onFilm={() => playFilm("open")}
          onCity={() => setFloor("city")}
          onBuild={() => openDistrict("construct")}
          onProtocol={() => startProtocol(0)}
          onStreet={() => openDistrict("street")}
          onDistrict={openDistrict}
          onWorld={() => setFloor("world")}
          onSignal={() => setSignalOpen(true)}
        />
      ) : null}

      {view === "city" && mode === "journey" && !filmOpen && Guide ? (
        <Guide
          step={step}
          onStep={gotoStep}
          onFilm={playFilm}
          onEnter={openDistrict}
          onCity={() => setFloor("city")}
        />
      ) : null}

      {view === "city" && mode === "protocol" && !filmOpen && Proto ? (
        <Proto
          step={step}
          onStep={gotoProtocol}
          onFilm={playFilm}
          onEnter={openDistrict}
          onCity={() => setFloor("city")}
          onMcp={() => goView("mcp")}
        />
      ) : null}

      {view === "city" && mode === "compare" && !filmOpen && Compare ? (
        <Compare
          a={compareA}
          b={compareB}
          onA={setCompareA}
          onB={setCompareB}
          onDistrict={openDistrict}
        />
      ) : null}

      {OsPane ? (
        <OsPane
          view={filmOpen || foilOpen ? "city" : view}
          onDistrict={openDistrict}
          onPlayFilm={playFilm}
          filmSeek={filmSeek}
          onFilmSeekConsumed={() => setFilmSeek(null)}
        />
      ) : null}

      {campusOpen && Campus ? (
        <Campus
          focus={campusFocus}
          onFocus={setCampusFocus}
          onClose={() => {
            setSelected(null);
            setCampusFocus(null);
          }}
        />
      ) : null}

      {streetOpen && Street ? (
        <Street
          onClose={() => setSelected(null)}
          onCity={() => setSelected(null)}
        />
      ) : null}

      {foilOpen && Foil ? (
        <Foil
          onClose={() => {
            setSelected(null);
            setView("city");
          }}
        />
      ) : null}

      {worldOpen && Stack ? (
        <Stack
          onClose={() => setFloor("city")}
          onCity={() => setFloor("city")}
          onOpen={openFromGlobe}
          onPath={(d, c) => {
            if (!d) {
              void navigate({ to: "/globe" });
              return;
            }
            if (!c) {
              void navigate({ to: "/globe/$district", params: { district: d } });
              return;
            }
            void navigate({ to: "/globe/$district/$child", params: { district: d, child: c } });
          }}
        />
      ) : null}

      {signalOpen && Archive ? (
        <Archive
          onClose={() => setSignalOpen(false)}
          onCity={() => {
            setSignalOpen(false);
            setFloor("city");
          }}
          onWorld={() => {
            setSignalOpen(false);
            setFloor("world");
          }}
          onFilm={playFilm}
        />
      ) : null}

      <div
        data-film-stage
        className={cn(
          "absolute inset-x-0 top-14 bottom-16 z-[25] bg-obsidian md:top-28",
          filmOpen ? "visible" : "invisible pointer-events-none",
        )}
        aria-hidden={!filmOpen}
      >
        {filmOpen && Film ? (
          <Film
            ref={filmRef}
            cinematic
            active={filmOpen}
            aspect={filmAspect}
            onAspect={setFilmAspect}
            seekTo={filmSeek}
            onSeekConsumed={() => setFilmSeek(null)}
          />
        ) : null}
      </div>

      <header className={cn("absolute inset-x-0 top-0 z-30 bg-gradient-to-b from-obsidian/90 via-obsidian/55 to-transparent", overlayOpen && "invisible pointer-events-none")}>
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src="/media/stills/agentropolis-mark.jpg"
              alt=""
              className="size-10 shrink-0 rounded-full ring-1 ring-red/55"
            />
            <button
              type="button"
              onClick={() => goView("city")}
              className="min-w-0 text-left"
              aria-label="Return to city"
            >
              <p className="os-wordmark font-display text-sm font-semibold tracking-[0.22em] sm:text-base">{SITE_TITLE}</p>
              <p className="hidden text-2xs tracking-[0.14em] text-mute uppercase sm:block">{SITE_TAGLINE}</p>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://agentropolis.dev"
              target="_blank"
              rel="noreferrer"
              data-dest="host-agentropolis"
              title="AGENTROPOLIS · agentropolis.dev · LIVE"
              className="hidden h-11 items-center px-1.5 font-mono text-2xs tracking-[0.08em] text-cyan md:inline-flex hover:text-red"
            >
              .dev
            </a>
            {mode !== "start" ? <StudioRail /> : null}
            {mode !== "start" ? <ComputeDock value={compute} onChange={setCompute} /> : null}
            <button
              type="button"
              data-ambient
              onClick={() => {
                setAmbientMuted((v) => {
                  const next = !v;
                  window.localStorage.setItem("agentropolis-ambient", next ? "off" : "on");
                  return next;
                });
              }}
              className="inline-flex size-11 items-center justify-center rounded-md text-cyan shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-red active:scale-[0.96]"
              aria-label={ambientMuted ? "Unmute Star Wars lofi" : "Mute Star Wars lofi"}
              title={ambientMuted ? "Star Wars lofi off" : "Star Wars lofi on"}
            >
              {ambientMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <button
              type="button"
              data-film
              data-film-header
              onClick={() => playFilm("open")}
              className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-xs tracking-[0.12em] text-cyan shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-red active:scale-[0.96]"
            >
              <Play className="size-3.5" fill="currentColor" />
              <span className="hidden sm:inline">Film</span>
            </button>
            {mode !== "start" ? (
              <span className="hidden h-8 items-center rounded-sm px-2 font-mono text-2xs tracking-[0.14em] text-cyan shadow-[var(--shadow-border)] sm:inline-flex">
                {DATA_MODE}
              </span>
            ) : null}
            <button
              type="button"
              data-command
              onClick={() => setFloor("find")}
              className="inline-flex h-11 items-center gap-2 rounded-md px-3 text-xs tracking-[0.12em] text-cyan shadow-[var(--shadow-border)] transition-transform duration-150 ease-out hover:text-red active:scale-[0.96]"
            >
              <Search className="size-4" />
              <span className="hidden sm:inline">Find</span>
              <kbd className="hidden rounded-sm px-1.5 py-0.5 font-mono text-2xs text-mute shadow-[var(--shadow-border)] md:inline">/</kbd>
            </button>
          </div>
        </div>
        {mode === "start" ? null : (
        <nav className="hidden gap-1 overflow-x-auto px-4 pb-2 md:flex sm:px-6" aria-label="City navigation">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              data-view={item.id}
              onClick={() => goView(item.id)}
              className={cn(
                "h-11 shrink-0 px-3 text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-150",
                view === item.id || (filmOpen && item.id === "atv") ? "text-red" : "text-cyan hover:text-red",
              )}
            >
              {item.label}
            </button>
          ))}
        </nav>
        )}
      </header>

      {agentFocus && view === "city" && !overlayOpen ? (
        <AgentDock
          agent={agentFocus}
          districtName={DISTRICT_BY_ID[agentFocus.districtId]?.name ?? agentFocus.place}
          onBack={() => setFocusAgent(null)}
          depth={depth}
        />
      ) : district && view === "city" && !overlayOpen ? (
        <DistrictDrawer
          id={district.id}
          depth={depth}
          onClose={() => {
            setSelected(null);
            setCampusFocus(null);
            setFocusAgent(null);
          }}
          onPlayFilm={playFilm}
          onDistrict={openDistrict}
          onAgent={setFocusAgent}
          onMcp={() => goView("mcp")}
          onJspace={() => goView("jspace")}
          onProtocol={startProtocol}
        />
      ) : null}

      {filmOpen || overlayOpen || mode === "start" ? null : <FloorDock mode={view === "city" ? mode : "city"} onMode={setFloor} />}

      <footer
        data-ticker
        className={cn(
          "absolute inset-x-0 bottom-0 z-50 flex items-center gap-3 bg-obsidian/78 px-3 py-2 shadow-[var(--shadow-border)] backdrop-blur-md sm:px-6",
          overlayOpen || mode === "start" ? "invisible pointer-events-none" : null,
        )}
      >
        <button
          type="button"
          onClick={() => openDistrict(AGENTS.find((a) => a.name === line.from)?.districtId ?? "mission")}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <span className="city-pulse size-1.5 shrink-0 rounded-full bg-red" />
          <span className="hidden font-mono text-2xs tracking-[0.16em] text-cyan uppercase sm:inline">Mission Control</span>
          <span className="truncate text-xs text-cyan">
            <span className="text-red">{line.from}</span>
            <span className="text-mute"> · {line.place} · </span>
            {line.text}
          </span>
        </button>
        <AttentionStrip
          gated={AGENTS.filter((a) => a.status === "gated").length}
          executing={AGENTS.filter((a) => a.status === "active" || a.status === "on-air" || a.status === "directing").length}
          live={Object.values(DISTRICT_BY_ID).filter((d) => d.status === "LIVE").length}
        />
        <span className="hidden font-mono text-2xs tracking-[0.12em] text-cyan lg:inline">{DATA_MODE}</span>
      </footer>

      {palette ? (
        <div
          data-palette
          className="absolute inset-0 z-palette flex items-start justify-center bg-obsidian/70 px-4 pt-24 backdrop-blur-sm"
          onClick={() => {
            setPalette(false);
            setMode("city");
          }}
        >
          <div
            className="os-palette w-full max-w-xl overflow-hidden rounded-xl bg-obsidian-2 shadow-[var(--shadow-border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-line px-3">
              <Search className="size-4 text-cyan" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setCursor((c) => Math.min(items.length - 1, c + 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setCursor((c) => Math.max(0, c - 1));
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    const item = items[cursor];
                    if (item) pick(item);
                  }
                }}
                placeholder="Find a district, floor, host, or the film"
                className="h-12 w-full bg-transparent text-sm text-paper outline-none placeholder:text-dim"
                aria-label="Find a district"
              />
            </div>
            <ul className="max-h-80 overflow-y-auto py-2">
              {items.length === 0 ? (
                <li className="px-4 py-6 text-sm text-mute">Nothing matches.</li>
              ) : (
                items.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => pick(item)}
                      className={cn(
                        "flex h-11 w-full items-center justify-between px-4 text-left text-sm",
                        i === cursor ? "bg-obsidian-3 text-cyan" : "text-paper hover:text-cyan",
                      )}
                    >
                      <span>{item.label}</span>
                      <span className="font-mono text-2xs text-dim">
                        {item.href ? "LIVE host" : item.districtId ? "District" : "Floor"}
                      </span>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <p className="border-t border-line px-4 py-2 font-mono text-2xs text-dim">{DATA_MODE_NOTE}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DistrictDrawer({
  id,
  depth: startDepth,
  onClose,
  onPlayFilm,
  onDistrict,
  onAgent,
  onMcp,
  onJspace,
  onProtocol,
}: {
  id: string;
  depth: InfoDepth;
  onClose: () => void;
  onPlayFilm: (chapterId: string) => void;
  onDistrict: (id: string) => void;
  onAgent: (id: string) => void;
  onMcp: () => void;
  onJspace: () => void;
  onProtocol: (at?: number) => void;
}) {
  const [depth, setDepth] = useState(startDepth);
  const [AtgPane, setAtgPane] = useState<ComponentType<{
    onProtocol: () => void;
    onMcp: () => void;
    onDistrict: (id: string) => void;
  }> | null>(null);
  useEffect(() => {
    setDepth(startDepth);
  }, [startDepth, id]);
  useEffect(() => {
    if (id !== "atg") return;
    let alive = true;
    void import("@/components/atg-floor").then((mod) => {
      if (alive) setAtgPane(() => mod.AtgInterior);
    });
    return () => {
      alive = false;
    };
  }, [id]);
  const district = DISTRICT_BY_ID[id];
  const caps = INFO_CAPS[depth];
  if (!district) return null;
  const agents = take(rankAgents(AGENTS.filter((a) => district.agents.includes(a.id))), caps.agents);
  const mcps = take(MCPS.filter((m) => district.mcps.includes(m.id)), caps.surfaces);
  const collective = caps.collective ? COLLECTIVES.find((c) => c.districtId === district.id) : undefined;
  const chapterId = DISTRICT_CHAPTER[district.id];
  const floor = take(
    FLOOR.filter((line) => district.name.includes(line.place) || line.place.includes(district.code) || agents.some((a) => a.name === line.from)),
    caps.activity,
  );
  const surfaces = take(districtSurfaces(district.id), caps.surfaces);
  const construct = district.id === "construct";
  const utility = district.id === "utility";
  const atg = district.id === "atg";
  const parallax = district.id === "parallax";
  const connected = take(neighborsOf(district.id), caps.neighbors);
  const accent = construct ? "text-pink" : utility ? "text-red" : "text-cyan";
  const hermesLayer = district.id === "hermes" ? take([...HERMES_STACK], Math.max(1, caps.surfaces)) : [];

  return (
    <aside
      data-drawer={district.id}
      data-info={depth}
      className={cn(
        "os-drawer absolute z-40 flex max-h-[34vh] flex-col rounded-xl bg-obsidian/92 shadow-[var(--shadow-border)] backdrop-blur-md md:max-h-none",
        construct && "botbae-glass md:rounded-none",
        utility && "utility-glass md:rounded-none",
        parallax && "parallax-glass md:rounded-none",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-4">
        <div className="min-w-0">
          <p className={cn("text-2xs tracking-[0.2em] uppercase", accent)}>
            {construct ? "BOTBAE world" : utility ? "Origin Engine" : parallax ? "Spatial MCP" : atg ? "Contract layer" : district.kind}
          </p>
          <h2 className="mt-1 font-display text-lg font-semibold tracking-[0.08em] text-paper">{district.name}</h2>
          <HierarchyTrail at="DISTRICT" className="mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <StatusChip status={district.status} />
          <button type="button" onClick={onClose} className="flex size-11 items-center justify-center text-mute hover:text-paper" aria-label="Close district">
            <X className="size-4" />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
        {atg ? (
          AtgPane ? <AtgPane onProtocol={onProtocol} onMcp={onMcp} onDistrict={onDistrict} /> : <p className="text-sm text-mute">Loading ATG…</p>
        ) : (
          <p className="text-sm leading-relaxed text-mute">{district.role}</p>
        )}
        <Corridor className="mt-4" active={district.status === "LIVE" ? "EXECUTE" : district.status === "AVAILABLE" ? "PLAN" : "MANDATE"} />
        {caps.response && !atg ? (
          <ResponseScene
            kind={district.status === "OFFLINE" ? "RISK" : "SYSTEM MAP"}
            title={district.name}
            claim={district.role}
            status={district.status}
            agents={agents.map((a) => ({ name: a.name, state: agentStateOf(a.status) }))}
            evidence={
              district.activity.length
                ? district.activity.slice(0, caps.activity)
                : ["No receipt on this floor. Repository existence is not a live runtime."]
            }
          />
        ) : null}
        {!construct && !atg && !utility && !parallax && district.id !== "hermes" && caps.posters ? (
          <img
            src={district.poster}
            alt=""
            className="mt-4 aspect-video w-full rounded-md object-cover shadow-[var(--shadow-border)]"
          />
        ) : null}

        {district.id === "hermes" ? (
          <>
            <p className={cn("mt-4 text-2xs tracking-[0.18em] uppercase", accent)}>Live layer</p>
            <ul className="mt-2 flex flex-col gap-2">
              {hermesLayer.map((sid) => {
                const d = destById(sid);
                if (!d) return null;
                return (
                  <li key={sid}>
                    {d.kind === "pages" || d.kind === "site" ? <HostCard dest={d} /> : <DestLink dest={d} />}
                    <p className="px-3 pt-1 text-2xs leading-relaxed text-dim">{d.note}</p>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}

        {connected.length ? (
          <>
            <p className={cn("mt-6 text-2xs tracking-[0.18em] uppercase", accent)}>
              Connected floors
            </p>
            <ul className="mt-2 flex flex-col gap-1">
              {connected.map((d) => (
                <li key={d.id}>
                  <button
                    type="button"
                    onClick={() => onDistrict(d.id)}
                    className="flex h-11 w-full items-center justify-between rounded-md px-3 text-left shadow-[var(--shadow-border)] hover:text-cyan"
                  >
                    <span className="truncate text-xs text-paper">{d.name}</span>
                    <StatusChip status={d.status} />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {surfaces.length && !atg ? (
          <>
            <p className={cn("mt-6 text-2xs tracking-[0.18em] uppercase", accent)}>Surfaces</p>
            <ul className="mt-2 flex flex-col gap-1">
              {surfaces
                .filter((d) => district.id !== "hermes" || !HERMES_STACK.includes(d.id as (typeof HERMES_STACK)[number]))
                .map((d) => (
                <li key={d.id}>
                  {destFrame(d) ? <HostCard dest={d} /> : <DestLink dest={d} />}
                  <p className="px-3 pt-1 text-2xs leading-relaxed text-dim">{d.note}</p>
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {construct && caps.posters ? (
          <>
            <p className="mt-6 text-2xs tracking-[0.18em] text-pink uppercase">BOTBAE construct</p>
            <img
              src="/media/stills/botbae-blueprint.jpg"
              alt="BOTBAE spatial blueprint"
              className="mt-2 w-full rounded-md ring-1 ring-pink/35"
            />
            <ul className="mt-3 flex flex-col gap-1">
              {BOTBAE_BUILDINGS.map((b) => {
                const dest = b.destId ? destById(b.destId) : undefined;
                const url = dest ? destUrl(dest) : undefined;
                return (
                  <li key={b.id}>
                    {url && dest ? (
                      <DestLink dest={{ ...dest, label: b.name, status: b.status }} />
                    ) : (
                      <div data-building={b.id} className="flex h-11 items-center justify-between rounded-md px-3 shadow-[var(--shadow-border)]">
                        <span className="text-xs tracking-[0.08em] text-mute">{b.name}</span>
                        <StatusChip status={b.status} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-2xs leading-relaxed text-dim">{AGENT_SPRITE_CONSTRAINT}</p>
          </>
        ) : null}

        {parallax && caps.posters ? (
          <>
            <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">See. Act. See again. Prove it.</p>
            <img
              src="/media/stills/px-operator.jpg"
              alt="NEURO in a PARALLAX Spatial MCP jacket"
              className="mt-2 aspect-video w-full rounded-md object-cover ring-1 ring-cyan/40"
            />
            <img
              src="/media/stills/px-auth.jpg"
              alt="PARALLAX AUTH FAILED"
              className="mt-2 aspect-video w-full rounded-md object-cover ring-1 ring-red/40"
            />
            <p className="mt-3 font-display text-sm font-semibold tracking-[0.08em] text-red">AUTH FAILED</p>
            <p className="mt-1 text-2xs leading-relaxed text-mute">
              An agent can report finished. PARALLAX inspects, captures, verifies, and writes a receipt. Spatial mutations are not live on this floor.
            </p>
            <ol className="mt-3 flex flex-col gap-1" data-parallax-loop>
              {PARALLAX_LOOP.map((step, i) => (
                <li key={step.id} className="rounded-md px-3 py-2 shadow-[var(--shadow-border)]">
                  <p className="flex items-center justify-between gap-2">
                    <span className="font-mono text-2xs tracking-[0.16em] text-cyan">
                      {String(i + 1).padStart(2, "0")} {step.name}
                    </span>
                  </p>
                  <p className="mt-1 text-2xs leading-relaxed text-dim">{step.note}</p>
                </li>
              ))}
            </ol>
          </>
        ) : null}

        <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Agents</p>
        <ul className="mt-2 flex flex-col gap-1">
          {agents.length ? (
            agents.map((a) => (
              <li key={a.id}>
                <AgentNode agent={a} onSelect={onAgent} />
              </li>
            ))
          ) : (
            <li className="text-sm text-mute">No named agents assigned.</li>
          )}
        </ul>

        {!atg ? (
          <>
            <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Connected MCP</p>
            <ul className="mt-2 flex flex-col gap-1">
              {mcps.length ? (
                mcps.map((m) => (
                  <li key={m.id}>
                    <button type="button" onClick={onMcp} className="flex h-11 w-full items-center justify-between rounded-md px-3 text-left shadow-[var(--shadow-border)] hover:text-cyan">
                      <span className="truncate text-xs text-paper">{m.name}</span>
                      <StatusChip status={m.status} />
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-sm text-mute">No public MCP on this floor.</li>
              )}
            </ul>
          </>
        ) : null}

        {!atg && caps.skills ? (
          <>
            <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Skills</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {district.skills.map((s) => (
                <li key={s} className="rounded-sm px-2 py-1 text-2xs tracking-[0.12em] text-paper shadow-[var(--shadow-border)]">
                  {s}
                </li>
              ))}
            </ul>
          </>
        ) : null}

        {!atg && caps.apps ? (
          <>
            <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Applications</p>
            <ul className="mt-2 flex flex-col gap-1">
              {district.apps.map((app) => {
                const dest = destForApp(app);
                if (dest) {
                  return (
                    <li key={app}>
                      <DestLink dest={{ ...dest, label: app }} />
                    </li>
                  );
                }
                return (
                  <li key={app} className="flex h-11 items-center justify-between rounded-md px-3 shadow-[var(--shadow-border)]">
                    <span className="truncate font-mono text-2xs text-mute">{app}</span>
                    <StatusChip status="PLANNED" />
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}

        <p className="mt-6 text-2xs tracking-[0.18em] text-cyan uppercase">Activity · preview</p>
        <ul className="mt-2 flex flex-col gap-2">
          {take(district.activity, caps.activity).map((line) => (
            <li key={line} className="text-sm text-paper">
              {line}
            </li>
          ))}
          {floor.map((line) => (
            <li key={line.text} className="text-sm text-mute">
              {line.from}: {line.text}
            </li>
          ))}
        </ul>

        {!atg && collective ? (
          <p className="mt-6 text-2xs leading-relaxed text-mute">{collective.mission}</p>
        ) : !atg ? (
          <Corridor className="mt-6" />
        ) : null}

        <Disclose depth={depth} onDeeper={() => { const n = nextDepth(depth); if (n) setDepth(n); }} />

        <div className="mt-6 flex flex-wrap gap-2">
          {district.id === "jspace" ? (
            <button type="button" onClick={onJspace} className="h-11 rounded-md bg-obsidian-2 px-4 text-xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan">
              Open J-SPACE
            </button>
          ) : null}
          {chapterId ? (
            <button type="button" onClick={() => onPlayFilm(chapterId)} className="h-11 rounded-md bg-obsidian-2 px-4 text-xs tracking-[0.14em] text-paper shadow-[var(--shadow-border)] hover:text-cyan">
              Watch in the film
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
