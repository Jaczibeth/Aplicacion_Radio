import React from "react";
import {View, Text, ScrollView,Image, StyleSheet, Modal, TouchableOpacity} from "react-native";
import { IconButton } from "react-native-paper";

const coloresPorCategoria = {
  Deportes: "#f39c12",
  Política: "#e74c3c",
  Tecnologia: "#3498db",
  Salud: "#27ae60",
  Cultura: "#8e44ad",
  Clima: "#3498db",
  Educación: "#2980b9",
  Economía: "#27ae60",
  Otro: "#95a5a6",
};

export default function DetalleNoticia({ noticia, visible, onCerrar }) {
  if (!noticia) return null;

  const colorCategoria =
    coloresPorCategoria[noticia.categoria] || coloresPorCategoria["Otro"];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={estilos.overlay}>
        <View style={estilos.modal}>
          {/* Cerrar botón */}
          <TouchableOpacity onPress={onCerrar} style={estilos.botonCerrar}>
            <IconButton icon="close" color="#fff" size={28} />
          </TouchableOpacity>

          {/* Imagen de la noticia */}
          {noticia.imagen && (
            <Image source={{ uri: noticia.imagen }} style={estilos.imagen} />
          )}

          {/* Contenido principal */}
          <ScrollView
            style={estilos.contenido}
            showsVerticalScrollIndicator={false}
          >
            {/* Categoría */}
            {noticia.categoria && (
              <View
                style={[estilos.etiquetaCategoria, { backgroundColor: colorCategoria }]}
              >
                <Text style={estilos.textoCategoria}>{noticia.categoria}</Text>
              </View>
            )}

            {/* Título */}
            <Text style={estilos.titulo}>{noticia.titulo}</Text>

            {/* Fuente y tiempo de lectura */}
            <Text style={estilos.fuenteTiempo}>
              {noticia.fuente} • {noticia.tiempo}
            </Text>

            {/* Descripción corta */}
            <Text style={estilos.descripcion}>
              {noticia.descripcion}
            </Text>

            {/* Descripción completa */}
            {noticia.descripcionCompleta && (
              <>
                <Text style={estilos.subtitulo}>Detalles</Text>
                <Text style={estilos.detalle}>
                  {noticia.descripcionCompleta}
                </Text>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    height: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: "hidden",
  },
  botonCerrar: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "#89878729",
    borderRadius: 20,
  },
  imagen: {
    width: "100%",
    height: 250, 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  contenido: {
    padding: 16,
  },
  etiquetaCategoria: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  textoCategoria: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
    textAlign: "center",  
  },
  fuenteTiempo: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
    textAlign: "center",  
  },
  descripcion: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    marginBottom: 20,
    textAlign: "justify",  
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#111",
  },
  detalle: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
    textAlign: "justify",
  },
});
