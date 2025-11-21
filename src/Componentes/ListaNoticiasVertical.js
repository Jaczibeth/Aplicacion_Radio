import React from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import TarjetaNoticia from "./TarjetaNoticia";
import { colores, tamanosTexto, espaciado } from "../configuracion/colores";

export default function ListaNoticiasVertical({
  noticias,
  estaGuardada,
  alCambiarGuardado,
  alVerDetalle
})
 {
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
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={estilos.contenedorItem}>
          <TarjetaNoticia
            noticia={item}
            estaGuardada={estaGuardada(item)}
            alCambiarGuardado={alCambiarGuardado}
            alVerDetalle={() => alVerDetalle(item)}
          />
        </View>
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
