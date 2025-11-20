import React, { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function NotificacionFondo({ visible, onHide }) {
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);
  return (
    <Animated.View
      style={[
        estilos.contenedor,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={estilos.notificacion}>
        <Text style={estilos.texto}>
          La aplicacion detectó Funciones en segundo plano.
        </Text>
      </View>
    </Animated.View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  notificacion: {
    backgroundColor: "#2a2a2a",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  texto: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
});
