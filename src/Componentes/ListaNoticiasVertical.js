import React, { useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Text, Animated } from "react-native";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import TarjetaNoticia_temp from "./TarjetaNoticia_temp";
import { colores, tamanosTexto, espaciado } from "../configuracion/colores";

export default function ListaNoticiasVertical({ noticias, estaGuardada, alCambiarGuardado, alVerDetalle }) {
  const [listaNoticias, setListaNoticias] = useState(noticias);

  const moverAlFinal = useCallback((item) => {
    setListaNoticias((prev) => {
      const nuevaLista = prev.filter((n) => n.id !== item.id);
      return [...nuevaLista, item];
    });
  }, []);

  const renderItem = useCallback(({ item }) => {
    const translateX = new Animated.Value(0);
    const opacity = new Animated.Value(1);

    const onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: translateX } }],
      { useNativeDriver: true }
    );

    const onHandlerStateChange = (event) => {
      if (event.nativeEvent.state === State.END) {
        const desplazamiento = event.nativeEvent.translationX;
        if (Math.abs(desplazamiento) > 100) {
          // ✅ Animación de salida
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: desplazamiento > 0 ? 500 : -500,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            moverAlFinal(item);
          });
        } else {
        
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    };

    return (
      <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
        <Animated.View style={[estilos.contenedorItem, { transform: [{ translateX }], opacity }]}>
          <TarjetaNoticia_temp
            noticia={item}
            estaGuardada={estaGuardada(item)}
            alCambiarGuardado={alCambiarGuardado}
            alVerDetalle={() => alVerDetalle(item)}
          />
        </Animated.View>
      </PanGestureHandler>
    );
  }, [moverAlFinal, estaGuardada, alCambiarGuardado, alVerDetalle]);

  if (!listaNoticias || listaNoticias.length === 0) {
    return (
      <View style={estilos.contenedorVacio}>
        <Text style={estilos.textoVacio}>No hay noticias disponibles</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={listaNoticias}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      initialNumToRender={6}
      windowSize={10}
      removeClippedSubviews={true}
    />
  );
}

const estilos = StyleSheet.create({
  contenedorItem: {
    marginBottom: espaciado.pequeno,
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
