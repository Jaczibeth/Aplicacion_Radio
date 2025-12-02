import React, { useContext } from "react";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { AudioContext } from "../../context/AudioContext";
import { Ionicons } from "@expo/vector-icons";

const AUDIO_URI = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export default function AudioPlayerScreen() {
  const { isPlaying, playAudio, pauseAudio, changeVolume } = useContext(AudioContext);

  const togglePlayback = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio(AUDIO_URI);
    }
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.headerBlur} />
      <Image
        source={{
          uri: "https://i.pinimg.com/736x/4d/a4/25/4da425f85097ffb95f871d1a576db8fb.jpg",
        }}
        style={styles.coverArt}
      />

      
      <Text style={styles.title}>World News</Text>
      <Text style={styles.subtitle}>Radio en Vivo - México</Text>

    
      <TouchableOpacity style={styles.playButton} onPress={togglePlayback}>
        <Ionicons
          name={isPlaying ? "pause" : "play"}
          size={48}
          color="#fff"
        />
      </TouchableOpacity>

     
      <Text style={styles.smallText}>Volumen</Text>
      <Slider
        style={{ width: 280, height: 40 }}
        minimumValue={0}
        maximumValue={1}
        value={0.5}
        onValueChange={changeVolume}
        minimumTrackTintColor="#5accff"
        maximumTrackTintColor="#ffffffff"
        thumbTintColor="#1daeb9ff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d3370",  justifyContent: "center", alignItems: "center", paddingHorizontal: 20,},
  headerBlur: {position: "absolute", top: 0,left: 0, right: 0,height: 300, backgroundColor: "#336ecc55", borderBottomLeftRadius: 100, borderBottomRightRadius: 100,opacity: 0.4,},
  coverArt: { width: 280, height: 280, borderRadius: 20, marginBottom: 30, shadowColor: "#676565ff", shadowOpacity: 0.5, shadowOffset: { width: 0, height: 8 }, shadowRadius: 12,},
  title: { fontSize: 26,fontWeight: "bold",color: "#fff",marginBottom: 6,textAlign: "center",},
  subtitle: {fontSize: 16,color: "#b3b3b3",marginBottom: 30,textAlign: "center",},
  playButton: { width: 90, height: 90, backgroundColor: "#b9471d63", borderRadius: 50, justifyContent: "center", alignItems: "center", marginBottom: 40, shadowColor: "#b91d1d7a", shadowOpacity: 0.6, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10,},
  smallText: { color: "#fff", marginBottom: 10,  fontSize: 14, },
});
