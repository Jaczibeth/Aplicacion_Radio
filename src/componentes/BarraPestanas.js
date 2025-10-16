import React, { useRef, useEffect, useState } from "react";
import {Text, TouchableOpacity, FlatList, StyleSheet, View,Animated,} from "react-native";
import { LISTA_PESTANAS } from "../configuracion/constantes";
import {colores,tamanosTexto, espaciado, bordesRedondeados,} from "../configuracion/colores";

export default function BarraPestanas({ pestanaActiva, alCambiarPestana }) {
  const [layouts, setLayouts] = useState({});
  const indicadorX = useRef(new Animated.Value(0)).current;
  const indicadorWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const index = LISTA_PESTANAS.findIndex((item) => item === pestanaActiva);
    const layout = layouts[pestanaActiva];
    if (layout) {
      Animated.parallel([
        Animated.spring(indicadorX, {
          toValue: layout.x,
          useNativeDriver: false,
        }),
        Animated.spring(indicadorWidth, {
          toValue: layout.width,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [pestanaActiva, layouts]);

  const handleLayout = (item, event) => {
    const { x, width } = event.nativeEvent.layout;
    setLayouts((prev) => ({ ...prev, [item]: { x, width } }));
  };

  return (
    <View style={estilos.contenedor}>
      <FlatList
        data={LISTA_PESTANAS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => {
          const esActivo = pestanaActiva === item;
          return (
            <TouchableOpacity
              onLayout={(event) => handleLayout(item, event)}
              onPress={() => alCambiarPestana(item)}
              activeOpacity={0.7}
              style={[
                estilos.pestana,
                esActivo && estilos.pestanaActiva,
              ]}
            >
              <Text
                style={[
                  estilos.textoPestana,
                  esActivo && estilos.textoPestanaActiva,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <Animated.View
        style={[
          estilos.indicador,
          {
            transform: [{ translateX: indicadorX }],
            width: indicadorWidth,
          },
        ]}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    backgroundColor: colores.fondoBlanco,
    paddingVertical: espaciado.normal,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  lista: {
    paddingHorizontal: espaciado.pequeno,
  },
  pestana: {
    paddingVertical: espaciado.pequeno,
    paddingHorizontal: espaciado.mediano,
    backgroundColor: colores.pestanaInactiva,
    borderRadius: bordesRedondeados.completo,
    marginRight: espaciado.minimo + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  pestanaActiva: {
    backgroundColor: colores.pestanaActiva,
  },
  textoPestana: {
    fontSize: tamanosTexto.pequeno,
    color: colores.textoGris,
    fontWeight: "600",
  },
  textoPestanaActiva: {
    color: colores.textoBlanc,
    fontWeight: "700",
  },
  indicador: {
    position: "absolute",
    height: 3,
    backgroundColor: colores.pestanaActiva,
    bottom: 6,
    borderRadius: 2,
  },
});