import React from "react";
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { colores, espaciado, tamanosTexto, bordesRedondeados } from "../configuracion/colores";
import { IconButton } from "react-native-paper";

export default function DetalleNoticia({ noticia, visible, onCerrar }) {
  if (!noticia) return null;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={estilos.header}>
        <Text style={estilos.headerTitulo}>Noticia</Text>
        <IconButton icon="close" size={28} color={colores.textoOscuro} onPress={onCerrar} />
      </View>

      <ScrollView style={estilos.contenedor}>
        <Image source={{ uri: noticia.imagen }} style={estilos.imagen} />

        <View style={estilos.seccion}>
          {noticia.categoria && (
            <View style={estilos.etiquetaCategoria}>
              <Text style={estilos.textoCategoria}>{noticia.categoria}</Text>
            </View>
          )}

          <Text style={estilos.titulo}>{noticia.titulo}</Text>
          <Text style={estilos.fuenteTiempo}>{noticia.fuente} • {noticia.tiempo}</Text>
        </View>

        <View style={estilos.seccion}>
          <Text style={estilos.descripcion}>{noticia.descripcion || "Sin descripción disponible."}</Text>
        </View>

        {noticia["descripcion Completa"] && (
          <View style={estilos.seccion}>
            <Text style={estilos.subtitulo}>Detalles</Text>
            <Text style={estilos.detalle}>{noticia["descripcion Completa"]}</Text>
          </View>
        )}
      </ScrollView>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: espaciado.normal,
    paddingVertical: espaciado.pequeno,
    backgroundColor: colores.fondoTarjeta,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: "700",
    color: colores.textoOscuro,
  },
  contenedor: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: espaciado.normal,
  },
  imagen: {
    width: "100%",
    height: 250,
    borderRadius: bordesRedondeados.mediano,
    marginVertical: espaciado.mediano,
    resizeMode: "cover",
  },
  seccion: {
    marginBottom: espaciado.mediano,
    backgroundColor: "#fff",
    borderRadius: bordesRedondeados.pequeno,
    padding: espaciado.normal,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  etiquetaCategoria: {
    backgroundColor: colores.principal,
    alignSelf: "flex-start",
    paddingHorizontal: espaciado.pequeno,
    paddingVertical: espaciado.minimo,
    borderRadius: bordesRedondeados.pequeno,
    marginBottom: espaciado.minimo,
  },
  textoCategoria: {
    fontSize: tamanosTexto.muyPequeno,
    color: "#fff",
    fontWeight: "600",
  },
  titulo: {
    fontSize: tamanosTexto.grande,
    fontWeight: "700",
    color: colores.textoOscuro,
    marginBottom: espaciado.minimo,
  },
  fuenteTiempo: {
    color: colores.textoGris,
    fontSize: tamanosTexto.pequeno,
    marginBottom: espaciado.minimo,
  },
  descripcion: {
    fontSize: tamanosTexto.normal,
    color: colores.textoGris,
    lineHeight: 22,
  },
  subtitulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: "600",
    color: colores.textoOscuro,
    marginBottom: espaciado.minimo,
  },
  detalle: {
    fontSize: tamanosTexto.normal,
    color: colores.textoOscuro,
    lineHeight: 24,
  },
});
