import React, { useState } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler"; 
import TarjetaNoticia_temp from "./TarjetaNoticia_temp";
import { colores, tamanosTexto, espaciado } from "../configuracion/colores";

export default function ListaNoticiasVertical({
  noticias,
  estaGuardada,
  alCambiarGuardado,
  alVerDetalle
}) {
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
    <FlatList
      data={listaNoticias}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <PanGestureHandler
          onGestureEvent={(event) => {
            if (event.nativeEvent.translationX > 100 || event.nativeEvent.translationX < -100) {
              moverAlFinal(item);
            }
          }}
        >
          <View style={estilos.contenedorItem}>
            <TarjetaNoticia_temp
              noticia={item}
              estaGuardada={estaGuardada(item)}
              alCambiarGuardado={alCambiarGuardado}
              alVerDetalle={() => alVerDetalle(item)}
            />
          </View>
        </PanGestureHandler>
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
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
