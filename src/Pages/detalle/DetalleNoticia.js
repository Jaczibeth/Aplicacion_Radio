import React from "react";
import { View, ScrollView, StyleSheet, Image, Share } from "react-native";
import { Title, Paragraph, IconButton } from "react-native-paper";
import { colores, tamanosTexto, espaciado, bordesRedondeados } from "../configuracion/colores";

export default function DetalleNoticia({ route, navigation }) {
  const { noticia } = route.params;

  const compartirNoticia = async () => {
    try {
      await Share.share({
        message: `${noticia.titulo}\n\n${noticia.descripcionCompleta || noticia.descripcion}`,
      });
    } catch (error) {
      console.error("Error al compartir:", error.message);
    }
  };

  return (
    <ScrollView style={estilos.container}>
      {/* Botón volver */}
      <IconButton
        icon="arrow-left"
        size={24}
        onPress={() => navigation.goBack()}
        style={estilos.botonVolver}
        iconColor={colores.principal}
      />

      {/* Imagen */}
      <Image source={{ uri: noticia.imagen }} style={estilos.imagen} />

      {/* Contenido */}
      <View style={estilos.contenido}>
        <Paragraph style={estilos.fuenteTiempo}>
          {noticia.fuente} • {noticia.tiempo}
        </Paragraph>

        {noticia.categoria && (
          <View style={estilos.etiquetaCategoria}>
            <Paragraph style={estilos.textoCategoria}>
              {noticia.categoria}
            </Paragraph>
          </View>
        )}

        <Title style={estilos.titulo}>{noticia.titulo}</Title>

        <Paragraph style={estilos.descripcion}>
          {noticia.descripcionCompleta || noticia.descripcion}
        </Paragraph>

        {/* Botón de compartir */}
        <IconButton
          icon="share-variant"
          size={24}
          onPress={compartirNoticia}
          iconColor={colores.principal}
          style={estilos.botonCompartir}
        />
      </View>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colores.fondoTarjeta,
  },
  imagen: {
    width: "100%",
    height: 250,
  },
  contenido: {
    padding: espaciado.normal,
  },
  fuenteTiempo: {
    fontSize: tamanosTexto.pequeno,
    color: colores.textoGrisClaro,
    marginBottom: espaciado.minimo,
  },
  etiquetaCategoria: {
    backgroundColor: colores.principal,
    alignSelf: "flex-start",
    paddingHorizontal: espaciado.pequeno,
    paddingVertical: espaciado.minimo,
    borderRadius: bordesRedondeados.pequeno,
    marginBottom: espaciado.pequeno,
  },
  textoCategoria: {
    fontSize: tamanosTexto.muyPequeno,
    color: colores.textoBlanc,
    fontWeight: "600",
  },
  titulo: {
    fontSize: tamanosTexto.grande,
    fontWeight: "700",
    color: colores.textoOscuro,
    marginTop: espaciado.minimo,
    marginBottom: espaciado.pequeno,
  },
  descripcion: {
    fontSize: tamanosTexto.normal,
    color: colores.textoGris,
    marginTop: espaciado.minimo,
  },
  botonVolver: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 10,
    backgroundColor: "#fff",
    elevation: 3,
  },
  botonCompartir: {
    alignSelf: "flex-end",
    marginTop: espaciado.pequeno,
    backgroundColor: "#fff",
    elevation: 2,
  },
});
