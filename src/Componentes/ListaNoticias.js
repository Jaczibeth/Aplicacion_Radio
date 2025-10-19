import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import TarjetaNoticia from "./TarjetaNoticia";
import { espaciado, colores, tamanosTexto } from "../configuracion/colores";

export default function ListaNoticias({ 
  noticias, 
  estaGuardada, 
  alCambiarGuardado, 
  alVerDetalle 
}) {
  if (!noticias || noticias.length === 0) {
    return (
      <View style={estilos.contenedorVacio}>
        <Text style={estilos.textoVacio}>No hay noticias disponibles</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={noticias}
      keyExtractor={(item) => item.id.toString()} // Clave única para cada noticia
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={estilos.contenedor}
      renderItem={({ item }) => (
        <View style={estilos.contenedorTarjeta} key={item.id}> 
          <TarjetaNoticia
            noticia={item}
            estaGuardada={estaGuardada(item)}
            alCambiarGuardado={alCambiarGuardado}
            alVerDetalle={() => alVerDetalle(item)}
          />
        </View>
      )}
    />
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    paddingHorizontal: espaciado.normal,
    paddingVertical: espaciado.pequeno,
  },
  contenedorTarjeta: {
    width: 320,
    marginRight:135, 
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
