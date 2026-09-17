import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import {
  ARCHIVE_CHAPTERS,
  ARCHIVE_QUESTION,
  ARCHIVE_SUB,
  ARCHIVE_TAG,
  ARCHIVE_THESIS,
  ARCHIVE_TITLE,
  CAPABILITY_LABEL,
  NX_AVATARS,
  NX_BY_ID,
  NX_LOCK,
} from "@/lib/neuro-archive";
import { CHAPTERS, VO_SRC } from "@/lib/film";
import { cn } from "@/lib/utils";

type Depth = "summary" | "inspect";

function chapterStart(id?: string) {
  return CHAPTERS.find((c) => c.id === id)?.start ?? 0;
}

export function NeuroArchive({
  onClose,
  onCity,
  onWorld,
}: {
  onClose: () => void;
  onCity: () => void;
  onWorld: () => void;
  onFilm?: (chapterId: string) => void;
}) {
  const [index, setIndex] = useState(0);
  const [depth, setDepth] = useState<Depth>("summary");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const chapter = ARCHIVE_CHAPTERS[index]!;
  const avatar = NX_BY_ID[chapter.avatarId]!;
  const next = ARCHIVE_CHAPTERS[Math.min(ARCHIVE_CHAPTERS.length - 1, index + 1)]!;

  const go = (i: number) => {
    setIndex(i);
    setDepth("summary");
  };

  const playVo = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.src) audio.src = VO_SRC;
    audio.muted = muted;
    audio.volume = 1;
    audio.currentTime = chapterStart(chapter.filmChapter);
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  const pauseVo = () => {
    audioRef.current?.pause();
    setPlaying(false);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !playing) return;
    audio.currentTime = chapterStart(chapter.filmChapter);
    void audio.play();
  }, [index, playing, chapter.filmChapter]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.muted = muted;
  }, [muted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(Math.min(ARCHIVE_CHAPTERS.length - 1, index + 1));
      if (e.key === "ArrowLeft") go(Math.max(0, index - 1));
      if (e.key === " ") {
        e.preventDefault();
        if (playing) pauseVo();
        else void playVo();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => () => audioRef.current?.pause(), []);

  const preload = useMemo(
    () => [avatar.src, next.video, NX_BY_ID[next.avatarId]?.src ?? null],
    [avatar.src, next.video, next.avatarId],
  );

  return (
    <div data-neuro-archive className="nx-root absolute inset-0 z-[55] flex flex-col bg-obsidian text-cyan">
      <audio ref={audioRef} preload="metadata" onEnded={() => setPlaying(false)} />
      {preload.map((src) => (src ? <link key={src} rel="preload" as={src.endsWith(".mp4") ? "video" : "image"} href={src} /> : null))}

      <header className="relative z-20 flex shrink-0 items-center gap-2 px-3 py-2 sm:px-4">
        <button type="button" className="h-11 px-3 font-display text-2xs tracking-[0.16em] text-cyan" onClick={onClose}>
          City
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-display text-sm font-bold tracking-[0.18em] text-cyan sm:text-base">{ARCHIVE_TITLE}</p>
          <p className="truncate font-mono text-2xs tracking-[0.14em] text-mute uppercase">{ARCHIVE_SUB} · {ARCHIVE_TAG}</p>
        </div>
        <p className="hidden font-mono text-2xs tracking-[0.14em] text-red sm:block">{CAPABILITY_LABEL[chapter.capability]}</p>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <aside className="nx-rail" aria-label="Documentary chapters">
          {ARCHIVE_CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => go(i)}
              className={cn("nx-tick", i === index && "is-on")}
            >
              <span className="nx-tick-mark">{c.mark}</span>
              <span className="nx-tick-copy">
                <span className="nx-tick-label">{c.title}</span>
                <span className="nx-tick-sub">{c.kicker}</span>
              </span>
            </button>
          ))}
        </aside>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <ChapterReel key={chapter.video} src={chapter.video} poster={chapter.still} />
          <div className="nx-veil" />
          <Portrait src={avatar.src} name={avatar.name} role={avatar.role} />
          {!playing ? (
            <button type="button" className="nx-play" onClick={() => void playVo()} aria-label="Play Agentropolis record">
              <Play className="size-8 fill-current" />
              <span>PLAY AGENTROPOLIS</span>
            </button>
          ) : null}
        </div>
      </div>

      <div className="relative z-20 flex flex-col gap-3 px-3 pb-4 pt-2 sm:max-w-2xl sm:px-5">
        <div className="nx-hud">
          <p className="font-mono text-2xs tracking-[0.2em] text-red">{chapter.mark} · {chapter.kicker}</p>
          <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-cyan sm:text-2xl">{chapter.title}</h2>
          <p className="mt-1 text-sm text-cyan">{chapter.line}</p>
          <p className="mt-2 text-xs leading-relaxed text-mute">{chapter.body[0]}</p>
          {depth === "inspect" ? (
            <>
              {chapter.body.slice(1).map((line) => (
                <p key={line} className="mt-2 text-xs leading-relaxed text-mute">{line}</p>
              ))}
              <ul className="mt-3 space-y-2">
                {chapter.evidence.map((ev) => (
                  <li key={ev.label}>
                    <span className="nx-stamp">{ev.kind}</span>
                    <span className="text-xs text-cyan">{ev.label}</span>
                    <span className="block text-2xs text-mute">{ev.note}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-2xs leading-relaxed text-mute">{ARCHIVE_THESIS}</p>
            </>
          ) : (
            <p className="mt-2 text-2xs text-mute">{ARCHIVE_QUESTION}</p>
          )}
          <p className="mt-3 font-mono text-2xs text-mute">
            {avatar.provenance} · {NX_LOCK.subject} · looping city picture + recorded testimony
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" className="nx-cta" onClick={() => (playing ? pauseVo() : void playVo())}>
            {playing ? <Pause className="size-4" /> : <Play className="size-4 fill-current" />}
            {playing ? "PAUSE RECORD" : "PLAY RECORD"}
          </button>
          <button type="button" className="nx-cta is-ghost" onClick={() => setMuted((v) => !v)} aria-label={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
          </button>
          <button type="button" className="nx-cta is-ghost" onClick={() => setDepth(depth === "summary" ? "inspect" : "summary")}>
            {depth === "summary" ? "INSPECT" : "SUMMARY"}
          </button>
          {chapter.id === "stack" ? (
            <button type="button" className="nx-cta is-ghost" onClick={onWorld}>
              ENTER WORLD STACK
            </button>
          ) : (
            <button type="button" className="nx-cta is-ghost" onClick={onCity}>
              ENTER THE CITY
            </button>
          )}
          {index < ARCHIVE_CHAPTERS.length - 1 ? (
            <button type="button" className="nx-cta is-ghost" onClick={() => go(index + 1)}>
              NEXT CHAPTER
            </button>
          ) : null}
        </div>

        <div className="nx-states" aria-label="Approved identity states">
          {NX_AVATARS.map((a) => (
            <button
              key={a.id}
              type="button"
              className={cn("nx-state", a.id === avatar.id && "is-on")}
              onClick={() => {
                const hit = ARCHIVE_CHAPTERS.findIndex((c) => c.avatarId === a.id);
                if (hit >= 0) go(hit);
              }}
            >
              <img src={a.src} alt="" />
              <span>{a.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChapterReel({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.playsInline = true;
    const play = () => {
      void el.play().catch(() => undefined);
    };
    play();
    const onVis = () => {
      if (document.hidden) el.pause();
      else play();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      el.pause();
    };
  }, [src]);
  return (
    <video
      ref={ref}
      className="nx-video"
      src={src}
      poster={poster}
      loop
      muted
      playsInline
      autoPlay
      preload="auto"
    />
  );
}

function Portrait({ src, name, role }: { src: string; name: string; role: string }) {
  const card = useRef<HTMLDivElement>(null);
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = card.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 10;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -8;
    el.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
  };
  const reset = () => {
    if (card.current) card.current.style.transform = "rotateY(0deg) rotateX(0deg)";
  };
  return (
    <div className="nx-stage" onPointerMove={onMove} onPointerLeave={reset}>
      <div ref={card} className="nx-card">
        <img src={src} alt={name} />
        <p className="nx-card-meta">
          <span>{name}</span>
          <em>{role}</em>
        </p>
      </div>
    </div>
  );
}
