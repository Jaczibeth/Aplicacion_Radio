import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Platform } from "react-native";
import { Text, Card } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";

const AUDIO_URI = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export default function AudioPlayerScreen() {
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const soundRef = useRef(null);


  const solicitarPermisos = async () => {
    try {
      const notif = await Notifications.requestPermissionsAsync();
      setHasNotificationPermission(notif.status === "granted");
    } catch (err) {
      console.warn("Error permisos:", err);
    }
  };

  useEffect(() => {
    solicitarPermisos();

    if (Platform.OS === "android" && Notifications.setNotificationChannelAsync) {
      Notifications.setNotificationChannelAsync("audio-channel", {
        name: "Audio",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  
  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      } else {
        if (!soundRef.current) {
          const { sound } = await Audio.Sound.createAsync(
            { uri: AUDIO_URI },
            { shouldPlay: true, volume: volume }
          );
          soundRef.current = sound;
        } else {
          await soundRef.current.playAsync();
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };


  const changeVolume = async (value) => {
    setVolume(value);
    if (soundRef.current) {
      await soundRef.current.setVolumeAsync(value);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.headerBlur} />

      <Card style={styles.card}>
        {/* Carátula */}
        <Image
          source={{ uri: "data:image/png;base64,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" }}
          style={styles.coverArt}
        />

        <Text style={styles.title}>La Tlaxaqueña</Text>
        <Text style={styles.subtitle}>Radio en Vivo – México</Text>

        {/* Botón circular */}
        <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
          <Text style={styles.playButtonText}>{isPlaying ? "❚❚" : "▶"}</Text>
        </TouchableOpacity>

        <Text style={styles.smallText}>Volumen</Text>

   

        <Text style={styles.permsText}>
          Notificaciones: {hasNotificationPermission ? "✔ Permitidas" : "✖ No permitidas"}
        </Text>

      </Card>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0d7d7ff",
    justifyContent: "center",
    alignItems: "center",
  },

  headerBlur: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: 260,
    backgroundColor: "#1db95455",
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
    opacity: 0.3,
  },

  card: {
    width: "85%",
    backgroundColor: "#e9e1e1ff",
    padding: 25,
    borderRadius: 20,
    alignItems: "center",
  },

  coverArt: {
    width: 250,
    height: 250,
    borderRadius: 14,
    marginBottom: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 15,
    color: "#b3b3b3",
    marginBottom: 30,
  },

  playButton: {
    width: 90,
    height: 90,
    backgroundColor: "#1db954",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  playButtonText: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "bold",
  },

  smallText: {
    color: "#e0e0e0",
    marginBottom: 10,
  },

  permsText: {
    color: "#8c8c8c",
    marginTop: 10,
  },
});
