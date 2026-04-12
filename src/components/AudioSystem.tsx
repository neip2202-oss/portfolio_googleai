import React, { useState, useEffect, useRef } from 'react';

// Default BGM (can be overridden by Supabase later)
const DEFAULT_BGM_URL = 'https://cdn.pixabay.com/download/audio/2022/02/10/audio_fc8b4bc82e.mp3?filename=retro-platform-puzzle-melody-87140.mp3';

const AudioSystem: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio(DEFAULT_BGM_URL);
    audio.loop = true;
    audio.volume = 0.3; // Default volume
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button
      className="audio-toggle"
      onClick={toggleAudio}
      title={isPlaying ? "Mute BGM" : "Play BGM"}
    >
      {isPlaying ? '🔊' : '🔇'}
    </button>
  );
};

export default AudioSystem;
