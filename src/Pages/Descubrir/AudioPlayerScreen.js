// AudioPlayerScreen limpio: un único componente
import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Platform,
} from "react-native";
import { Audio } from "expo-av";
import * as Notifications from "expo-notifications";

const AUDIO_URI = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export default function AudioPlayerScreen() {
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);

  const solicitarPermisos = async () => {
    try {
      const notifPerm = await Notifications.requestPermissionsAsync();
      setHasNotificationPermission(notifPerm.status === "granted");
    } catch (err) {
      console.warn("Error solicitando permisos de notificación:", err);
      setHasNotificationPermission(false);
    }
  };

  useEffect(() => {
    solicitarPermisos();

    if (Platform.OS === "android" && Notifications.setNotificationChannelAsync) {
      Notifications.setNotificationChannelAsync("audio-channel", {
        name: "Audio channel",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync && soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    };
  }, []);

  const togglePlayback = async () => {
    try {
      if (isPlaying) {
        // Pausar
        if (soundRef.current) {
          await soundRef.current.pauseAsync();
          setIsPlaying(false);
          if (hasNotificationPermission) {
            await Notifications.scheduleNotificationAsync({ content: { title: "Pausa", body: "La reproducción está en pausa." }, trigger: null });
          }
        }
      } else {
        // Reproducir
        if (!soundRef.current) {
          const { sound } = await Audio.Sound.createAsync({ uri: AUDIO_URI }, { shouldPlay: true });
          soundRef.current = sound;
        } else {
          await soundRef.current.playAsync();
        }
        setIsPlaying(true);
        if (hasNotificationPermission) {
          await Notifications.scheduleNotificationAsync({ content: { title: "La Tlaxaqueña", body: "Reproduciendo ahora." }, 
            trigger: null });
        }
      }
    } catch (error) {
      console.error("Error al controlar la reproducción:", error);
      Alert.alert("Error", "No se pudo controlar la reproducción.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={{ uri: "https://img.icons8.com/fluency/96/000000/microphone.png" }} style={styles.image} />
        <Text style={styles.title}>Reproductor simulado</Text>
        <Text style={styles.subtitle}>La Tlaxaqueña</Text>

        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={togglePlayback}>
            <Text style={styles.buttonText}>{isPlaying ? "Pausa" : "Play"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.perms}>
          <Text>Permisos Notif.: {hasNotificationPermission ? "Si" : "No"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" },
  card: { width: "86%", backgroundColor: "white", padding: 20, borderRadius: 14, alignItems: "center", elevation: 4 },
  image: { width: 120, height: 120, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#666", marginBottom: 16 },
  controls: { flexDirection: "row", width: "100%", justifyContent: "space-around", marginTop: 8 },
  button: { backgroundColor: "#3178c6", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: "white", fontWeight: "700" },
  perms: { marginTop: 16, width: "100%", alignItems: "center" },
});
