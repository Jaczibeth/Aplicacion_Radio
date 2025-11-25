import React, { useState, useEffect } from "react";
import { View, StyleSheet,Share, KeyboardAvoidingView, Platform, Alert, ScrollView,} from "react-native";
import { Text } from "react-native-paper";
import Dialog from "react-native-dialog";
import { coloresCategorias } from "../configuracion/colores";
import CabeceraNoticia from "./DetalleNoticia/CabeceraNoticia";
import CuerpoNoticia from "./DetalleNoticia/CuerpoNoticia";
import SeccionComentarios from "./DetalleNoticia/SeccionComentarios";
import BarraComentarios from "./DetalleNoticia/BarraComentarios";
import Api from "../Data/Api";

export default function DetalleNoticia({ noticia, onCerrar }) {
  if (!noticia) return null;

  const [comentarios, setComentarios] = useState([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [mostrarComentarios, setMostrarComentarios] = useState(false);

  const colorCategoria =
    coloresCategorias[noticia.categoria] || coloresCategorias["Otro"];

  // Fecha formateada
const obtenerFechaFormateada = () => {
  const fecha = new Date(); 

  return fecha.toLocaleString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};


  // Cargar comentarios
  const cargarComentarios = async () => {
    try {
      const data = await Api.getComentariosPorNoticia(noticia.id);
      setComentarios(data);
    } catch (error) {
      console.log("Error al cargar comentarios:", error);
    }
  };

  useEffect(() => {
    cargarComentarios();
  }, [noticia.id]);

  // Agregar comentario
  const manejarAgregarComentario = async () => {
    if (nuevoComentario.trim() === "") return;

    const comentario = { autor: "Anónimo", texto: nuevoComentario.trim() };
    const nuevo = await Api.agregarComentarioAPI(noticia.id, comentario);

    if (nuevo) {
      setComentarios([nuevo, ...comentarios]);
      setNuevoComentario("");
    } else {
      Alert.alert("Error", "No se pudo agregar el comentario");
    }
  };

  // Editar comentario
  const manejarEditarComentario = async () => {
    try {
      const actualizado = await Api.editarComentarioAPI(
        comentarioEditando,
        textoEditando
      );
      if (actualizado) {
        setComentarios((prev) =>
          prev.map((c) => (c.id === comentarioEditando ? actualizado : c))
        );
        setVisibleDialog(false);
        setComentarioEditando(null);
        setTextoEditando("");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el comentario");
    }
  };

  // Eliminar comentario
  const manejarEliminarComentario = async (comentario) => {
    try {
      const respuesta = await Api.eliminarComentarioAPI(comentario.id);
      if (respuesta) {
        setComentarios(comentarios.filter((c) => c.id !== comentario.id));
      } else {
        Alert.alert("Error", "No se pudo eliminar el comentario");
      }
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      Alert.alert("Error", "Error al eliminar comentario");
    }
  };

  // Compartir noticia
  const onShare = async () => {
    try {
      const descripcion = noticia.descripcionCompleta || noticia.descripcion || 'Descripción no disponible';
      await Share.share({
        message: `${noticia.titulo}\n\n${descripcion}\n\nFuente: ${noticia.fuente || 'Fuente no disponible'}`,
        url: noticia.imagen,
        title: noticia.titulo,
      });
    } catch (error) {
      alert("Error al compartir: " + error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView style={estilos.scrollPrincipal}>
  
        <CabeceraNoticia
          noticia={noticia}
          onCerrar={onCerrar}
          colorCategoria={colorCategoria}
          
        />
  

        <View style={estilos.contenedorFecha}>
          <Text variant="bodySmall" style={estilos.textoFecha}>
            Publicado el {obtenerFechaFormateada()}
          </Text>
        </View>
        <CuerpoNoticia noticia={noticia} />
        <SeccionComentarios
          mostrarComentarios={mostrarComentarios}
          setMostrarComentarios={setMostrarComentarios}
          comentarios={comentarios}
          setComentarioEditando={setComentarioEditando}
          setTextoEditando={setTextoEditando}
          setVisibleDialog={setVisibleDialog}
          manejarEliminarComentario={manejarEliminarComentario}
        />
      </ScrollView>

      <BarraComentarios
        nuevoComentario={nuevoComentario}
        setNuevoComentario={setNuevoComentario}
        manejarAgregarComentario={manejarAgregarComentario}
        onShare={onShare}
      />

      <Dialog.Container visible={visibleDialog}>
        <Dialog.Title>Editar comentario</Dialog.Title>
        <Dialog.Input value={textoEditando} onChangeText={setTextoEditando} />
        <Dialog.Button
          label="Cancelar"
          onPress={() => setVisibleDialog(false)}
        />
        <Dialog.Button label="Guardar" onPress={manejarEditarComentario} />
      </Dialog.Container>
    </KeyboardAvoidingView>
  );
}

const estilos = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollPrincipal: { flex: 1, paddingBottom: 10 },
  contenedorFecha: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  textoFecha: {
    color: "#666",
    fontStyle: "italic",
  },
});
 
