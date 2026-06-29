// src/components/ui/MusicPlayer.jsx
import { useMusic } from '../../lib/MusicContext';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

function formatTime(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60).toString().padStart(2, '0');
  return `${m}:${sec}`;
}

export default function MusicPlayer({ src, title, compact = false }) {
  const music = useMusic();

  const isThisTrack = music.src === src;
  const isPlaying   = isThisTrack && music.playing;

  function handleToggle() {
    if (isThisTrack) {
      music.toggle();
    } else {
      music.play(src, title);
    }
  }

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-rose/40 text-wine hover:bg-rose/20 transition-all text-sm"
        title={isPlaying ? 'Pause music' : 'Play music'}
      >
        {isPlaying
          ? <Pause size={14} className="text-petal-500" />
          : <Play  size={14} className="text-petal-500" />
        }
        <Music size={13} className="opacity-60" />
        <span className="font-sans truncate max-w-[120px]">{title || 'Song'}</span>
      </button>
    );
  }

  return (
    <div className="glass rounded-2xl p-4 shadow-glass border border-rose/30">
      {/* Track info */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-petal-300 to-petal-500 flex items-center justify-center flex-shrink-0 ${isPlaying ? 'animate-spin' : ''}`}
             style={{ animationDuration: '4s' }}>
          <Music size={16} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-serif text-sm font-semibold text-wine truncate">{title || 'Our Song'}</p>
          <p className="text-xs text-dusty font-sans">
            {formatTime(isThisTrack ? music.currentTime : 0)} / {formatTime(isThisTrack ? music.duration : 0)}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <input
        type="range"
        min={0}
        max={isThisTrack ? music.duration || 1 : 1}
        value={isThisTrack ? music.currentTime : 0}
        onChange={(e) => isThisTrack && music.seek(Number(e.target.value))}
        className="w-full mb-3 accent-petal-500"
      />

      {/* Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className="w-9 h-9 rounded-full bg-gradient-to-br from-petal-400 to-petal-600 text-white flex items-center justify-center shadow-petal hover:scale-105 active:scale-95 transition-transform"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
        </button>

        {/* Volume */}
        <button
          onClick={() => music.setVolume(music.volume > 0 ? 0 : 0.6)}
          className="text-dusty hover:text-wine transition-colors"
        >
          {music.volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <input
          type="range"
          min={0} max={1} step={0.01}
          value={music.volume}
          onChange={(e) => music.setVolume(Number(e.target.value))}
          className="flex-1 accent-petal-400"
        />
      </div>
    </div>
  );
}
