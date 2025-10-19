import React from "react";
import { Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { LISTA_PESTANAS } from "../configuracion/constantes";
import { colores, tamanosTexto, espaciado, bordesRedondeados } from "../configuracion/colores";
export default function BarraPestanas({ pestanaActiva, alCambiarPestana }) {
  return (
    <FlatList
      data={LISTA_PESTANAS}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      contentContainerStyle={estilos.contenedor}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            estilos.pestana,
            pestanaActiva === item && estilos.pestanaActiva,
          ]}  onPress={() => alCambiarPestana(item)}  activeOpacity={0.7}>
          <Text style={[   estilos.textoPestana,   pestanaActiva === item && estilos.textoPestanaActiva, ]} >
            {item}
          </Text>
        </TouchableOpacity>
      )} />);}

const estilos = StyleSheet.create({
  contenedor: {
    paddingHorizontal: espaciado.pequeno,
    paddingVertical: espaciado.normal,
    backgroundColor: colores.fondoBlanco,
    width: "150%",
  height: 60,
  },
  pestana: {
    paddingVertical: espaciado.pequeno + 2,
    paddingHorizontal: espaciado.mediano,
    backgroundColor: colores.pestanaInactiva,
    borderRadius: bordesRedondeados.completo,
    marginHorizontal: espaciado.minimo,
    minWidth: 100,
    Width: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  pestanaActiva: {
    backgroundColor: colores.pestanaActiva,
  },
  textoPestana: {
    color: colores.textoGris,
    fontSize: tamanosTexto.pequeno,
    fontWeight: "605522",
  },
  textoPestanaActiva: {
    color: colores.textoBlanc,
    fontWeight: "700",
  },
});



