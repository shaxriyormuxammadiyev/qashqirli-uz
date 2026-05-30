import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

export function AudioPlayer({
  src,
  variant = "light",
}: {
  src: string;
  variant?: "light" | "dark";
}) {
  const ref = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    const onTime = () => {
      setTime(a.currentTime);
      setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0);
    };
    const onMeta = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [src]);

  const toggle = () => {
    const a = ref.current;
    if (!a) return;
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const fmt = (s: number) => {
    if (!isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const trackBg = variant === "dark" ? "bg-white/20" : "bg-brand/15";
  const trackFg = variant === "dark" ? "bg-white" : "bg-brand";
  const btn =
    variant === "dark"
      ? "bg-white text-brand"
      : "bg-brand text-brand-foreground";

  return (
    <div className="flex items-center gap-3 w-full">
      <audio ref={ref} src={src} preload="metadata" />
      <button
        type="button"
        onClick={toggle}
        className={`size-12 rounded-full grid place-items-center hover:scale-105 transition ${btn}`}
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? <Pause className="size-5" /> : <Play className="size-5 fill-current" />}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`h-1.5 rounded-full overflow-hidden ${trackBg}`}>
          <div className={`h-full ${trackFg}`} style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-xs mt-1 opacity-75">
          <span>{fmt(time)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>
    </div>
  );
}
