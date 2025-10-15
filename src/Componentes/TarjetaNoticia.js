import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Title, Paragraph, IconButton } from "react-native-paper";
import { colores, tamanosTexto, espaciado, bordesRedondeados } from "../configuracion/colores";

export default function TarjetaNoticia({
  noticia,
  estaGuardada,
  alCambiarGuardado,
  navigation // <-- Necesario para navegar
}) {
  const irADetalle = () => {
    navigation.navigate("DetalleNoticia", { noticia });
  };

  return (
    <Card style={estilos.tarjeta} elevation={2}>
      <TouchableOpacity onPress={irADetalle} activeOpacity={0.9}>
        <Card.Cover source={{ uri: noticia.imagen }} style={estilos.imagen} />
      </TouchableOpacity>

      <Card.Content style={estilos.contenido}>
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

        <Title style={estilos.titulo} numberOfLines={2}>
          {noticia.titulo}
        </Title>

        {noticia.descripcion && (
          <Paragraph style={estilos.descripcion} numberOfLines={3}>
            {noticia.descripcion}
          </Paragraph>
        )}
      </Card.Content>

      <View style={estilos.contenedorAcciones}>
        <IconButton
          icon="eye"
          iconColor={colores.principal}
          size={22}
          onPress={irADetalle}
        />
        <IconButton
          icon={estaGuardada ? "bookmark" : "bookmark-outline"}
          iconColor={estaGuardada ? colores.rojoPrimario : colores.textoGrisClaro}
          size={22}
          onPress={() => alCambiarGuardado(noticia)}
        />
      </View>
    </Card>
  );
}

const estilos = StyleSheet.create({
  tarjeta: {
    marginBottom: espaciado.mediano,
    borderRadius: bordesRedondeados.mediano,
    backgroundColor: colores.fondoTarjeta,
    overflow: "hidden",
  },
  imagen: {
    height: 200,
    width: "100%",
  },
  contenido: {
    paddingTop: espaciado.normal,
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
    margin: 0,
  },
  titulo: {
    fontSize: tamanosTexto.mediano,
    fontWeight: "700",
    color: colores.textoOscuro,
    marginTop: espaciado.minimo,
  },
  descripcion: {
    fontSize: tamanosTexto.normal,
    color: colores.textoGris,
    marginTop: espaciado.pequeno,
  },
  contenedorAcciones: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: espaciado.pequeno,
    paddingBottom: espaciado.pequeno,
  },
});
