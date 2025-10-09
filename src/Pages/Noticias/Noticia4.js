import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, Share, Alert } from "react-native";
import { Text, Avatar, Divider, IconButton, Appbar } from "react-native-paper";

export default function Noticia4({ navigation }) {
  const [saved, setSaved] = useState(false);

  const noticia = {
    categoria: "Importante",
    titulo: "Reporte de decisiones presidenciales",
    imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyz5XNTQBWIi0eRP3uwBPw8SUHNq6ddqti1g&s",
    autor: "Presidencia",
    fecha: "9 Oct 2025",
    tiempoLectura: "3 min de lectura",
    descripcion: "Se publica un resumen de las decisiones tomadas por la presidencia durante la última semana.",
    contenido: [
      "Incluye políticas económicas y sociales recientes.",
      "Se enfatiza en la transparencia y rendición de cuentas.",
    ],
  };

  const handleSave = () => {
    setSaved(!saved);
    Alert.alert(
      saved ? "Noticia eliminada" : "Guardada",
      saved
        ? "La noticia fue eliminada de tus guardadas."
        : "La noticia se guardó correctamente."
    );
    if (!saved) {
      navigation.navigate("Home", { noticiaGuardada: noticia });
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${noticia.titulo}\n\n${noticia.descripcion}\n\nFuente: ${noticia.autor}`,
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo compartir la noticia.");
    }
  };

  return (
    <>
      {/* Barra superior */}
      <Appbar.Header style={estilos.appbar}>
        <Appbar.BackAction onPress={() => navigation?.goBack?.()} />
        <Appbar.Content title="Noticia" />
        <Avatar.Image size={50} source={require("../../../assets/Logos/nt-el-reloj.gif")} />
      </Appbar.Header>

      {/* Contenido principal */}
      <ScrollView style={estilos.container}>
        <Image source={{ uri: noticia.imagen }} style={estilos.imagenPortada} />

        <View style={estilos.contenido}>
          {/* Categoría */}
          <View style={estilos.categoriaContainer}>
            <Text style={estilos.categoriaTexto}>{noticia.categoria}</Text>
          </View>

          {/* Título */}
          <Text style={estilos.titulo}>{noticia.titulo}</Text>

          {/* Autor */}
          <View style={estilos.autorContainer}>
            <Avatar.Text size={36} label={noticia.autor.charAt(0)} />
            <View style={{ marginLeft: 10 }}>
              <Text style={estilos.autor}>{noticia.autor}</Text>
              <Text style={estilos.meta}>
                {noticia.fecha} • {noticia.tiempoLectura}
              </Text>
            </View>
          </View>

          <Divider style={estilos.divisor} />

          {/* Descripción */}
          <Text style={estilos.descripcion}>{noticia.descripcion}</Text>

          {/* Contenido */}
          {noticia.contenido.map((parrafo, index) => (
            <Text key={index} style={estilos.parrafo}>
              {parrafo}
            </Text>
          ))}

          <View style={{ height: 60 }} />
        </View>
      </ScrollView>

      {/* Barra inferior funcional */}
      <View style={estilos.footer}>
        {/* Botón Home */}
        <View style={estilos.iconGroup}>
          <IconButton
            icon="home"
            size={26}
            onPress={() => navigation.navigate("Home")}
          />
          <Text>Inicio</Text>
        </View>
       
        {/* Botón Compartir */}
        <View style={estilos.iconGroup}>
          <IconButton icon="share-variant" size={26} onPress={handleShare} />
          <Text>Compartir</Text>
        </View>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  appbar: {
    backgroundColor: "#fff",
    elevation: 1,
  },
  imagenPortada: {
    width: "100%",
    height: 230,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  contenido: {
    padding: 20,
  },
  categoriaContainer: {
    backgroundColor: "#E8F5E9",
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  categoriaTexto: {
    color: "#2E7D32",
    fontSize: 13,
    fontWeight: "600",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212121",
    marginBottom: 10,
    lineHeight: 32,
  },
  autorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  autor: {
    fontSize: 15,
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
    color: "#757575",
  },
  divisor: {
    marginVertical: 10,
  },
  descripcion: {
    fontSize: 17,
    color: "#424242",
    marginBottom: 15,
    lineHeight: 24,
  },
  parrafo: {
    fontSize: 16,
    color: "#424242",
    lineHeight: 26,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderColor: "#ddd",
    paddingVertical: 8,
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  iconGroup: {
    alignItems: "center",
  },
});
