
import React, { useRef, useState } from "react";
import { View, FlatList, StyleSheet, Text, Dimensions, Animated } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler"; // ✅ Importamos para swipe
import TarjetaNoticia_temp from "./TarjetaNoticia_temp";
import { colores, espaciado, tamanosTexto } from "../configuracion/colores";

const { width } = Dimensions.get("window");

export default function ListaNoticias({ noticias, alVerDetalle }) {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [listaNoticias, setListaNoticias] = useState(noticias);

  if (!listaNoticias || listaNoticias.length === 0) {
    return (
      <View style={estilos.contenedorVacio}>
        <Text style={estilos.textoVacio}>No hay noticias disponibles</Text>
      </View>
    );
  }

  const moverAlFinal = (item) => {
    setListaNoticias((prev) => {
      const nuevaLista = prev.filter((n) => n.id !== item.id);
      return [...nuevaLista, item];
    });
  };

  return (
    <View>
      <Animated.FlatList
        data={listaNoticias}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={width * 0.8 + espaciado.normal}
        decelerationRate="fast"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={estilos.lista}
        renderItem={({ item }) => (
          <PanGestureHandler
            onGestureEvent={(event) => {
              if (event.nativeEvent.translationX > 100 || event.nativeEvent.translationX < -100) {
                moverAlFinal(item);
              }
            }}
          >
            <View style={{ width: width * 0.8, marginRight: espaciado.normal }}>
              <TarjetaNoticia_temp
                noticia={item}
                alVerDetalle={(noticiaActual) => alVerDetalle(noticiaActual)}
              />
            </View>
          </PanGestureHandler>
        )}
      />

      {/* Puntitos animados */}
      <View style={estilos.puntitos}>
        {listaNoticias.map((_, i) => {
          const inputRange = [(i - 1) * width * 0.8, i * width * 0.8, (i + 1) * width * 0.8];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return <Animated.View key={i.toString()} style={[estilos.dot, { width: dotWidth, opacity }]} />;
        })}
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  lista: {
    paddingHorizontal: espaciado.normal,
    paddingVertical: espaciado.pequeno,
  },
  puntitos: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: espaciado.pequeno,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#333",
    marginHorizontal: 4,
  },
  contenedorVacio: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: espaciado.enorme,
  },
  textoVacio: {
    fontSize: tamanosTexto.mediano,
    color: colores.textoGris,
    textAlign: "center",
  },
});
