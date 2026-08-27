import { useState, useEffect, useRef, useCallback } from 'react';

export function useAudioPlayer(customAudioSrc = '/music/song.mp3') {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(() => {
    return parseFloat(localStorage.getItem('amrita_audio_volume') || '0.7');
  });
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(true);
  const [trackTitle, setTrackTitle] = useState('Mere Nishan');
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [audioError, setAudioError] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio();
    audio.src = customAudioSrc;
    audio.loop = isLooping;
    audio.preload = 'auto';
    audio.volume = volume;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setAudioError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleError = (e) => {
      console.warn('[AudioPlayer] Audio loading error for:', customAudioSrc, e);
      setAudioError(true);
    };

    const handleEnded = () => {
      if (!audio.loop) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);
    audio.addEventListener('ended', handleEnded);

    audioRef.current = audio;

    // Attempt Autoplay on load
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(false); // require user interaction for full active status or start
          setIsPlaying(true);
          setAutoplayBlocked(false);
          console.log('[AudioPlayer] Autoplay started successfully for Mere Nishan');
        })
        .catch(() => {
          console.log('[AudioPlayer] Autoplay prevented by browser, waiting for user click/tap...');
          setAutoplayBlocked(true);

          const handleFirstInteraction = () => {
            if (audioRef.current) {
              audioRef.current.play()
                .then(() => {
                  setIsPlaying(true);
                  setAutoplayBlocked(false);
                  console.log('[AudioPlayer] Unlocked audio playback on user gesture!');
                })
                .catch((err) => console.warn('[AudioPlayer] User gesture play error:', err));
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
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
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
        .then(() => {
          setIsPlaying(true);
          setAutoplayBlocked(false);
        })
        .catch((err) => console.warn('[AudioPlayer] Toggle play error:', err));
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
    localStorage.setItem('amrita_audio_volume', newVol.toString());
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  }, []);

  const seek = useCallback((newTime) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  }, []);

  const toggleLoop = useCallback(() => {
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    if (audioRef.current) {
      audioRef.current.loop = nextLoop;
    }
  }, [isLooping]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return {
    isPlaying,
    isMuted,
    volume,
    currentTime,
    duration,
    isLooping,
    trackTitle,
    autoplayBlocked,
    audioError,
    formatTime,
    togglePlay,
    toggleMute,
    changeVolume,
    seek,
    toggleLoop,
    startAudio: () => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setAutoplayBlocked(false);
          })
          .catch((err) => console.warn('[AudioPlayer] Start audio error:', err));
      }
    },
  };
}
