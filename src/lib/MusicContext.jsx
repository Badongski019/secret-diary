// src/lib/MusicContext.jsx
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const MusicContext = createContext(null);

export function MusicProvider({ children }) {
  const audioRef = useRef(new Audio());
  const [src,     setSrc]     = useState(null);
  const [playing, setPlaying] = useState(false);
  const [volume,  setVolume]  = useState(0.6);
  const [title,   setTitle]   = useState('');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration,    setDuration]    = useState(0);

  const audio = audioRef.current;

  // Keep volume in sync
  useEffect(() => { audio.volume = volume; }, [volume]);

  // Load new src
  useEffect(() => {
    if (!src) return;
    audio.src = src;
    audio.load();
    if (playing) audio.play().catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  // Sync time/duration
  useEffect(() => {
    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnd  = () => setPlaying(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('ended', onEnd);
    return () => {
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('ended', onEnd);
    };
  }, []);

  function play(newSrc, newTitle) {
    if (newSrc && newSrc !== audio.src) {
      audio.src = newSrc;
      audio.load();
      setTitle(newTitle || '');
      setSrc(newSrc);
    }
    audio.play().catch(() => {});
    setPlaying(true);
  }

  function pause() {
    audio.pause();
    setPlaying(false);
  }

  function toggle() {
    playing ? pause() : play();
  }

  function seek(t) {
    audio.currentTime = t;
    setCurrentTime(t);
  }

  return (
    <MusicContext.Provider value={{ src, playing, volume, title, currentTime, duration, play, pause, toggle, seek, setVolume }}>
      {children}
    </MusicContext.Provider>
  );
}

export const useMusic = () => useContext(MusicContext);
