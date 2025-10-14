import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Text } from "react-native";
import { DURACION_ANIMACION } from "../../configuracion/constantes";
import { estilos } from "./estilos";

/**
 * PANTALLA DE CARGA (SPLASH)
 */
export default function PantallaCarga({ navigation }) {
  const progreso = useRef(new Animated.Value(0)).current;
  const escala = useRef(new Animated.Value(1)).current;
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Animación de la barra de progreso
    Animated.timing(progreso, {
      toValue: 1,
      duration: DURACION_ANIMACION.SPLASH,
      useNativeDriver: false,
    }).start(() => {
      // Navegar a Inicio cuando la animación termine
      navigation.replace("Inicio");
    });

    // Navegación después del tiempo de splash + 500ms
    timeoutRef.current = setTimeout(() => {
      navigation.replace("Inicio");
    }, DURACION_ANIMACION.SPLASH + 500);

    // Animación del logo (pulso)
    Animated.loop(
      Animated.sequence([
        Animated.timing(escala, {
          toValue: 1.1,
          duration: DURACION_ANIMACION.MEDIA,
          useNativeDriver: true,
        }),
        Animated.timing(escala, {
          toValue: 1,
          duration: DURACION_ANIMACION.MEDIA,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Detener animaciones
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      progreso.stopAnimation && progreso.stopAnimation();
      escala.stopAnimation && escala.stopAnimation();
    };
  }, [navigation, progreso, escala]);

  // Ancho de la barra
  const anchoBarra = progreso.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={estilos.contenedor}>
      {/* Logo animado */}
      <Animated.View style={[estilos.contenedorLogo, { transform: [{ scale: escala }] }]}>
        <Image
          source={require("../../../assets/Logos/nt-el-reloj.gif")}
          style={estilos.logo}
        />
      </Animated.View>

      {/* Nombre de la app */}
      <Text style={estilos.nombreApp}>LA TLAXIAQUEÑA</Text>
      <Text style={estilos.subtitulo}>Noticias de tu región</Text>

      {/* Barra de progreso */}
      <View style={estilos.contenedorBarra}>
        <Animated.View
          style={[estilos.barraCarga, { width: anchoBarra }]}
        />
      </View>
    </View>
  );
}
