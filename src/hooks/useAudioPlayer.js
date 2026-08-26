import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioPlayer(customAudioSrc = '/music/song.mp3') {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.6);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [trackTitle, setTrackTitle] = useState("Mere Nishan — Amrita's Theme");

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = customAudioSrc;
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = volume;

    const handleCanPlay = () => {
      setAudioLoaded(true);
      setTrackTitle("Mere Nishan — Amrita's Theme");
    };

    const handleError = (e) => {
      console.warn("[AudioPlayer] HTML5 audio error for:", customAudioSrc, e);
      setAudioLoaded(true);
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);

    audioRef.current = audio;

    // Attempt Autoplay on load
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          console.log("[AudioPlayer] Autoplay started successfully for Mere Nishan.mp3");
        })
        .catch(() => {
          // Autoplay blocked by browser policy -> wait for first user gesture
          console.log("[AudioPlayer] Autoplay prevented by browser, waiting for user click/tap...");
          
          const handleFirstInteraction = () => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  console.log("[AudioPlayer] Unlocked audio playback on user gesture!");
                })
                .catch((err) => console.warn("[AudioPlayer] User interaction play error:", err));
            }
            window.removeEventListener('pointerdown', handleFirstInteraction);
            window.removeEventListener('click', handleFirstInteraction);
            window.removeEventListener('touchstart', handleFirstInteraction);
          };

          window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
          window.addEventListener('click', handleFirstInteraction, { once: true });
          window.addEventListener('touchstart', handleFirstInteraction, { once: true });
        });
    }

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [customAudioSrc]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn("[AudioPlayer] Toggle play error:", err));
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);

    if (audioRef.current) {
      audioRef.current.muted = nextMute;
    }
  }, [isMuted]);

  const changeVolume = useCallback((newVol) => {
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  }, []);

  return {
    isPlaying,
    isMuted,
    volume,
    audioLoaded,
    trackTitle,
    togglePlay,
    toggleMute,
    changeVolume,
    startAudio: () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.warn("[AudioPlayer] Start audio error:", err));
      }
    }
  };
}
