import React, { useEffect, useRef } from "react";
import { View, Image, Animated, Dimensions } from "react-native";
import { estilos } from "./estilos";

export default function PantallaCarga({ navigation }) {
  const escalaLogo = useRef(new Animated.Value(0)).current;
  const punto1 = useRef(new Animated.Value(0)).current;
  const punto2 = useRef(new Animated.Value(0)).current;
  const punto3 = useRef(new Animated.Value(0)).current;
  const salidaPantalla = useRef(new Animated.Value(1)).current;

  const pantalla = Dimensions.get("window");

  const tamañoLogo = pantalla.width * 1; 
  const tamañoPunto = 16; 
  const espacioPuntos = 8; 

  useEffect(() => {
    Animated.spring(escalaLogo, {
      toValue: 1,
      useNativeDriver: true,
      friction: 3,
      tension: 40,
    }).start();

    Animated.loop(
      Animated.stagger(300, [
        Animated.sequence([
          Animated.timing(punto1, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(punto1, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(punto2, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(punto2, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(punto3, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(punto3, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
      ])
    ).start();

    setTimeout(() => {
      Animated.timing(salidaPantalla, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        navigation.replace("Inicio");
      });
    }, 3500);
  }, [navigation]);

  const puntos = [punto1, punto2, punto3];

  return (
    <Animated.View style={[estilos.contenedor, { opacity: salidaPantalla }]}>
      
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.Image
          source={require("../../assets/Logos/Logo_noticias1.png")}
          style={{
            width: tamañoLogo,
            height: tamañoLogo,
            resizeMode: "contain",
            transform: [{ scale: escalaLogo }],
          }}
        />

        <View style={{ flexDirection: "row", marginTop: 20 }}>
          {puntos.map((p, i) => (
            <Animated.View
              key={i}
              style={{
                width: tamañoPunto,
                height: tamañoPunto,
                borderRadius: tamañoPunto / 2,
                backgroundColor: "#144784",
                opacity: p,
                marginHorizontal: espacioPuntos,
              }}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}
