import React, { createContext, useState, useRef } from "react";
import { Audio } from "expo-av";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const playAudio = async (uri) => {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          { shouldPlay: true, volume }
        );
        soundRef.current = sound;
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(true);
    } catch (error) {
      console.error("Error al reproducir:", error);
    }
  };

  const pauseAudio = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const changeVolume = async (value) => {
    setVolume(value);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(value);
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, playAudio, pauseAudio, changeVolume }}>
      {children}
    </AudioContext.Provider>
  );
};
