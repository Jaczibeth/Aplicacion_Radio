import React, { useEffect, useRef } from "react";
import { View, Image, Animated } from "react-native";
import { estilos } from "./estilos";

export default function PantallaCarga({ navigation }) {
  const escalaLogo = useRef(new Animated.Value(0)).current;
  const punto1 = useRef(new Animated.Value(0)).current;
  const punto2 = useRef(new Animated.Value(0)).current;
  const punto3 = useRef(new Animated.Value(0)).current;
  const punto4 = useRef(new Animated.Value(0)).current;
  const punto5 = useRef(new Animated.Value(0)).current;
  const punto6 = useRef(new Animated.Value(0)).current;
  const salidaPantalla = useRef(new Animated.Value(1)).current;

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
          Animated.timing(punto1, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(punto1, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([ 
          Animated.timing(punto2, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(punto2, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([ 
          Animated.timing(punto3, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(punto3, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
    setTimeout(() => {
      Animated.timing(salidaPantalla, {
        toValue: 0,
        duration: 1, 
        useNativeDriver: true,
      }).start(() => {
        navigation.replace("Inicio");
      });
    }, 3500);
  }, [navigation]);

  return (
    <Animated.View style={[estilos.contenedor, { opacity: salidaPantalla }]}>
     
      <Image
        source={require("../../assets/Logos/NTRELOJ.gif")} // Tu imagen
        style={[estilos.logo, { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }]}
      />
      <View style={[estilos.contenedorPuntos, { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -30 }, { translateY: -30 }] }]}>
        <Animated.View style={[estilos.punto, { opacity: punto1, margin: 5 }]} />
        <Animated.View style={[estilos.punto, { opacity: punto2, margin: 5 }]} />
        <Animated.View style={[estilos.punto, { opacity: punto3, margin: 5 }]} />
        <Animated.View style={[estilos.punto, { opacity: punto4, margin: 5 }]} />
        <Animated.View style={[estilos.punto, { opacity: punto5, margin: 5 }]} />
        <Animated.View style={[estilos.punto, { opacity: punto6, margin: 5 }]} />
      </View>
    </Animated.View>
  );
}
