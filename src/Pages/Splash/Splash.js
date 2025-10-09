import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image, Animated } from "react-native";

export default function Splash({ navigation }) {
  const progress = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de la barra de carga
    Animated.timing(progress, {
      toValue: 1,
      duration: 4000, // 4 segundos
      useNativeDriver: false,
    }).start(() => {
      navigation.replace("Home");
    });

    // Animación de la imagen
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // ancho de la barra
  const widthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.container}>
      {/* Logo animado */}
      <Animated.View style={{ transform: [{ scale }] }}>
        <Image
          source={require("../../../assets/Logos/nt-el-reloj.gif")}
          style={styles.logo}
        />
      </Animated.View>

      {/* Barra de carga */}
      <View style={styles.progressBar}>
        <Animated.View
          style={[styles.progressFill, { width: widthInterpolated }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
    marginBottom: 50,
  },
  progressBar: {
    width: "100%",
    height: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#1e90ff",
  },
});